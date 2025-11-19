export interface Session {
    id: number;
    date: string;
    duration: number;
    type: 'Foco Profundo' | 'Pausa';
    note?: string;
  }
  
  export interface Stats {
    totalMinutes: number;
    totalSessions: number;
    todaySessions: number;
    weekSessions: number[];
    currentStreak: number;
  }
  
  export interface Theme {
    bg: string;
    cardBg: string;
    primary: string;
    text: string;
    textSecondary: string;
  }
  
  export type SessionType = 'focus' | 'break';
  
  export type BadgeType = 'first' | 'veteran' | 'daily' | 'streak';
  
  export interface Badge {
    icon: string;
    name: string;
  }