
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LineChart, Target, Clock, TrendingUp, User, Users, Zap, Square, Award } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ScorecardProps {
  totalRuns: number;
  wickets: number;
  totalBalls: number;
  crr: string;
  target: number;
  rrr: string;
  runsLeft: number;
  ballsLeft: number;
  batsmen: Array<{name: string, runs: number, balls: number, fours: number, sixes: number}>;
  bowler: {name: string, runs: number, balls: number, wickets: number, maidens: number} | null;
  striker: string | null;
  nonStriker: string | null;
  teamAName: string;
  teamBName: string;
  teamALogo: string | null;
  teamBLogo: string | null;
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
  nonStriker,
  teamAName,
  teamBName,
  teamALogo,
  teamBLogo
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
        
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-14 w-14 border-2 border-primary/20">
                {teamALogo ? (
                  <AvatarImage src={teamALogo} alt={teamAName} />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">{teamAName.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
              <div className="font-bold text-lg">{teamAName}</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold mb-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {totalRuns}/{wickets}
              </div>
              <div className="text-sm text-muted-foreground">
                <Clock className="inline-block h-4 w-4 mr-1" />
                {oversText} overs
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="font-bold text-lg">{teamBName}</div>
              <Avatar className="h-14 w-14 border-2 border-primary/20">
                {teamBLogo ? (
                  <AvatarImage src={teamBLogo} alt={teamBName} />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">{teamBName.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3 text-center shadow-md">
              <div className="text-sm text-muted-foreground mb-1">Current RR</div>
              <div className="text-xl font-bold flex items-center justify-center">
                <TrendingUp className="h-4 w-4 mr-1 text-primary" />
                {crr}
              </div>
            </div>
            
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3 text-center shadow-md">
              <div className="text-sm text-muted-foreground mb-1">Target</div>
              <div className="text-xl font-bold flex items-center justify-center">
                <Target className="h-4 w-4 mr-1 text-accent" />
                {target}
              </div>
            </div>
            
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3 text-center shadow-md">
              <div className="text-sm text-muted-foreground mb-1">Req. RR</div>
              <div className="text-xl font-bold flex items-center justify-center">
                <TrendingUp className="h-4 w-4 mr-1 text-destructive" />
                {rrr}
              </div>
            </div>
            
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3 text-center shadow-md">
              <div className="text-sm text-muted-foreground mb-1">To Win</div>
              <div className="text-xl font-bold">
                {runsLeft} off {ballsLeft}
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <Card className="overflow-hidden border-none shadow-lg">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <h3 className="font-bold text-lg">Batsmen</h3>
            </div>
          </div>
          <CardContent className="p-4">
            {batsmen.length === 0 ? (
              <div className="text-muted-foreground italic text-center p-4">
                No batsmen selected yet
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-12 text-sm text-muted-foreground px-2">
                  <div className="col-span-4">Batsman</div>
                  <div className="col-span-2 text-center">R</div>
                  <div className="col-span-2 text-center">B</div>
                  <div className="col-span-2 text-center">SR</div>
                  <div className="col-span-1 text-center">4s</div>
                  <div className="col-span-1 text-center">6s</div>
                </div>
                
                {batsmen.map((b, i) => {
                  const isActive = b.name === striker || b.name === nonStriker;
                  const isStriker = b.name === striker;
                  const strikeRate = b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(1) : "0.0";
                  
                  return (
                    <div 
                      key={i} 
                      className={`grid grid-cols-12 p-2 rounded-md ${
                        isActive 
                          ? isStriker 
                            ? 'bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200' 
                            : 'bg-gradient-to-r from-green-50 to-green-100 border border-green-200'
                          : 'border border-border'
                      }`}
                    >
                      <div className="col-span-4 font-medium flex items-center">
                        {b.name} {isStriker && <Badge className="ml-1 bg-blue-500 text-white">*</Badge>}
                      </div>
                      <div className="col-span-2 text-center font-bold">{b.runs}</div>
                      <div className="col-span-2 text-center">{b.balls}</div>
                      <div className="col-span-2 text-center">{strikeRate}</div>
                      <div className="col-span-1 text-center">
                        <Badge variant="outline" className="bg-blue-100">{b.fours}</Badge>
                      </div>
                      <div className="col-span-1 text-center">
                        <Badge variant="outline" className="bg-purple-100">{b.sixes}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-none shadow-lg">
          <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <h3 className="font-bold text-lg">Bowler</h3>
            </div>
          </div>
          <CardContent className="p-4">
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
                
                <div className="grid grid-cols-10 p-2 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-md mt-2">
                  <div className="col-span-3 font-medium">{bowler.name}</div>
                  <div className="col-span-2 text-center">
                    {Math.floor(bowler.balls/6)}.{bowler.balls%6}
                  </div>
                  <div className="col-span-1 text-center">{bowler.maidens}</div>
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
        
        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-accent/20 to-primary/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Square className="h-4 w-4 text-blue-500 fill-blue-500" />
            <span className="text-sm font-medium">4s: {batsmen.reduce((acc, b) => acc + b.fours, 0)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-500" />
            <span className="text-sm font-medium">Top Score: {batsmen.length > 0 ? Math.max(...batsmen.map(b => b.runs)) : 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <Square className="h-4 w-4 text-purple-500 fill-purple-500" />
            <span className="text-sm font-medium">6s: {batsmen.reduce((acc, b) => acc + b.sixes, 0)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
