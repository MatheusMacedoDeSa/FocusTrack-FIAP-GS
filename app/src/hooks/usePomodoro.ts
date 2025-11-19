// usePomodoro.ts (Arquivo Refatorado com Correção)

import { useState, useEffect, useRef, useCallback } from 'react';
import { SessionType } from '../types';

const TIMER_CONFIG = {
  FOCUS_DURATION: 25 * 60, // 1500 segundos (25 minutos)
  BREAK_DURATION: 5 * 60,  // 300 segundos (5 minutos)
};

interface UsePomodoroReturn {
  seconds: number;
  isActive: boolean;
  sessionType: SessionType;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  switchSessionType: (type: SessionType) => void;
}

export const usePomodoro = (onComplete: () => void): UsePomodoroReturn => {
  const [seconds, setSeconds] = useState(TIMER_CONFIG.FOCUS_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState<SessionType>('focus');
  
  // A tipagem já está correta, mas faremos o casting no setInterval:
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      // 1. Limpa o intervalo anterior antes de criar um novo (boas práticas)
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      if (seconds > 0) {
        // 2. Aqui está a correção: usamos um casting para garantir a compatibilidade de tipo.
        intervalRef.current = setInterval(() => {
          setSeconds(prev => prev - 1);
        }, 1000) as unknown as NodeJS.Timeout;

      } else {
        // 3. Sessão terminada
        setIsActive(false);
        onComplete();
      }
    }

    // Função de limpeza: garante que o intervalo é parado ao desmontar ou ao desativar/re-renderizar
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  // Adicionamos 'onComplete' às dependências porque ele vem de fora
  }, [isActive, seconds, onComplete]); 

  // Funções de controle
  const startTimer = useCallback(() => setIsActive(true), []);
  const pauseTimer = useCallback(() => setIsActive(false), []);

  const resetTimer = useCallback(() => {
    // Garante que o intervalo é limpo imediatamente ao resetar
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsActive(false);
    setSeconds(sessionType === 'focus' ? TIMER_CONFIG.FOCUS_DURATION : TIMER_CONFIG.BREAK_DURATION);
  }, [sessionType]);

  const switchSessionType = useCallback((type: SessionType) => {
    // Garante o reset antes de mudar o tipo
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setSessionType(type);
    setSeconds(type === 'focus' ? TIMER_CONFIG.FOCUS_DURATION : TIMER_CONFIG.BREAK_DURATION);
    setIsActive(false);
  }, []);

  return {
    seconds,
    isActive,
    sessionType,
    startTimer,
    pauseTimer,
    resetTimer,
    switchSessionType,
  };
};