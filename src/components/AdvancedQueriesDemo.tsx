'use client';

import React, { useState } from 'react';
import { useAdvancedQueries, useQueryUtils, useDashboardQueries } from '@/lib/web3/advancedQueries';
import { useAccount } from 'wagmi';

export default function AdvancedQueriesDemo() {
  const { address, isConnected } = useAccount();
  const [remittanceId, setRemittanceId] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [achievementId, setAchievementId] = useState('');
  const [txId, setTxId] = useState('');
  const [rateIndex, setRateIndex] = useState(0);
  const [rateCount, setRateCount] = useState(5);
  const [maxAge, setMaxAge] = useState(3600);

  const {
    useGetRemittance,
    totalVolume,
    totalTransactions,
    useIsBlacklisted,
    useGetTransaction,
    useGetUserAchievement,
    useGetPendingRewards,
    useGetRateHistory,
    useGetRecentRates,
    useIsRateStale,
    rateAge,
    isRateStale1Hour,
    isRateStale24Hours,
  } = useAdvancedQueries();

  const {
    formatTimestamp,
    formatExchangeRate,
    formatUSD,
    truncateAddress,
    getRemittanceStatus,
    isValidAddress,
    isValidHash,
  } = useQueryUtils();

  const dashboardData = useDashboardQueries();

  // Consultas dinámicas
  const { data: remittance, isLoading: isLoadingRemittance } = useGetRemittance(remittanceId);
  const { data: isBlacklisted, isLoading: isLoadingBlacklist } = useIsBlacklisted(userAddress);
  const { data: transaction, isLoading: isLoadingTransaction } = useGetTransaction(txId);
  const { data: achievement, isLoading: isLoadingAchievement } = useGetUserAchievement(userAddress, achievementId);
  const { data: pendingRewards, isLoading: isLoadingPendingRewards } = useGetPendingRewards(userAddress);
  const { data: rateHistory, isLoading: isLoadingRateHistory } = useGetRateHistory(rateIndex);
  const { data: recentRates, isLoading: isLoadingRecentRates } = useGetRecentRates(rateCount);
  const { data: isRateStale, isLoading: isLoadingRateStale } = useIsRateStale(maxAge);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Advanced Query Functions
          </h1>
          <p className="text-lg text-gray-600">
            Complete demonstration of all implemented query functions
          </p>
        </div>

        {!isConnected && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              Connect your wallet to access all functions
            </p>
          </div>
        )}

        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Volume</h3>
            <p className="text-3xl font-bold text-blue-600">
              {dashboardData.isLoadingTotalVolume ? '...' : `$${dashboardData.totalVolume}`}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Transactions</h3>
            <p className="text-3xl font-bold text-green-600">
              {dashboardData.isLoadingTotalTransactions ? '...' : dashboardData.totalTransactions}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Liquidity</h3>
            <p className="text-3xl font-bold text-purple-600">
              {dashboardData.isLoadingTotalLiquidity ? '...' : `$${dashboardData.totalLiquidity}`}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">USD/MXN Rate</h3>
            <p className="text-3xl font-bold text-orange-600">
              {dashboardData.isLoadingCurrentRate ? '...' : dashboardData.currentRate}
            </p>
          </div>
        </div>

        {/* RemittancePool Queries */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">RemittancePool - Queries</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Get Remittance */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Get Remittance</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Remittance ID (0x...)"
                  value={remittanceId}
                  onChange={(e) => setRemittanceId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  tabIndex={0}
                  aria-label="Remittance ID"
                />
                <button
                  onClick={() => {}} // Only to show the state
                  disabled={!isValidHash(remittanceId)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  tabIndex={0}
                  aria-label="Query remittance"
                >
                  {isLoadingRemittance ? 'Querying...' : 'Query Remittance'}
                </button>
              </div>
              
              {remittance && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-gray-800">Remittance Details:</h4>
                  <p><span className="font-medium">Sender:</span> {truncateAddress(remittance.sender)}</p>
                  <p><span className="font-medium">Receiver:</span> {truncateAddress(remittance.receiver)}</p>
                  <p><span className="font-medium">Amount:</span> {formatUSD(remittance.amount)}</p>
                  <p><span className="font-medium">Fee:</span> {formatUSD(remittance.fee)}</p>
                  <p><span className="font-medium">Date:</span> {formatTimestamp(remittance.timestamp)}</p>
                  <p><span className="font-medium">Status:</span> 
                    <span className={`ml-2 ${getRemittanceStatus(remittance.completed).color}`}>
                      {getRemittanceStatus(remittance.completed).status}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Global Statistics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Global Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Total Volume:</span>
                  <span className="text-blue-600 font-semibold">
                    {dashboardData.isLoadingTotalVolume ? '...' : `$${dashboardData.totalVolume}`}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Total Transactions:</span>
                  <span className="text-green-600 font-semibold">
                    {dashboardData.isLoadingTotalTransactions ? '...' : dashboardData.totalTransactions}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ComplianceModule Queries */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">ComplianceModule - Queries</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Check Blacklist */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Check Blacklist</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="User address (0x...)"
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  tabIndex={0}
                  aria-label="User address"
                />
                <button
                  onClick={() => {}} // Only to show the state
                  disabled={!isValidAddress(userAddress)}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  tabIndex={0}
                  aria-label="Check blacklist"
                >
                  {isLoadingBlacklist ? 'Checking...' : 'Check Blacklist'}
                </button>
              </div>
              
              {isBlacklisted !== undefined && (
                <div className={`p-4 rounded-lg ${isBlacklisted ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                  <p className={`font-semibold ${isBlacklisted ? 'text-red-800' : 'text-green-800'}`}>
                    {isBlacklisted ? 'User in BLACKLIST' : 'User NOT in blacklist'}
                  </p>
                </div>
              )}
            </div>

            {/* Get Transaction */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Get Transaction</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Transaction ID (0x...)"
                  value={txId}
                  onChange={(e) => setTxId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  tabIndex={0}
                  aria-label="Transaction ID"
                />
                <button
                  onClick={() => {}} // Only to show the state
                  disabled={!isValidHash(txId)}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  tabIndex={0}
                  aria-label="Query transaction"
                >
                  {isLoadingTransaction ? 'Querying...' : 'Query Transaction'}
                </button>
              </div>
              
              {transaction && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-gray-800">Transaction Details:</h4>
                  <p><span className="font-medium">Sender:</span> {truncateAddress(transaction.sender)}</p>
                  <p><span className="font-medium">Receiver:</span> {truncateAddress(transaction.receiver)}</p>
                  <p><span className="font-medium">Amount:</span> {formatUSD(transaction.amount)}</p>
                  <p><span className="font-medium">Date:</span> {formatTimestamp(transaction.timestamp)}</p>
                  <p><span className="font-medium">Suspicious:</span> 
                    <span className={`ml-2 ${transaction.isSuspicious ? 'text-red-600' : 'text-green-600'}`}>
                      {transaction.isSuspicious ? 'Yes' : 'No'}
                    </span>
                  </p>
                  {transaction.reason && (
                    <p><span className="font-medium">Reason:</span> {transaction.reason}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* IncentiveVault Queries */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">IncentiveVault - Queries</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Get Achievement */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Get User Achievement</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="User address (0x...)"
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  tabIndex={0}
                  aria-label="User address for achievement"
                />
                <input
                  type="text"
                  placeholder="Achievement ID (e.g.: first_transaction)"
                  value={achievementId}
                  onChange={(e) => setAchievementId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  tabIndex={0}
                  aria-label="Achievement ID"
                />
                <button
                  onClick={() => {}} // Only to show the state
                  disabled={!isValidAddress(userAddress) || !achievementId}
                  className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  tabIndex={0}
                  aria-label="Query achievement"
                >
                  {isLoadingAchievement ? 'Querying...' : 'Query Achievement'}
                </button>
              </div>
              
              {achievement && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-gray-800">Achievement Details:</h4>
                  <p><span className="font-medium">Name:</span> {achievement.name}</p>
                  <p><span className="font-medium">Description:</span> {achievement.description}</p>
                  <p><span className="font-medium">Requirement:</span> {achievement.requirement.toString()}</p>
                  <p><span className="font-medium">Is NFT:</span> {achievement.isNFT ? 'Yes' : 'No'}</p>
                  <p><span className="font-medium">Claimed:</span> 
                    <span className={`ml-2 ${achievement.isClaimed ? 'text-green-600' : 'text-yellow-600'}`}>
                      {achievement.isClaimed ? 'Yes' : 'No'}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Pending Rewards */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Pending Rewards</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="User address (0x...)"
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  tabIndex={0}
                  aria-label="User address for rewards"
                />
                <button
                  onClick={() => {}} // Only to show the state
                  disabled={!isValidAddress(userAddress)}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  tabIndex={0}
                  aria-label="Query rewards"
                >
                  {isLoadingPendingRewards ? 'Querying...' : 'Query Rewards'}
                </button>
              </div>
              
              {pendingRewards !== undefined && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Pending Rewards:</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {formatUSD(pendingRewards as bigint)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ExchangeRateOracle Queries */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">ExchangeRateOracle - Queries</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Rate History */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Rate History</h3>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="History index"
                  value={rateIndex}
                  onChange={(e) => setRateIndex(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  tabIndex={0}
                  aria-label="Rate history index"
                />
                <button
                  onClick={() => {}} // Only to show the state
                  disabled={rateIndex < 0}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  tabIndex={0}
                  aria-label="Query rate history"
                >
                  {isLoadingRateHistory ? 'Querying...' : 'Query History'}
                </button>
              </div>
              
              {rateHistory && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-gray-800">Rate Details:</h4>
                  <p><span className="font-medium">Rate:</span> {formatExchangeRate(rateHistory.rate)} MXN/USD</p>
                  <p><span className="font-medium">Date:</span> {formatTimestamp(rateHistory.timestamp)}</p>
                  <p><span className="font-medium">Source:</span> {rateHistory.source}</p>
                  <p><span className="font-medium">Valid:</span> 
                    <span className={`ml-2 ${rateHistory.isValid ? 'text-green-600' : 'text-red-600'}`}>
                      {rateHistory.isValid ? 'Yes' : 'No'}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Recent Rates */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Recent Rates</h3>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Number of rates (1-100)"
                  value={rateCount}
                  onChange={(e) => setRateCount(Number(e.target.value))}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  tabIndex={0}
                  aria-label="Number of recent rates"
                />
                <button
                  onClick={() => {}} // Only to show the state
                  disabled={rateCount < 1 || rateCount > 100}
                  className="w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  tabIndex={0}
                  aria-label="Query recent rates"
                >
                  {isLoadingRecentRates ? 'Querying...' : 'Query Recent'}
                </button>
              </div>
              
              {recentRates && recentRates.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Recent Rates:</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {recentRates.map((rate, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{formatExchangeRate(rate.rate)} MXN/USD</span>
                        <span className="text-gray-500 ml-2">({rate.source})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Rate Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Rate Status</h3>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Maximum age in seconds"
                  value={maxAge}
                  onChange={(e) => setMaxAge(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  tabIndex={0}
                  aria-label="Maximum rate age"
                />
                <button
                  onClick={() => {}} // Only to show the state
                  disabled={maxAge <= 0}
                  className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  tabIndex={0}
                  aria-label="Check rate status"
                >
                  {isLoadingRateStale ? 'Checking...' : 'Check Status'}
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-gray-800">Rate Information:</h4>
                <p><span className="font-medium">Current age:</span> {rateAge} seconds</p>
                <p><span className="font-medium">Stale (1h):</span> 
                  <span className={`ml-2 ${isRateStale1Hour ? 'text-red-600' : 'text-green-600'}`}>
                    {isRateStale1Hour ? 'Yes' : 'No'}
                  </span>
                </p>
                <p><span className="font-medium">Stale (24h):</span> 
                  <span className={`ml-2 ${isRateStale24Hours ? 'text-red-600' : 'text-green-600'}`}>
                    {isRateStale24Hours ? 'Yes' : 'No'}
                  </span>
                </p>
                {isRateStale !== undefined && (
                  <p><span className="font-medium">Stale (custom):</span> 
                    <span className={`ml-2 ${isRateStale ? 'text-red-600' : 'text-green-600'}`}>
                      {isRateStale ? 'Yes' : 'No'}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* User Information */}
        {isConnected && address && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Address</h3>
                <p className="text-blue-700 font-mono text-sm">{truncateAddress(address)}</p>
              </div>
              
              {dashboardData.userStats && (
                <>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Total Volume</h3>
                    <p className="text-green-700 text-xl font-bold">
                      {formatUSD(dashboardData.userStats.totalVolume as bigint)}
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">Transactions</h3>
                    <p className="text-purple-700 text-xl font-bold">
                      {dashboardData.userStats.totalTransactions.toString()}
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-900 mb-2">Referrals</h3>
                    <p className="text-yellow-700 text-xl font-bold">
                      {dashboardData.userStats.referralCount.toString()}
                    </p>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-900 mb-2">Achievements</h3>
                    <p className="text-orange-700 text-xl font-bold">
                      {dashboardData.userStats.achievementCount.toString()}
                    </p>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-4">
                    <h3 className="font-semibold text-red-900 mb-2">Pending Rewards</h3>
                    <p className="text-red-700 text-xl font-bold">
                      {dashboardData.pendingRewards}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
