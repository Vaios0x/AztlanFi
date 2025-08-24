'use client';

import { useState, useCallback, useRef } from 'react';

interface Corridor {
  id: string;
  name: string;
  flag: string;
}

export function useCorridorSelection(initialCorridor: string = 'USA-MEX') {
  const [selectedCorridor, setSelectedCorridor] = useState(initialCorridor);
  const lastChangeTime = useRef<number>(0);
  const changeTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleCorridorChange = useCallback((newCorridor: string) => {
    // Prevenir cambios muy rápidos (debounce)
    const now = Date.now();
    if (now - lastChangeTime.current < 100) {
      return;
    }

    // Cancelar timeout anterior si existe
    if (changeTimeout.current) {
      clearTimeout(changeTimeout.current);
    }

    // Establecer nuevo timeout
    changeTimeout.current = setTimeout(() => {
      if (newCorridor !== selectedCorridor) {
        setSelectedCorridor(newCorridor);
        lastChangeTime.current = Date.now();
      }
    }, 50);

  }, [selectedCorridor]);

  const resetCorridor = useCallback(() => {
    setSelectedCorridor(initialCorridor);
  }, [initialCorridor]);

  return {
    selectedCorridor,
    handleCorridorChange,
    resetCorridor
  };
}
