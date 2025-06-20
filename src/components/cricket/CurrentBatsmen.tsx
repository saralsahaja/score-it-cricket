
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
    <Card className="overflow-hidden border-none shadow-lg dark:bg-gray-800">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 text-white p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h3 className="font-bold text-2xl">Current Batsmen</h3>
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
          className="text-white hover:underline bg-blue-700 dark:bg-blue-600 px-3 py-1 rounded-lg text-sm"
        >
          View All Details
        </Link>
      </div>
      <CardContent className="p-4 border-3 border-blue-300 dark:border-blue-700 dark:bg-gray-800">
        {activeBatsmen.length === 0 ? (
          <div className="text-muted-foreground italic text-center p-4 text-lg">
            No batsmen selected yet
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-12 text-sm text-blue-700 dark:text-blue-300 px-2 font-semibold">
              <div className="col-span-4">Batsman</div>
              <div className="col-span-2 text-center">R</div>
              <div className="col-span-2 text-center">B</div>
              <div className="col-span-2 text-center">SR</div>
              <div className="col-span-1 text-center">4s</div>
              <div className="col-span-1 text-center">6s</div>
            </div>
            
            {activeBatsmen.map((b, i) => {
              if (!b) return null;
              const isStriker = b.name === striker;
              const strikeRate = b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(1) : "0.0";
              
              return (
                <div 
                  key={i} 
                  className={`grid grid-cols-12 p-2 rounded-md ${
                    isStriker 
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-2 border-blue-300 dark:border-blue-700' 
                      : 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-2 border-green-300 dark:border-green-700'
                  }`}
                >
                  <div className="col-span-4 font-medium flex items-center text-xl">
                    {b.name} 
                    {isStriker && <Badge className="ml-1 bg-blue-500 text-white">*</Badge>}
                  </div>
                  <div className="col-span-2 text-center font-bold text-xl">{b.runs}</div>
                  <div className="col-span-2 text-center text-xl">{b.balls}</div>
                  <div className="col-span-2 text-center">{strikeRate}</div>
                  <div className="col-span-1 text-center">
                    <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-base">{b.fours}</Badge>
                  </div>
                  <div className="col-span-1 text-center">
                    <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900 text-base">{b.sixes}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
