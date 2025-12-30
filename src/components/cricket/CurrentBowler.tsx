
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
    <Card className="overflow-hidden border-none shadow-md dark:bg-gray-800">
      <div className="bg-gradient-to-r from-green-600 to-green-800 dark:from-green-800 dark:to-green-900 text-white p-2 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <Award className="h-4 w-4" />
          <h3 className="font-bold text-sm">Bowler</h3>
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
          className="text-white hover:underline bg-green-700 dark:bg-green-600 px-2 py-0.5 rounded text-xs"
        >
          View All
        </Link>
      </div>
      <CardContent className="p-2 border border-green-300 dark:border-green-700 dark:bg-gray-800">
        {!bowler ? (
          <div className="text-muted-foreground italic text-center p-2 text-sm">
            No bowler selected
          </div>
        ) : (
          <>
            <div className="grid grid-cols-10 text-xs text-green-700 dark:text-green-300 px-1 font-semibold">
              <div className="col-span-3">Bowler</div>
              <div className="col-span-2 text-center">O</div>
              <div className="col-span-1 text-center">M</div>
              <div className="col-span-1 text-center">R</div>
              <div className="col-span-1 text-center">W</div>
              <div className="col-span-2 text-center">Eco</div>
            </div>
            
            <div className="mt-1">
              {(() => {
                const economy = bowler.balls > 0 ? ((bowler.runs / (bowler.balls/6)) || 0).toFixed(1) : "0.0";
                
                return (
                  <div className="grid grid-cols-10 p-1 rounded text-sm bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border border-green-300 dark:border-green-700">
                    <div className="col-span-3 font-medium truncate">
                      {bowler.name}
                    </div>
                    <div className="col-span-2 text-center">
                      {Math.floor(bowler.balls/6)}.{bowler.balls%6}
                    </div>
                    <div className="col-span-1 text-center">{bowler.maidens}</div>
                    <div className="col-span-1 text-center">{bowler.runs}</div>
                    <div className="col-span-1 text-center font-bold">{bowler.wickets}</div>
                    <div className="col-span-2 text-center text-xs">
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
