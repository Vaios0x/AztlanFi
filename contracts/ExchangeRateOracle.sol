// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract ExchangeRateOracle is Ownable, Pausable {
    // Oracle para tasas de cambio USD/MXN
    // Permite actualización manual y automática de tasas
    // Incluye historial de tasas para auditoría
    
    struct RateData {
        uint256 rate;        // Rate * 100 (e.g., 1700 = 17.00 MXN per USD)
        uint256 timestamp;
        string source;       // Source of the rate (e.g., "API", "Manual")
        bool isValid;
    }
    
    mapping(uint256 => RateData) public rateHistory;
    uint256 public currentRate = 1700; // Default: 17.00 MXN per USD
    uint256 public rateHistoryIndex = 0;
    uint256 public lastUpdateTime;
    
    address public authorizedUpdater;
    uint256 public constant MIN_RATE = 1000;  // 10.00 MXN per USD
    uint256 public constant MAX_RATE = 5000;  // 50.00 MXN per USD
    uint256 public constant RATE_DECIMALS = 2;
    
    event RateUpdated(uint256 indexed index, uint256 oldRate, uint256 newRate, string source);
    event UpdaterChanged(address indexed oldUpdater, address indexed newUpdater);
    
    modifier onlyAuthorized() {
        require(
            msg.sender == owner() || msg.sender == authorizedUpdater,
            "Not authorized"
        );
        _;
    }
    
    constructor() Ownable(msg.sender) {
        authorizedUpdater = msg.sender;
        lastUpdateTime = block.timestamp;
        
        // Initialize with default rate
        rateHistory[0] = RateData({
            rate: currentRate,
            timestamp: block.timestamp,
            source: "Initial",
            isValid: true
        });
        rateHistoryIndex = 1;
    }
    
    function updateRate(uint256 _newRate, string calldata _source) external onlyAuthorized whenNotPaused {
        require(_newRate >= MIN_RATE && _newRate <= MAX_RATE, "Rate out of bounds");
        require(_newRate != currentRate, "Rate unchanged");
        
        uint256 oldRate = currentRate;
        currentRate = _newRate;
        lastUpdateTime = block.timestamp;
        
        // Store in history
        rateHistory[rateHistoryIndex] = RateData({
            rate: _newRate,
            timestamp: block.timestamp,
            source: _source,
            isValid: true
        });
        
        emit RateUpdated(rateHistoryIndex, oldRate, _newRate, _source);
        rateHistoryIndex++;
    }
    
    function updateRateBatch(
        uint256[] calldata _rates,
        string[] calldata _sources
    ) external onlyAuthorized whenNotPaused {
        require(_rates.length == _sources.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < _rates.length; i++) {
            require(_rates[i] >= MIN_RATE && _rates[i] <= MAX_RATE, "Rate out of bounds");
            
            uint256 oldRate = currentRate;
            currentRate = _rates[i];
            lastUpdateTime = block.timestamp;
            
            // Store in history
            rateHistory[rateHistoryIndex] = RateData({
                rate: _rates[i],
                timestamp: block.timestamp,
                source: _sources[i],
                isValid: true
            });
            
            emit RateUpdated(rateHistoryIndex, oldRate, _rates[i], _sources[i]);
            rateHistoryIndex++;
        }
    }
    
    function getCurrentRate() external view returns (uint256) {
        return currentRate;
    }
    
    function getRateWithDecimals() external view returns (uint256) {
        return currentRate * (10 ** RATE_DECIMALS);
    }
    
    function getRateHistory(uint256 _index) external view returns (RateData memory) {
        require(_index < rateHistoryIndex, "Index out of bounds");
        return rateHistory[_index];
    }
    
    function getRecentRates(uint256 _count) external view returns (RateData[] memory) {
        require(_count > 0 && _count <= rateHistoryIndex, "Invalid count");
        
        RateData[] memory recentRates = new RateData[](_count);
        uint256 startIndex = rateHistoryIndex - _count;
        
        for (uint256 i = 0; i < _count; i++) {
            recentRates[i] = rateHistory[startIndex + i];
        }
        
        return recentRates;
    }
    
    function setAuthorizedUpdater(address _newUpdater) external onlyOwner {
        require(_newUpdater != address(0), "Invalid address");
        address oldUpdater = authorizedUpdater;
        authorizedUpdater = _newUpdater;
        emit UpdaterChanged(oldUpdater, _newUpdater);
    }
    
    function isRateStale(uint256 _maxAge) external view returns (bool) {
        return (block.timestamp - lastUpdateTime) > _maxAge;
    }
    
    function getRateAge() external view returns (uint256) {
        return block.timestamp - lastUpdateTime;
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // Emergency function to invalidate a rate entry
    function invalidateRate(uint256 _index) external onlyOwner {
        require(_index < rateHistoryIndex, "Index out of bounds");
        rateHistory[_index].isValid = false;
    }
}
