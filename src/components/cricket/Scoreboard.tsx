import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  LineChart, Target, Clock, TrendingUp, User, Users, 
  Award, Star, Trophy, CircleCheck, CircleDot
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  const [latestBall, setLatestBall] = useState<string | null>(null);
  const [showLatestBallInfo, setShowLatestBallInfo] = useState(false);
  const [showTotalRuns, setShowTotalRuns] = useState(true);
  const [showBallsPopover, setShowBallsPopover] = useState(false);
  const [animatingBall, setAnimatingBall] = useState<string | null>(null);
  
  // State for cycling display types
  const [displayInfoType, setDisplayInfoType] = useState<'reqRate' | 'toWin' | 'partnership'>(isSecondInnings ? 'reqRate' : 'partnership');
  
  // State for cycling match info
  const [matchInfoType, setMatchInfoType] = useState<'toss' | 'lastWicket' | 'bestBowler'>('toss');
  
  // Determine batting and bowling teams based on innings
  let battingTeam, bowlingTeam, battingTeamLogo, bowlingTeamLogo;
  
  // In second innings, swap the teams based on toss decision
  if (isSecondInnings) {
    // If team that won toss chose to bowl, they bat second
    battingTeam = tossDecision === "bowl" ? tossWinner : (tossWinner === teamAName ? teamBName : teamAName);
  } else {
    // First innings - team that won toss bats first if they chose to bat
    battingTeam = tossDecision === "bat" ? tossWinner : (tossWinner === teamAName ? teamBName : teamAName);
  }
  
  // Set the bowling team as the opposite of batting team
  bowlingTeam = battingTeam === teamAName ? teamBName : teamAName;
  
  // Get team logos
  battingTeamLogo = battingTeam === teamAName ? teamALogo : teamBLogo;
  bowlingTeamLogo = battingTeam === teamAName ? teamBLogo : teamALogo;
  
  const overs = Math.floor(totalBalls / 6);
  const balls = totalBalls % 6;
  const oversText = `${overs}.${balls}`;
  
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

  // Cycle between different information displays
  useEffect(() => {
    if (!isSecondInnings) {
      setDisplayInfoType('partnership');
      return;
    }
    
    const interval = setInterval(() => {
      setDisplayInfoType(current => {
        if (current === 'reqRate') return 'toWin';
        if (current === 'toWin') return 'partnership';
        return 'reqRate';
      });
    }, 5000); // Change display every 5 seconds
    
    return () => clearInterval(interval);
  }, [isSecondInnings]);
  
  // Cycle between different match info displays (toss, last wicket, best bowler)
  useEffect(() => {
    const interval = setInterval(() => {
      setMatchInfoType(current => {
        if (current === 'toss') return 'lastWicket';
        if (current === 'lastWicket') return 'bestBowler';
        return 'toss';
      });
    }, 4000); // Change match info display every 4 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Only update the latest ball info with animations - with extended 4 second duration
  useEffect(() => {
    if (recentBalls.length > 0) {
      const latestBall = recentBalls[recentBalls.length - 1];
      setLatestBall(latestBall);
      
      // Show the latest ball info briefly with animation
      setShowLatestBallInfo(true);
      setShowTotalRuns(false);
      setAnimatingBall(latestBall);
      
      // Reset animation after 1 second to show total runs
      setTimeout(() => {
        setAnimatingBall(null);
      }, 1000);
      
      // Show total runs again after 4 seconds (extended from 3)
      setTimeout(() => {
        setShowLatestBallInfo(false);
        setShowTotalRuns(true);
      }, 4000);
    }
  }, [recentBalls]);

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
  
  // Get match info to display in the cycling animation
  const getMatchInfoContent = () => {
    switch (matchInfoType) {
      case 'toss':
        return tossWinner && tossDecision ? (
          <div className="text-amber-800 dark:text-amber-200">
            Toss: {tossWinner} won the toss and elected to {tossDecision} first
          </div>
        ) : (
          <div className="text-amber-800 dark:text-amber-200">Match in progress</div>
        );
      case 'lastWicket':
        return lastWicketType && outPlayers.length > 0 ? (
          <div className="text-red-800 dark:text-red-200">
            Last Wicket: {outPlayers[outPlayers.length-1]} ({lastWicketType})
          </div>
        ) : (
          <div className="text-amber-800 dark:text-amber-200">No wickets yet</div>
        );
      case 'bestBowler':
        return bestBowler ? (
          <div className="text-green-800 dark:text-green-200">
            Best Bowler: {bestBowler.name} ({bestBowler.wickets}/{bestBowler.runs})
          </div>
        ) : (
          <div className="text-amber-800 dark:text-amber-200">Bowling stats pending</div>
        );
      default:
        return <div className="text-amber-800 dark:text-amber-200">Match in progress</div>;
    }
  };

  // Group recentBalls by overs for better visualization
  const groupBallsByOver = () => {
    const groupedBalls: { [key: number]: string[] } = {};
    
    // Process balls in reverse order (newest first)
    for (let i = recentBalls.length - 1; i >= 0; i--) {
      const ballIndexInMatch = i + 1;
      const overNumber = Math.floor((totalBalls - (recentBalls.length - ballIndexInMatch)) / 6) + 1;
      
      if (!groupedBalls[overNumber]) {
        groupedBalls[overNumber] = [];
      }
      
      // Insert at beginning to maintain ball order within over
      groupedBalls[overNumber].unshift(recentBalls[i]);
    }
    
    return groupedBalls;
  };
  
  const groupedBalls = groupBallsByOver();
  const currentOverNumber = Math.floor(totalBalls / 6) + 1;
  
  // Create a more attractive ball-by-ball display with over breaks
  const renderBallByBallPopover = () => {
    return (
      <div className="w-full max-w-xl p-2">
        <div className="text-center font-bold text-xl text-primary mb-2">Ball-by-Ball Updates</div>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {Object.entries(groupedBalls)
            .sort((a, b) => Number(b[0]) - Number(a[0])) // Sort by over number (descending)
            .map(([overNumber, balls]) => (
              <div key={`over-${overNumber}`} className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <div className="font-medium text-blue-700 dark:text-blue-300 mb-2">
                  Over {overNumber} {Number(overNumber) === currentOverNumber ? '(Current)' : ''}
                </div>
                <div className="flex flex-wrap gap-2">
                  {balls.map((ball, idx) => {
                    // Determine if this ball is the most recent in the current over
                    const isLatestInOver = Number(overNumber) === currentOverNumber && idx === balls.length - 1;
                    const isLatestBall = Number(overNumber) === currentOverNumber && idx === balls.length - 1 && 
                                        (Number(overNumber) === currentOverNumber);
                    
                    // Style based on ball value and if it's the latest
                    let ballStyle = "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-300";
                    
                    if (ball === 'W') {
                      ballStyle += " bg-red-600 animate-pulse";
                    } else if (ball === '4') {
                      ballStyle += " bg-blue-500";
                    } else if (ball === '6') {
                      ballStyle += " bg-purple-600";
                    } else if (ball === '0') {
                      ballStyle += " bg-gray-400 dark:bg-gray-600";
                    } else if (['WD', 'NB', 'LB', 'OT'].includes(ball)) {
                      ballStyle += " bg-yellow-500";
                    } else {
                      ballStyle += " bg-green-500";
                    }
                    
                    // Add highlight effect for latest ball
                    if (isLatestBall) {
                      ballStyle += " ring-4 ring-yellow-300 dark:ring-yellow-500 shadow-lg scale-110";
                    } else if (isLatestInOver) {
                      ballStyle += " ring-2 ring-blue-300 dark:ring-blue-500";
                    }
                    
                    return (
                      <div key={`ball-${overNumber}-${idx}`} className={ballStyle}>
                        {ball}
                      </div>
                    );
                  })}
                </div>
                
                {Number(overNumber) === currentOverNumber && balls.length > 0 && (
                  <div className="mt-3 bg-white dark:bg-gray-800 p-3 rounded-md shadow text-center text-lg font-medium border-l-4 border-primary">
                    {getLatestBallDescription()}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    );
  };
  
  // Organize last 12 balls into current over and previous over on same row
  const renderLastTwelveBalls = () => {
    const last12Balls = recentBalls.slice(-12);
    const ballsInCurrentOver = totalBalls % 6; // 0 means over just completed
    
    // If current over is empty (just completed), show previous two overs
    const currentOverBalls = ballsInCurrentOver === 0 
      ? [] 
      : last12Balls.slice(-ballsInCurrentOver);
      
    const previousOverBalls = ballsInCurrentOver === 0
      ? last12Balls.slice(-12, -6) // Last complete over
      : last12Balls.slice(0, -ballsInCurrentOver); // Balls before current over
    
    return (
      <div className="space-y-3 w-full">
        <div className="flex justify-between items-start gap-4">
          {/* Current Over - Now positioned side by side with Previous Over */}
          <div className="flex-1">
            <span className="text-xs font-semibold text-blue-600 mb-1 block">
              Current Over {currentOverNumber}
            </span>
            <div className="flex flex-wrap gap-2">
              {currentOverBalls.length > 0 ? (
                currentOverBalls.map((ball, idx) => {
                  // Style based on ball value
                  let ballStyle = "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg";
                  
                  if (ball === 'W') {
                    ballStyle += " bg-red-600 text-white";
                  } else if (ball === '4') {
                    ballStyle += " bg-blue-500 text-white";
                  } else if (ball === '6') {
                    ballStyle += " bg-purple-600 text-white";
                  } else if (ball === '0') {
                    ballStyle += " bg-gray-400 dark:bg-gray-600 text-white";
                  } else if (['WD', 'NB', 'LB', 'OT'].includes(ball)) {
                    ballStyle += " bg-yellow-500 text-white";
                  } else {
                    ballStyle += " bg-green-500 text-white";
                  }
                  
                  // Highlight the latest ball
                  if (idx === currentOverBalls.length - 1) {
                    ballStyle += " ring-2 ring-yellow-300 dark:ring-yellow-500";
                  }
                  
                  return (
                    <div key={`current-ball-${idx}`} className={ballStyle}>
                      {ball}
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-500 italic text-sm">
                  No balls in current over
                </div>
              )}
            </div>
          </div>
          
          {/* Previous Over - Now positioned side by side with Current Over */}
          <div className="flex-1">
            <span className="text-xs font-semibold text-gray-600 mb-1 block">
              Previous Over {currentOverNumber - (currentOverBalls.length > 0 ? 1 : 0)}
            </span>
            <div className="flex flex-wrap gap-2">
              {previousOverBalls.length > 0 ? (
                previousOverBalls.slice(-6).map((ball, idx) => {
                  // Style based on ball value
                  let ballStyle = "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg opacity-80";
                  
                  if (ball === 'W') {
                    ballStyle += " bg-red-600 text-white";
                  } else if (ball === '4') {
                    ballStyle += " bg-blue-500 text-white";
                  } else if (ball === '6') {
                    ballStyle += " bg-purple-600 text-white";
                  } else if (ball === '0') {
                    ballStyle += " bg-gray-400 dark:bg-gray-600 text-white";
                  } else if (['WD', 'NB', 'LB', 'OT'].includes(ball)) {
                    ballStyle += " bg-yellow-500 text-white";
                  } else {
                    ballStyle += " bg-green-500 text-white";
                  }
                  
                  return (
                    <div key={`prev-ball-${idx}`} className={ballStyle}>
                      {ball}
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-500 italic text-sm">
                  No previous over data
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Create animated ball for latest update with enhanced styling and sizing
  const renderAnimatedBallUpdate = () => {
    if (!animatingBall) return null;
    
    // Define style based on ball value with fixed width and height
    let ballClass = "w-full h-full rounded-lg flex items-center justify-center transition-all duration-500 animate-scale-in";
    let textColor = "text-white";
    let bgColor = "";
    let icon = null;
    
    switch (animatingBall) {
      case 'W':
        bgColor = "bg-gradient-to-r from-red-600 to-red-700";
        textColor = "text-white font-bold";
        break;
      case '4':
        bgColor = "bg-gradient-to-r from-blue-500 to-blue-600";
        textColor = "text-white font-bold";
        break;
      case '6':
        bgColor = "bg-gradient-to-r from-purple-600 to-purple-700";
        textColor = "text-white font-bold";
        break;
      case '0':
        bgColor = "bg-gradient-to-r from-gray-500 to-gray-600";
        textColor = "text-white";
        break;
      case 'WD':
        bgColor = "bg-gradient-to-r from-yellow-500 to-yellow-600";
        textColor = "text-white font-bold";
        break;
      case 'NB':
        bgColor = "bg-gradient-to-r from-orange-500 to-orange-600";
        textColor = "text-white font-bold";
        break;
      case 'LB':
      case 'OT':
        bgColor = "bg-gradient-to-r from-amber-500 to-amber-600";
        textColor = "text-white font-bold";
        break;
      default:
        bgColor = "bg-gradient-to-r from-green-500 to-green-600";
        textColor = "text-white font-bold";
    }
    
    return (
      <div className={`${ballClass} ${bgColor} px-4 py-2 shadow-lg w-[300px] h-[75px] mx-auto`}>
        <div className={`flex flex-col items-center justify-center ${textColor}`}>
          <div className="text-2xl font-bold">{animatingBall}</div>
          <div className="text-sm mt-1">{getLatestBallDescription()}</div>
        </div>
      </div>
    );
  };
  
  return (
    <Card className="shadow-lg border-4 border-primary rounded-xl overflow-hidden dark:bg-gray-800 relative">
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
              <Avatar className="h-16 w-16 bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-300 dark:border-blue-700 rounded-full">
                {battingTeamLogo ? (
                  <AvatarImage src={battingTeamLogo} alt={battingTeam} />
                ) : (
                  <AvatarFallback className="bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200 font-bold text-2xl">{battingTeam.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
              <div className="font-bold text-2xl text-blue-800 dark:text-blue-300">
                {battingTeam}
              </div>
            </div>
            
            <div className="text-center relative h-28 flex items-center justify-center">
              {/* Display total runs/wickets WITH OVERS COUNT */}
              {showTotalRuns && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl font-bold bg-white dark:bg-gray-800 text-indigo-700 dark:text-indigo-300 border-3 border-indigo-300 dark:border-indigo-700 rounded-xl px-6 py-2 shadow-md">
                    {totalRuns}/{wickets}
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                      Over: {oversText}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Latest ball information with eye-catching animation */}
              {showLatestBallInfo && latestBall && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[300px] h-[75px] animate-fade-in">
                    {renderAnimatedBallUpdate()}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="font-bold text-2xl text-purple-800 dark:text-purple-300">
                {bowlingTeam}
              </div>
              <Avatar className="h-16 w-16 bg-purple-100 dark:bg-purple-900/50 border-2 border-purple-300 dark:border-purple-700 rounded-full">
                {bowlingTeamLogo ? (
                  <AvatarImage src={bowlingTeamLogo} alt={bowlingTeam} />
                ) : (
                  <AvatarFallback className="bg-purple-200 text-purple-800 dark:bg-purple-800 dark:text-purple-200 font-bold text-2xl">{bowlingTeam.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
            </div>
          </div>
          
          {/* Add match information cycling display */}
          <div className="mb-4 bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg text-center font-medium min-h-[40px]">
            {getMatchInfoContent()}
          </div>
          
          {/* Ball by Ball section with popup feature */}
          <div className="mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-300 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Ball-by-Ball</span>
              <Dialog open={showBallsPopover} onOpenChange={setShowBallsPopover}>
                <DialogTrigger asChild>
                  <button 
                    className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition-colors"
                  >
                    View All Balls
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  {renderBallByBallPopover()}
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex items-center justify-center overflow-x-auto py-2">
              {renderLastTwelveBalls()}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 text-center shadow-md border-2 border-blue-300 dark:border-blue-700">
              <div className="text-sm text-blue-700 dark:text-blue-300 mb-1 font-semibold">Current RR</div>
              <div className="text-2xl font-bold flex items-center justify-center text-blue-700 dark:text-blue-300">
                <TrendingUp className="h-5 w-5 mr-1 text-blue-500 dark:text-blue-400" />
                {crr}
              </div>
            </div>
            
            {/* Standardized size/shape for all info panels */}
            {isSecondInnings && (
              <>
                {/* Required run rate section */}
                {displayInfoType === 'reqRate' && (
                  <div className="col-span-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 h-24 flex flex-col justify-center text-center shadow-md border-2 border-red-300 dark:border-red-700">
                    <div className="text-sm text-red-700 dark:text-red-300 mb-1 font-semibold">Required Run Rate</div>
                    <div className="flex items-center justify-center">
                      <div className="text-2xl font-bold text-red-700 dark:text-red-300 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-1 text-red-500 dark:text-red-400" />
                        {rrr}
                      </div>
                      <span className="mx-2 text-red-600 dark:text-red-400">per over</span>
                    </div>
                  </div>
                )}
                
                {/* Runs to win section */}
                {displayInfoType === 'toWin' && (
                  <div className="col-span-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 h-24 flex flex-col justify-center text-center shadow-md border-2 border-purple-300 dark:border-purple-700">
                    <div className="text-sm text-purple-700 dark:text-purple-300 mb-1 font-semibold">To Win</div>
                    <div className="flex items-center justify-center">
                      <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                        {runsLeft}
                      </div>
                      <span className="mx-2 text-purple-600 dark:text-purple-400">runs needed from</span>
                      <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                        {ballsLeft}
                      </div>
                      <span className="ml-2 text-blue-600 dark:text-blue-400">balls</span>
                    </div>
                  </div>
                )}
                
                {/* Partnership section (shown in second innings as part of cycle) */}
                {displayInfoType === 'partnership' && (
                  <div className="col-span-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 h-24 flex flex-col justify-center text-center shadow-md border-2 border-amber-300 dark:border-amber-700">
                    <div className="text-sm text-amber-700 dark:text-amber-300 mb-1 font-semibold">Current Partnership</div>
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="font-semibold py-1 px-2 bg-amber-100 dark:bg-amber-900/40 rounded-md text-amber-800 dark:text-amber-200">{striker || '---'}</span> 
                        <span className="text-xs mx-1">&amp;</span>
                        <span className="font-semibold py-1 px-2 bg-amber-100 dark:bg-amber-900/40 rounded-md text-amber-800 dark:text-amber-200">{nonStriker || '---'}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <div className="flex gap-1 items-center">
                          <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">R</span>
                          </div>
                          <div className="text-xl font-bold text-amber-700 dark:text-amber-300">
                            {partnershipRuns}
                          </div>
                        </div>
                        <span className="text-amber-600 dark:text-amber-400">off</span>
                        <div className="flex gap-1 items-center">
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">B</span>
                          </div>
                          <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                            {partnershipBalls}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            
            {!isSecondInnings && (
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 h-24 flex flex-col justify-center text-center shadow-md col-span-3 border-2 border-amber-300 dark:border-amber-700">
                <div className="text-sm text-amber-700 dark:text-amber-300 mb-1 font-semibold">Current Partnership</div>
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="font-semibold py-1 px-2 bg-amber-100 dark:bg-amber-900/40 rounded-md text-amber-800 dark:text-amber-200">{striker || '---'}</span> 
                    <span className="text-xs mx-1">&amp;</span>
                    <span className="font-semibold py-1 px-2 bg-amber-100 dark:bg-amber-900/40 rounded-md text-amber-800 dark:text-amber-200">{nonStriker || '---'}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex gap-1 items-center">
                      <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">R</span>
                      </div>
                      <div className="text-xl font-bold text-amber-700 dark:text-amber-300">
                        {partnershipRuns}
                      </div>
                    </div>
                    <span className="text-amber-600 dark:text-amber-400">off</span>
                    <div className="flex gap-1 items-center">
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">B</span>
                      </div>
                      <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                        {partnershipBalls}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
      </CardContent>
    </Card>
  );
}
