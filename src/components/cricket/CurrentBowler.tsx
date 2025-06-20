
import { Card, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";
import { Link } from "react-router-dom";
import { BowlerStats } from "./types";

interface CurrentBowlerProps {
  bowler: BowlerStats | null;
  batsmen: any[];
  bowlersList: BowlerStats[];
  teamAName: string;
  teamBName: string;
  outPlayers: string[];
  retiredHurtPlayers: string[];
  gameTitle: string;
  totalRuns: number;
  wickets: number;
  totalOvers: number;
  totalBalls: number;
  crr: string;
}

export default function CurrentBowler({
  bowler,
  batsmen,
  bowlersList,
  teamAName,
  teamBName,
  outPlayers,
  retiredHurtPlayers,
  gameTitle,
  totalRuns,
  wickets,
  totalOvers,
  totalBalls,
  crr
}: CurrentBowlerProps) {
  const overs = Math.floor(totalBalls / 6);
  const balls = totalBalls % 6;
  const oversText = `${overs}.${balls}`;

  return (
    <Card className="overflow-hidden border-none shadow-lg dark:bg-gray-800">
      <div className="bg-gradient-to-r from-green-600 to-green-800 dark:from-green-800 dark:to-green-900 text-white p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Award className="h-6 w-6" />
          <h3 className="font-bold text-2xl">Current Bowler</h3>
        </div>
        <Link 
          to="/match-records" 
          state={{ 
            batsmen, 
            bowlersList, 
            teamAName, 
            teamBName, 
            outPlayers, 
            retiredHurtPlayers,
            gameTitle,
            totalRuns,
            wickets,
            totalOvers,
            totalBalls,
            crr,
            oversText
          }} 
          className="text-white hover:underline bg-green-700 dark:bg-green-600 px-3 py-1 rounded-lg text-sm"
        >
          View All Details
        </Link>
      </div>
      <CardContent className="p-4 border-3 border-green-300 dark:border-green-700 dark:bg-gray-800">
        {!bowler ? (
          <div className="text-muted-foreground italic text-center p-4 text-lg">
            No bowler selected yet
          </div>
        ) : (
          <>
            <div className="grid grid-cols-10 text-sm text-green-700 dark:text-green-300 px-2 font-semibold">
              <div className="col-span-3">Bowler</div>
              <div className="col-span-2 text-center">O</div>
              <div className="col-span-1 text-center">M</div>
              <div className="col-span-1 text-center">R</div>
              <div className="col-span-1 text-center">W</div>
              <div className="col-span-2 text-center">Econ</div>
            </div>
            
            <div className="space-y-2 mt-2">
              {(() => {
                const economy = bowler.balls > 0 ? ((bowler.runs / (bowler.balls/6)) || 0).toFixed(1) : "0.0";
                
                return (
                  <div className="grid grid-cols-10 p-2 rounded-md bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-2 border-green-300 dark:border-green-700">
                    <div className="col-span-3 font-medium flex items-center text-xl">
                      {bowler.name}
                    </div>
                    <div className="col-span-2 text-center text-xl">
                      {Math.floor(bowler.balls/6)}.{bowler.balls%6}
                    </div>
                    <div className="col-span-1 text-center text-xl">{bowler.maidens}</div>
                    <div className="col-span-1 text-center text-xl">{bowler.runs}</div>
                    <div className="col-span-1 text-center font-bold text-xl">{bowler.wickets}</div>
                    <div className="col-span-2 text-center">
                      {economy}
                    </div>
                  </div>
                );
              })()}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
