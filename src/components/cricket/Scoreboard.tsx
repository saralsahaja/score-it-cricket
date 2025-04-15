
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LineChart, Target, Clock, TrendingUp, User, Users, Zap, Square, Award, Star, Trophy } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

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
  recentBalls: string[];
  setTeamAName: (name: string) => void;
  setTeamBName: (name: string) => void;
  totalOvers: number;
  gameTitle: string;
  outPlayers: string[];
  retiredHurtPlayers: string[];
  lastWicketType?: string;
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
  bowlersList,
  recentBalls,
  setTeamAName,
  setTeamBName,
  totalOvers,
  gameTitle,
  outPlayers,
  retiredHurtPlayers,
  lastWicketType
}: ScorecardProps) {
  const [showWicketPopup, setShowWicketPopup] = useState(false);
  const [lastOutBatsman, setLastOutBatsman] = useState<{name: string, runs: number, balls: number} | null>(null);
  
  const overs = Math.floor(totalBalls / 6);
  const balls = totalBalls % 6;
  const oversText = `${overs}.${balls}`;
  const matchFormat = totalOvers === 20 ? 'T20' : 
                      totalOvers === 50 ? 'ODI' : 
                      totalOvers === 10 ? 'T10' : 
                      totalOvers === 90 ? 'Test' : 
                      `${totalOvers} overs`;
  
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

  const activeBatsman1 = batsmen.find(b => b.name === striker);
  const activeBatsman2 = batsmen.find(b => b.name === nonStriker);
  const activeBatsmen = [activeBatsman1, activeBatsman2].filter(Boolean);

  useEffect(() => {
    if (lastWicketType && outPlayers.length > 0) {
      const lastOut = outPlayers[outPlayers.length - 1];
      const lastOutStats = batsmen.find(b => b.name === lastOut);
      
      if (lastOutStats) {
        setLastOutBatsman({
          name: lastOutStats.name,
          runs: lastOutStats.runs,
          balls: lastOutStats.balls
        });
        setShowWicketPopup(true);
        
        const timer = setTimeout(() => {
          setShowWicketPopup(false);
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [outPlayers, lastWicketType, batsmen]);

  const getBallColor = (ball: string) => {
    if (ball === 'W') return 'bg-red-500';
    if (ball === '0') return 'bg-gray-300';
    if (ball === '1') return 'bg-blue-300';
    if (ball === '2') return 'bg-blue-400';
    if (ball === '3') return 'bg-blue-500';
    if (ball === '4') return 'bg-green-400';
    if (ball === '6') return 'bg-purple-500';
    if (ball === 'WD') return 'bg-yellow-400';
    if (ball === 'NB') return 'bg-orange-400';
    if (ball === 'LB') return 'bg-indigo-400';
    if (ball === 'OT') return 'bg-pink-400';
    return 'bg-gray-200';
  };
  
  return (
    <Card className="shadow-lg border-4 border-primary rounded-xl overflow-hidden">
      {showWicketPopup && lastWicketType && lastOutBatsman && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-red-100 rounded-xl p-6 shadow-lg border-4 border-red-500 max-w-md transform animate-bounce">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-red-700 mb-2">WICKET!</h2>
              <p className="text-xl font-semibold">{lastOutBatsman.name} {lastOutBatsman.runs}({lastOutBatsman.balls})</p>
              <p className="text-lg mt-1">Dismissal: {lastWicketType}</p>
            </div>
          </div>
        </div>
      )}
      
      <CardContent className="space-y-6 p-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <LineChart className="h-7 w-7 text-primary" />
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {gameTitle}
          </h2>
        </div>
        
        <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100 rounded-lg p-6 border-2 border-primary">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="relative bg-blue-100 rounded-full p-2 border-2 border-blue-300">
                <Avatar className="h-16 w-16">
                  {teamALogo ? (
                    <AvatarImage src={teamALogo} alt={teamAName} />
                  ) : (
                    <AvatarFallback className="bg-blue-200 text-blue-800 font-bold text-2xl">{teamAName.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div className="font-bold text-2xl text-blue-800">
                {teamAName}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-6xl font-bold mb-1 bg-white text-indigo-700 border-3 border-indigo-300 rounded-xl px-6 py-2 shadow-md">
                {totalRuns}/{wickets}
              </div>
              <div className="text-md text-indigo-700 font-semibold flex items-center justify-center">
                <Clock className="inline-block h-5 w-5 mr-1" />
                {oversText}/{totalOvers} overs
              </div>
              <div className="text-xs font-medium text-indigo-600 mt-1">
                {matchFormat} match
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="font-bold text-2xl text-purple-800">
                {teamBName}
              </div>
              <div className="relative bg-purple-100 rounded-full p-2 border-2 border-purple-300">
                <Avatar className="h-16 w-16">
                  {teamBLogo ? (
                    <AvatarImage src={teamBLogo} alt={teamBName} />
                  ) : (
                    <AvatarFallback className="bg-purple-200 text-purple-800 font-bold text-2xl">{teamBName.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
              </div>
            </div>
          </div>
          
          {recentBalls.length > 0 && (
            <div className="mb-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md border-2 border-primary/20">
              <div className="text-sm text-indigo-700 mb-2 font-semibold">Ball by Ball</div>
              <div className="flex items-center gap-1 overflow-x-auto py-1 px-1">
                {recentBalls.map((ball, index) => (
                  <div 
                    key={index} 
                    className={`flex-shrink-0 w-8 h-8 rounded-full ${getBallColor(ball)} flex items-center justify-center text-white font-bold shadow-md border-2 border-white`}
                  >
                    {ball}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-center shadow-md border-2 border-blue-300">
              <div className="text-sm text-blue-700 mb-1 font-semibold">Current RR</div>
              <div className="text-2xl font-bold flex items-center justify-center text-blue-700">
                <TrendingUp className="h-5 w-5 mr-1 text-blue-500" />
                {crr}
              </div>
            </div>
            
            {isSecondInnings && (
              <>
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-center shadow-md border-2 border-green-300">
                  <div className="text-sm text-green-700 mb-1 font-semibold">Target</div>
                  <div className="text-2xl font-bold flex items-center justify-center text-green-700">
                    <Target className="h-5 w-5 mr-1 text-green-500" />
                    {target}
                  </div>
                </div>
                
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-center shadow-md border-2 border-red-300">
                  <div className="text-sm text-red-700 mb-1 font-semibold">Req. RR</div>
                  <div className="text-2xl font-bold flex items-center justify-center text-red-700">
                    <TrendingUp className="h-5 w-5 mr-1 text-red-500" />
                    {rrr}
                  </div>
                </div>
                
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-center shadow-md border-2 border-purple-300">
                  <div className="text-sm text-purple-700 mb-1 font-semibold">To Win</div>
                  <div className="text-2xl font-bold text-purple-700">
                    {runsLeft} off {ballsLeft}
                  </div>
                </div>
              </>
            )}
            
            {!isSecondInnings && (
              <>
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-center shadow-md col-span-3 border-2 border-amber-300">
                  <div className="text-sm text-amber-700 mb-1 font-semibold">First Innings</div>
                  <div className="text-2xl font-bold text-amber-700">
                    Setting a target for {teamBName}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        <Separator className="border-2 border-primary/20 rounded-full" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="overflow-hidden border-none shadow-lg">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                <h3 className="font-bold text-2xl">Current Batsmen</h3>
              </div>
              <Link to="/match-records" className="text-white hover:underline bg-blue-700 px-3 py-1 rounded-lg text-sm">
                View All Records
              </Link>
            </div>
            <CardContent className="p-4 border-3 border-blue-300">
              {activeBatsmen.length === 0 ? (
                <div className="text-muted-foreground italic text-center p-4 text-lg">
                  No batsmen selected yet
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-12 text-sm text-blue-700 px-2 font-semibold">
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
                            ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300' 
                            : 'bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300'
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
                          <Badge variant="outline" className="bg-blue-100 text-base">{b.fours}</Badge>
                        </div>
                        <div className="col-span-1 text-center">
                          <Badge variant="outline" className="bg-purple-100 text-base">{b.sixes}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-none shadow-lg">
            <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Zap className="h-6 w-6" />
                <h3 className="font-bold text-2xl">Current Bowler</h3>
              </div>
              <Link to="/match-records" className="text-white hover:underline bg-green-700 px-3 py-1 rounded-lg text-sm">
                View All Records
              </Link>
            </div>
            <CardContent className="p-4 border-3 border-green-300">
              {!bowler ? (
                <div className="text-muted-foreground italic text-center p-4 text-lg">
                  No bowler selected yet
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-10 text-sm text-green-700 px-2 font-semibold">
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
                        <div className="grid grid-cols-10 p-2 rounded-md bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300">
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
        </div>
        
        <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-primary/30">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-3 shadow-sm border-2 border-blue-200">
                <h3 className="font-bold text-blue-800 flex items-center gap-1 mb-2 text-lg">
                  <Award className="h-6 w-6 text-blue-800" />
                  Top Performer
                </h3>
                {topScorer && topScorer.runs > 0 ? (
                  <div className="text-center">
                    <div className="font-bold text-xl">{topScorer.name}</div>
                    <div className="text-3xl font-bold text-blue-600">{topScorer.runs} <span className="text-md font-normal text-gray-500">({topScorer.balls} balls)</span></div>
                    <div className="text-sm text-gray-500 mt-1">
                      SR: {((topScorer.runs / topScorer.balls) * 100).toFixed(1)} | 4s: {topScorer.fours} | 6s: {topScorer.sixes}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 italic">No data available</div>
                )}
              </div>
              
              <div className="bg-white rounded-lg p-3 shadow-sm border-2 border-green-200">
                <h3 className="font-bold text-green-800 flex items-center gap-1 mb-2 text-lg">
                  <Trophy className="h-6 w-6 text-green-800" />
                  Best Bowler
                </h3>
                {bestBowler ? (
                  <div className="text-center">
                    <div className="font-bold text-xl">{bestBowler.name}</div>
                    <div className="text-3xl font-bold text-green-600">
                      {bestBowler.wickets}-{bestBowler.runs} <span className="text-md font-normal text-gray-500">
                        ({Math.floor(bestBowler.balls/6)}.{bestBowler.balls%6} overs)
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Economy: {((bestBowler.runs / (bestBowler.balls/6)) || 0).toFixed(2)}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 italic">No data available</div>
                )}
              </div>
              
              <div className="bg-white rounded-lg p-3 shadow-sm border-2 border-purple-200">
                <h3 className="font-bold text-purple-800 flex items-center gap-1 mb-2 text-lg">
                  <Square className="h-6 w-6 text-purple-800 fill-purple-800" />
                  Boundaries
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-sm font-medium text-blue-600">Fours</div>
                    <div className="text-3xl font-bold">{batsmen.reduce((acc, b) => acc + b.fours, 0)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-purple-600">Sixes</div>
                    <div className="text-3xl font-bold">{batsmen.reduce((acc, b) => acc + b.sixes, 0)}</div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-center text-gray-500">
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
