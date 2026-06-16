export type AppPage = 'dashboard' | 'stats' | 'history';
export type DashboardRole = 'killer' | 'survivor';

export interface MatchRecord {
  id: string;
  characterName: string;
  role: DashboardRole;
  result: string;
  time: string;
  durationSeconds: number;
  bp: number;
  timestamp: number;
}
