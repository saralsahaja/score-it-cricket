import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LineChart, Target, Clock, TrendingUp, User, Users, Zap } from "lucide-react";

interface ScorecardProps {
  totalRuns: number;
  wickets: number;
  totalBalls: number;
  crr: string;
  target: number;
  rrr: string;
  runsLeft: number;
  ballsLeft: number;
  batsmen: Array<{name: string, runs: number, balls: number}>;
  bowler: {name: string, runs: number, balls: number, wickets: number} | null;
  striker: string | null;
  nonStriker: string | null;
}

export default function Scoreboard({
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
  nonStriker
}: ScorecardProps) {
  const overs = Math.floor(totalBalls / 6);
  const balls = totalBalls % 6;
  const oversText = `${overs}.${balls}`;
  
  return (
    <Card className="shadow-lg border-2 border-primary/20">
      <CardContent className="space-y-6 p-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <LineChart className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-center">Live Scoreboard</h2>
        </div>
        
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold mb-2">
              {totalRuns}/{wickets}
            </div>
            <div className="text-lg text-muted-foreground">
              <Clock className="inline-block h-4 w-4 mr-1" />
              {oversText} overs
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-background rounded-lg p-3 text-center">
              <div className="text-sm text-muted-foreground mb-1">Current RR</div>
              <div className="text-xl font-bold flex items-center justify-center">
                <TrendingUp className="h-4 w-4 mr-1 text-primary" />
                {crr}
              </div>
            </div>
            
            <div className="bg-background rounded-lg p-3 text-center">
              <div className="text-sm text-muted-foreground mb-1">Target</div>
              <div className="text-xl font-bold flex items-center justify-center">
                <Target className="h-4 w-4 mr-1 text-accent" />
                {target}
              </div>
            </div>
            
            <div className="bg-background rounded-lg p-3 text-center">
              <div className="text-sm text-muted-foreground mb-1">Req. RR</div>
              <div className="text-xl font-bold flex items-center justify-center">
                <TrendingUp className="h-4 w-4 mr-1 text-destructive" />
                {rrr}
              </div>
            </div>
            
            <div className="bg-background rounded-lg p-3 text-center">
              <div className="text-sm text-muted-foreground mb-1">To Win</div>
              <div className="text-xl font-bold">
                {runsLeft} off {ballsLeft}
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg">Batsmen</h3>
            </div>
            
            {batsmen.length === 0 ? (
              <div className="text-muted-foreground italic text-center p-4">
                No batsmen selected yet
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-12 text-sm text-muted-foreground px-2">
                  <div className="col-span-5">Batsman</div>
                  <div className="col-span-2 text-center">R</div>
                  <div className="col-span-2 text-center">B</div>
                  <div className="col-span-2 text-center">SR</div>
                  <div className="col-span-1 text-center">4s/6s</div>
                </div>
                
                {batsmen.map((b, i) => {
                  const isActive = b.name === striker || b.name === nonStriker;
                  const isStriker = b.name === striker;
                  const strikeRate = b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(1) : "0.0";
                  
                  return (
                    <div 
                      key={i} 
                      className={`grid grid-cols-12 p-2 rounded-md ${isActive ? 'bg-primary/5 border border-primary/20' : 'border border-border'}`}
                    >
                      <div className="col-span-5 font-medium flex items-center">
                        {b.name} {isStriker && <Badge className="ml-1 bg-accent text-accent-foreground">*</Badge>}
                      </div>
                      <div className="col-span-2 text-center font-bold">{b.runs}</div>
                      <div className="col-span-2 text-center">{b.balls}</div>
                      <div className="col-span-2 text-center">{strikeRate}</div>
                      <div className="col-span-1 text-center">-</div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg">Bowler</h3>
            </div>
            
            {!bowler ? (
              <div className="text-muted-foreground italic text-center p-4">
                No bowler selected yet
              </div>
            ) : (
              <>
                <div className="grid grid-cols-10 text-sm text-muted-foreground px-2">
                  <div className="col-span-3">Bowler</div>
                  <div className="col-span-2 text-center">O</div>
                  <div className="col-span-1 text-center">M</div>
                  <div className="col-span-1 text-center">R</div>
                  <div className="col-span-1 text-center">W</div>
                  <div className="col-span-2 text-center">Econ</div>
                </div>
                
                <div className="grid grid-cols-10 p-2 bg-primary/5 border border-primary/20 rounded-md mt-2">
                  <div className="col-span-3 font-medium">{bowler.name}</div>
                  <div className="col-span-2 text-center">
                    {Math.floor(bowler.balls/6)}.{bowler.balls%6}
                  </div>
                  <div className="col-span-1 text-center">0</div>
                  <div className="col-span-1 text-center">{bowler.runs}</div>
                  <div className="col-span-1 text-center font-bold">{bowler.wickets}</div>
                  <div className="col-span-2 text-center">
                    {bowler.balls > 0 ? ((bowler.runs / (bowler.balls/6)) || 0).toFixed(1) : "0.0"}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
