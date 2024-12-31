export interface MatchupStats {
  'FG%': string;
  'FT%': string;
  '3PTM': string;
  'PTS': string;
  'REB': string;
  'AST': string;
  'ST': string;
  'BLK': string;
  'TO': string;
  [key: string]: string;
}

export interface Matchup {
  week: number;
  name: string;
  stats: MatchupStats;
} 