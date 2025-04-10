
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

  const [batsmen, setBatsmen] = useState<BatsmanStats[]>([]);
  const [bowler, setBowler] = useState<BowlerStats | null>(null);
  const [striker, setStriker] = useState<string | null>(null);
  const [nonStriker, setNonStriker] = useState<string | null>(null);
  const [currentBowler, setCurrentBowler] = useState<string | null>(null);
  const [isOverComplete, setIsOverComplete] = useState(false);

  const [totalRuns, setTotalRuns] = useState(0);
  const [totalBalls, setTotalBalls] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [target, setTarget] = useState(150);

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
    
    if (bowler) {
      const prev = bowler;
      setBatsmen(b => b.map(x => x.name === prev.name ? prev : x));
    }
    
    setBowler({ name: player, runs: 0, balls: 0, wickets: 0, maidens: 0 });
    setCurrentBowler(player);
    setIsOverComplete(false);
    toast.success(`${player} is now bowling`);
  };

  const handleAddRun = (runs: number, extraType?: string) => {
    if (!striker || !bowler) {
      toast.error("Please select striker and bowler first");
      return;
    }

    const strikerStats = batsmen.find(b => b.name === striker);
    if (!strikerStats) return;
    
    // Handle regular runs
    if (!extraType) {
      strikerStats.runs += runs;
      strikerStats.balls += 1;
      
      // Count boundaries
      if (runs === 4) {
        strikerStats.fours += 1;
      } else if (runs === 6) {
        strikerStats.sixes += 1;
      }

      const bowlerStats = bowler;
      bowlerStats.runs += runs;
      bowlerStats.balls += 1;

      setBatsmen([...batsmen]);
      setBowler({ ...bowlerStats });
      setTotalRuns(totalRuns + runs);
      setTotalBalls(totalBalls + 1);

      // Swap striker if odd runs
      if (runs % 2 === 1) {
        const temp = striker;
        setStriker(nonStriker);
        setNonStriker(temp);
      }

      // Check for end of over (6 legal deliveries)
      if (bowlerStats.balls % 6 === 0) {
        toast.info("End of over. Batsmen swapped positions.");
        setIsOverComplete(true);
        const temp = striker;
        setStriker(nonStriker);
        setNonStriker(temp);
      }
    } 
    // Handle extras
    else {
      let runsToAdd = runs;
      const bowlerStats = bowler;
      
      if (extraType === 'wide' || extraType === 'noBall') {
        runsToAdd = runs + 1; // Extra 1 run for wide/no-ball
        bowlerStats.runs += runsToAdd;
        
        // No ball counts as a ball faced by batsman, but not in bowler's over count
        if (extraType === 'noBall') {
          strikerStats.runs += runs;
          strikerStats.balls += 1;
          
          if (runs === 4) {
            strikerStats.fours += 1;
          } else if (runs === 6) {
            strikerStats.sixes += 1;
          }
        }
      } else if (extraType === 'overThrow') {
        strikerStats.runs += runsToAdd;
        strikerStats.balls += 1;
        bowlerStats.runs += runsToAdd;
        bowlerStats.balls += 1;
      }
      
      setBatsmen([...batsmen]);
      setBowler({ ...bowlerStats });
      setTotalRuns(totalRuns + runsToAdd);
      
      // Only increment totalBalls for balls that count toward the over
      if (extraType !== 'wide' && extraType !== 'noBall') {
        setTotalBalls(totalBalls + 1);
        
        // Check for end of over
        if (bowlerStats.balls % 6 === 0) {
          toast.info("End of over. Batsmen swapped positions.");
          setIsOverComplete(true);
          const temp = striker;
          setStriker(nonStriker);
          setNonStriker(temp);
        }
      }
      
      // Swap striker for odd runs (except wides)
      if (extraType !== 'wide' && runs % 2 === 1) {
        const temp = striker;
        setStriker(nonStriker);
        setNonStriker(temp);
      }
    }
  };

  const handleWicket = () => {
    if (!striker || !bowler) {
      toast.error("Please select striker and bowler first");
      return;
    }

    const bowlerStats = bowler;
    bowlerStats.wickets += 1;
    bowlerStats.balls += 1;
    
    // Update the batsman's stats
    const strikerStats = batsmen.find(b => b.name === striker);
    if (strikerStats) {
      strikerStats.balls += 1;
      setBatsmen([...batsmen]);
    }
    
    setWickets(wickets + 1);
    setTotalBalls(totalBalls + 1);
    setBowler({ ...bowlerStats });
    
    // Check for end of over
    if (bowlerStats.balls % 6 === 0) {
      setIsOverComplete(true);
      const temp = striker;
      setStriker(nonStriker);
      setNonStriker(temp);
    }
    
    toast.error(`${striker} is OUT!`);
    setStriker(null);
  };

  // Handler for logo uploads
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

  const crr = totalBalls > 0 ? (totalRuns / (totalBalls / 6)).toFixed(2) : "0.00";
  const ballsLeft = 120 - totalBalls;
  const runsLeft = target - totalRuns;
  const rrr = ballsLeft > 0 ? (runsLeft / (ballsLeft / 6)).toFixed(2) : "0.00";

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
              striker={striker}
              nonStriker={nonStriker}
              currentBowler={currentBowler}
              isOverComplete={isOverComplete}
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
            />
          </TabsContent>
        </Tabs>
      </main>
      <Toaster position="top-center" />
    </div>
  );
}
