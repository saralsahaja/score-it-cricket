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
import CustomGameSetup, { CustomGameData } from "@/components/cricket/CustomGameSetup";
import { useNavigate, useLocation } from "react-router-dom";
import AdminLogin from "@/components/cricket/AdminLogin";
import TossForm from "@/components/cricket/TossForm";

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

export interface TossInfo {
  winner: string;
  decision: "bat" | "bowl";
}

export default function Index() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  
  // Team Management
  const [teamA, setTeamA] = useState<string[]>([]);
  const [teamB, setTeamB] = useState<string[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [activeTeam, setActiveTeam] = useState("A");
  const [teamAName, setTeamAName] = useState("Team A");
  const [teamBName, setTeamBName] = useState("Team B");
  const [teamALogo, setTeamALogo] = useState<string | null>(null);
  const [teamBLogo, setTeamBLogo] = useState<string | null>(null);
  
  // Match Settings
  const [totalOvers, setTotalOvers] = useState(20);
  const [gameTitle, setGameTitle] = useState("Live Scoreboard");
  const [tossInfo, setTossInfo] = useState<TossInfo | null>(null);
  
  // Match Stats
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
  
  // Score Tracking
  const [totalRuns, setTotalRuns] = useState(0);
  const [totalBalls, setTotalBalls] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [firstInningsScore, setFirstInningsScore] = useState(0);
  const [isSecondInnings, setIsSecondInnings] = useState(false);
  const [recentBalls, setRecentBalls] = useState<string[]>([]);
  
  // UI State
  const [activeTab, setActiveTab] = useState("setup");
  
  // Store first innings team info to swap roles
  const [firstInningsBattingTeam, setFirstInningsBattingTeam] = useState<string | null>(null);
  
  // Store game state in sessionStorage to preserve it when navigating
  useEffect(() => {
    // Check if we have stored game state in sessionStorage
    const storedGameState = sessionStorage.getItem('cricketGameState');
    if (storedGameState) {
      try {
        const parsedState = JSON.parse(storedGameState);
        
        // Restore all game state
        setTeamA(parsedState.teamA || []);
        setTeamB(parsedState.teamB || []);
        setActiveTeam(parsedState.activeTeam || "A");
        setTeamAName(parsedState.teamAName || "Team A");
        setTeamBName(parsedState.teamBName || "Team B");
        setTeamALogo(parsedState.teamALogo || null);
        setTeamBLogo(parsedState.teamBLogo || null);
        
        setTotalOvers(parsedState.totalOvers || 20);
        setGameTitle(parsedState.gameTitle || "Live Scoreboard");
        setTossInfo(parsedState.tossInfo || null);
        
        setBatsmen(parsedState.batsmen || []);
        setBowler(parsedState.bowler || null);
        setBowlersList(parsedState.bowlersList || []);
        setStriker(parsedState.striker || null);
        setNonStriker(parsedState.nonStriker || null);
        setCurrentBowler(parsedState.currentBowler || null);
        setIsOverComplete(parsedState.isOverComplete || false);
        setOutPlayers(parsedState.outPlayers || []);
        setRetiredHurtPlayers(parsedState.retiredHurtPlayers || []);
        setLastWicketType(parsedState.lastWicketType || "");
        
        setTotalRuns(parsedState.totalRuns || 0);
        setTotalBalls(parsedState.totalBalls || 0);
        setWickets(parsedState.wickets || 0);
        setFirstInningsScore(parsedState.firstInningsScore || 0);
        setIsSecondInnings(parsedState.isSecondInnings || false);
        setRecentBalls(parsedState.recentBalls || []);
        setFirstInningsBattingTeam(parsedState.firstInningsBattingTeam || null);
        
        // Don't restore activeTab - leave it at default or admin status
      } catch (error) {
        console.error("Error parsing stored game state:", error);
      }
    }
  }, []);

  // Check if user is admin on load
  useEffect(() => {
    // Check if user has admin privileges from localStorage
    const adminStatus = localStorage.getItem('cricketAdminStatus');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    } else {
      // If not admin, force to scoreboard view
      setActiveTab("scoreboard");
    }
  }, []);

  // Save game state whenever relevant state changes
  useEffect(() => {
    const gameState = {
      teamA, teamB, activeTeam, teamAName, teamBName, teamALogo, teamBLogo,
      totalOvers, gameTitle, tossInfo,
      batsmen, bowler, bowlersList, striker, nonStriker, currentBowler,
      isOverComplete, outPlayers, retiredHurtPlayers, lastWicketType,
      totalRuns, totalBalls, wickets, firstInningsScore, isSecondInnings, 
      recentBalls, firstInningsBattingTeam
    };
    
    sessionStorage.setItem('cricketGameState', JSON.stringify(gameState));
  }, [
    teamA, teamB, activeTeam, teamAName, teamBName, teamALogo, teamBLogo,
    totalOvers, gameTitle, tossInfo,
    batsmen, bowler, bowlersList, striker, nonStriker, currentBowler,
    isOverComplete, outPlayers, retiredHurtPlayers, lastWicketType,
    totalRuns, totalBalls, wickets, firstInningsScore, isSecondInnings, 
    recentBalls, firstInningsBattingTeam
  ]);

  useEffect(() => {
    const maxBalls = totalOvers * 6;
    
    if (!isSecondInnings && (wickets >= 10 || totalBalls >= maxBalls)) {
      if (totalBalls > 0) {
        toast.info("First innings complete! Starting second innings.", {
          duration: 5000,
        });
        
        // Store first innings batting team
        if (tossInfo) {
          const firstInningsBattingTeamName = tossInfo.decision === "bat" ? tossInfo.winner : 
            (tossInfo.winner === teamAName ? teamBName : teamAName);
          setFirstInningsBattingTeam(firstInningsBattingTeamName);
        }
        
        setFirstInningsScore(totalRuns);
        setIsSecondInnings(true);
        
        // Swap batsmen and bowlers lists before resetting
        const firstInningsBatsmen = [...batsmen];
        const firstInningsBowlers = [...bowlersList];
        
        resetInnings();
        
        // Convert first innings bowlers to be the new batsmen (empty stats but keep names)
        const newBatsmen = firstInningsBowlers.map(bowler => ({
          name: bowler.name,
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0
        }));
        
        // Convert first innings batsmen to be the new bowlers (empty stats but keep names)
        const newBowlers = firstInningsBatsmen.map(batsman => ({
          name: batsman.name,
          runs: 0,
          balls: 0,
          wickets: 0,
          maidens: 0
        }));
        
        setBatsmen(newBatsmen);
        setBowlersList(newBowlers);
        
        setRecentBalls([]);
      }
    }
  }, [wickets, totalBalls, isSecondInnings, totalOvers, tossInfo, teamAName, teamBName]);

  const resetInnings = () => {
    setTotalRuns(0);
    setTotalBalls(0);
    setWickets(0);
    setBowler(null);
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

  const handleLogin = (credentials: { username: string, password: string }) => {
    // In a real app, this would validate against a server
    if (credentials.username === "admin" && credentials.password === "admin123") {
      setIsAdmin(true);
      localStorage.setItem('cricketAdminStatus', 'true');
      setShowLogin(false);
      toast.success("Admin login successful");
    } else {
      toast.error("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('cricketAdminStatus');
    setActiveTab("scoreboard");
    toast.info("Admin logged out");
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
    // Block run updates when conditions aren't met
    if (isOverComplete && !currentBowler) {
      toast.error("Please select a bowler before adding runs");
      return;
    }
    
    if (!striker || !nonStriker) {
      toast.error("Please select both batsmen before adding runs");
      return;
    }
    
    if (!bowler) {
      toast.error("Please select a bowler first");
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
      setRecentBalls(prev => [...prev, ballNotation]);

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
        setRecentBalls(prev => [...prev, 'WD']);
        toast.info("Wide ball: +1 run added");
      } 
      else if (extraType === 'noBall') {
        bowlerStats.runs += 1;
        setTotalRuns(totalRuns + 1);
        setRecentBalls(prev => [...prev, 'NB']);
        toast.info("No ball: +1 run added");
      } 
      else if (extraType === 'legBye' || extraType === 'overThrow') {
        if (extraType === 'overThrow') {
          strikerStats.runs += runs;
          setRecentBalls(prev => [...prev, 'OT']);
          toast.info(`Overthrow: ${runs} runs added`);
        } else {
          setRecentBalls(prev => [...prev, 'LB']);
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
    // Block wicket updates when conditions aren't met
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
    
    setRecentBalls(prev => [...prev, 'W']);
    
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
  
  const handleTossSubmit = (info: TossInfo) => {
    setTossInfo(info);
    toast.success(`${info.winner} won the toss and elected to ${info.decision} first`);
  };

  const handleApplyCustomSetup = (data: CustomGameData) => {
    const totalBallsCount = (data.overs * 6) + data.balls;
    
    setTotalRuns(data.runs);
    setWickets(data.wickets);
    setTotalBalls(totalBallsCount);
    
    setBatsmen(data.batsmen.map(b => ({
      name: b.name,
      runs: b.runs,
      balls: b.balls,
      fours: b.fours,
      sixes: b.sixes
    })));
    
    setStriker(data.striker);
    setNonStriker(data.nonStriker);
    
    const formattedBowlers = data.bowlers.map(b => ({
      name: b.name,
      runs: b.runs,
      balls: (b.overs * 6) + b.balls,
      wickets: b.wickets,
      maidens: b.maidens
    }));
    
    setBowlersList(formattedBowlers);
    
    const currentBowlerData = formattedBowlers.find(b => b.name === data.currentBowler);
    if (currentBowlerData) {
      setBowler(currentBowlerData);
      setCurrentBowler(data.currentBowler);
    }
    
    setOutPlayers(data.outPlayers);
    
    setActiveTab("control");
    
    toast.success("Custom game setup applied. Game state has been updated.");
  };

  // Determine batting team based on innings and toss
  const getBattingTeam = () => {
    if (!tossInfo) return teamAName;
    if (!isSecondInnings) {
      return tossInfo.decision === "bat" ? tossInfo.winner : (tossInfo.winner === teamAName ? teamBName : teamAName);
    } else {
      // In second innings, batting team is the opposite of first innings
      return firstInningsBattingTeam === teamAName ? teamBName : teamAName;
    }
  };

  const battingTeam = getBattingTeam();
  const bowlingTeam = battingTeam === teamAName ? teamBName : teamAName;

  const target = isSecondInnings ? firstInningsScore + 1 : 0;
  const crr = totalBalls > 0 ? (totalRuns / (totalBalls / 6)).toFixed(2) : "0.00";
  const ballsLeft = totalOvers * 6 - totalBalls;
  const runsLeft = isSecondInnings ? target - totalRuns : 0;
  const rrr = ballsLeft > 0 && isSecondInnings ? (runsLeft / (ballsLeft / 6)).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen bg-secondary/50">
      <CricketAppHeader />
      
      <main className="container mx-auto py-6 px-4">
        {/* Admin Login Button - Always visible in top right */}
        <div className="flex justify-end mb-4">
          {isAdmin ? (
            <Button variant="outline" onClick={handleLogout}>
              Admin Logout
            </Button>
          ) : (
            <Button onClick={() => setShowLogin(true)}>
              Admin Login
            </Button>
          )}
        </div>
        
        {isAdmin ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="setup">Team Setup</TabsTrigger>
              <TabsTrigger value="customSetup">Custom Start</TabsTrigger>
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
              
              {/* Toss Form - Added to Team Setup */}
              <Card className="mt-6 shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Toss Information</h3>
                  <TossForm 
                    teamAName={teamAName} 
                    teamBName={teamBName} 
                    onSubmit={handleTossSubmit}
                    currentToss={tossInfo}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="customSetup">
              <CustomGameSetup 
                teamA={teamA}
                teamB={teamB}
                applyCustomSetup={handleApplyCustomSetup}
              />
            </TabsContent>
            
            <TabsContent value="control">
              <MatchControl 
                teamA={isSecondInnings ? 
                  (battingTeam === teamAName ? teamA : teamB) : 
                  teamA}
                teamB={isSecondInnings ? 
                  (battingTeam === teamBName ? teamB : teamA) : 
                  teamB}
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
                tossWinner={tossInfo?.winner}
                tossDecision={tossInfo?.decision}
              />
            </TabsContent>
          </Tabs>
        ) : (
          // Public user view - Only scoreboard
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
            tossWinner={tossInfo?.winner}
            tossDecision={tossInfo?.decision}
          />
        )}
      </main>
      
      {/* Admin Login Modal */}
      <AdminLogin 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        onLogin={handleLogin} 
      />
      
      <Toaster position="top-center" />
    </div>
  );
}
