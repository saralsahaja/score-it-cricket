
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
  const [bowlersList, setBowlersList] = useState<BowlerStats[]>([]);
  const [striker, setStriker] = useState<string | null>(null);
  const [nonStriker, setNonStriker] = useState<string | null>(null);
  const [currentBowler, setCurrentBowler] = useState<string | null>(null);
  const [isOverComplete, setIsOverComplete] = useState(false);

  const [totalRuns, setTotalRuns] = useState(0);
  const [totalBalls, setTotalBalls] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [firstInningsScore, setFirstInningsScore] = useState(0);
  const [isSecondInnings, setIsSecondInnings] = useState(false);
  
  // Automatically start second innings when 10 wickets fall or 20 overs completed in first innings
  useEffect(() => {
    if (!isSecondInnings && (wickets >= 10 || totalBalls >= 120)) {
      if (totalBalls > 0) { // Only if a match has started
        toast.info("First innings complete! Starting second innings.", {
          duration: 5000,
        });
        setFirstInningsScore(totalRuns);
        setIsSecondInnings(true);
        resetInnings();
      }
    }
  }, [wickets, totalBalls, isSecondInnings]);

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
    
    // Check if this bowler has bowled before
    const existingBowler = bowlersList.find(b => b.name === player);
    
    if (existingBowler) {
      // Use existing stats
      setBowler(existingBowler);
    } else {
      // Add new bowler to the list
      setBowler(newBowler);
      setBowlersList([...bowlersList, newBowler]);
    }
    
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
    
    if (!extraType) {
      // Normal runs
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
      
      // Update bowler in the bowlers list
      updateBowlerInList(bowlerStats);
      
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
    else {
      let runsToAdd = runs;
      const bowlerStats = bowler;
      
      if (extraType === 'wide' || extraType === 'noBall') {
        // Wide and No Ball both add 1 extra run
        runsToAdd = runs + 1;
        bowlerStats.runs += runsToAdd;
        
        if (extraType === 'noBall') {
          // No ball counts to batsman's score if they hit it
          strikerStats.runs += runs;
          strikerStats.balls += 1;
          
          if (runs === 4) {
            strikerStats.fours += 1;
          } else if (runs === 6) {
            strikerStats.sixes += 1;
          }
        }
      } 
      else if (extraType === 'legBye' || extraType === 'overThrow') {
        // Leg byes don't count to batsman's runs but count for the team
        // Overthrows do count to the team and are attributed to the batsman
        if (extraType === 'overThrow') {
          strikerStats.runs += runsToAdd;
        }
        
        strikerStats.balls += 1;
        bowlerStats.runs += runsToAdd;
        bowlerStats.balls += 1;
      }
      
      setBatsmen([...batsmen]);
      
      // Update bowler in the bowlers list
      updateBowlerInList(bowlerStats);
      
      setTotalRuns(totalRuns + runsToAdd);
      
      if (extraType !== 'wide' && extraType !== 'noBall') {
        setTotalBalls(totalBalls + 1);
        
        if (bowlerStats.balls % 6 === 0) {
          toast.info("End of over. Batsmen swapped positions.");
          setIsOverComplete(true);
          const temp = striker;
          setStriker(nonStriker);
          setNonStriker(temp);
        }
      }
      
      if ((extraType !== 'wide' && runs % 2 === 1) || (extraType === 'legBye' && runs % 2 === 1)) {
        const temp = striker;
        setStriker(nonStriker);
        setNonStriker(temp);
      }
    }
  };

  const updateBowlerInList = (bowlerStats: BowlerStats) => {
    setBowler({ ...bowlerStats });
    setBowlersList(bowlersList.map(b => b.name === bowlerStats.name ? { ...bowlerStats } : b));
  };

  const handleWicket = () => {
    if (!striker || !bowler) {
      toast.error("Please select striker and bowler first");
      return;
    }

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
    
    // Update bowler in the bowlers list
    updateBowlerInList(bowlerStats);
    
    if (bowlerStats.balls % 6 === 0) {
      setIsOverComplete(true);
      const temp = striker;
      setStriker(nonStriker);
      setNonStriker(temp);
    }
    
    toast.error(`${striker} is OUT!`);
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

  // Calculate target and required stats
  const target = isSecondInnings ? firstInningsScore + 1 : 0;
  const crr = totalBalls > 0 ? (totalRuns / (totalBalls / 6)).toFixed(2) : "0.00";
  const ballsLeft = 120 - totalBalls;
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
              wickets={wickets}
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
            />
          </TabsContent>
        </Tabs>
      </main>
      <Toaster position="top-center" />
    </div>
  );
}
