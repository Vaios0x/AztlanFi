// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract P2PEscrow is ReentrancyGuard, AccessControl, Pausable {
    bytes32 public constant ESCROW_MANAGER_ROLE = keccak256("ESCROW_MANAGER");
    
    enum EscrowStatus { Created, Funded, Completed, Disputed, Refunded, Expired }
    
    struct Escrow {
        address sender;
        address liquidityProvider;
        uint256 amount;
        string offRampDetails;
        uint256 deadline;
        EscrowStatus status;
        string proofOfPayment;
        uint256 createdAt;
        uint256 completedAt;
        string corridor;
        string offRampMethod;
    }
    
    struct EscrowStats {
        uint256 totalEscrows;
        uint256 completedEscrows;
        uint256 disputedEscrows;
        uint256 totalVolume;
        uint256 averageCompletionTime;
    }
    
    mapping(uint256 => Escrow) public escrows;
    mapping(address => uint256[]) public userEscrows;
    mapping(address => uint256) public providerStats;
    
    uint256 public escrowCounter;
    uint256 public constant MIN_ESCROW_AMOUNT = 1 ether; // $1 minimum
    uint256 public constant MAX_ESCROW_AMOUNT = 100000 ether; // $100K maximum
    uint256 public constant DEFAULT_ESCROW_DURATION = 1 hours;
    uint256 public constant MAX_ESCROW_DURATION = 24 hours;
    
    // Events
    event EscrowCreated(
        uint256 indexed escrowId,
        address indexed sender,
        address indexed liquidityProvider,
        uint256 amount,
        string corridor,
        string offRampMethod
    );
    
    event EscrowFunded(
        uint256 indexed escrowId,
        uint256 amount
    );
    
    event ProofSubmitted(
        uint256 indexed escrowId,
        string proof,
        address indexed provider
    );
    
    event EscrowReleased(
        uint256 indexed escrowId,
        address indexed provider,
        uint256 amount
    );
    
    event EscrowDisputed(
        uint256 indexed escrowId,
        address indexed disputer,
        string reason
    );
    
    event EscrowRefunded(
        uint256 indexed escrowId,
        address indexed sender,
        uint256 amount
    );
    
    event EscrowExpired(
        uint256 indexed escrowId
    );
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ESCROW_MANAGER_ROLE, msg.sender);
    }
    
    // Create escrow for P2P off-ramp
    function createEscrow(
        address liquidityProvider,
        uint256 amount,
        string memory offRampDetails,
        string memory corridor,
        string memory offRampMethod,
        uint256 duration
    ) external nonReentrant whenNotPaused returns (uint256) {
        require(liquidityProvider != address(0), "Invalid provider");
        require(amount >= MIN_ESCROW_AMOUNT, "Amount too low");
        require(amount <= MAX_ESCROW_AMOUNT, "Amount too high");
        require(duration <= MAX_ESCROW_DURATION, "Duration too long");
        require(duration > 0, "Duration must be positive");
        
        uint256 escrowId = ++escrowCounter;
        uint256 deadline = block.timestamp + duration;
        
        escrows[escrowId] = Escrow({
            sender: msg.sender,
            liquidityProvider: liquidityProvider,
            amount: amount,
            offRampDetails: offRampDetails,
            deadline: deadline,
            status: EscrowStatus.Created,
            proofOfPayment: "",
            createdAt: block.timestamp,
            completedAt: 0,
            corridor: corridor,
            offRampMethod: offRampMethod
        });
        
        userEscrows[msg.sender].push(escrowId);
        userEscrows[liquidityProvider].push(escrowId);
        
        emit EscrowCreated(escrowId, msg.sender, liquidityProvider, amount, corridor, offRampMethod);
        
        return escrowId;
    }
    
    // Fund escrow (transfer USDC to contract)
    function fundEscrow(uint256 escrowId) external nonReentrant whenNotPaused {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.sender == msg.sender, "Not escrow sender");
        require(escrow.status == EscrowStatus.Created, "Escrow not in created state");
        
        // Transfer USDC from sender to contract
        IERC20(getUSDCAddress()).transferFrom(msg.sender, address(this), escrow.amount);
        
        escrow.status = EscrowStatus.Funded;
        
        emit EscrowFunded(escrowId, escrow.amount);
    }
    
    // Submit proof of payment by liquidity provider
    function submitProof(uint256 escrowId, string memory proof) external nonReentrant whenNotPaused {
        Escrow storage escrow = escrows[escrowId];
        require(msg.sender == escrow.liquidityProvider, "Not provider");
        require(escrow.status == EscrowStatus.Funded, "Escrow not funded");
        require(block.timestamp <= escrow.deadline, "Escrow expired");
        require(bytes(proof).length > 0, "Proof cannot be empty");
        
        escrow.proofOfPayment = proof;
        
        emit ProofSubmitted(escrowId, proof, msg.sender);
    }
    
    // Release escrow to provider (sender confirms payment)
    function releaseEscrow(uint256 escrowId) external nonReentrant whenNotPaused {
        Escrow storage escrow = escrows[escrowId];
        require(msg.sender == escrow.sender, "Not escrow sender");
        require(escrow.status == EscrowStatus.Funded, "Escrow not funded");
        require(bytes(escrow.proofOfPayment).length > 0, "No proof submitted");
        require(block.timestamp <= escrow.deadline, "Escrow expired");
        
        escrow.status = EscrowStatus.Completed;
        escrow.completedAt = block.timestamp;
        
        // Transfer funds to provider
        IERC20(getUSDCAddress()).transfer(escrow.liquidityProvider, escrow.amount);
        
        // Update provider stats
        providerStats[escrow.liquidityProvider] += escrow.amount;
        
        emit EscrowReleased(escrowId, escrow.liquidityProvider, escrow.amount);
    }
    
    // Dispute escrow
    function disputeEscrow(uint256 escrowId, string memory reason) external nonReentrant whenNotPaused {
        Escrow storage escrow = escrows[escrowId];
        require(
            msg.sender == escrow.sender || msg.sender == escrow.liquidityProvider,
            "Not authorized"
        );
        require(escrow.status == EscrowStatus.Funded, "Escrow not funded");
        require(block.timestamp <= escrow.deadline, "Escrow expired");
        
        escrow.status = EscrowStatus.Disputed;
        
        emit EscrowDisputed(escrowId, msg.sender, reason);
    }
    
    // Refund escrow (admin or after dispute resolution)
    function refundEscrow(uint256 escrowId) external nonReentrant whenNotPaused {
        Escrow storage escrow = escrows[escrowId];
        require(
            hasRole(ESCROW_MANAGER_ROLE, msg.sender) ||
            (escrow.status == EscrowStatus.Disputed && msg.sender == escrow.sender),
            "Not authorized"
        );
        require(
            escrow.status == EscrowStatus.Funded || escrow.status == EscrowStatus.Disputed,
            "Invalid status"
        );
        
        escrow.status = EscrowStatus.Refunded;
        
        // Refund to sender
        IERC20(getUSDCAddress()).transfer(escrow.sender, escrow.amount);
        
        emit EscrowRefunded(escrowId, escrow.sender, escrow.amount);
    }
    
    // Expire escrow (can be called by anyone after deadline)
    function expireEscrow(uint256 escrowId) external nonReentrant whenNotPaused {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.status == EscrowStatus.Funded, "Escrow not funded");
        require(block.timestamp > escrow.deadline, "Escrow not expired");
        
        escrow.status = EscrowStatus.Expired;
        
        // Refund to sender
        IERC20(getUSDCAddress()).transfer(escrow.sender, escrow.amount);
        
        emit EscrowExpired(escrowId);
        emit EscrowRefunded(escrowId, escrow.sender, escrow.amount);
    }
    
    // Extend escrow deadline (only sender can extend)
    function extendEscrowDeadline(uint256 escrowId, uint256 additionalTime) external {
        Escrow storage escrow = escrows[escrowId];
        require(msg.sender == escrow.sender, "Not escrow sender");
        require(escrow.status == EscrowStatus.Funded, "Escrow not funded");
        require(additionalTime > 0, "Additional time must be positive");
        require(additionalTime <= 12 hours, "Cannot extend more than 12 hours");
        
        escrow.deadline += additionalTime;
    }
    
    // View functions
    function getEscrow(uint256 escrowId) external view returns (Escrow memory) {
        return escrows[escrowId];
    }
    
    function getUserEscrows(address user) external view returns (uint256[] memory) {
        return userEscrows[user];
    }
    
    function getProviderStats(address provider) external view returns (uint256) {
        return providerStats[provider];
    }
    
    function getEscrowStatus(uint256 escrowId) external view returns (EscrowStatus) {
        return escrows[escrowId].status;
    }
    
    function isEscrowExpired(uint256 escrowId) external view returns (bool) {
        Escrow storage escrow = escrows[escrowId];
        return escrow.status == EscrowStatus.Funded && block.timestamp > escrow.deadline;
    }
    
    function getExpiredEscrows() external view returns (uint256[] memory) {
        uint256[] memory expiredEscrows = new uint256[](escrowCounter);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= escrowCounter; i++) {
            Escrow storage escrow = escrows[i];
            if (escrow.status == EscrowStatus.Funded && block.timestamp > escrow.deadline) {
                expiredEscrows[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = expiredEscrows[i];
        }
        
        return result;
    }
    
    function getEscrowStats() external view returns (EscrowStats memory) {
        uint256 totalEscrows = escrowCounter;
        uint256 completedEscrows = 0;
        uint256 disputedEscrows = 0;
        uint256 totalVolume = 0;
        uint256 totalCompletionTime = 0;
        
        for (uint256 i = 1; i <= escrowCounter; i++) {
            Escrow storage escrow = escrows[i];
            totalVolume += escrow.amount;
            
            if (escrow.status == EscrowStatus.Completed) {
                completedEscrows++;
                totalCompletionTime += (escrow.completedAt - escrow.createdAt);
            } else if (escrow.status == EscrowStatus.Disputed) {
                disputedEscrows++;
            }
        }
        
        uint256 averageCompletionTime = completedEscrows > 0 ? 
            totalCompletionTime / completedEscrows : 0;
        
        return EscrowStats({
            totalEscrows: totalEscrows,
            completedEscrows: completedEscrows,
            disputedEscrows: disputedEscrows,
            totalVolume: totalVolume,
            averageCompletionTime: averageCompletionTime
        });
    }
    
    function getEscrowsByStatus(EscrowStatus status) external view returns (uint256[] memory) {
        uint256[] memory escrowsByStatus = new uint256[](escrowCounter);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= escrowCounter; i++) {
            if (escrows[i].status == status) {
                escrowsByStatus[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = escrowsByStatus[i];
        }
        
        return result;
    }
    
    function getEscrowsByCorridor(string memory corridor) external view returns (uint256[] memory) {
        uint256[] memory escrowsByCorridor = new uint256[](escrowCounter);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= escrowCounter; i++) {
            if (keccak256(bytes(escrows[i].corridor)) == keccak256(bytes(corridor))) {
                escrowsByCorridor[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = escrowsByCorridor[i];
        }
        
        return result;
    }
    
    // Admin functions
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
