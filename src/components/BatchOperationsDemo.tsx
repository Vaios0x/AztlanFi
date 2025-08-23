'use client';

import React, { useState } from 'react';
import { useBatchOperations, useBatchOperationUtils, useBatchOperationUI } from '@/lib/web3/batchOperations';
import { useAccount } from 'wagmi';
import { BatchMintData, BatchRateUpdateData } from '@/lib/web3/batchOperations';

export default function BatchOperationsDemo() {
  const { address, isConnected } = useAccount();
  
  // Estados para mint batch
  const [mintBatchData, setMintBatchData] = useState<BatchMintData>({
    recipients: [''],
    amounts: [''],
    reason: ''
  });

  // Estados para update rate batch
  const [rateBatchData, setRateBatchData] = useState<BatchRateUpdateData>({
    rates: [17.0],
    sources: ['']
  });

  // Estados para CSV
  const [csvData, setCsvData] = useState('');

  const {
    executeMintBatch,
    executeUpdateRateBatch,
    mintBatchStatus,
    updateRateBatchStatus,
    resetMintBatch,
    resetUpdateRateBatch,
  } = useBatchOperations();

  const {
    validateMintBatchData,
    validateUpdateRateBatchData,
    formatMintBatchForCSV,
    formatUpdateRateBatchForCSV,
    calculateMintBatchTotal,
    calculateRateBatchStats,
  } = useBatchOperationUtils();

  const {
    getBatchOperationStatus,
    getBatchOperationProgress,
  } = useBatchOperationUI();

  // Validaciones
  const mintValidation = validateMintBatchData(mintBatchData);
  const rateValidation = validateUpdateRateBatchData(rateBatchData);

  // Estadísticas
  const mintTotal = calculateMintBatchTotal(mintBatchData);
  const rateStats = calculateRateBatchStats(rateBatchData);

  // Funciones para manejar mint batch
  const addMintRecipient = () => {
    setMintBatchData(prev => ({
      ...prev,
      recipients: [...prev.recipients, ''],
      amounts: [...prev.amounts, '']
    }));
  };

  const removeMintRecipient = (index: number) => {
    if (mintBatchData.recipients.length > 1) {
      setMintBatchData(prev => ({
        ...prev,
        recipients: prev.recipients.filter((_, i) => i !== index),
        amounts: prev.amounts.filter((_, i) => i !== index)
      }));
    }
  };

  const updateMintRecipient = (index: number, field: 'recipient' | 'amount', value: string) => {
    setMintBatchData(prev => ({
      ...prev,
      [field === 'recipient' ? 'recipients' : 'amounts']: prev[field === 'recipient' ? 'recipients' : 'amounts'].map((item, i) => 
        i === index ? value : item
      )
    }));
  };

  // Funciones para manejar rate batch
  const addRateEntry = () => {
    setRateBatchData(prev => ({
      ...prev,
      rates: [...prev.rates, 17.0],
      sources: [...prev.sources, '']
    }));
  };

  const removeRateEntry = (index: number) => {
    if (rateBatchData.rates.length > 1) {
      setRateBatchData(prev => ({
        ...prev,
        rates: prev.rates.filter((_, i) => i !== index),
        sources: prev.sources.filter((_, i) => i !== index)
      }));
    }
  };

  const updateRateEntry = (index: number, field: 'rate' | 'source', value: string | number) => {
    setRateBatchData(prev => ({
      ...prev,
      [field === 'rate' ? 'rates' : 'sources']: prev[field === 'rate' ? 'rates' : 'sources'].map((item, i) => 
        i === index ? value : item
      )
    }));
  };

  // Funciones para manejar CSV
  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCsvData(text);
        
        // Parsear CSV para mint batch
        const lines = text.split('\n');
        const headers = lines[0]?.split(',').map(h => h.replace(/"/g, '').trim());
        
        if (headers?.includes('Recipient') && headers?.includes('Amount (USD)')) {
          const recipients: string[] = [];
          const amounts: string[] = [];
          
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i]?.split(',').map(v => v.replace(/"/g, '').trim());
            if (values && values.length >= 2) {
              recipients.push(values[0] || '');
              amounts.push(values[1] || '');
            }
          }
          
          setMintBatchData(prev => ({
            ...prev,
            recipients: recipients.length > 0 ? recipients : [''],
            amounts: amounts.length > 0 ? amounts : ['']
          }));
        }
      };
      reader.readAsText(file);
    }
  };

  const downloadMintBatchCsv = () => {
    const csv = formatMintBatchForCSV(mintBatchData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mint_batch_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadRateBatchCsv = () => {
    const csv = formatUpdateRateBatchForCSV(rateBatchData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rate_batch_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Ejecutar operaciones
  const handleMintBatch = () => {
    if (mintValidation.isValid) {
      executeMintBatch(mintBatchData);
    }
  };

  const handleUpdateRateBatch = () => {
    if (rateValidation.isValid) {
      executeUpdateRateBatch(rateBatchData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Batch Operations/Multi-Operations
          </h1>
          <p className="text-lg text-gray-600">
            Execute massive operations efficiently and optimized
          </p>
        </div>

        {!isConnected && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              Connect your wallet to access batch operations
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* RemittanceToken Batch Mint */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🪙 Token Mint Batch</h2>
            
            {/* Estado de la operación */}
            <div className="mb-6">
              <div className={`p-4 rounded-lg border ${getBatchOperationStatus(mintBatchStatus).bgColor} ${getBatchOperationStatus(mintBatchStatus).borderColor}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getBatchOperationStatus(mintBatchStatus).icon}</span>
                    <span className={`font-semibold ${getBatchOperationStatus(mintBatchStatus).color}`}>
                      {getBatchOperationStatus(mintBatchStatus).text}
                    </span>
                  </div>
                  {mintBatchStatus.hash && (
                    <span className="text-sm text-gray-500 font-mono">
                      {mintBatchStatus.hash.slice(0, 10)}...{mintBatchStatus.hash.slice(-8)}
                    </span>
                  )}
                </div>
                {mintBatchStatus.isPending && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getBatchOperationProgress(mintBatchStatus)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reason */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mint Batch Reason
              </label>
              <input
                type="text"
                value={mintBatchData.reason}
                onChange={(e) => setMintBatchData(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Ex: Referral rewards"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                tabIndex={0}
                aria-label="Mint batch reason"
              />
            </div>

            {/* Recipients and amounts */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Recipients and Amounts
                </label>
                <div className="space-x-2">
                  <button
                    onClick={addMintRecipient}
                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                    tabIndex={0}
                    aria-label="Add recipient"
                  >
                    + Add
                  </button>
                  <button
                    onClick={downloadMintBatchCsv}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    tabIndex={0}
                    aria-label="Download CSV"
                  >
                    📥 CSV
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {mintBatchData.recipients.map((recipient, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={recipient}
                      onChange={(e) => updateMintRecipient(index, 'recipient', e.target.value)}
                      placeholder="0x..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      tabIndex={0}
                      aria-label={`Recipient address ${index + 1}`}
                    />
                    <input
                      type="number"
                      value={mintBatchData.amounts[index]}
                      onChange={(e) => updateMintRecipient(index, 'amount', e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      tabIndex={0}
                      aria-label={`Amount for recipient ${index + 1}`}
                    />
                    {mintBatchData.recipients.length > 1 && (
                      <button
                        onClick={() => removeMintRecipient(index)}
                        className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        tabIndex={0}
                        aria-label={`Remove recipient ${index + 1}`}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Total Tokens:</span>
                <span className="text-lg font-bold text-purple-600">${mintTotal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Recipients:</span>
                <span className="text-lg font-bold text-purple-600">{mintBatchData.recipients.length}</span>
              </div>
            </div>

            {/* Validation */}
            {!mintValidation.isValid && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Validation errors:</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {mintValidation.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleMintBatch}
                disabled={!mintValidation.isValid || mintBatchStatus.isPending}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                tabIndex={0}
                aria-label="Execute mint batch"
              >
                {mintBatchStatus.isPending ? 'Processing...' : 'Execute Mint Batch'}
              </button>
              <button
                onClick={resetMintBatch}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                tabIndex={0}
                aria-label="Reset mint batch"
              >
                Reset
              </button>
            </div>

            {/* Upload CSV */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload from CSV
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleCsvUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                tabIndex={0}
                aria-label="Upload CSV file"
              />
            </div>
          </div>

          {/* ExchangeRateOracle Batch Update */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Update Rate Batch</h2>
            
            {/* Estado de la operación */}
            <div className="mb-6">
              <div className={`p-4 rounded-lg border ${getBatchOperationStatus(updateRateBatchStatus).bgColor} ${getBatchOperationStatus(updateRateBatchStatus).borderColor}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getBatchOperationStatus(updateRateBatchStatus).icon}</span>
                    <span className={`font-semibold ${getBatchOperationStatus(updateRateBatchStatus).color}`}>
                      {getBatchOperationStatus(updateRateBatchStatus).text}
                    </span>
                  </div>
                  {updateRateBatchStatus.hash && (
                    <span className="text-sm text-gray-500 font-mono">
                      {updateRateBatchStatus.hash.slice(0, 10)}...{updateRateBatchStatus.hash.slice(-8)}
                    </span>
                  )}
                </div>
                {updateRateBatchStatus.isPending && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getBatchOperationProgress(updateRateBatchStatus)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Rates and sources */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Rates and Sources
                </label>
                <div className="space-x-2">
                  <button
                    onClick={addRateEntry}
                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                    tabIndex={0}
                    aria-label="Add rate"
                  >
                    + Add
                  </button>
                  <button
                    onClick={downloadRateBatchCsv}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    tabIndex={0}
                    aria-label="Download rates CSV"
                  >
                    📥 CSV
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {rateBatchData.rates.map((rate, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="number"
                      value={rate}
                      onChange={(e) => updateRateEntry(index, 'rate', parseFloat(e.target.value) || 0)}
                      placeholder="17.00"
                      step="0.01"
                      min="10.00"
                      max="50.00"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      tabIndex={0}
                      aria-label={`Rate ${index + 1}`}
                    />
                    <input
                      type="text"
                      value={rateBatchData.sources[index]}
                      onChange={(e) => updateRateEntry(index, 'source', e.target.value)}
                      placeholder="API, Manual, etc."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      tabIndex={0}
                      aria-label={`Source for rate ${index + 1}`}
                    />
                    {rateBatchData.rates.length > 1 && (
                      <button
                        onClick={() => removeRateEntry(index)}
                        className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        tabIndex={0}
                        aria-label={`Remove rate ${index + 1}`}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Rates:</span>
                  <span className="ml-2 font-bold text-indigo-600">{rateStats.count}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Average:</span>
                  <span className="ml-2 font-bold text-indigo-600">{rateStats.avg} MXN/USD</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Minimum:</span>
                  <span className="ml-2 font-bold text-indigo-600">{rateStats.min} MXN/USD</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Maximum:</span>
                  <span className="ml-2 font-bold text-indigo-600">{rateStats.max} MXN/USD</span>
                </div>
              </div>
            </div>

            {/* Validation */}
            {!rateValidation.isValid && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Validation errors:</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {rateValidation.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleUpdateRateBatch}
                disabled={!rateValidation.isValid || updateRateBatchStatus.isPending}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                tabIndex={0}
                aria-label="Execute update rate batch"
              >
                {updateRateBatchStatus.isPending ? 'Processing...' : 'Execute Rate Batch'}
              </button>
              <button
                onClick={resetUpdateRateBatch}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                tabIndex={0}
                aria-label="Reset rate batch"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Additional information */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">ℹ️ Batch Operations Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">🪙 Token Mint Batch</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Maximum 100 recipients per operation</li>
                <li>• Amounts must be greater than 0</li>
                <li>• Addresses must be valid (0x...)</li>
                <li>• Reason is mandatory</li>
                <li>• Gas optimization for multiple mints</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">📊 Update Rate Batch</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Maximum 50 rates per operation</li>
                <li>• Rates between 10.00 and 50.00 MXN/USD</li>
                <li>• Sources cannot be empty</li>
                <li>• Maximum 50 characters per source</li>
                <li>• Massive exchange rate updates</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Batch Operations Advantages</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Gas Optimization:</strong> Lower cost per individual operation</li>
              <li>• <strong>Efficiency:</strong> Multiple operations in a single transaction</li>
              <li>• <strong>Speed:</strong> Faster confirmation</li>
              <li>• <strong>Scalability:</strong> Ideal for massive operations</li>
              <li>• <strong>Security:</strong> Atomic transaction (all or nothing)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
