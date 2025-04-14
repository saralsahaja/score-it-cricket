import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import TeamSetup from "@/components/cricket/TeamSetup";
import MatchControl from "@/components/cricket/MatchControl";
import Scoreboard from "@/components/cricket/Scoreboard";
import { CricketAppHeader } from "@/components/cricket/CricketAppHeader";

interface BatsmanStats {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
}

interface BowlerStats {
  name: string;
  runs: number;
  balls: number;
  wickets: number;
  maidens: number;
}

export default function Index() {
  const [teamA, setTeamA] = useState<string[]>([]);
  const [teamB, setTeamB] = useState<string[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [activeTeam, setActiveTeam] = useState("A");
  const [teamAName, setTeamAName] = useState("Team A");
  const [teamBName, setTeamBName] = useState("Team B");
  const [teamALogo, setTeamALogo] = useState<string | null>(null);
  const [teamBLogo, setTeamBLogo] = useState<string | null>(null);
  const [totalOvers, setTotalOvers] = useState(20);
  const [gameTitle, setGameTitle] = useState("Live Scoreboard");

  const [batsmen, setBatsmen] = useState<BatsmanStats[]>([]);
  const [bowler, setBowler] = useState<BowlerStats | null>(null);
  const [bowlersList, setBowlersList] = useState<BowlerStats[]>([]);
  const [striker, setStriker] = useState<string | null>(null);
  const [nonStriker, setNonStriker] = useState<string | null>(null);
  const [currentBowler, setCurrentBowler] = useState<string | null>(null);
  const [isOverComplete, setIsOverComplete] = useState(false);
  const [outPlayers, setOutPlayers] = useState<string[]>([]);
  const [retiredHurtPlayers, setRetiredHurtPlayers] = useState<string[]>([]);
  const [lastWicketType, setLastWicketType] = useState<string>("");

  const [totalRuns, setTotalRuns] = useState(0);
  const [totalBalls, setTotalBalls] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [firstInningsScore, setFirstInningsScore] = useState(0);
  const [isSecondInnings, setIsSecondInnings] = useState(false);
  const [recentBalls, setRecentBalls] = useState<string[]>([]);

  useEffect(() => {
    const maxBalls = totalOvers * 6;
    
    if (!isSecondInnings && (wickets >= 10 || totalBalls >= maxBalls)) {
      if (totalBalls > 0) {
        toast.info("First innings complete! Starting second innings.", {
          duration: 5000,
        });
        setFirstInningsScore(totalRuns);
        setIsSecondInnings(true);
        resetInnings();
        setRecentBalls([]);
      }
    }
  }, [wickets, totalBalls, isSecondInnings, totalOvers]);

  const resetInnings = () => {
    setTotalRuns(0);
    setTotalBalls(0);
    setWickets(0);
    setBatsmen([]);
    setBowler(null);
    setBowlersList([]);
    setStriker(null);
    setNonStriker(null);
    setCurrentBowler(null);
    setIsOverComplete(false);
    setOutPlayers([]);
    setRetiredHurtPlayers([]);
  };

  const handleAddPlayer = () => {
    if (playerName.trim() === "") {
      toast.error("Please enter a player name");
      return;
    }
    
    if (activeTeam === "A") {
      if (teamA.includes(playerName)) {
        toast.error("Player already exists in Team A");
        return;
      }
      setTeamA([...teamA, playerName]);
    } else {
      if (teamB.includes(playerName)) {
        toast.error("Player already exists in Team B");
        return;
      }
      setTeamB([...teamB, playerName]);
    }
    
    toast.success(`${playerName} added to ${activeTeam === "A" ? teamAName : teamBName}`);
    setPlayerName("");
  };

  const handleSelectBatsman = (player: string, isStriker: boolean) => {
    if (outPlayers.includes(player)) {
      toast.error(`${player} is out and cannot bat again`);
      return;
    }
    
    if (!batsmen.find(b => b.name === player)) {
      setBatsmen([...batsmen, { name: player, runs: 0, balls: 0, fours: 0, sixes: 0 }]);
    }
    
    if (isStriker) {
      setStriker(player);
      toast.success(`${player} is now the striker`);
    } else {
      setNonStriker(player);
      toast.success(`${player} is now the non-striker`);
    }
  };

  const handleSelectBowler = (player: string) => {
    if (bowler?.name === player) return;
    
    const newBowler = { name: player, runs: 0, balls: 0, wickets: 0, maidens: 0 };
    
    const existingBowler = bowlersList.find(b => b.name === player);
    
    if (existingBowler) {
      setBowler(existingBowler);
    } else {
      setBowler(newBowler);
      setBowlersList([...bowlersList, newBowler]);
    }
    
    setCurrentBowler(player);
    setIsOverComplete(false);
    toast.success(`${player} is now bowling`);
  };

  const handleRetireHurt = (player: string) => {
    if (!player) return;
    
    setRetiredHurtPlayers(prev => [...prev, player]);
    
    if (player === striker) {
      setStriker(null);
      toast.info(`${player} has retired hurt. Please select a new striker.`);
    } else if (player === nonStriker) {
      setNonStriker(null);
      toast.info(`${player} has retired hurt. Please select a new non-striker.`);
    }
  };

  const handleAddRun = (runs: number, extraType?: string) => {
    if (!striker || !bowler) {
      toast.error("Please select striker and bowler first");
      return;
    }

    const strikerStats = batsmen.find(b => b.name === striker);
    if (!strikerStats) return;
    
    if (!extraType) {
      strikerStats.runs += runs;
      strikerStats.balls += 1;
      
      if (runs === 4) {
        strikerStats.fours += 1;
      } else if (runs === 6) {
        strikerStats.sixes += 1;
      }

      const bowlerStats = bowler;
      bowlerStats.runs += runs;
      bowlerStats.balls += 1;

      setBatsmen([...batsmen]);
      
      updateBowlerInList(bowlerStats);
      
      setTotalRuns(totalRuns + runs);
      setTotalBalls(totalBalls + 1);

      const ballNotation = runs === 0 ? '0' : runs.toString();
      setRecentBalls(prev => [...prev.slice(-11), ballNotation]);

      if (runs % 2 === 1) {
        const temp = striker;
        setStriker(nonStriker);
        setNonStriker(temp);
      }

      if (bowlerStats.balls % 6 === 0) {
        toast.info("End of over. Batsmen swapped positions.");
        setIsOverComplete(true);
        const temp = striker;
        setStriker(nonStriker);
        setNonStriker(temp);
      }
    } 
    else {
      const bowlerStats = bowler;
      
      if (extraType === 'wide') {
        bowlerStats.runs += 1;
        setTotalRuns(totalRuns + 1);
        setRecentBalls(prev => [...prev.slice(-11), 'WD']);
        toast.info("Wide ball: +1 run added");
      } 
      else if (extraType === 'noBall') {
        bowlerStats.runs += 1;
        setTotalRuns(totalRuns + 1);
        setRecentBalls(prev => [...prev.slice(-11), 'NB']);
        toast.info("No ball: +1 run added");
      } 
      else if (extraType === 'legBye' || extraType === 'overThrow') {
        if (extraType === 'overThrow') {
          strikerStats.runs += runs;
          setRecentBalls(prev => [...prev.slice(-11), 'OT']);
          toast.info(`Overthrow: ${runs} runs added`);
        } else {
          setRecentBalls(prev => [...prev.slice(-11), 'LB']);
          toast.info(`Leg bye: ${runs} runs added`);
        }
        
        strikerStats.balls += 1;
        bowlerStats.runs += runs;
        bowlerStats.balls += 1;
        
        setTotalRuns(totalRuns + runs);
        setTotalBalls(totalBalls + 1);
        
        if (runs % 2 === 1) {
          const temp = striker;
          setStriker(nonStriker);
          setNonStriker(temp);
        }
        
        if (bowlerStats.balls % 6 === 0) {
          toast.info("End of over. Batsmen swapped positions.");
          setIsOverComplete(true);
          const temp = striker;
          setStriker(nonStriker);
          setNonStriker(temp);
        }
      }
      
      setBatsmen([...batsmen]);
      
      updateBowlerInList(bowlerStats);
    }
  };

  const updateBowlerInList = (bowlerStats: BowlerStats) => {
    setBowler({ ...bowlerStats });
    setBowlersList(bowlersList.map(b => b.name === bowlerStats.name ? { ...bowlerStats } : b));
  };

  const handleWicket = (wicketType?: string) => {
    if (!striker || !bowler) {
      toast.error("Please select striker and bowler first");
      return;
    }

    setLastWicketType(wicketType || 'Out');
    
    setOutPlayers(prev => [...prev, striker]);

    const bowlerStats = bowler;
    bowlerStats.wickets += 1;
    bowlerStats.balls += 1;
    
    const strikerStats = batsmen.find(b => b.name === striker);
    if (strikerStats) {
      strikerStats.balls += 1;
      setBatsmen([...batsmen]);
    }
    
    setWickets(wickets + 1);
    setTotalBalls(totalBalls + 1);
    
    setRecentBalls(prev => [...prev.slice(-11), 'W']);
    
    updateBowlerInList(bowlerStats);
    
    if (bowlerStats.balls % 6 === 0) {
      setIsOverComplete(true);
      const temp = striker;
      setStriker(nonStriker);
      setNonStriker(temp);
    }
    
    toast.error(`${striker} is OUT! (${wicketType || 'Out'})`);
    setStriker(null);
    
    if (wickets >= 9) {
      toast.error("All out! Innings complete.", {
        duration: 5000,
      });
    }
  };

  const handleLogoUpload = (team: 'A' | 'B', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (team === 'A') {
        setTeamALogo(e.target?.result as string);
      } else {
        setTeamBLogo(e.target?.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTotalOversChange = (overs: number) => {
    if (overs > 0 && overs <= 50) {
      setTotalOvers(overs);
      toast.success(`Match format updated to ${overs} overs`);
    } else {
      toast.error("Please enter a valid number of overs (1-50)");
    }
  };

  const navigateToRecords = () => {
    return {
      batsmen,
      bowlersList,
      teamAName,
      teamBName,
      outPlayers,
      retiredHurtPlayers,
      gameTitle
    };
  };

  const target = isSecondInnings ? firstInningsScore + 1 : 0;
  const crr = totalBalls > 0 ? (totalRuns / (totalBalls / 6)).toFixed(2) : "0.00";
  const ballsLeft = totalOvers * 6 - totalBalls;
  const runsLeft = isSecondInnings ? target - totalRuns : 0;
  const rrr = ballsLeft > 0 && isSecondInnings ? (runsLeft / (ballsLeft / 6)).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen bg-secondary/50">
      <CricketAppHeader />
      
      <main className="container mx-auto py-6 px-4">
        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="setup">Team Setup</TabsTrigger>
            <TabsTrigger value="control">Match Control</TabsTrigger>
            <TabsTrigger value="scoreboard">Scoreboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup">
            <TeamSetup 
              teamA={teamA}
              teamB={teamB}
              playerName={playerName}
              setPlayerName={setPlayerName}
              activeTeam={activeTeam}
              setActiveTeam={setActiveTeam}
              handleAddPlayer={handleAddPlayer}
              teamAName={teamAName}
              setTeamAName={setTeamAName}
              teamBName={teamBName}
              setTeamBName={setTeamBName}
              teamALogo={teamALogo}
              teamBLogo={teamBLogo}
              handleLogoUpload={handleLogoUpload}
              totalOvers={totalOvers}
              handleTotalOversChange={handleTotalOversChange}
              gameTitle={gameTitle}
              setGameTitle={setGameTitle}
            />
          </TabsContent>
          
          <TabsContent value="control">
            <MatchControl 
              teamA={teamA}
              teamB={teamB}
              handleSelectBatsman={handleSelectBatsman}
              handleSelectBowler={handleSelectBowler}
              handleAddRun={handleAddRun}
              handleWicket={handleWicket}
              handleRetireHurt={handleRetireHurt}
              striker={striker}
              nonStriker={nonStriker}
              currentBowler={currentBowler}
              isOverComplete={isOverComplete}
              wickets={wickets}
              totalOvers={totalOvers}
              totalBalls={totalBalls}
              outPlayers={outPlayers}
              retiredHurtPlayers={retiredHurtPlayers}
            />
          </TabsContent>
          
          <TabsContent value="scoreboard">
            <Scoreboard 
              totalRuns={totalRuns}
              wickets={wickets}
              totalBalls={totalBalls}
              crr={crr}
              target={target}
              rrr={rrr}
              runsLeft={runsLeft}
              ballsLeft={ballsLeft}
              batsmen={batsmen}
              bowler={bowler}
              striker={striker}
              nonStriker={nonStriker}
              teamAName={teamAName}
              teamBName={teamBName}
              teamALogo={teamALogo}
              teamBLogo={teamBLogo}
              isSecondInnings={isSecondInnings}
              bowlersList={bowlersList}
              recentBalls={recentBalls}
              setTeamAName={setTeamAName}
              setTeamBName={setTeamBName}
              totalOvers={totalOvers}
              gameTitle={gameTitle}
              outPlayers={outPlayers}
              retiredHurtPlayers={retiredHurtPlayers}
              lastWicketType={lastWicketType}
            />
          </TabsContent>
        </Tabs>
      </main>
      <Toaster position="top-center" />
    </div>
  );
}
