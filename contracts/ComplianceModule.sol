// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract ComplianceModule is Ownable, Pausable {
    // Blacklist checking
    // Transaction limits
    // Progressive KYC
    // OFAC screening
    
    struct User {
        bool isRegistered;
        uint256 kycLevel;
        uint256 dailyLimit;
        uint256 monthlyLimit;
        uint256 dailyUsed;
        uint256 monthlyUsed;
        uint256 lastDailyReset;
        uint256 lastMonthlyReset;
        bool isBlacklisted;
        string kycHash;
    }
    
    struct Transaction {
        address sender;
        address receiver;
        uint256 amount;
        uint256 timestamp;
        bool isSuspicious;
        string reason;
    }
    
    mapping(address => User) public users;
    mapping(address => bool) public blacklist;
    mapping(bytes32 => Transaction) public transactions;
    mapping(string => bool) public ofacSanctions;
    
    uint256 public constant KYC_LEVEL_1 = 1; // Basic info
    uint256 public constant KYC_LEVEL_2 = 2; // ID verification
    uint256 public constant KYC_LEVEL_3 = 3; // Enhanced due diligence
    
    uint256 public constant DAILY_LIMIT_LEVEL_1 = 1000 ether; // $1000
    uint256 public constant DAILY_LIMIT_LEVEL_2 = 5000 ether; // $5000
    uint256 public constant DAILY_LIMIT_LEVEL_3 = 50000 ether; // $50000
    
    uint256 public constant MONTHLY_LIMIT_LEVEL_1 = 10000 ether; // $10000
    uint256 public constant MONTHLY_LIMIT_LEVEL_2 = 50000 ether; // $50000
    uint256 public constant MONTHLY_LIMIT_LEVEL_3 = 500000 ether; // $500000
    
    address public remittancePool;
    address public complianceOfficer;
    
    event UserRegistered(address indexed user, uint256 kycLevel);
    event UserBlacklisted(address indexed user, string reason);
    event UserUnblacklisted(address indexed user);
    event TransactionFlagged(bytes32 indexed txId, address sender, string reason);
    event KYCLevelUpgraded(address indexed user, uint256 newLevel);
    event LimitUpdated(address indexed user, uint256 dailyLimit, uint256 monthlyLimit);
    
    modifier onlyRemittancePool() {
        require(msg.sender == remittancePool, "Only remittance pool can call this");
        _;
    }
    
    modifier onlyComplianceOfficer() {
        require(msg.sender == complianceOfficer || msg.sender == owner(), "Only compliance officer");
        _;
    }
    
    constructor(address _remittancePool) Ownable(msg.sender) {
        remittancePool = _remittancePool;
        complianceOfficer = msg.sender;
    }
    
    function registerUser(address _user, uint256 _kycLevel) external onlyComplianceOfficer {
        require(_kycLevel >= KYC_LEVEL_1 && _kycLevel <= KYC_LEVEL_3, "Invalid KYC level");
        require(!users[_user].isRegistered, "User already registered");
        
        users[_user] = User({
            isRegistered: true,
            kycLevel: _kycLevel,
            dailyLimit: getDailyLimit(_kycLevel),
            monthlyLimit: getMonthlyLimit(_kycLevel),
            dailyUsed: 0,
            monthlyUsed: 0,
            lastDailyReset: block.timestamp,
            lastMonthlyReset: block.timestamp,
            isBlacklisted: false,
            kycHash: ""
        });
        
        emit UserRegistered(_user, _kycLevel);
    }
    
    function checkTransaction(
        address _sender,
        address _receiver,
        uint256 _amount
    ) external onlyRemittancePool returns (bool, string memory) {
        // Check if users are blacklisted
        if (blacklist[_sender] || users[_sender].isBlacklisted) {
            return (false, "Sender is blacklisted");
        }
        
        if (blacklist[_receiver] || users[_receiver].isBlacklisted) {
            return (false, "Receiver is blacklisted");
        }
        
        // Check if sender is registered
        if (!users[_sender].isRegistered) {
            return (false, "Sender not registered");
        }
        
        // Reset daily/monthly limits if needed
        resetLimits(_sender);
        
        // Check daily limit
        if (users[_sender].dailyUsed + _amount > users[_sender].dailyLimit) {
            return (false, "Daily limit exceeded");
        }
        
        // Check monthly limit
        if (users[_sender].monthlyUsed + _amount > users[_sender].monthlyLimit) {
            return (false, "Monthly limit exceeded");
        }
        
        // Check for suspicious patterns
        if (isSuspiciousTransaction(_sender, _receiver, _amount)) {
            bytes32 txId = keccak256(abi.encodePacked(_sender, _receiver, _amount, block.timestamp));
            
            transactions[txId] = Transaction({
                sender: _sender,
                receiver: _receiver,
                amount: _amount,
                timestamp: block.timestamp,
                isSuspicious: true,
                reason: "Suspicious pattern detected"
            });
            
            emit TransactionFlagged(txId, _sender, "Suspicious pattern detected");
            
            // For suspicious transactions, require manual review
            return (false, "Transaction flagged for review");
        }
        
        // Update usage
        users[_sender].dailyUsed += _amount;
        users[_sender].monthlyUsed += _amount;
        
        return (true, "");
    }
    
    function addToBlacklist(address _user, string calldata _reason) external onlyComplianceOfficer {
        blacklist[_user] = true;
        users[_user].isBlacklisted = true;
        emit UserBlacklisted(_user, _reason);
    }
    
    function removeFromBlacklist(address _user) external onlyComplianceOfficer {
        blacklist[_user] = false;
        users[_user].isBlacklisted = false;
        emit UserUnblacklisted(_user);
    }
    
    function upgradeKYCLevel(address _user, uint256 _newLevel) external onlyComplianceOfficer {
        require(_newLevel > users[_user].kycLevel && _newLevel <= KYC_LEVEL_3, "Invalid KYC level");
        
        users[_user].kycLevel = _newLevel;
        users[_user].dailyLimit = getDailyLimit(_newLevel);
        users[_user].monthlyLimit = getMonthlyLimit(_newLevel);
        
        emit KYCLevelUpgraded(_user, _newLevel);
        emit LimitUpdated(_user, users[_user].dailyLimit, users[_user].monthlyLimit);
    }
    
    function setCustomLimits(
        address _user,
        uint256 _dailyLimit,
        uint256 _monthlyLimit
    ) external onlyComplianceOfficer {
        require(users[_user].isRegistered, "User not registered");
        
        users[_user].dailyLimit = _dailyLimit;
        users[_user].monthlyLimit = _monthlyLimit;
        
        emit LimitUpdated(_user, _dailyLimit, _monthlyLimit);
    }
    
    function addOFACSanction(string calldata _address) external onlyComplianceOfficer {
        ofacSanctions[_address] = true;
    }
    
    function removeOFACSanction(string calldata _address) external onlyComplianceOfficer {
        ofacSanctions[_address] = false;
    }
    
    function setComplianceOfficer(address _newOfficer) external onlyOwner {
        require(_newOfficer != address(0), "Invalid address");
        complianceOfficer = _newOfficer;
    }
    
    function setRemittancePool(address _newPool) external onlyOwner {
        require(_newPool != address(0), "Invalid address");
        remittancePool = _newPool;
    }
    
    function resetLimits(address _user) internal {
        User storage user = users[_user];
        
        // Reset daily limit if 24 hours have passed
        if (block.timestamp >= user.lastDailyReset + 1 days) {
            user.dailyUsed = 0;
            user.lastDailyReset = block.timestamp;
        }
        
        // Reset monthly limit if 30 days have passed
        if (block.timestamp >= user.lastMonthlyReset + 30 days) {
            user.monthlyUsed = 0;
            user.lastMonthlyReset = block.timestamp;
        }
    }
    
    function isSuspiciousTransaction(
        address _sender,
        address _receiver,
        uint256 _amount
    ) internal view returns (bool) {
        // Check for large amounts
        if (_amount > 10000 ether) {
            return true;
        }
        
        // Check for frequent transactions (simplified)
        // In production, you'd track transaction frequency
        
        // Check for round numbers (potential structuring)
        if (_amount % 1000 ether == 0 && _amount > 5000 ether) {
            return true;
        }
        
        return false;
    }
    
    function getDailyLimit(uint256 _kycLevel) internal pure returns (uint256) {
        if (_kycLevel == KYC_LEVEL_1) return DAILY_LIMIT_LEVEL_1;
        if (_kycLevel == KYC_LEVEL_2) return DAILY_LIMIT_LEVEL_2;
        if (_kycLevel == KYC_LEVEL_3) return DAILY_LIMIT_LEVEL_3;
        return 0;
    }
    
    function getMonthlyLimit(uint256 _kycLevel) internal pure returns (uint256) {
        if (_kycLevel == KYC_LEVEL_1) return MONTHLY_LIMIT_LEVEL_1;
        if (_kycLevel == KYC_LEVEL_2) return MONTHLY_LIMIT_LEVEL_2;
        if (_kycLevel == KYC_LEVEL_3) return MONTHLY_LIMIT_LEVEL_3;
        return 0;
    }
    
    function getUser(address _user) external view returns (User memory) {
        return users[_user];
    }
    
    function isBlacklisted(address _user) external view returns (bool) {
        return blacklist[_user] || users[_user].isBlacklisted;
    }
    
    function getTransaction(bytes32 _txId) external view returns (Transaction memory) {
        return transactions[_txId];
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
}
