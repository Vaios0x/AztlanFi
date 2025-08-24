'use client';

import { memo, useCallback } from 'react';

interface Corridor {
  id: string;
  name: string;
  flag: string;
}

interface CorridorSelectorProps {
  corridors: Corridor[];
  selectedCorridor: string;
  onCorridorChange: (corridor: string) => void;
  disabled?: boolean;
  className?: string;
}

export const CorridorSelector = memo(function CorridorSelector({
  corridors,
  selectedCorridor,
  onCorridorChange,
  disabled = false,
  className = ''
}: CorridorSelectorProps) {
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    if (newValue !== selectedCorridor && !disabled) {
      onCorridorChange(newValue);
    }
  }, [selectedCorridor, onCorridorChange, disabled]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Corredor
      </label>
      <select
        value={selectedCorridor}
        onChange={handleChange}
        disabled={disabled}
        className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`}
      >
        {corridors.map((corridor) => (
          <option key={corridor.id} value={corridor.id}>
            {corridor.flag} {corridor.name}
          </option>
        ))}
      </select>
    </div>
  );
});
