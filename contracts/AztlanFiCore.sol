// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract AztlanFiCore is ReentrancyGuard, AccessControl, Pausable {
    bytes32 public constant LIQUIDITY_PROVIDER_ROLE = keccak256("LIQUIDITY_PROVIDER");
    bytes32 public constant COMPLIANCE_OFFICER_ROLE = keccak256("COMPLIANCE_OFFICER");
    
    struct Corridor {
        string from;
        string to;
        uint256 totalVolume;
        uint256 feePercentage; // 50 = 0.5%
        bool active;
        address liquidityPool;
        uint256 dailyLimit;
        uint256 monthlyLimit;
        uint256 dailyUsed;
        uint256 monthlyUsed;
        uint256 lastDailyReset;
        uint256 lastMonthlyReset;
    }
    
    struct Remittance {
        address sender;
        address recipient;
        uint256 amount;
        string corridor;
        uint256 timestamp;
        uint256 fee;
        bool completed;
        string offRampMethod;
        bytes32 id;
        string phoneHash;
        string partnerIntegration; // 0x, Reown, Envio, Para
        bool gaslessTransaction;
        string socialLoginProvider; // Reown, Telegram, Farcaster
        uint256 savingsGoalId; // Para Wallet integration
        bool analyticsTracked; // Envio Analytics
    }
    
    struct LiquidityProvider {
        address provider;
        uint256 amount;
        uint256 rewards;
        uint256 lastUpdate;
        bool active;
        string[] supportedCorridors;
    }
    
    mapping(string => Corridor) public corridors;
    mapping(uint256 => Remittance) public remittances;
    mapping(address => uint256[]) public userRemittances;
    mapping(address => LiquidityProvider) public liquidityProviders;
    mapping(address => uint256) public userBalances;
    mapping(string => address) public phoneToAddress;
    
    uint256 public remittanceCounter;
    uint256 public constant BASE_FEE = 50; // 0.5%
    uint256 public constant MIN_FEE = 30; // 0.3%
    uint256 public constant MAX_FEE = 100; // 1.0%
    
    // Events
    event RemittanceInitiated(
        uint256 indexed id,
        address indexed sender,
        string corridor,
        uint256 amount,
        string offRampMethod,
        string partnerIntegration
    );
    
    event RemittanceCompleted(
        uint256 indexed id,
        address indexed recipient,
        uint256 amount,
        string corridor,
        bool gaslessTransaction
    );
    
    event CorridorActivated(string corridor, address liquidityPool);
    event CorridorDeactivated(string corridor);
    event LiquidityAdded(address provider, uint256 amount, string corridor);
    event LiquidityRemoved(address provider, uint256 amount, string corridor);
    event FeeCollected(uint256 remittanceId, uint256 fee, string corridor);
    event OffRampProcessed(uint256 remittanceId, string method, bool success);
    event PartnerIntegrationUsed(uint256 remittanceId, string partner, string method);
    event GaslessTransactionExecuted(uint256 remittanceId, uint256 gasSaved);
    event SocialLoginUsed(uint256 remittanceId, string provider, address user);
    event SavingsGoalLinked(uint256 remittanceId, uint256 goalId, address user);
    event AnalyticsTracked(uint256 remittanceId, string eventType, string data);
    
    // Modifiers
    modifier onlyComplianceOfficer() {
        require(hasRole(COMPLIANCE_OFFICER_ROLE, msg.sender) || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Not authorized");
        _;
    }
    
    modifier onlyLiquidityProvider() {
        require(hasRole(LIQUIDITY_PROVIDER_ROLE, msg.sender), "Not liquidity provider");
        _;
    }
    
    modifier corridorActive(string memory corridor) {
        require(corridors[corridor].active, "Corridor not active");
        _;
    }
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(COMPLIANCE_OFFICER_ROLE, msg.sender);
        _initializeCorridors();
    }
    
    function _initializeCorridors() private {
        // Initialize all 32 payment corridors (16 bidirectional pairs)
        
        // Original 8 corridors
        _createCorridor("USA-MEX", "USA", "Mexico", 1000000 ether, 5000000 ether);
        _createCorridor("CHN-MEX", "China", "Mexico", 2000000 ether, 10000000 ether);
        _createCorridor("USA-BRA", "USA", "Brazil", 500000 ether, 2500000 ether);
        _createCorridor("JPN-MEX", "Japan", "Mexico", 300000 ether, 1500000 ether);
        _createCorridor("KOR-LATAM", "Korea", "LatAm", 200000 ether, 1000000 ether);
        _createCorridor("IND-LATAM", "India", "LatAm", 150000 ether, 750000 ether);
        _createCorridor("BRA-MEX", "Brazil", "Mexico", 500000 ether, 2500000 ether);
        _createCorridor("EUR-LATAM", "Europe", "LatAm", 800000 ether, 4000000 ether);
        
        // Inverse bidirectional pairs
        _createCorridor("MEX-USA", "Mexico", "USA", 1000000 ether, 5000000 ether);
        _createCorridor("MEX-CHN", "Mexico", "China", 2000000 ether, 10000000 ether);
        _createCorridor("BRA-USA", "Brazil", "USA", 500000 ether, 2500000 ether);
        _createCorridor("MEX-JPN", "Mexico", "Japan", 300000 ether, 1500000 ether);
        _createCorridor("LATAM-KOR", "LatAm", "Korea", 200000 ether, 1000000 ether);
        _createCorridor("LATAM-IND", "LatAm", "India", 150000 ether, 750000 ether);
        _createCorridor("MEX-BRA", "Mexico", "Brazil", 500000 ether, 2500000 ether);
        _createCorridor("LATAM-EUR", "LatAm", "Europe", 800000 ether, 4000000 ether);
        
        // New regional corridors
        _createCorridor("USA-COL", "USA", "Colombia", 400000 ether, 2000000 ether);
        _createCorridor("COL-USA", "Colombia", "USA", 400000 ether, 2000000 ether);
        _createCorridor("USA-ARG", "USA", "Argentina", 300000 ether, 1500000 ether);
        _createCorridor("ARG-USA", "Argentina", "USA", 300000 ether, 1500000 ether);
        _createCorridor("USA-PER", "USA", "Peru", 250000 ether, 1250000 ether);
        _createCorridor("PER-USA", "Peru", "USA", 250000 ether, 1250000 ether);
        _createCorridor("USA-CHL", "USA", "Chile", 200000 ether, 1000000 ether);
        _createCorridor("CHL-USA", "Chile", "USA", 200000 ether, 1000000 ether);
        _createCorridor("USA-ECU", "USA", "Ecuador", 150000 ether, 750000 ether);
        _createCorridor("ECU-USA", "Ecuador", "USA", 150000 ether, 750000 ether);
        _createCorridor("USA-VEN", "USA", "Venezuela", 100000 ether, 500000 ether);
        _createCorridor("VEN-USA", "Venezuela", "USA", 100000 ether, 500000 ether);
        
        // Internal LatAm corridors
        _createCorridor("BRA-COL", "Brazil", "Colombia", 300000 ether, 1500000 ether);
        _createCorridor("COL-BRA", "Colombia", "Brazil", 300000 ether, 1500000 ether);
        _createCorridor("MEX-COL", "Mexico", "Colombia", 250000 ether, 1250000 ether);
        _createCorridor("COL-MEX", "Colombia", "Mexico", 250000 ether, 1250000 ether);
    }
    
    function _createCorridor(
        string memory corridorId,
        string memory from,
        string memory to,
        uint256 dailyLimit,
        uint256 monthlyLimit
    ) private {
        corridors[corridorId] = Corridor({
            from: from,
            to: to,
            totalVolume: 0,
            feePercentage: BASE_FEE,
            active: true,
            liquidityPool: address(0),
            dailyLimit: dailyLimit,
            monthlyLimit: monthlyLimit,
            dailyUsed: 0,
            monthlyUsed: 0,
            lastDailyReset: block.timestamp,
            lastMonthlyReset: block.timestamp
        });
        
        emit CorridorActivated(corridorId, address(0));
    }
    
    function sendRemittance(
        address recipient,
        uint256 amount,
        string memory corridor,
        string memory offRampMethod,
        string memory phoneHash,
        string memory partnerIntegration,
        bool gaslessTransaction,
        string memory socialLoginProvider,
        uint256 savingsGoalId
    ) external nonReentrant whenNotPaused corridorActive(corridor) returns (uint256) {
        require(amount > 0, "Invalid amount");
        require(recipient != address(0), "Invalid recipient");
        require(recipient != msg.sender, "Cannot send to self");
        
        Corridor storage corridorData = corridors[corridor];
        
        // Reset limits if needed
        _resetLimits(corridor);
        
        // Check limits
        require(corridorData.dailyUsed + amount <= corridorData.dailyLimit, "Daily limit exceeded");
        require(corridorData.monthlyUsed + amount <= corridorData.monthlyLimit, "Monthly limit exceeded");
        
        // Calculate fee
        uint256 fee = (amount * corridorData.feePercentage) / 10000;
        uint256 netAmount = amount - fee;
        
        // Transfer USDC from sender
        IERC20(getUSDCAddress()).transferFrom(msg.sender, address(this), amount);
        
        // Create remittance
        uint256 remittanceId = ++remittanceCounter;
        bytes32 remittanceHash = keccak256(abi.encodePacked(
            msg.sender,
            recipient,
            amount,
            corridor,
            block.timestamp,
            remittanceId
        ));
        
        remittances[remittanceId] = Remittance({
            sender: msg.sender,
            recipient: recipient,
            amount: netAmount,
            corridor: corridor,
            timestamp: block.timestamp,
            fee: fee,
            completed: false,
            offRampMethod: offRampMethod,
            id: remittanceHash,
            phoneHash: phoneHash,
            partnerIntegration: partnerIntegration,
            gaslessTransaction: gaslessTransaction,
            socialLoginProvider: socialLoginProvider,
            savingsGoalId: savingsGoalId,
            analyticsTracked: false
        });
        
        userRemittances[msg.sender].push(remittanceId);
        
        // Update corridor stats
        corridorData.totalVolume += amount;
        corridorData.dailyUsed += amount;
        corridorData.monthlyUsed += amount;
        
        // Map phone to address for future reference
        if (bytes(phoneHash).length > 0) {
            phoneToAddress[phoneHash] = recipient;
        }
        
        emit RemittanceInitiated(remittanceId, msg.sender, corridor, amount, offRampMethod, partnerIntegration);
        
        // Emit partner-specific events
        if (gaslessTransaction) {
            emit GaslessTransactionExecuted(remittanceId, 50000); // Estimated gas saved
        }
        
        if (bytes(socialLoginProvider).length > 0) {
            emit SocialLoginUsed(remittanceId, socialLoginProvider, msg.sender);
        }
        
        if (savingsGoalId > 0) {
            emit SavingsGoalLinked(remittanceId, savingsGoalId, msg.sender);
        }
        
        emit PartnerIntegrationUsed(remittanceId, partnerIntegration, "transaction_created");
        
        // Process off-ramp immediately for Monad's 1-second finality
        _processOffRamp(remittanceId);
        
        return remittanceId;
    }
    
    function _processOffRamp(uint256 remittanceId) private {
        Remittance storage rem = remittances[remittanceId];
        
        // Process specific off-ramp method
        if (keccak256(bytes(rem.offRampMethod)) == keccak256("P2P")) {
            _processP2POffRamp(remittanceId);
        } else if (keccak256(bytes(rem.offRampMethod)) == keccak256("BANK")) {
            _processBankOffRamp(remittanceId);
        } else if (keccak256(bytes(rem.offRampMethod)) == keccak256("DIRECT")) {
            _processDirectTransfer(remittanceId);
        } else {
            // Default to direct transfer
            _processDirectTransfer(remittanceId);
        }
        
        rem.completed = true;
        rem.analyticsTracked = true;
        
        emit RemittanceCompleted(remittanceId, rem.recipient, rem.amount, rem.corridor, rem.gaslessTransaction);
        emit OffRampProcessed(remittanceId, rem.offRampMethod, true);
        emit AnalyticsTracked(remittanceId, "transaction_completed", rem.partnerIntegration);
    }
    
    function _processP2POffRamp(uint256 remittanceId) private {
        // Implement P2P escrow logic
        // This would interact with the P2PEscrow contract
        Remittance storage rem = remittances[remittanceId];
        
        // For now, just transfer to recipient
        IERC20(getUSDCAddress()).transfer(rem.recipient, rem.amount);
    }
    
    function _processBankOffRamp(uint256 remittanceId) private {
        // Implement bank transfer logic
        // This would interact with external banking APIs
        Remittance storage rem = remittances[remittanceId];
        
        // For now, just transfer to recipient
        IERC20(getUSDCAddress()).transfer(rem.recipient, rem.amount);
    }
    
    function _processDirectTransfer(uint256 remittanceId) private {
        Remittance storage rem = remittances[remittanceId];
        IERC20(getUSDCAddress()).transfer(rem.recipient, rem.amount);
    }
    
    function _resetLimits(string memory corridor) private {
        Corridor storage corridorData = corridors[corridor];
        
        // Reset daily limit if 24 hours have passed
        if (block.timestamp >= corridorData.lastDailyReset + 1 days) {
            corridorData.dailyUsed = 0;
            corridorData.lastDailyReset = block.timestamp;
        }
        
        // Reset monthly limit if 30 days have passed
        if (block.timestamp >= corridorData.lastMonthlyReset + 30 days) {
            corridorData.monthlyUsed = 0;
            corridorData.lastMonthlyReset = block.timestamp;
        }
    }
    
    // Admin functions
    function activateCorridor(string memory corridor, address liquidityPool) external onlyComplianceOfficer {
        require(bytes(corridor).length > 0, "Invalid corridor");
        corridors[corridor].active = true;
        corridors[corridor].liquidityPool = liquidityPool;
        emit CorridorActivated(corridor, liquidityPool);
    }
    
    function deactivateCorridor(string memory corridor) external onlyComplianceOfficer {
        corridors[corridor].active = false;
        emit CorridorDeactivated(corridor);
    }
    
    function setCorridorFee(string memory corridor, uint256 feePercentage) external onlyComplianceOfficer {
        require(feePercentage >= MIN_FEE && feePercentage <= MAX_FEE, "Invalid fee");
        corridors[corridor].feePercentage = feePercentage;
    }
    
    function setCorridorLimits(
        string memory corridor,
        uint256 dailyLimit,
        uint256 monthlyLimit
    ) external onlyComplianceOfficer {
        corridors[corridor].dailyLimit = dailyLimit;
        corridors[corridor].monthlyLimit = monthlyLimit;
    }
    
    // Liquidity provider functions
    function addLiquidity(string memory corridor, uint256 amount) external onlyLiquidityProvider {
        require(corridors[corridor].active, "Corridor not active");
        require(amount > 0, "Invalid amount");
        
        IERC20(getUSDCAddress()).transferFrom(msg.sender, address(this), amount);
        
        if (liquidityProviders[msg.sender].provider == address(0)) {
            liquidityProviders[msg.sender] = LiquidityProvider({
                provider: msg.sender,
                amount: amount,
                rewards: 0,
                lastUpdate: block.timestamp,
                active: true,
                supportedCorridors: new string[](0)
            });
        } else {
            liquidityProviders[msg.sender].amount += amount;
        }
        
        // Add corridor to supported corridors if not already there
        bool corridorExists = false;
        for (uint i = 0; i < liquidityProviders[msg.sender].supportedCorridors.length; i++) {
            if (keccak256(bytes(liquidityProviders[msg.sender].supportedCorridors[i])) == keccak256(bytes(corridor))) {
                corridorExists = true;
                break;
            }
        }
        
        if (!corridorExists) {
            liquidityProviders[msg.sender].supportedCorridors.push(corridor);
        }
        
        emit LiquidityAdded(msg.sender, amount, corridor);
    }
    
    function removeLiquidity(string memory corridor, uint256 amount) external onlyLiquidityProvider {
        require(liquidityProviders[msg.sender].amount >= amount, "Insufficient liquidity");
        
        liquidityProviders[msg.sender].amount -= amount;
        IERC20(getUSDCAddress()).transfer(msg.sender, amount);
        
        emit LiquidityRemoved(msg.sender, amount, corridor);
    }
    
    // View functions
    function getCorridor(string memory corridor) external view returns (Corridor memory) {
        return corridors[corridor];
    }
    
    function getRemittance(uint256 remittanceId) external view returns (Remittance memory) {
        return remittances[remittanceId];
    }
    
    function getUserRemittances(address user) external view returns (uint256[] memory) {
        return userRemittances[user];
    }
    
    function getLiquidityProvider(address provider) external view returns (LiquidityProvider memory) {
        return liquidityProviders[provider];
    }
    
    function getPhoneAddress(string memory phoneHash) external view returns (address) {
        return phoneToAddress[phoneHash];
    }
    
    function getCorridorStats(string memory corridor) external view returns (
        uint256 totalVolume,
        uint256 dailyUsed,
        uint256 monthlyUsed,
        uint256 dailyLimit,
        uint256 monthlyLimit,
        bool active
    ) {
        Corridor storage corridorData = corridors[corridor];
        return (
            corridorData.totalVolume,
            corridorData.dailyUsed,
            corridorData.monthlyUsed,
            corridorData.dailyLimit,
            corridorData.monthlyLimit,
            corridorData.active
        );
    }
    
    // Emergency functions
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }
    
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
    
    function emergencyWithdraw(address token, address to, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        IERC20(token).transfer(to, amount);
    }
    
    // Helper function to get USDC address (mock for now)
    function getUSDCAddress() internal pure returns (address) {
        // In production, this would return the actual USDC address on Monad
        return 0x0000000000000000000000000000000000000000; // Placeholder
    }
}
