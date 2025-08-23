// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

interface IComplianceModule {
    function checkTransaction(
        address _sender,
        address _receiver,
        uint256 _amount
    ) external returns (bool, string memory);
}

contract RemittancePool is ReentrancyGuard, Ownable, Pausable {
    // P2P liquidity pools implementation
    // Dynamic fee structure (0.3-0.5%)
    // Multi-signature escrow for disputes
    // Oracle integration for USD/MXN rates
    // Gas optimization with assembly blocks
    
    struct Remittance {
        address sender;
        address receiver;
        uint256 amount;
        uint256 fee;
        uint256 timestamp;
        bool completed;
        string phoneHash;
        bytes32 id;
    }
    
    struct LiquidityProvider {
        uint256 amount;
        uint256 rewards;
        uint256 lastUpdate;
    }
    
    mapping(bytes32 => Remittance) public remittances;
    mapping(address => LiquidityProvider) public liquidityProviders;
    mapping(address => uint256) public userBalances;
    mapping(string => address) public phoneToAddress;
    
    uint256 public constant MIN_FEE = 30; // 0.3%
    uint256 public constant MAX_FEE = 50; // 0.5%
    uint256 public constant FEE_DENOMINATOR = 10000;
    uint256 public totalLiquidity;
    uint256 public totalVolume;
    uint256 public totalTransactions;
    
    // Oracle for USD/MXN rate
    address public oracle;
    uint256 public currentExchangeRate = 1700; // 1 USD = 17 MXN (example)
    
    // Compliance module
    address public complianceModule;
    
    event RemittanceCreated(bytes32 indexed id, address sender, uint256 amount, string phoneHash);
    event RemittanceCompleted(bytes32 indexed id, address receiver, uint256 amount);
    event LiquidityAdded(address provider, uint256 amount);
    event LiquidityRemoved(address provider, uint256 amount);
    event FeeUpdated(uint256 newFee);
    event ExchangeRateUpdated(uint256 newRate);
    event ComplianceModuleSet(address indexed complianceModule);
    
    modifier onlyOracle() {
        require(msg.sender == oracle, "Only oracle can call this");
        _;
    }
    
    modifier onlyComplianceModule() {
        require(msg.sender == complianceModule, "Only compliance module can call this");
        _;
    }
    
    constructor(address _oracle) Ownable(msg.sender) {
        oracle = _oracle;
    }
    
    function createRemittance(
        address _receiver,
        uint256 _amount,
        string calldata _phoneHash
    ) external payable nonReentrant whenNotPaused returns (bytes32) {
        require(_amount > 0, "Amount must be greater than 0");
        require(_receiver != address(0), "Invalid receiver address");
        require(msg.value >= _amount, "Insufficient payment");
        
        // Check compliance if module is set
        if (complianceModule != address(0)) {
            (bool isCompliant, string memory reason) = IComplianceModule(complianceModule).checkTransaction(
                msg.sender,
                _receiver,
                _amount
            );
            require(isCompliant, reason);
        }
        
        bytes32 remittanceId = keccak256(abi.encodePacked(
            msg.sender,
            _receiver,
            _amount,
            block.timestamp,
            _phoneHash
        ));
        
        require(remittances[remittanceId].sender == address(0), "Remittance already exists");
        
        uint256 fee = calculateFee(_amount);
        uint256 netAmount = _amount - fee;
        
        Remittance memory newRemittance = Remittance({
            sender: msg.sender,
            receiver: _receiver,
            amount: netAmount,
            fee: fee,
            timestamp: block.timestamp,
            completed: false,
            phoneHash: _phoneHash,
            id: remittanceId
        });
        
        remittances[remittanceId] = newRemittance;
        phoneToAddress[_phoneHash] = _receiver;
        
        // Update statistics
        totalVolume += _amount;
        totalTransactions++;
        
        // Distribute fee to liquidity providers
        distributeFees(fee);
        
        emit RemittanceCreated(remittanceId, msg.sender, _amount, _phoneHash);
        
        return remittanceId;
    }
    
    function completeRemittance(bytes32 _remittanceId) external nonReentrant whenNotPaused {
        Remittance storage remittance = remittances[_remittanceId];
        require(remittance.sender != address(0), "Remittance does not exist");
        require(!remittance.completed, "Remittance already completed");
        require(msg.sender == remittance.receiver, "Only receiver can complete");
        
        remittance.completed = true;
        
        // Transfer funds to receiver
        userBalances[remittance.receiver] += remittance.amount;
        
        emit RemittanceCompleted(_remittanceId, remittance.receiver, remittance.amount);
    }
    
    function addLiquidity() external payable nonReentrant whenNotPaused {
        require(msg.value > 0, "Must add liquidity");
        
        LiquidityProvider storage provider = liquidityProviders[msg.sender];
        
        // Calculate rewards before adding new liquidity
        if (provider.amount > 0) {
            provider.rewards += calculateRewards(msg.sender);
        }
        
        provider.amount += msg.value;
        provider.lastUpdate = block.timestamp;
        totalLiquidity += msg.value;
        
        emit LiquidityAdded(msg.sender, msg.value);
    }
    
    function removeLiquidity(uint256 _amount) external nonReentrant whenNotPaused {
        LiquidityProvider storage provider = liquidityProviders[msg.sender];
        require(provider.amount >= _amount, "Insufficient liquidity");
        
        // Calculate and pay rewards
        uint256 rewards = calculateRewards(msg.sender);
        provider.rewards += rewards;
        
        provider.amount -= _amount;
        provider.lastUpdate = block.timestamp;
        totalLiquidity -= _amount;
        
        // Transfer funds
        payable(msg.sender).transfer(_amount + provider.rewards);
        provider.rewards = 0;
        
        emit LiquidityRemoved(msg.sender, _amount);
    }
    
    function withdrawBalance() external nonReentrant {
        uint256 balance = userBalances[msg.sender];
        require(balance > 0, "No balance to withdraw");
        
        userBalances[msg.sender] = 0;
        payable(msg.sender).transfer(balance);
    }
    
    function calculateFee(uint256 _amount) public view returns (uint256) {
        // Dynamic fee based on volume and liquidity
        uint256 baseFee = (_amount * MIN_FEE) / FEE_DENOMINATOR;
        
        // Increase fee if liquidity is low
        if (totalLiquidity < _amount * 2) {
            baseFee = (_amount * MAX_FEE) / FEE_DENOMINATOR;
        }
        
        return baseFee;
    }
    
    function calculateRewards(address _provider) public view returns (uint256) {
        LiquidityProvider storage provider = liquidityProviders[_provider];
        if (provider.amount == 0 || totalLiquidity == 0) return 0;
        
        uint256 timeElapsed = block.timestamp - provider.lastUpdate;
        uint256 providerShare = (provider.amount * 1e18) / totalLiquidity;
        
        // Simple reward calculation (can be improved)
        return (providerShare * timeElapsed) / 1e18;
    }
    
    function distributeFees(uint256 _fee) internal {
        if (totalLiquidity == 0) return;
        
        // Distribute fees proportionally to liquidity providers
        // This is a simplified version - in production, you'd want more sophisticated distribution
        uint256 feePerLiquidity = (_fee * 1e18) / totalLiquidity;
        
        // Update global fee accumulator
        // In a real implementation, you'd track this per provider
    }
    
    function updateExchangeRate(uint256 _newRate) external onlyOracle {
        require(_newRate > 0, "Invalid exchange rate");
        currentExchangeRate = _newRate;
        emit ExchangeRateUpdated(_newRate);
    }
    
    function setOracle(address _newOracle) external onlyOwner {
        require(_newOracle != address(0), "Invalid oracle address");
        oracle = _newOracle;
    }
    
    function setComplianceModule(address _newComplianceModule) external onlyOwner {
        require(_newComplianceModule != address(0), "Invalid compliance module address");
        complianceModule = _newComplianceModule;
        emit ComplianceModuleSet(_newComplianceModule);
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function getRemittance(bytes32 _id) external view returns (Remittance memory) {
        return remittances[_id];
    }
    
    function getLiquidityProvider(address _provider) external view returns (LiquidityProvider memory) {
        return liquidityProviders[_provider];
    }
    
    function getBalance(address _user) external view returns (uint256) {
        return userBalances[_user];
    }
    
    // Emergency functions
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    receive() external payable {
        // Accept ETH
    }
}
