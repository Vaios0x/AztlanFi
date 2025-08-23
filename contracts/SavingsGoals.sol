// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract SavingsGoals is ReentrancyGuard, AccessControl, Pausable {
    bytes32 public constant GOAL_MANAGER_ROLE = keccak256("GOAL_MANAGER");
    
    struct Goal {
        string name;
        address owner;
        uint256 targetAmount;
        uint256 currentAmount;
        uint256 deadline;
        bool completed;
        bool locked;
        uint256 createdAt;
        uint256 lastDeposit;
        RecurringDeposit recurringDeposit;
    }
    
    struct RecurringDeposit {
        uint256 amount;
        uint256 frequency; // 1 = daily, 7 = weekly, 30 = monthly
        uint256 nextDeposit;
        bool active;
    }
    
    struct GoalStats {
        uint256 totalGoals;
        uint256 completedGoals;
        uint256 totalSaved;
        uint256 averageGoalAmount;
        uint256 totalRecurringDeposits;
    }
    
    mapping(uint256 => Goal) public goals;
    mapping(address => uint256[]) public userGoals;
    mapping(address => uint256) public userTotalSaved;
    
    uint256 public goalCounter;
    uint256 public constant MIN_GOAL_AMOUNT = 1 ether; // $1 minimum
    uint256 public constant MAX_GOAL_AMOUNT = 1000000 ether; // $1M maximum
    uint256 public constant MIN_DEADLINE_DAYS = 1;
    uint256 public constant MAX_DEADLINE_DAYS = 3650; // 10 years
    
    // Events
    event GoalCreated(
        uint256 indexed goalId,
        address indexed owner,
        string name,
        uint256 targetAmount,
        uint256 deadline
    );
    
    event DepositMade(
        uint256 indexed goalId,
        address indexed owner,
        uint256 amount,
        uint256 newBalance
    );
    
    event GoalCompleted(
        uint256 indexed goalId,
        address indexed owner,
        uint256 targetAmount,
        uint256 finalAmount
    );
    
    event RecurringDepositSetup(
        uint256 indexed goalId,
        uint256 amount,
        uint256 frequency
    );
    
    event RecurringDepositExecuted(
        uint256 indexed goalId,
        uint256 amount,
        uint256 nextDeposit
    );
    
    event GoalWithdrawn(
        uint256 indexed goalId,
        address indexed owner,
        uint256 amount
    );
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(GOAL_MANAGER_ROLE, msg.sender);
    }
    
    // Create a new savings goal
    function createGoal(
        string memory name,
        uint256 targetAmount,
        uint256 deadlineDays,
        uint256 initialDeposit
    ) external nonReentrant whenNotPaused returns (uint256) {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(targetAmount >= MIN_GOAL_AMOUNT, "Target too low");
        require(targetAmount <= MAX_GOAL_AMOUNT, "Target too high");
        require(deadlineDays >= MIN_DEADLINE_DAYS, "Deadline too short");
        require(deadlineDays <= MAX_DEADLINE_DAYS, "Deadline too long");
        require(initialDeposit <= targetAmount, "Initial deposit exceeds target");
        
        uint256 goalId = ++goalCounter;
        uint256 deadline = block.timestamp + (deadlineDays * 1 days);
        
        goals[goalId] = Goal({
            name: name,
            owner: msg.sender,
            targetAmount: targetAmount,
            currentAmount: 0,
            deadline: deadline,
            completed: false,
            locked: true,
            createdAt: block.timestamp,
            lastDeposit: 0,
            recurringDeposit: RecurringDeposit({
                amount: 0,
                frequency: 0,
                nextDeposit: 0,
                active: false
            })
        });
        
        userGoals[msg.sender].push(goalId);
        
        emit GoalCreated(goalId, msg.sender, name, targetAmount, deadline);
        
        // Make initial deposit if provided
        if (initialDeposit > 0) {
            _depositToGoal(goalId, initialDeposit);
        }
        
        return goalId;
    }
    
    // Deposit to a savings goal
    function depositToGoal(uint256 goalId, uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(goals[goalId].owner == msg.sender, "Not goal owner");
        require(!goals[goalId].completed, "Goal already completed");
        require(block.timestamp < goals[goalId].deadline, "Goal expired");
        
        _depositToGoal(goalId, amount);
    }
    
    // Setup recurring deposits
    function setupRecurringDeposit(
        uint256 goalId,
        uint256 amount,
        uint256 frequency // 1 = daily, 7 = weekly, 30 = monthly
    ) external nonReentrant whenNotPaused {
        require(goals[goalId].owner == msg.sender, "Not goal owner");
        require(!goals[goalId].completed, "Goal already completed");
        require(amount > 0, "Amount must be greater than 0");
        require(frequency == 1 || frequency == 7 || frequency == 30, "Invalid frequency");
        
        Goal storage goal = goals[goalId];
        goal.recurringDeposit = RecurringDeposit({
            amount: amount,
            frequency: frequency,
            nextDeposit: block.timestamp + (frequency * 1 days),
            active: true
        });
        
        emit RecurringDepositSetup(goalId, amount, frequency);
    }
    
    // Execute recurring deposits (can be called by anyone)
    function executeRecurringDeposits(uint256 goalId) external nonReentrant whenNotPaused {
        Goal storage goal = goals[goalId];
        require(goal.owner != address(0), "Goal does not exist");
        require(!goal.completed, "Goal already completed");
        require(goal.recurringDeposit.active, "No recurring deposit");
        require(block.timestamp >= goal.recurringDeposit.nextDeposit, "Too early");
        
        uint256 amount = goal.recurringDeposit.amount;
        
        // Check if user has enough balance
        uint256 userBalance = IERC20(getUSDCAddress()).balanceOf(goal.owner);
        require(userBalance >= amount, "Insufficient balance");
        
        // Transfer from user to contract
        IERC20(getUSDCAddress()).transferFrom(goal.owner, address(this), amount);
        
        // Update goal
        goal.currentAmount += amount;
        goal.lastDeposit = block.timestamp;
        goal.recurringDeposit.nextDeposit = block.timestamp + (goal.recurringDeposit.frequency * 1 days);
        
        // Update user stats
        userTotalSaved[goal.owner] += amount;
        
        emit DepositMade(goalId, goal.owner, amount, goal.currentAmount);
        emit RecurringDepositExecuted(goalId, amount, goal.recurringDeposit.nextDeposit);
        
        // Check if goal is completed
        if (goal.currentAmount >= goal.targetAmount && !goal.completed) {
            goal.completed = true;
            goal.locked = false;
            emit GoalCompleted(goalId, goal.owner, goal.targetAmount, goal.currentAmount);
        }
    }
    
    // Withdraw from goal (only if completed, expired, or unlocked)
    function withdrawFromGoal(uint256 goalId, uint256 amount) external nonReentrant whenNotPaused {
        Goal storage goal = goals[goalId];
        require(goal.owner == msg.sender, "Not goal owner");
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= goal.currentAmount, "Insufficient balance");
        require(
            !goal.locked || 
            goal.completed || 
            block.timestamp > goal.deadline, 
            "Goal still locked"
        );
        
        goal.currentAmount -= amount;
        userTotalSaved[msg.sender] -= amount;
        
        IERC20(getUSDCAddress()).transfer(msg.sender, amount);
        
        emit GoalWithdrawn(goalId, msg.sender, amount);
    }
    
    // Cancel recurring deposit
    function cancelRecurringDeposit(uint256 goalId) external {
        require(goals[goalId].owner == msg.sender, "Not goal owner");
        
        Goal storage goal = goals[goalId];
        goal.recurringDeposit.active = false;
    }
    
    // Extend goal deadline
    function extendDeadline(uint256 goalId, uint256 additionalDays) external {
        require(goals[goalId].owner == msg.sender, "Not goal owner");
        require(!goals[goalId].completed, "Goal already completed");
        require(additionalDays > 0, "Additional days must be positive");
        require(additionalDays <= 365, "Cannot extend more than 1 year");
        
        Goal storage goal = goals[goalId];
        goal.deadline += (additionalDays * 1 days);
    }
    
    // Internal deposit function
    function _depositToGoal(uint256 goalId, uint256 amount) private {
        Goal storage goal = goals[goalId];
        
        // Transfer USDC from user to contract
        IERC20(getUSDCAddress()).transferFrom(msg.sender, address(this), amount);
        
        // Update goal
        goal.currentAmount += amount;
        goal.lastDeposit = block.timestamp;
        
        // Update user stats
        userTotalSaved[msg.sender] += amount;
        
        emit DepositMade(goalId, msg.sender, amount, goal.currentAmount);
        
        // Check if goal is completed
        if (goal.currentAmount >= goal.targetAmount && !goal.completed) {
            goal.completed = true;
            goal.locked = false;
            emit GoalCompleted(goalId, msg.sender, goal.targetAmount, goal.currentAmount);
        }
    }
    
    // View functions
    function getGoal(uint256 goalId) external view returns (Goal memory) {
        return goals[goalId];
    }
    
    function getUserGoals(address user) external view returns (uint256[] memory) {
        return userGoals[user];
    }
    
    function getUserTotalSaved(address user) external view returns (uint256) {
        return userTotalSaved[user];
    }
    
    function getGoalProgress(uint256 goalId) external view returns (
        uint256 currentAmount,
        uint256 targetAmount,
        uint256 percentage,
        uint256 daysRemaining,
        bool isCompleted
    ) {
        Goal storage goal = goals[goalId];
        uint256 progress = (goal.currentAmount * 100) / goal.targetAmount;
        uint256 remaining = goal.deadline > block.timestamp ? 
            (goal.deadline - block.timestamp) / 1 days : 0;
        
        return (
            goal.currentAmount,
            goal.targetAmount,
            progress,
            remaining,
            goal.completed
        );
    }
    
    function getGoalStats() external view returns (GoalStats memory) {
        uint256 totalGoals = goalCounter;
        uint256 completedGoals = 0;
        uint256 totalSaved = 0;
        uint256 totalRecurring = 0;
        
        for (uint256 i = 1; i <= goalCounter; i++) {
            Goal storage goal = goals[i];
            if (goal.completed) {
                completedGoals++;
            }
            totalSaved += goal.currentAmount;
            if (goal.recurringDeposit.active) {
                totalRecurring++;
            }
        }
        
        uint256 averageAmount = totalGoals > 0 ? totalSaved / totalGoals : 0;
        
        return GoalStats({
            totalGoals: totalGoals,
            completedGoals: completedGoals,
            totalSaved: totalSaved,
            averageGoalAmount: averageAmount,
            totalRecurringDeposits: totalRecurring
        });
    }
    
    function getGoalsReadyForRecurringDeposit() external view returns (uint256[] memory) {
        uint256[] memory readyGoals = new uint256[](goalCounter);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= goalCounter; i++) {
            Goal storage goal = goals[i];
            if (
                goal.recurringDeposit.active &&
                !goal.completed &&
                block.timestamp >= goal.recurringDeposit.nextDeposit
            ) {
                readyGoals[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = readyGoals[i];
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
