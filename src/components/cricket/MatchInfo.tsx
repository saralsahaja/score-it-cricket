
import { useState, useEffect } from "react";

interface MatchInfoProps {
  tossWinner?: string;
  tossDecision?: string;
  lastWicketType?: string;
  outPlayers: string[];
  bestBowler: { name: string; wickets: number; runs: number } | null;
}

export default function MatchInfo({
  tossWinner,
  tossDecision,
  lastWicketType,
  outPlayers,
  bestBowler
}: MatchInfoProps) {
  const [matchInfoType, setMatchInfoType] = useState<'toss' | 'lastWicket' | 'bestBowler'>('toss');

  useEffect(() => {
    const interval = setInterval(() => {
      setMatchInfoType(current => {
        if (current === 'toss') return 'lastWicket';
        if (current === 'lastWicket') return 'bestBowler';
        return 'toss';
      });
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  const getMatchInfoContent = () => {
    switch (matchInfoType) {
      case 'toss':
        return tossWinner && tossDecision ? (
          <div className="text-amber-800 dark:text-amber-200">
            Toss: {tossWinner} won the toss and elected to {tossDecision} first
          </div>
        ) : (
          <div className="text-amber-800 dark:text-amber-200">Match in progress</div>
        );
      case 'lastWicket':
        return lastWicketType && outPlayers.length > 0 ? (
          <div className="text-red-800 dark:text-red-200">
            Last Wicket: {outPlayers[outPlayers.length-1]} ({lastWicketType})
          </div>
        ) : (
          <div className="text-amber-800 dark:text-amber-200">No wickets yet</div>
        );
      case 'bestBowler':
        return bestBowler ? (
          <div className="text-green-800 dark:text-green-200">
            Best Bowler: {bestBowler.name} ({bestBowler.wickets}/{bestBowler.runs})
          </div>
        ) : (
          <div className="text-amber-800 dark:text-amber-200">Bowling stats pending</div>
        );
      default:
        return <div className="text-amber-800 dark:text-amber-200">Match in progress</div>;
    }
  };

  return (
    <div className="mb-4 bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg text-center font-medium min-h-[40px]">
      {getMatchInfoContent()}
    </div>
  );
}
