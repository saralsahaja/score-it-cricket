
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
    <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-primary/30">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border-2 border-blue-200 dark:border-blue-800">
            <h3 className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1 mb-2 text-lg">
              <Award className="h-6 w-6 text-blue-800 dark:text-blue-300" />
              Top Performer
            </h3>
            {topScorer && topScorer.runs > 0 ? (
              <div className="text-center">
                <div className="font-bold text-xl">{topScorer.name}</div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{topScorer.runs} <span className="text-md font-normal text-gray-500 dark:text-gray-400">({topScorer.balls} balls)</span></div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  SR: {((topScorer.runs / topScorer.balls) * 100).toFixed(1)} | 4s: {topScorer.fours} | 6s: {topScorer.sixes}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 italic">No data available</div>
            )}
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border-2 border-green-200 dark:border-green-800">
            <h3 className="font-bold text-green-800 dark:text-green-300 flex items-center gap-1 mb-2 text-lg">
              <Trophy className="h-6 w-6 text-green-800 dark:text-green-300" />
              Best Bowler
            </h3>
            {bestBowler ? (
              <div className="text-center">
                <div className="font-bold text-xl">{bestBowler.name}</div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {bestBowler.wickets}-{bestBowler.runs} <span className="text-md font-normal text-gray-500 dark:text-gray-400">
                    ({Math.floor(bestBowler.balls/6)}.{bestBowler.balls%6} overs)
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Economy: {((bestBowler.runs / (bestBowler.balls/6)) || 0).toFixed(2)}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 italic">No data available</div>
            )}
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border-2 border-purple-200 dark:border-purple-800">
            <h3 className="font-bold text-purple-800 dark:text-purple-300 flex items-center gap-1 mb-2 text-lg">
              <Star className="h-6 w-6 text-purple-800 dark:text-purple-300" />
              Boundaries
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Fours</div>
                <div className="text-3xl font-bold">{batsmen.reduce((acc, b) => acc + b.fours, 0)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-purple-600 dark:text-purple-400">Sixes</div>
                <div className="text-3xl font-bold">{batsmen.reduce((acc, b) => acc + b.sixes, 0)}</div>
              </div>
            </div>
            <div className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
              {Math.round((batsmen.reduce((acc, b) => acc + (b.fours * 4) + (b.sixes * 6), 0) / Math.max(1, totalRuns)) * 100)}% 
              runs from boundaries
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
