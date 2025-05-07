
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
import { Progress } from "@/components/ui/progress";

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
  
  // Only update the latest ball info with animations
  useEffect(() => {
    if (recentBalls.length > 0) {
      const latestBall = recentBalls[recentBalls.length - 1];
      setLatestBall(latestBall);
      
      // Show the latest ball info briefly
      setShowLatestBallInfo(true);
      setShowTotalRuns(false);
      
      // Show total runs again after 3 seconds
      setTimeout(() => {
        setShowLatestBallInfo(false);
        setShowTotalRuns(true);
      }, 3000);
    }
  }, [recentBalls]);

  // Calculate total boundaries
  const totalFours = batsmen.reduce((acc, b) => acc + b.fours, 0);
  const totalSixes = batsmen.reduce((acc, b) => acc + b.sixes, 0);
  const runsFromBoundaries = (totalFours * 4) + (totalSixes * 6);
  const boundariesPercentage = totalRuns > 0 ? Math.round((runsFromBoundaries / totalRuns) * 100) : 0;

  // Get the current over balls
  const getCurrentOverBalls = () => {
    const ballsInCurrentOver = totalBalls % 6 === 0 ? 6 : totalBalls % 6;
    const startIdx = recentBalls.length - ballsInCurrentOver;
    return startIdx >= 0 ? recentBalls.slice(startIdx) : recentBalls;
  };

  const currentOverBalls = getCurrentOverBalls();
  const currentOverRuns = currentOverBalls.reduce((total, ball) => {
    if (ball === '4') return total + 4;
    if (ball === '6') return total + 6;
    if (ball === 'W' || ball === '0' || ball === 'WD' || ball === 'NB' || ball === 'LB' || ball === 'OT') return total;
    return total + parseInt(ball) || 0;
  }, 0);

  const renderBallByBall = () => {
    return (
      <div className="bg-[#1C2536] rounded-md p-3 mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-blue-300 font-semibold text-sm">Ball by Ball</h3>
        </div>
        <div className="text-sm text-white mb-2">Current Over:</div>
        <div className="flex gap-2 flex-wrap">
          {currentOverBalls.map((ball, idx) => {
            let bgColor = "bg-gray-700";
            
            if (ball === 'W') bgColor = "bg-red-600";
            else if (ball === '4') bgColor = "bg-blue-600";
            else if (ball === '6') bgColor = "bg-purple-600";
            else if (ball === '0') bgColor = "bg-gray-600";
            else if (['WD', 'NB', 'LB', 'OT'].includes(ball)) bgColor = "bg-yellow-600";
            else bgColor = "bg-green-600";
            
            return (
              <div 
                key={idx} 
                className={`${bgColor} w-9 h-9 rounded-full flex items-center justify-center text-white font-medium`}
              >
                {ball}
              </div>
            );
          })}
          {currentOverBalls.length > 0 && (
            <div className="ml-2 flex items-center text-white">
              = {currentOverRuns}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Dialog content for detailed ball-by-ball view
  const renderBallByBallDialog = () => {
    const groupedBalls: { [key: number]: string[] } = {};
    
    for (let i = 0; i < recentBalls.length; i++) {
      const overNumber = Math.floor(i / 6) + 1;
      if (!groupedBalls[overNumber]) {
        groupedBalls[overNumber] = [];
      }
      groupedBalls[overNumber].push(recentBalls[i]);
    }
    
    return (
      <div className="max-h-[70vh] overflow-y-auto p-2">
        <h2 className="text-xl font-bold mb-4 text-center">Ball by Ball Details</h2>
        {Object.entries(groupedBalls).map(([over, balls]) => (
          <div key={over} className="mb-4">
            <h3 className="text-lg font-medium mb-2">Over {over}</h3>
            <div className="flex gap-2 flex-wrap">
              {balls.map((ball, idx) => {
                let bgColor = "bg-gray-700";
                
                if (ball === 'W') bgColor = "bg-red-600";
                else if (ball === '4') bgColor = "bg-blue-600";
                else if (ball === '6') bgColor = "bg-purple-600";
                else if (ball === '0') bgColor = "bg-gray-600";
                else if (['WD', 'NB', 'LB', 'OT'].includes(ball)) bgColor = "bg-yellow-600";
                else bgColor = "bg-green-600";
                
                return (
                  <div 
                    key={idx} 
                    className={`${bgColor} w-10 h-10 rounded-full flex items-center justify-center text-white font-medium`}
                  >
                    {ball}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-[#0F172A] text-white rounded-lg overflow-hidden border-[3px] border-[#2DD4BF]">
        <div className="p-4 flex items-center justify-center gap-2">
          <LineChart className="h-5 w-5 text-[#2DD4BF]" />
          <h2 className="text-2xl font-bold text-[#2DD4BF]">
            {gameTitle}
          </h2>
        </div>
        
        <div className="bg-[#1A1F38] p-4">
          {/* Main Score Display */}
          <div className="bg-[#1C2536] rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              {/* Team A */}
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center">
                  {battingTeamLogo ? (
                    <img src={battingTeamLogo} alt={battingTeam} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="text-2xl font-bold text-blue-300">{battingTeam.charAt(0)}</div>
                  )}
                </div>
                <div className="font-bold text-lg text-blue-300">{battingTeam}</div>
              </div>
              
              {/* Score */}
              <div className="text-center">
                <div className="text-4xl font-bold">
                  {totalRuns}/{wickets}
                </div>
                <div className="text-gray-400 text-sm">
                  {oversText}/{totalOvers} overs
                </div>
              </div>
              
              {/* Team B */}
              <div className="flex items-center gap-2">
                <div className="font-bold text-lg text-purple-300">{bowlingTeam}</div>
                <div className="w-12 h-12 rounded-full bg-purple-900 flex items-center justify-center">
                  {bowlingTeamLogo ? (
                    <img src={bowlingTeamLogo} alt={bowlingTeam} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="text-2xl font-bold text-purple-300">{bowlingTeam.charAt(0)}</div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Toss Info */}
            <div className="bg-[#361F38] text-amber-200 text-center py-2 rounded-md text-sm mb-4">
              Toss: {tossWinner} won the toss and elected to {tossDecision} first
            </div>
            
            {renderBallByBall()}
            
            <div className="grid grid-cols-2 gap-4">
              {/* Current RR */}
              <div className="bg-[#152146] rounded-md p-3">
                <div className="text-blue-300 mb-1 text-sm">Current RR</div>
                <div className="text-2xl font-bold flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1 text-blue-300" />
                  {crr}
                </div>
              </div>
              
              {/* Current Partnership */}
              <div className="bg-[#26183D] rounded-md p-3">
                <div className="text-purple-300 mb-1 text-sm">
                  Current Partnership
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-lg font-bold">
                    {activeBatsman1?.name?.charAt(0) || "-"} & {activeBatsman2?.name?.charAt(0) || "-"}
                  </div>
                  <div className="text-lg font-bold">
                    {partnershipRuns} runs
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-1">from {partnershipBalls} balls</div>
                <Progress
                  value={(partnershipBalls / 36) * 100}
                  className="h-1.5 mt-2"
                />
              </div>
            </div>
          </div>
          
          {/* Batsmen & Bowler Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Current Batsmen */}
            <div className="bg-[#1C2536] rounded-xl overflow-hidden">
              <div className="bg-blue-900 px-3 py-2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-white" />
                  <h3 className="font-bold text-white">Current Batsmen</h3>
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
                  className="text-xs bg-blue-800 text-white px-2 py-1 rounded"
                >
                  View All Details
                </Link>
              </div>
              
              <div className="p-2">
                <div className="grid grid-cols-12 text-xs text-gray-400 mb-1 px-2">
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
                      className={`grid grid-cols-12 p-2 rounded ${
                        isStriker ? 'bg-blue-900/30' : 'bg-[#1C2536]'
                      }`}
                    >
                      <div className="col-span-4 font-medium flex items-center">
                        <div className="w-6 h-6 mr-1 rounded-full bg-blue-800 flex items-center justify-center text-xs">
                          {b.name.charAt(0)}
                        </div>
                        {b.name}
                        {isStriker && <span className="ml-1 text-blue-300">*</span>}
                      </div>
                      <div className="col-span-2 text-center font-bold">{b.runs}</div>
                      <div className="col-span-2 text-center">{b.balls}</div>
                      <div className="col-span-2 text-center">{strikeRate}</div>
                      <div className="col-span-1 text-center">{b.fours}</div>
                      <div className="col-span-1 text-center">{b.sixes}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Current Bowler */}
            <div className="bg-[#1C2536] rounded-xl overflow-hidden">
              <div className="bg-green-800 px-3 py-2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-white" />
                  <h3 className="font-bold text-white">Current Bowler</h3>
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
                  className="text-xs bg-green-700 text-white px-2 py-1 rounded"
                >
                  View All Details
                </Link>
              </div>
              
              <div className="p-2">
                <div className="grid grid-cols-10 text-xs text-gray-400 mb-1 px-2">
                  <div className="col-span-3">Bowler</div>
                  <div className="col-span-2 text-center">O</div>
                  <div className="col-span-1 text-center">M</div>
                  <div className="col-span-1 text-center">R</div>
                  <div className="col-span-1 text-center">W</div>
                  <div className="col-span-2 text-center">Econ</div>
                </div>
                
                {bowler && (
                  <div className="grid grid-cols-10 p-2 rounded bg-green-900/30">
                    <div className="col-span-3 font-medium flex items-center">
                      <div className="w-6 h-6 mr-1 rounded-full bg-green-800 flex items-center justify-center text-xs">
                        {bowler.name.charAt(0)}
                      </div>
                      {bowler.name}
                    </div>
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
                )}
              </div>
            </div>
          </div>
          
          {/* Top Performance Section */}
          <div className="grid grid-cols-3 gap-3">
            {/* Top Performer */}
            <div className="bg-[#152146] rounded-md p-3 text-center">
              <h3 className="text-xs font-medium text-blue-300 mb-2 flex justify-center items-center gap-1">
                <Award className="h-3 w-3" />
                Top Performer
              </h3>
              {topScorer && (
                <>
                  <div className="text-xl font-bold">{topScorer.name.charAt(0)}</div>
                  <div className="text-2xl font-bold text-white">
                    {topScorer.runs} <span className="text-sm text-gray-400">({topScorer.balls} balls)</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    SR: {((topScorer.runs / topScorer.balls) * 100).toFixed(1)} | 
                    {topScorer.fours}x4s | {topScorer.sixes}x6s
                  </div>
                </>
              )}
            </div>
            
            {/* Best Bowler */}
            <div className="bg-[#153021] rounded-md p-3 text-center">
              <h3 className="text-xs font-medium text-green-300 mb-2 flex justify-center items-center gap-1">
                <Trophy className="h-3 w-3" />
                Best Bowler
              </h3>
              {bestBowler && (
                <>
                  <div className="text-xl font-bold">{bestBowler.name.charAt(0)}</div>
                  <div className="text-2xl font-bold text-white">
                    {bestBowler.wickets}-{bestBowler.runs} <span className="text-sm text-gray-400">({Math.floor(bestBowler.balls/6)}.{bestBowler.balls%6})</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Economy: {((bestBowler.runs / (bestBowler.balls/6)) || 0).toFixed(1)}
                  </div>
                </>
              )}
            </div>
            
            {/* Boundaries */}
            <div className="bg-[#2D1A38] rounded-md p-3">
              <h3 className="text-xs font-medium text-purple-300 mb-2 flex justify-center items-center gap-1">
                <Star className="h-3 w-3" />
                Boundaries
              </h3>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="text-center">
                  <div className="text-blue-300 text-xs">Fours</div>
                  <div className="text-xl font-bold">{totalFours}</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-300 text-xs">Sixes</div>
                  <div className="text-xl font-bold">{totalSixes}</div>
                </div>
              </div>
              <div className="text-center text-xs text-gray-400">
                {boundariesPercentage}% runs from boundaries
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ball by ball detailed view dialog */}
      <Dialog open={showBallsPopover} onOpenChange={setShowBallsPopover}>
        <DialogContent>
          {renderBallByBallDialog()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
