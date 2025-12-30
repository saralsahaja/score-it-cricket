
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import { BatsmanStats } from "./types";

interface CurrentBatsmenProps {
  batsmen: BatsmanStats[];
  striker: string | null;
  nonStriker: string | null;
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
  bowlersList: any[];
}

export default function CurrentBatsmen({
  batsmen,
  striker,
  nonStriker,
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
  bowlersList
}: CurrentBatsmenProps) {
  const activeBatsman1 = batsmen.find(b => b.name === striker);
  const activeBatsman2 = batsmen.find(b => b.name === nonStriker);
  const activeBatsmen = [activeBatsman1, activeBatsman2].filter(Boolean);
  const overs = Math.floor(totalBalls / 6);
  const balls = totalBalls % 6;
  const oversText = `${overs}.${balls}`;

  return (
    <Card className="overflow-hidden border-none shadow-md dark:bg-gray-800">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 text-white p-2 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <h3 className="font-bold text-sm">Batsmen</h3>
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
          className="text-white hover:underline bg-blue-700 dark:bg-blue-600 px-2 py-0.5 rounded text-xs"
        >
          View All
        </Link>
      </div>
      <CardContent className="p-2 border border-blue-300 dark:border-blue-700 dark:bg-gray-800">
        {activeBatsmen.length === 0 ? (
          <div className="text-muted-foreground italic text-center p-2 text-sm">
            No batsmen selected
          </div>
        ) : (
          <div className="space-y-1">
            <div className="grid grid-cols-12 text-xs text-blue-700 dark:text-blue-300 px-1 font-semibold">
              <div className="col-span-4">Batsman</div>
              <div className="col-span-2 text-center">R</div>
              <div className="col-span-2 text-center">B</div>
              <div className="col-span-2 text-center">SR</div>
              <div className="col-span-1 text-center">4</div>
              <div className="col-span-1 text-center">6</div>
            </div>
            
            {activeBatsmen.map((b, i) => {
              if (!b) return null;
              const isStriker = b.name === striker;
              const strikeRate = b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(0) : "0";
              
              return (
                <div 
                  key={i} 
                  className={`grid grid-cols-12 p-1 rounded text-sm ${
                    isStriker 
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-300 dark:border-blue-700' 
                      : 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border border-green-300 dark:border-green-700'
                  }`}
                >
                  <div className="col-span-4 font-medium flex items-center text-sm truncate">
                    {b.name} 
                    {isStriker && <Badge className="ml-1 bg-blue-500 text-white text-xs px-1">*</Badge>}
                  </div>
                  <div className="col-span-2 text-center font-bold">{b.runs}</div>
                  <div className="col-span-2 text-center">{b.balls}</div>
                  <div className="col-span-2 text-center text-xs">{strikeRate}</div>
                  <div className="col-span-1 text-center text-xs">{b.fours}</div>
                  <div className="col-span-1 text-center text-xs">{b.sixes}</div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
