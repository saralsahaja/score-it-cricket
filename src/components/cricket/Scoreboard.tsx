import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface ScoreboardProps {
  totalRuns: number;
  wickets: number;
  totalBalls: number;
  crr: string;
  target: number;
  rrr: string;
  runsLeft: number;
  ballsLeft: number;
  batsmen: {
    name: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
  }[];
  bowler: {
    name: string;
    runs: number;
    balls: number;
    wickets: number;
    maidens: number;
  } | null;
  striker: string | null;
  nonStriker: string | null;
  teamAName: string;
  teamBName: string;
  teamALogo: string | null;
  teamBLogo: string | null;
  isSecondInnings: boolean;
  bowlersList: {
    name: string;
    runs: number;
    balls: number;
    wickets: number;
    maidens: number;
  }[];
  recentBalls: string[];
  setTeamAName: React.Dispatch<React.SetStateAction<string>>;
  setTeamBName: React.Dispatch<React.SetStateAction<string>>;
  totalOvers: number;
  gameTitle: string;
  outPlayers: string[];
  retiredHurtPlayers: string[];
  lastWicketType: string;
  tossWinner?: string;
  tossDecision?: "bat" | "bowl";
}

const Scoreboard: React.FC<ScoreboardProps> = ({ 
  totalRuns, 
  wickets, 
  totalBalls, 
  crr,
  target,
  rrr,
  runsLeft,
  ballsLeft,
  batsmen,
  bowler,
  striker,
  nonStriker,
  teamAName,
  teamBName,
  teamALogo,
  teamBLogo,
  isSecondInnings,
  bowlersList,
  recentBalls,
  setTeamAName,
  setTeamBName,
  totalOvers,
  gameTitle,
  outPlayers,
  retiredHurtPlayers,
  lastWicketType,
  tossWinner,
  tossDecision
}) => {
  // Simple ball rendering without animations for the main view
  const renderLastTwelveBalls = () => {
    const last12Balls = recentBalls.slice(-12);
    
    return (
      <div className="flex flex-wrap gap-2 justify-center items-center w-full">
        {last12Balls.map((ball, idx) => {
          // Style based on ball value
          let ballStyle = "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg";
          
          if (ball === 'W') {
            ballStyle += " bg-red-600 text-white";
          } else if (ball === '4') {
            ballStyle += " bg-blue-500 text-white";
          } else if (ball === '6') {
            ballStyle += " bg-purple-600 text-white";
          } else if (ball === '0') {
            ballStyle += " bg-gray-400 dark:bg-gray-600 text-white";
          } else if (['WD', 'NB', 'LB', 'OT'].includes(ball)) {
            ballStyle += " bg-yellow-500 text-white";
          } else {
            ballStyle += " bg-green-500 text-white";
          }
          
          // Highlight the latest ball
          if (idx === last12Balls.length - 1) {
            ballStyle += " ring-2 ring-yellow-300 dark:ring-yellow-500";
          }
          
          return (
            <div key={`ball-${idx}`} className={ballStyle}>
              {ball}
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div>
      {/* Render your scoreboard content here */}
      <Card className="shadow-md mb-6">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Balls</h2>
          {renderLastTwelveBalls()}
        </CardContent>
      </Card>
    </div>
  );
};

export default Scoreboard;
