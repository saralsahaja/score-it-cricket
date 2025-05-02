import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  LineChart, Target, Clock, TrendingUp, User, Users, Zap, Square, 
  Award, Star, Trophy, Circle, CircleDot, Maximize, Minimize 
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
  tossWinner?: string;
  tossDecision?: string;
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
  lastWicketType,
  tossWinner,
  tossDecision
}: ScorecardProps) {
  const { toast } = useToast();
  const [animatingBalls, setAnimatingBalls] = useState<{[key: string]: string}>({});
  const [showWicketAnimation, setShowWicketAnimation] = useState(false);
  const [showFourAnimation, setShowFourAnimation] = useState(false);
  const [showSixAnimation, setShowSixAnimation] = useState(false);
  const [latestBall, setLatestBall] = useState<string | null>(null);
  const [showLatestBallInfo, setShowLatestBallInfo] = useState(false);
  
  // Determine batting and bowling teams
  let battingTeam = isSecondInnings ? (tossDecision === "bowl" ? tossWinner : (tossWinner === teamAName ? teamBName : teamAName)) : 
                                     (tossDecision === "bat" ? tossWinner : (tossWinner === teamAName ? teamBName : teamAName));
  let bowlingTeam = battingTeam === teamAName ? teamBName : teamAName;
  
  // Get batting team logo
  const battingTeamLogo = battingTeam === teamAName ? teamALogo : teamBLogo;
  const bowlingTeamLogo = battingTeam === teamAName ? teamBLogo : teamALogo;
  
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

  // Calculate partnership runs
  const partnershipRuns = activeBatsmen.reduce((total, batter) => total + (batter?.runs || 0), 0);
  const partnershipBalls = activeBatsmen.reduce((total, batter) => total + (batter?.balls || 0), 0);

  useEffect(() => {
    if (recentBalls.length > 0) {
      const latestBall = recentBalls[recentBalls.length - 1];
      const key = `${latestBall}-${Date.now()}`;
      
      if (latestBall === "W") {
        setAnimatingBalls(prev => ({ ...prev, [key]: "animate-wicket" }));
        setShowWicketAnimation(true);
        setTimeout(() => setShowWicketAnimation(false), 2000);
      } else if (latestBall === "4") {
        setAnimatingBalls(prev => ({ ...prev, [key]: "animate-boundary" }));
        setShowFourAnimation(true);
        setTimeout(() => setShowFourAnimation(false), 2000);
      } else if (latestBall === "6") {
        setAnimatingBalls(prev => ({ ...prev, [key]: "animate-six" }));
        setShowSixAnimation(true);
        setTimeout(() => setShowSixAnimation(false), 2000);
      }
      
      // Show the latest ball info
      setLatestBall(latestBall);
      setShowLatestBallInfo(true);
      setTimeout(() => {
        setShowLatestBallInfo(false);
      }, 3000);
      
      // Clear animation after it completes
      setTimeout(() => {
        setAnimatingBalls(prev => {
          const newState = { ...prev };
          delete newState[key];
          return newState;
        });
      }, 1600);
    }
  }, [recentBalls]);

  // Process recent balls to format them by overs (all balls including extras)
  const processRecentBalls = () => {
    const recentOvers: { [key: string]: string[] } = {};
    
    // Map ball positions to their over numbers
    recentBalls.forEach((ball, index) => {
      const ballPosition = totalBalls - recentBalls.length + index;
      const overNumber = Math.floor(ballPosition / 6);
      if (!recentOvers[overNumber]) {
        recentOvers[overNumber] = [];
      }
      recentOvers[overNumber].push(ball);
    });
    
    // Get only the last two overs
    const allOvers = Object.keys(recentOvers).sort((a, b) => parseInt(b) - parseInt(a));
    const lastTwoOvers = allOvers.slice(0, 2);
    
    const result: { [key: string]: string[] } = {};
    lastTwoOvers.forEach(over => {
      result[over] = recentOvers[over];
    });
    
    return result;
  };
  
  const recentTwoOvers = processRecentBalls();
  const currentOver = Object.keys(recentTwoOvers)[0] ? parseInt(Object.keys(recentTwoOvers)[0]) : -1;
  const previousOver = Object.keys(recentTwoOvers)[1] ? parseInt(Object.keys(recentTwoOvers)[1]) : -1;

  const getBallColor = (ball: string) => {
    if (ball === 'W') return 'bg-red-500';
    if (ball === '0') return 'bg-gray-300 dark:bg-gray-600';
    if (ball === '1') return 'bg-blue-300 dark:bg-blue-600';
    if (ball === '2') return 'bg-blue-400 dark:bg-blue-700';
    if (ball === '3') return 'bg-blue-500 dark:bg-blue-800';
    if (ball === '4') return 'bg-green-400 dark:bg-green-600';
    if (ball === '6') return 'bg-purple-500 dark:bg-purple-700';
    if (ball === 'WD') return 'bg-yellow-400 dark:bg-yellow-600';
    if (ball === 'NB') return 'bg-orange-400 dark:bg-orange-600';
    if (ball === 'LB') return 'bg-indigo-400 dark:bg-indigo-600';
    if (ball === 'OT') return 'bg-pink-400 dark:bg-pink-600';
    return 'bg-gray-200 dark:bg-gray-700';
  };

  // Calculate over runs total
  const calculateOverTotal = (balls: string[]) => {
    return balls.reduce((sum, ball) => {
      if (ball === 'W') return sum;
      if (ball === 'WD' || ball === 'NB') return sum + 1;
      const value = parseInt(ball);
      return sum + (isNaN(value) ? 0 : value);
    }, 0);
  };

  const getLatestBallDescription = () => {
    if (!latestBall) return '';

    switch (latestBall) {
      case 'W':
        return `WICKET! ${striker || 'Batsman'} is out!`;
      case '4':
        return `FOUR! ${striker || 'Batsman'} hits a boundary!`;
      case '6':
        return `SIX! ${striker || 'Batsman'} clears the rope!`;
      case 'WD':
        return `Wide ball! Extra run added.`;
      case 'NB':
        return `No ball! Free hit coming up.`;
      case 'LB':
        return `Leg bye! One run taken.`;
      case 'OT':
        return `Overthrow! Extra runs to the batting team.`;
      case '0':
        return `Dot ball! Good delivery by ${bowler?.name || 'bowler'}.`;
      default:
        return `${latestBall} run(s) taken by ${striker || 'batsman'}.`;
    }
  };
  
  return (
    <Card className="shadow-lg border-4 border-primary rounded-xl overflow-hidden dark:bg-gray-800 relative">
      {/* Full-screen animations */}
      {showWicketAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="wicket-animation bg-red-500/30 absolute inset-0 animate-pulse backdrop-blur-sm"></div>
          <div className="text-9xl font-extrabold text-red-600 animate-bounce shadow-lg">
            WICKET!
          </div>
        </div>
      )}
      
      {showFourAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="four-animation bg-green-500/30 absolute inset-0 animate-pulse backdrop-blur-sm"></div>
          <div className="text-9xl font-extrabold text-green-600 animate-bounce shadow-lg">
            FOUR!
          </div>
        </div>
      )}
      
      {showSixAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="six-animation bg-purple-500/30 absolute inset-0 animate-pulse backdrop-blur-sm"></div>
          <div className="text-9xl font-extrabold text-purple-600 animate-bounce shadow-lg">
            SIX!
          </div>
        </div>
      )}
      
      <CardContent className="space-y-6 p-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <LineChart className="h-7 w-7 text-primary" />
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
            {gameTitle}
          </h2>
        </div>
        
        <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100 dark:from-blue-900/40 dark:via-purple-900/40 dark:to-blue-900/40 rounded-lg p-6 border-2 border-primary">
          <div className="flex items-center justify-between mb-6">
            {/* Always show batting team on the left */}
            <div className="flex items-center gap-2">
              <div className="relative bg-blue-100 dark:bg-blue-900/50 rounded-full p-2 border-2 border-blue-300 dark:border-blue-700">
                <Avatar className="h-16 w-16 animate-[scale_2s_ease-in-out_infinite]">
                  {battingTeamLogo ? (
                    <AvatarImage src={battingTeamLogo} alt={battingTeam} />
                  ) : (
                    <AvatarFallback className="bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200 font-bold text-2xl">{battingTeam.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute -top-2 -right-2 bg-blue-600 text-white p-1 rounded-full">
                  {/* Replace Bat with acceptable alternative */}
                  <Award className="h-5 w-5" />
                </div>
              </div>
              <div className="font-bold text-2xl text-blue-800 dark:text-blue-300">
                {battingTeam}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-6xl font-bold mb-1 bg-white dark:bg-gray-800 text-indigo-700 dark:text-indigo-300 border-3 border-indigo-300 dark:border-indigo-700 rounded-xl px-6 py-2 shadow-md">
                {totalRuns}/{wickets}
              </div>
              <div className="text-md text-indigo-700 dark:text-indigo-300 font-semibold flex items-center justify-center">
                <Clock className="inline-block h-5 w-5 mr-1" />
                {oversText}/{totalOvers} overs
              </div>
              <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-1">
                {matchFormat} match
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="font-bold text-2xl text-purple-800 dark:text-purple-300">
                {bowlingTeam}
              </div>
              <div className="relative bg-purple-100 dark:bg-purple-900/50 rounded-full p-2 border-2 border-purple-300 dark:border-purple-700">
                <Avatar className="h-16 w-16 animate-[scale_2s_ease-in-out_infinite]">
                  {bowlingTeamLogo ? (
                    <AvatarImage src={bowlingTeamLogo} alt={bowlingTeam} />
                  ) : (
                    <AvatarFallback className="bg-purple-200 text-purple-800 dark:bg-purple-800 dark:text-purple-200 font-bold text-2xl">{bowlingTeam.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute -top-2 -right-2 bg-purple-600 text-white p-1 rounded-full">
                  {/* Replace CricketBall with acceptable alternative */}
                  <CircleDot className="h-5 w-5 animate-spin" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Add toss information */}
          {tossWinner && tossDecision && (
            <div className="mb-4 bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg text-center text-amber-800 dark:text-amber-200 font-medium">
              Toss: {tossWinner} won the toss and elected to {tossDecision} first
            </div>
          )}

          {/* Latest Ball Animation Panel */}
          {showLatestBallInfo && latestBall && (
            <div className="mb-4 bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-sm rounded-lg p-4 shadow-lg border-2 border-white/30 animate-fade-in animate-pulse">
              <div className="text-center">
                <div className={`inline-block w-16 h-16 ${getBallColor(latestBall)} rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg border-2 border-white dark:border-gray-800 mb-2`}>
                  {latestBall}
                </div>
                <div className="text-xl font-bold text-white dark:text-white">
                  {getLatestBallDescription()}
                </div>
              </div>
            </div>
          )}
          
          {/* Ball by Ball section - Improved to show all deliveries and consistent boxes */}
          {Object.keys(recentTwoOvers).length > 0 && (
            <div className="mb-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-md border-2 border-primary/20">
              <div className="text-sm text-indigo-700 dark:text-indigo-300 mb-3 font-semibold">Ball by Ball</div>
              <div className="flex flex-row gap-4">
                {/* Current Over */}
                {currentOver >= 0 && (
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex-1">
                    <div className="bg-green-100 dark:bg-green-900/40 px-3 py-1 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-semibold text-green-800 dark:text-green-300">Current Over: </span>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-900 flex items-center">
                      <div className="flex flex-row flex-nowrap overflow-x-auto gap-2">
                        {recentTwoOvers[currentOver.toString()]?.map((ball, idx) => {
                          const uniqueKey = `curr-${idx}-${ball}`;
                          const hasAnimation = Object.keys(animatingBalls).some(key => key.startsWith(`${ball}-`));
                          const animationClass = hasAnimation ? 
                            (ball === "W" ? "animate-wicket" : 
                             ball === "4" ? "animate-boundary" : 
                             ball === "6" ? "animate-six" : "") : "";
                          
                          return (
                            <div key={uniqueKey} className="inline-block flex-shrink-0">
                              <div 
                                className={`w-10 h-10 ${getBallColor(ball)} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white dark:border-gray-800 ${animationClass}`}
                              >
                                {ball}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="ml-4 text-gray-600 dark:text-gray-300 font-medium whitespace-nowrap text-lg">
                        = {calculateOverTotal(recentTwoOvers[currentOver.toString()] || [])}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Previous Over */}
                {previousOver >= 0 && (
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex-1">
                    <div className="bg-blue-100 dark:bg-blue-900/40 px-3 py-1 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">Last Over: </span>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-900 flex items-center">
                      <div className="flex flex-row flex-nowrap overflow-x-auto gap-2">
                        {recentTwoOvers[previousOver.toString()]?.map((ball, idx) => (
                          <div key={`prev-${idx}`} className="inline-block flex-shrink-0">
                            <div 
                              className={`w-10 h-10 ${getBallColor(ball)} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white dark:border-gray-800`}
                            >
                              {ball}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="ml-4 text-gray-600 dark:text-gray-300 font-medium whitespace-nowrap text-lg">
                        = {calculateOverTotal(recentTwoOvers[previousOver.toString()] || [])}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 text-center shadow-md border-2 border-blue-300 dark:border-blue-700">
              <div className="text-sm text-blue-700 dark:text-blue-300 mb-1 font-semibold">Current RR</div>
              <div className="text-2xl font-bold flex items-center justify-center text-blue-700 dark:text-blue-300">
                <TrendingUp className="h-5 w-5 mr-1 text-blue-500 dark:text-blue-400" />
                {crr}
              </div>
            </div>
            
            {isSecondInnings && (
              <>
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 text-center shadow-md border-2 border-green-300 dark:border-green-700">
                  <div className="text-sm text-green-700 dark:text-green-300 mb-1 font-semibold">Target</div>
                  <div className="text-2xl font-bold flex items-center justify-center text-green-700 dark:text-green-300">
                    <Target className="h-5 w-5 mr-1 text-green-500 dark:text-green-400" />
                    {target}
                  </div>
                </div>
                
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 text-center shadow-md border-2 border-red-300 dark:border-red-700">
                  <div className="text-sm text-red-700 dark:text-red-300 mb-1 font-semibold">Req. RR</div>
                  <div className="text-2xl font-bold flex items-center justify-center text-red-700 dark:text-red-300">
                    <TrendingUp className="h-5 w-5 mr-1 text-red-500 dark:text-red-400" />
                    {rrr}
                  </div>
                </div>
                
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 text-center shadow-md border-2 border-purple-300 dark:border-purple-700">
                  <div className="text-sm text-purple-700 dark:text-purple-300 mb-1 font-semibold">To Win</div>
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {runsLeft} off {ballsLeft}
                  </div>
                </div>
              </>
            )}
            
            {!isSecondInnings && (
              <>
                {/* Replace "Setting target" message with partnership info */}
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 text-center shadow-md col-span-3 border-2 border-amber-300 dark:border-amber-700">
                  <div className="text-sm text-amber-700 dark:text-amber-300 mb-1 font-semibold">Current Partnership</div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="text-xl font-bold text-amber-700 dark:text-amber-300">
                      {partnershipRuns} runs
                      <span className="text-sm font-normal"> from {partnershipBalls} balls</span>
                    </div>
                    <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                        style={{ width: `${Math.min(100, (partnershipRuns / Math.max(1, totalRuns)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        <Separator className="border-2 border-primary/20 rounded-full" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="overflow-hidden border-none shadow-lg dark:bg-gray-800">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 text-white p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                <h3 className="font-bold text-2xl">Current Batsmen</h3>
              </div>
              <Link to="/match-records" className="text-white hover:underline bg-blue-700 dark:bg-blue-600 px-3 py-1 rounded-lg text-sm">
                View All Records
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
          
          <Card className="overflow-hidden border-none shadow-lg dark:bg-gray-800">
            <div className="bg-gradient-to-r from-green-600 to-green-800 dark:from-green-800 dark:to-green-900 text-white p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Zap className="h-6 w-6" />
                <h3 className="font-bold text-2xl">Current Bowler</h3>
              </div>
              <Link to="/match-records" className="text-white hover:underline bg-green-700 dark:bg-green-600 px-3 py-1 rounded-lg text-sm">
                View All Records
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
        </div>
        
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
                  <Square className="h-6 w-6 text-purple-800 dark:text-purple-300 fill-purple-800 dark:fill-purple-300" />
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
      </CardContent>
    </Card>
  );
}
