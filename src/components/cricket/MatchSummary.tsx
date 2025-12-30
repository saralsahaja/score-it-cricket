
import { Card, CardContent } from "@/components/ui/card";
import { Award, Trophy, Star } from "lucide-react";
import { BatsmanStats, BowlerStats } from "./types";

interface MatchSummaryProps {
  batsmen: BatsmanStats[];
  bowlersList: BowlerStats[];
  totalRuns: number;
}

export default function MatchSummary({
  batsmen,
  bowlersList,
  totalRuns
}: MatchSummaryProps) {
  const topScorer = batsmen.length > 0 
    ? batsmen.reduce((prev, current) => (prev.runs > current.runs) ? prev : current) 
    : null;
  
  const economicalBowlers = bowlersList.filter(b => b.balls >= 6);
  const bestBowler = economicalBowlers.length > 0 
    ? economicalBowlers.reduce((prev, current) => 
        ((prev.runs / Math.max(1, prev.balls/6)) < (current.runs / Math.max(1, current.balls/6))) 
          ? prev 
          : current
      )
    : null;

  return (
    <Card className="overflow-hidden border-none shadow-md bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-primary/30">
      <CardContent className="p-2">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm border border-blue-200 dark:border-blue-800">
            <h3 className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1 mb-1 text-xs">
              <Award className="h-3 w-3" />
              Top Scorer
            </h3>
            {topScorer && topScorer.runs > 0 ? (
              <div className="text-center">
                <div className="font-bold text-sm truncate">{topScorer.name}</div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {topScorer.runs}<span className="text-xs font-normal text-gray-500">({topScorer.balls})</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 italic text-xs">No data</div>
            )}
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm border border-green-200 dark:border-green-800">
            <h3 className="font-bold text-green-800 dark:text-green-300 flex items-center gap-1 mb-1 text-xs">
              <Trophy className="h-3 w-3" />
              Best Bowler
            </h3>
            {bestBowler ? (
              <div className="text-center">
                <div className="font-bold text-sm truncate">{bestBowler.name}</div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {bestBowler.wickets}-{bestBowler.runs}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 italic text-xs">No data</div>
            )}
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm border border-purple-200 dark:border-purple-800">
            <h3 className="font-bold text-purple-800 dark:text-purple-300 flex items-center gap-1 mb-1 text-xs">
              <Star className="h-3 w-3" />
              Boundaries
            </h3>
            <div className="grid grid-cols-2 gap-1">
              <div className="text-center">
                <div className="text-xs text-blue-600 dark:text-blue-400">4s</div>
                <div className="text-lg font-bold">{batsmen.reduce((acc, b) => acc + b.fours, 0)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-purple-600 dark:text-purple-400">6s</div>
                <div className="text-lg font-bold">{batsmen.reduce((acc, b) => acc + b.sixes, 0)}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
