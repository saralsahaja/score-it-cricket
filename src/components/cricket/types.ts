
export interface BatsmanStats {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
}

export interface BowlerStats {
  name: string;
  runs: number;
  balls: number;
  wickets: number;
  maidens: number;
}

export interface ScorecardProps {
  totalRuns: number;
  wickets: number;
  totalBalls: number;
  crr: string;
  target: number;
  rrr: string;
  runsLeft: number;
  ballsLeft: number;
  batsmen: BatsmanStats[];
  bowler: BowlerStats | null;
  striker: string | null;
  nonStriker: string | null;
  teamAName: string;
  teamBName: string;
  teamALogo: string | null;
  teamBLogo: string | null;
  isSecondInnings: boolean;
  bowlersList: BowlerStats[];
  recentBalls: string[];
  setTeamAName: (name: string) => void;
  setTeamBName: (name: string) => void;
  totalOvers: number;
  gameTitle: string;
  outPlayers: string[];
  retiredHurtPlayers: string[];
  lastWicketType?: string;
  tossWinner?: string;
  tossDecision?: string;
}
