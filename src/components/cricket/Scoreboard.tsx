
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LineChart } from "lucide-react";
import ScoreDisplay from "./ScoreDisplay";
import MatchInfo from "./MatchInfo";
import BallByBall from "./BallByBall";
import MatchStats from "./MatchStats";
import CurrentBatsmen from "./CurrentBatsmen";
import CurrentBowler from "./CurrentBowler";
import MatchSummary from "./MatchSummary";
import { ScorecardProps } from "./types";

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
  
  // Determine batting and bowling teams based on innings
  let battingTeam, bowlingTeam, battingTeamLogo, bowlingTeamLogo;
  
  if (isSecondInnings) {
    battingTeam = tossDecision === "bowl" ? tossWinner : (tossWinner === teamAName ? teamBName : teamAName);
  } else {
    battingTeam = tossDecision === "bat" ? tossWinner : (tossWinner === teamAName ? teamBName : teamAName);
  }
  
  bowlingTeam = battingTeam === teamAName ? teamBName : teamAName;
  battingTeamLogo = battingTeam === teamAName ? teamALogo : teamBLogo;
  bowlingTeamLogo = battingTeam === teamAName ? teamBLogo : teamALogo;
  
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
  
  return (
    <Card className="shadow-lg border-2 border-primary rounded-xl overflow-hidden dark:bg-gray-800 relative">
      <CardContent className="space-y-2 p-3">
        <div className="flex items-center justify-center gap-2">
          <LineChart className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
            {gameTitle}
          </h2>
        </div>
        
        <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100 dark:from-blue-900/40 dark:via-purple-900/40 dark:to-blue-900/40 rounded-lg p-3 border border-primary">
          <ScoreDisplay
            totalRuns={totalRuns}
            wickets={wickets}
            totalBalls={totalBalls}
            battingTeam={battingTeam}
            bowlingTeam={bowlingTeam}
            battingTeamLogo={battingTeamLogo}
            bowlingTeamLogo={bowlingTeamLogo}
            recentBalls={recentBalls}
            striker={striker}
            bowler={bowler}
          />
          
          <MatchInfo
            tossWinner={tossWinner}
            tossDecision={tossDecision}
            lastWicketType={lastWicketType}
            outPlayers={outPlayers}
            bestBowler={bestBowler}
          />
          
          <BallByBall
            recentBalls={recentBalls}
            totalBalls={totalBalls}
            striker={striker}
            bowler={bowler}
          />
          
          <MatchStats
            crr={crr}
            isSecondInnings={isSecondInnings}
            rrr={rrr}
            runsLeft={runsLeft}
            ballsLeft={ballsLeft}
            striker={striker}
            nonStriker={nonStriker}
            partnershipRuns={partnershipRuns}
            partnershipBalls={partnershipBalls}
          />
        </div>
        
        <Separator className="border border-primary/20 rounded-full" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <CurrentBatsmen
            batsmen={batsmen}
            striker={striker}
            nonStriker={nonStriker}
            teamAName={teamAName}
            teamBName={teamBName}
            outPlayers={outPlayers}
            retiredHurtPlayers={retiredHurtPlayers}
            gameTitle={gameTitle}
            totalRuns={totalRuns}
            wickets={wickets}
            totalOvers={totalOvers}
            totalBalls={totalBalls}
            crr={crr}
            bowlersList={bowlersList}
          />
          
          <CurrentBowler
            bowler={bowler}
            batsmen={batsmen}
            bowlersList={bowlersList}
            teamAName={teamAName}
            teamBName={teamBName}
            outPlayers={outPlayers}
            retiredHurtPlayers={retiredHurtPlayers}
            gameTitle={gameTitle}
            totalRuns={totalRuns}
            wickets={wickets}
            totalOvers={totalOvers}
            totalBalls={totalBalls}
            crr={crr}
          />
        </div>

        <MatchSummary
          batsmen={batsmen}
          bowlersList={bowlersList}
          totalRuns={totalRuns}
        />
      </CardContent>
    </Card>
  );
}
