import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, Stats, BadgeType } from '../types';

const STORAGE_KEYS = {
  SESSIONS: 'sessions',
  STATS: 'stats',
  DARK_MODE: 'darkMode',
  DAILY_GOAL: 'dailyGoal',
  BADGES: 'badges',
};

const DEFAULT_DAILY_GOAL = 4;

interface UseDataAnalyticsReturn {
  sessions: Session[];
  stats: Stats;
  badges: BadgeType[];
  dailyGoal: number;
  darkMode: boolean;
  loadData: () => Promise<void>;
  saveSession: (session: Session) => Promise<void>;
  clearAllData: () => Promise<void>;
  setDarkMode: (value: boolean) => Promise<void>;
  setDailyGoal: (value: number) => void;
}

export const useDataAnalytics = (): UseDataAnalyticsReturn => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalMinutes: 0,
    totalSessions: 0,
    todaySessions: 0,
    weekSessions: [],
    currentStreak: 0,
  });
  const [badges, setBadges] = useState<BadgeType[]>([]);
  const [dailyGoal, setDailyGoalState] = useState(DEFAULT_DAILY_GOAL);
  const [darkMode, setDarkModeState] = useState(true);

  const isToday = (date: string): boolean => {
    return new Date(date).toDateString() === new Date().toDateString();
  };

  const getLast7Days = (): Date[] => {
    const days: Date[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  };

  const calculateStats = useCallback((sessionsList: Session[]): Stats => {
    const todaySessions = sessionsList.filter(s => isToday(s.date));
    
    const last7Days = getLast7Days();
    const weekSessions = last7Days.map(date => {
      const dayStr = date.toDateString();
      return sessionsList.filter(s => new Date(s.date).toDateString() === dayStr).length;
    });
    
    const totalMinutes = sessionsList.reduce((acc, s) => acc + s.duration, 0);
    
    let streak = 0;
    const sortedSessions = [...sessionsList].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let currentDate = new Date().toDateString();
    for (let session of sortedSessions) {
      const sessionDate = new Date(session.date).toDateString();
      if (sessionDate === currentDate) {
        streak++;
        const prevDate = new Date(currentDate);
        prevDate.setDate(prevDate.getDate() - 1);
        currentDate = prevDate.toDateString();
      } else {
        break;
      }
    }
    
    return {
      totalMinutes,
      totalSessions: sessionsList.length,
      todaySessions: todaySessions.length,
      weekSessions,
      currentStreak: streak,
    };
  }, []);

  const checkBadges = useCallback((newStats: Stats, currentBadges: BadgeType[]): BadgeType[] => {
    const earnedBadges = [...currentBadges];
    
    if (newStats.totalSessions >= 1 && !earnedBadges.includes('first')) {
      earnedBadges.push('first');
    }
    
    if (newStats.totalSessions >= 10 && !earnedBadges.includes('veteran')) {
      earnedBadges.push('veteran');
    }
    
    if (newStats.todaySessions >= dailyGoal && !earnedBadges.includes('daily')) {
      earnedBadges.push('daily');
    }
    
    if (newStats.currentStreak >= 3 && !earnedBadges.includes('streak')) {
      earnedBadges.push('streak');
    }
    
    return earnedBadges;
  }, [dailyGoal]);

  const loadData = useCallback(async () => {
    try {
      const [savedSessions, savedStats, savedDarkMode, savedGoal, savedBadges] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.SESSIONS),
        AsyncStorage.getItem(STORAGE_KEYS.STATS),
        AsyncStorage.getItem(STORAGE_KEYS.DARK_MODE),
        AsyncStorage.getItem(STORAGE_KEYS.DAILY_GOAL),
        AsyncStorage.getItem(STORAGE_KEYS.BADGES),
      ]);
      
      if (savedSessions) {
        const parsedSessions = JSON.parse(savedSessions);
        setSessions(parsedSessions);
        const calculatedStats = calculateStats(parsedSessions);
        setStats(calculatedStats);
      }
      
      if (savedStats) setStats(JSON.parse(savedStats));
      if (savedDarkMode) setDarkModeState(JSON.parse(savedDarkMode));
      if (savedGoal) setDailyGoalState(JSON.parse(savedGoal));
      if (savedBadges) setBadges(JSON.parse(savedBadges));
    } catch (error) {
      console.error('Erro ao carregar:', error);
    }
  }, [calculateStats]);

  const saveSession = useCallback(async (newSession: Session) => {
    try {
      const updatedSessions = [newSession, ...sessions];
      setSessions(updatedSessions);
      
      const newStats = calculateStats(updatedSessions);
      setStats(newStats);
      
      const newBadges = checkBadges(newStats, badges);
      setBadges(newBadges);
      
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updatedSessions)),
        AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(newStats)),
        AsyncStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(newBadges)),
      ]);
      
      console.log('✅ Dados salvos!');
    } catch (error) {
      console.error('❌ Erro ao salvar:', error);
    }
  }, [sessions, calculateStats, checkBadges, badges]);

  const clearAllData = useCallback(async () => {
    try {
      await AsyncStorage.clear();
      setSessions([]);
      setStats({
        totalMinutes: 0,
        totalSessions: 0,
        todaySessions: 0,
        weekSessions: [],
        currentStreak: 0,
      });
      setBadges([]);
    } catch (error) {
      console.error('❌ Erro ao limpar:', error);
    }
  }, []);

  const setDarkMode = useCallback(async (value: boolean) => {
    try {
      setDarkModeState(value);
      await AsyncStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(value));
    } catch (error) {
      console.error('❌ Erro ao salvar tema:', error);
    }
  }, []);

  const setDailyGoal = useCallback((value: number) => {
    setDailyGoalState(value);
    AsyncStorage.setItem(STORAGE_KEYS.DAILY_GOAL, JSON.stringify(value));
  }, []);

  return {
    sessions,
    stats,
    badges,
    dailyGoal,
    darkMode,
    loadData,
    saveSession,
    clearAllData,
    setDarkMode,
    setDailyGoal,
  };
};