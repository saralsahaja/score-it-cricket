
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LineChart, Target, Clock, TrendingUp, User, Users, Zap, Square, Award, Star, Trophy } from "lucide-react";
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
  isSecondInnings: boolean;
  bowlersList: Array<{name: string, runs: number, balls: number, wickets: number, maidens: number}>;
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
  teamBLogo,
  isSecondInnings,
  bowlersList
}: ScorecardProps) {
  const overs = Math.floor(totalBalls / 6);
  const balls = totalBalls % 6;
  const oversText = `${overs}.${balls}`;
  
  // Find top scorer
  const topScorer = batsmen.length > 0 
    ? batsmen.reduce((prev, current) => (prev.runs > current.runs) ? prev : current) 
    : null;
  
  // Find most economical bowler (minimum 1 over bowled)
  const economicalBowlers = bowlersList.filter(b => b.balls >= 6);
  const bestBowler = economicalBowlers.length > 0 
    ? economicalBowlers.reduce((prev, current) => 
        ((prev.runs / Math.max(1, prev.balls/6)) < (current.runs / Math.max(1, current.balls/6))) 
          ? prev 
          : current
      )
    : null;
  
  return (
    <Card className="shadow-lg border-2 border-primary/20">
      <CardContent className="space-y-6 p-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <LineChart className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Live Scoreboard
          </h2>
        </div>
        
        <div className="bg-gradient-to-r from-blue-600/20 via-purple-500/20 to-blue-600/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-14 w-14 border-2 border-primary/20">
                {teamALogo ? (
                  <AvatarImage src={teamALogo} alt={teamAName} />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">{teamAName.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
              <div className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {teamAName}
              </div>
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
              <div className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {teamBName}
              </div>
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
            
            {isSecondInnings && (
              <>
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
              </>
            )}
            
            {!isSecondInnings && (
              <>
                <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3 text-center shadow-md col-span-3">
                  <div className="text-sm text-muted-foreground mb-1">First Innings</div>
                  <div className="text-xl font-bold">
                    Setting a target for {teamBName}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        } ${b === topScorer && b.runs > 0 ? 'ring-2 ring-amber-400' : ''}`}
                      >
                        <div className="col-span-4 font-medium flex items-center">
                          {b.name} 
                          {isStriker && <Badge className="ml-1 bg-blue-500 text-white">*</Badge>}
                          {b === topScorer && b.runs > 0 && <Star className="h-3 w-3 ml-1 fill-amber-400 text-amber-400" />}
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
                <h3 className="font-bold text-lg">Bowlers</h3>
              </div>
            </div>
            <CardContent className="p-4">
              {bowlersList.length === 0 ? (
                <div className="text-muted-foreground italic text-center p-4">
                  No bowlers yet
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
                  
                  <div className="space-y-2 mt-2 max-h-[160px] overflow-y-auto pr-1">
                    {bowlersList.map((b, idx) => {
                      const economy = b.balls > 0 ? ((b.runs / (b.balls/6)) || 0).toFixed(1) : "0.0";
                      const isCurrentBowler = bowler?.name === b.name;
                      const isBestBowler = bestBowler && b.name === bestBowler.name && b.balls >= 6;
                      
                      return (
                        <div 
                          key={idx} 
                          className={`grid grid-cols-10 p-2 rounded-md ${
                            isCurrentBowler
                              ? 'bg-gradient-to-r from-green-50 to-green-100 border border-green-200' 
                              : 'border border-border'
                          } ${isBestBowler ? 'ring-2 ring-emerald-400' : ''}`}
                        >
                          <div className="col-span-3 font-medium flex items-center">
                            {b.name}
                            {isBestBowler && <Trophy className="h-3 w-3 ml-1 fill-emerald-400 text-emerald-400" />}
                          </div>
                          <div className="col-span-2 text-center">
                            {Math.floor(b.balls/6)}.{b.balls%6}
                          </div>
                          <div className="col-span-1 text-center">{b.maidens}</div>
                          <div className="col-span-1 text-center">{b.runs}</div>
                          <div className="col-span-1 text-center font-bold">{b.wickets}</div>
                          <div className="col-span-2 text-center">
                            {economy}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <h3 className="font-bold text-blue-800 flex items-center gap-1 mb-2">
                  <Award className="h-5 w-5 text-blue-800" />
                  Top Performer
                </h3>
                {topScorer && topScorer.runs > 0 ? (
                  <div className="text-center">
                    <div className="font-bold text-lg">{topScorer.name}</div>
                    <div className="text-2xl font-bold text-blue-600">{topScorer.runs} <span className="text-sm font-normal text-gray-500">({topScorer.balls} balls)</span></div>
                    <div className="text-xs text-gray-500 mt-1">
                      SR: {((topScorer.runs / topScorer.balls) * 100).toFixed(1)} | 4s: {topScorer.fours} | 6s: {topScorer.sixes}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 italic">No data available</div>
                )}
              </div>
              
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <h3 className="font-bold text-green-800 flex items-center gap-1 mb-2">
                  <Trophy className="h-5 w-5 text-green-800" />
                  Best Bowler
                </h3>
                {bestBowler ? (
                  <div className="text-center">
                    <div className="font-bold text-lg">{bestBowler.name}</div>
                    <div className="text-2xl font-bold text-green-600">
                      {bestBowler.wickets}-{bestBowler.runs} <span className="text-sm font-normal text-gray-500">
                        ({Math.floor(bestBowler.balls/6)}.{bestBowler.balls%6} overs)
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Economy: {((bestBowler.runs / (bestBowler.balls/6)) || 0).toFixed(2)}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 italic">No data available</div>
                )}
              </div>
              
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <h3 className="font-bold text-purple-800 flex items-center gap-1 mb-2">
                  <Square className="h-5 w-5 text-purple-800 fill-purple-800" />
                  Boundaries
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-sm font-medium text-blue-600">Fours</div>
                    <div className="text-2xl font-bold">{batsmen.reduce((acc, b) => acc + b.fours, 0)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-purple-600">Sixes</div>
                    <div className="text-2xl font-bold">{batsmen.reduce((acc, b) => acc + b.sixes, 0)}</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-center text-gray-500">
                  {Math.round((batsmen.reduce((acc, b) => acc + (b.fours * 4) + (b.sixes * 6), 0) / Math.max(1, totalRuns)) * 100)}% 
                  runs from boundaries
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
