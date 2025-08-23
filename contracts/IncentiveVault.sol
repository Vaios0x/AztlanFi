// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract IncentiveVault is Ownable, ReentrancyGuard {
    // Referral rewards
    // LP rewards
    // Volume discounts
    // Achievement NFTs
    
    struct Referral {
        address referrer;
        address referred;
        uint256 totalVolume;
        uint256 rewardsEarned;
        uint256 lastReward;
        bool isActive;
    }
    
    struct Achievement {
        string name;
        string description;
        uint256 requirement;
        bool isNFT;
        string metadataURI;
        bool isClaimed;
    }
    
    struct UserStats {
        uint256 totalVolume;
        uint256 totalTransactions;
        uint256 referralCount;
        uint256 rewardsEarned;
        uint256 achievementCount;
        uint256 lastActivity;
    }
    
    mapping(address => Referral) public referrals;
    mapping(address => UserStats) public userStats;
    mapping(address => mapping(string => Achievement)) public userAchievements;
    mapping(address => uint256) public userRewards;
    
    uint256 public REFERRAL_RATE = 50; // 0.5% of transaction volume
    uint256 public constant RATE_DENOMINATOR = 10000;
    uint256 public constant MIN_REFERRAL_VOLUME = 100 ether; // $100 minimum
    
    address public remittancePool;
    address public rewardToken; // ERC20 token for rewards
    
    event ReferralCreated(address indexed referrer, address indexed referred);
    event RewardEarned(address indexed user, uint256 amount, string reason);
    event AchievementUnlocked(address indexed user, string achievement);
    event RewardClaimed(address indexed user, uint256 amount);
    
    modifier onlyRemittancePool() {
        require(msg.sender == remittancePool, "Only remittance pool can call this");
        _;
    }
    
    constructor(address _remittancePool, address _rewardToken) Ownable(msg.sender) {
        remittancePool = _remittancePool;
        rewardToken = _rewardToken;
    }
    
    function createReferral(address _referrer, address _referred) external onlyRemittancePool {
        require(_referrer != address(0) && _referred != address(0), "Invalid addresses");
        require(_referrer != _referred, "Cannot refer yourself");
        require(referrals[_referred].referrer == address(0), "Already referred");
        
        referrals[_referred] = Referral({
            referrer: _referrer,
            referred: _referred,
            totalVolume: 0,
            rewardsEarned: 0,
            lastReward: 0,
            isActive: true
        });
        
        userStats[_referrer].referralCount++;
        
        emit ReferralCreated(_referrer, _referred);
    }
    
    function processTransaction(
        address _sender,
        uint256 _amount
    ) external onlyRemittancePool {
        // Update user stats
        userStats[_sender].totalVolume += _amount;
        userStats[_sender].totalTransactions++;
        userStats[_sender].lastActivity = block.timestamp;
        
        // Process referral rewards
        processReferralRewards(_sender, _amount);
        
        // Check for achievements
        checkAchievements(_sender);
    }
    
    function processReferralRewards(address _user, uint256 _amount) internal {
        Referral storage referral = referrals[_user];
        
        if (referral.isActive && referral.referrer != address(0)) {
            referral.totalVolume += _amount;
            
            // Calculate reward
            uint256 reward = (_amount * REFERRAL_RATE) / RATE_DENOMINATOR;
            
            if (reward > 0) {
                referral.rewardsEarned += reward;
                referral.lastReward = block.timestamp;
                
                // Add to referrer's rewards
                userRewards[referral.referrer] += reward;
                userStats[referral.referrer].rewardsEarned += reward;
                
                emit RewardEarned(referral.referrer, reward, "Referral reward");
            }
        }
    }
    
    function checkAchievements(address _user) internal {
        UserStats storage stats = userStats[_user];
        
        // First Transaction Achievement
        if (stats.totalTransactions == 1) {
            unlockAchievement(_user, "first_transaction", "First Transaction", "Complete your first remittance", 1, false, "");
        }
        
        // Volume Achievements
        if (stats.totalVolume >= 1000 ether && !userAchievements[_user]["volume_1k"].isClaimed) {
            unlockAchievement(_user, "volume_1k", "Volume Trader", "Send $1,000 in remittances", 1000 ether, false, "");
        }
        
        if (stats.totalVolume >= 10000 ether && !userAchievements[_user]["volume_10k"].isClaimed) {
            unlockAchievement(_user, "volume_10k", "Power User", "Send $10,000 in remittances", 10000 ether, false, "");
        }
        
        // Referral Achievements
        if (stats.referralCount >= 5 && !userAchievements[_user]["referral_5"].isClaimed) {
            unlockAchievement(_user, "referral_5", "Networker", "Refer 5 users", 5, false, "");
        }
        
        if (stats.referralCount >= 20 && !userAchievements[_user]["referral_20"].isClaimed) {
            unlockAchievement(_user, "referral_20", "Influencer", "Refer 20 users", 20, false, "");
        }
        
        // Frequency Achievements
        if (stats.totalTransactions >= 10 && !userAchievements[_user]["transactions_10"].isClaimed) {
            unlockAchievement(_user, "transactions_10", "Regular User", "Complete 10 transactions", 10, false, "");
        }
        
        if (stats.totalTransactions >= 100 && !userAchievements[_user]["transactions_100"].isClaimed) {
            unlockAchievement(_user, "transactions_100", "Loyal Customer", "Complete 100 transactions", 100, false, "");
        }
    }
    
    function unlockAchievement(
        address _user,
        string memory _id,
        string memory _name,
        string memory _description,
        uint256 _requirement,
        bool _isNFT,
        string memory _metadataURI
    ) internal {
        userAchievements[_user][_id] = Achievement({
            name: _name,
            description: _description,
            requirement: _requirement,
            isNFT: _isNFT,
            metadataURI: _metadataURI,
            isClaimed: false
        });
        
        userStats[_user].achievementCount++;
        
        // Give bonus rewards for achievements
        uint256 bonusReward = calculateAchievementReward(_id);
        if (bonusReward > 0) {
            userRewards[_user] += bonusReward;
            userStats[_user].rewardsEarned += bonusReward;
            emit RewardEarned(_user, bonusReward, "Achievement bonus");
        }
        
        emit AchievementUnlocked(_user, _id);
    }
    
    function calculateAchievementReward(string memory _achievementId) internal pure returns (uint256) {
        if (keccak256(bytes(_achievementId)) == keccak256(bytes("first_transaction"))) {
            return 10 ether; // 10 tokens
        } else if (keccak256(bytes(_achievementId)) == keccak256(bytes("volume_1k"))) {
            return 50 ether; // 50 tokens
        } else if (keccak256(bytes(_achievementId)) == keccak256(bytes("volume_10k"))) {
            return 200 ether; // 200 tokens
        } else if (keccak256(bytes(_achievementId)) == keccak256(bytes("referral_5"))) {
            return 100 ether; // 100 tokens
        } else if (keccak256(bytes(_achievementId)) == keccak256(bytes("referral_20"))) {
            return 500 ether; // 500 tokens
        } else if (keccak256(bytes(_achievementId)) == keccak256(bytes("transactions_10"))) {
            return 75 ether; // 75 tokens
        } else if (keccak256(bytes(_achievementId)) == keccak256(bytes("transactions_100"))) {
            return 300 ether; // 300 tokens
        }
        return 0;
    }
    
    function claimRewards() external nonReentrant {
        uint256 rewards = userRewards[msg.sender];
        require(rewards > 0, "No rewards to claim");
        
        userRewards[msg.sender] = 0;
        
        // Transfer ERC20 tokens
        if (rewardToken != address(0)) {
            IERC20(rewardToken).transfer(msg.sender, rewards);
        } else {
            // Fallback to ETH if no reward token
            payable(msg.sender).transfer(rewards);
        }
        
        emit RewardClaimed(msg.sender, rewards);
    }
    
    function claimAchievement(string calldata _achievementId) external {
        Achievement storage achievement = userAchievements[msg.sender][_achievementId];
        require(achievement.isClaimed == false, "Achievement already claimed");
        
        achievement.isClaimed = true;
        
        // If it's an NFT achievement, mint NFT here
        if (achievement.isNFT) {
            // NFT minting logic would go here
            // For now, just mark as claimed
        }
    }
    
    function getReferral(address _user) external view returns (Referral memory) {
        return referrals[_user];
    }
    
    function getUserStats(address _user) external view returns (UserStats memory) {
        return userStats[_user];
    }
    
    function getUserAchievement(
        address _user,
        string calldata _achievementId
    ) external view returns (Achievement memory) {
        return userAchievements[_user][_achievementId];
    }
    
    function getPendingRewards(address _user) external view returns (uint256) {
        return userRewards[_user];
    }
    
    function setRemittancePool(address _newPool) external onlyOwner {
        require(_newPool != address(0), "Invalid address");
        remittancePool = _newPool;
    }
    
    function setRewardToken(address _newToken) external onlyOwner {
        rewardToken = _newToken;
    }
    
    function updateReferralRate(uint256 _newRate) external onlyOwner {
        require(_newRate <= 1000, "Rate too high"); // Max 10%
        REFERRAL_RATE = _newRate;
    }
    
    // Emergency functions
    function emergencyWithdraw() external onlyOwner {
        if (rewardToken != address(0)) {
            uint256 balance = IERC20(rewardToken).balanceOf(address(this));
            IERC20(rewardToken).transfer(owner(), balance);
        } else {
            payable(owner()).transfer(address(this).balance);
        }
    }
    
    receive() external payable {
        // Accept ETH
    }
}
