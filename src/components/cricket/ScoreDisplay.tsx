
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ScoreDisplayProps {
  totalRuns: number;
  wickets: number;
  totalBalls: number;
  battingTeam: string;
  bowlingTeam: string;
  battingTeamLogo: string | null;
  bowlingTeamLogo: string | null;
  recentBalls: string[];
  striker: string | null;
  bowler: { name: string } | null;
}

export default function ScoreDisplay({
  totalRuns,
  wickets,
  totalBalls,
  battingTeam,
  bowlingTeam,
  battingTeamLogo,
  bowlingTeamLogo,
  recentBalls,
  striker,
  bowler
}: ScoreDisplayProps) {
  const [latestBall, setLatestBall] = useState<string | null>(null);
  const [showLatestBallInfo, setShowLatestBallInfo] = useState(false);
  const [showTotalRuns, setShowTotalRuns] = useState(true);

  const overs = Math.floor(totalBalls / 6);
  const balls = totalBalls % 6;
  const oversText = `${overs}.${balls}`;

  useEffect(() => {
    if (recentBalls.length > 0) {
      const latestBall = recentBalls[recentBalls.length - 1];
      setLatestBall(latestBall);
      
      setShowLatestBallInfo(true);
      setShowTotalRuns(false);
      
      setTimeout(() => {
        setShowLatestBallInfo(false);
        setShowTotalRuns(true);
      }, 3000);
    }
  }, [recentBalls]);

  const getLatestBallDescription = () => {
    if (!latestBall) return '';

    switch (latestBall) {
      case 'W':
        return `WICKET! ${striker || 'Batsman'} is out!`;
      case '4':
        return `FOUR! ${striker || 'Batsman'} hits a boundary!`;
      case '6':
        return `SIX! ${striker || 'Batsman'} clears the rope!`;
      case 'WD':
        return `Wide ball! Extra run added.`;
      case 'NB':
        return `No ball! Free hit coming up.`;
      case 'LB':
        return `Leg bye! One run taken.`;
      case 'OT':
        return `Overthrow! Extra runs to the batting team.`;
      case '0':
        return `Dot ball! Good delivery by ${bowler?.name || 'bowler'}.`;
      default:
        return `${latestBall} run(s) taken by ${striker || 'batsman'}.`;
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Avatar className="h-16 w-16 bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-300 dark:border-blue-700 rounded-full">
          {battingTeamLogo ? (
            <AvatarImage src={battingTeamLogo} alt={battingTeam} />
          ) : (
            <AvatarFallback className="bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200 font-bold text-2xl">{battingTeam.charAt(0)}</AvatarFallback>
          )}
        </Avatar>
        <div className="font-bold text-2xl text-blue-800 dark:text-blue-300">
          {battingTeam}
        </div>
      </div>
      
      <div className="text-center relative h-32 flex items-center justify-center">
        {showTotalRuns && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-bold bg-white dark:bg-gray-800 text-indigo-700 dark:text-indigo-300 border-3 border-indigo-300 dark:border-indigo-700 rounded-xl px-6 py-2 shadow-md">
              {totalRuns}/{wickets}
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                Over: {oversText}
              </div>
            </div>
          </div>
        )}
        
        {showLatestBallInfo && latestBall && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-blue-500 rounded-3xl p-4 px-12 shadow-xl w-full max-w-[500px] h-24 flex items-center justify-center animate-fade-in border-2 border-blue-300">
              <div className="text-xl font-bold text-white text-center leading-tight">
                {getLatestBallDescription()}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <div className="font-bold text-2xl text-purple-800 dark:text-purple-300">
          {bowlingTeam}
        </div>
        <Avatar className="h-16 w-16 bg-purple-100 dark:bg-purple-900/50 border-2 border-purple-300 dark:border-purple-700 rounded-full">
          {bowlingTeamLogo ? (
            <AvatarImage src={bowlingTeamLogo} alt={bowlingTeam} />
          ) : (
            <AvatarFallback className="bg-purple-200 text-purple-800 dark:bg-purple-800 dark:text-purple-200 font-bold text-2xl">{bowlingTeam.charAt(0)}</AvatarFallback>
          )}
        </Avatar>
      </div>
    </div>
  );
}
