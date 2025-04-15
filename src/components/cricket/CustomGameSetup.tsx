
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings, Clock, Target, UserCheck, Zap, PlusCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface BatsmanSetup {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isStriker?: boolean;
}

interface BowlerSetup {
  name: string;
  overs: number;
  balls: number;
  maidens: number;
  runs: number;
  wickets: number;
}

interface CustomGameSetupProps {
  teamA: string[];
  teamB: string[];
  applyCustomSetup: (data: CustomGameData) => void;
}

export interface CustomGameData {
  runs: number;
  wickets: number;
  overs: number;
  balls: number;
  batsmen: BatsmanSetup[];
  bowlers: BowlerSetup[];
  striker: string;
  nonStriker: string;
  currentBowler: string;
  outPlayers: string[];
}

export default function CustomGameSetup({ teamA, teamB, applyCustomSetup }: CustomGameSetupProps) {
  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [overs, setOvers] = useState(0);
  const [balls, setBalls] = useState(0);
  const [batsmen, setBatsmen] = useState<BatsmanSetup[]>([]);
  const [bowlers, setBowlers] = useState<BowlerSetup[]>([]);
  const [selectedBatsman, setSelectedBatsman] = useState("");
  const [selectedBowler, setSelectedBowler] = useState("");
  const [batsmanRuns, setBatsmanRuns] = useState(0);
  const [batsmanBalls, setBatsmanBalls] = useState(0);
  const [batsmanFours, setBatsmanFours] = useState(0);
  const [batsmanSixes, setBatsmanSixes] = useState(0);
  const [striker, setStriker] = useState("");
  const [nonStriker, setNonStriker] = useState("");
  const [currentBowler, setCurrentBowler] = useState("");
  const [bowlerOvers, setBowlerOvers] = useState(0);
  const [bowlerBalls, setBowlerBalls] = useState(0);
  const [bowlerMaidens, setBowlerMaidens] = useState(0);
  const [bowlerRuns, setBowlerRuns] = useState(0);
  const [bowlerWickets, setBowlerWickets] = useState(0);
  const [outPlayers, setOutPlayers] = useState<string[]>([]);
  
  const handleAddBatsman = () => {
    if (!selectedBatsman) {
      toast.error("Please select a batsman");
      return;
    }
    
    if (batsmen.some(b => b.name === selectedBatsman)) {
      toast.error("This batsman has already been added");
      return;
    }
    
    const newBatsman: BatsmanSetup = {
      name: selectedBatsman,
      runs: batsmanRuns,
      balls: batsmanBalls,
      fours: batsmanFours,
      sixes: batsmanSixes
    };
    
    setBatsmen([...batsmen, newBatsman]);
    setBatsmanRuns(0);
    setBatsmanBalls(0);
    setBatsmanFours(0);
    setBatsmanSixes(0);
    setSelectedBatsman("");
    toast.success(`${selectedBatsman}'s stats added`);
  };
  
  const handleAddBowler = () => {
    if (!selectedBowler) {
      toast.error("Please select a bowler");
      return;
    }
    
    if (bowlers.some(b => b.name === selectedBowler)) {
      toast.error("This bowler has already been added");
      return;
    }
    
    const newBowler: BowlerSetup = {
      name: selectedBowler,
      overs: bowlerOvers,
      balls: bowlerBalls,
      maidens: bowlerMaidens,
      runs: bowlerRuns,
      wickets: bowlerWickets
    };
    
    setBowlers([...bowlers, newBowler]);
    setBowlerOvers(0);
    setBowlerBalls(0);
    setBowlerMaidens(0);
    setBowlerRuns(0);
    setBowlerWickets(0);
    setSelectedBowler("");
    toast.success(`${selectedBowler}'s stats added`);
  };
  
  const handleRemoveBatsman = (name: string) => {
    setBatsmen(batsmen.filter(b => b.name !== name));
    if (striker === name) setStriker("");
    if (nonStriker === name) setNonStriker("");
    toast.info(`${name} removed from batsmen list`);
  };
  
  const handleRemoveBowler = (name: string) => {
    setBowlers(bowlers.filter(b => b.name !== name));
    if (currentBowler === name) setCurrentBowler("");
    toast.info(`${name} removed from bowlers list`);
  };
  
  const handleApplySetup = () => {
    if (!striker || !nonStriker) {
      toast.error("Please select both striker and non-striker");
      return;
    }
    
    if (!currentBowler) {
      toast.error("Please select current bowler");
      return;
    }
    
    // Validate total runs match batsman totals
    const totalBatsmanRuns = batsmen.reduce((sum, b) => sum + b.runs, 0);
    if (totalBatsmanRuns !== runs) {
      toast.error(`Total runs (${runs}) doesn't match sum of batsmen runs (${totalBatsmanRuns})`);
      return;
    }
    
    const customData: CustomGameData = {
      runs,
      wickets,
      overs,
      balls,
      batsmen,
      bowlers,
      striker,
      nonStriker,
      currentBowler,
      outPlayers
    };
    
    applyCustomSetup(customData);
    toast.success("Custom game setup applied successfully");
  };
  
  const handleMarkAsOut = (name: string) => {
    if (outPlayers.includes(name)) {
      setOutPlayers(outPlayers.filter(p => p !== name));
      toast.info(`${name} marked as not out`);
    } else {
      setOutPlayers([...outPlayers, name]);
      if (striker === name) setStriker("");
      if (nonStriker === name) setNonStriker("");
      toast.info(`${name} marked as out`);
    }
  };
  
  return (
    <Card className="shadow-lg border-2 border-primary/20">
      <CardHeader className="bg-primary/10">
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Custom Game Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="total-runs">Total Runs</Label>
            <div className="flex items-center">
              <Target className="w-4 h-4 mr-2 text-primary" />
              <Input
                id="total-runs"
                type="number"
                min="0"
                value={runs}
                onChange={(e) => setRuns(parseInt(e.target.value) || 0)}
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="wickets">Wickets</Label>
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-2 text-primary" />
              <Input
                id="wickets"
                type="number"
                min="0"
                max="10"
                value={wickets}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setWickets(val > 10 ? 10 : val);
                }}
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="overs">Completed Overs</Label>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-primary" />
              <Input
                id="overs"
                type="number"
                min="0"
                value={overs}
                onChange={(e) => setOvers(parseInt(e.target.value) || 0)}
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="balls">Extra Balls</Label>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-primary" />
              <Input
                id="balls"
                type="number"
                min="0"
                max="5"
                value={balls}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setBalls(val > 5 ? 5 : val);
                }}
                className="flex-1"
              />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="bg-blue-100 pb-2">
              <CardTitle className="text-lg flex items-center">
                <UserCheck className="h-5 w-5 mr-2 text-blue-700" />
                <span className="text-blue-700">Batsmen Setup</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Select Batsman</Label>
                    <Select value={selectedBatsman} onValueChange={setSelectedBatsman}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select batsman" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamA.map((player, i) => (
                          <SelectItem key={i} value={player}>
                            {player}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Runs</Label>
                      <Input
                        type="number"
                        min="0"
                        value={batsmanRuns}
                        onChange={(e) => setBatsmanRuns(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Balls</Label>
                      <Input
                        type="number"
                        min="0"
                        value={batsmanBalls}
                        onChange={(e) => setBatsmanBalls(parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">4s</Label>
                      <Input
                        type="number"
                        min="0"
                        value={batsmanFours}
                        onChange={(e) => setBatsmanFours(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">6s</Label>
                      <Input
                        type="number"
                        min="0"
                        value={batsmanSixes}
                        onChange={(e) => setBatsmanSixes(parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={handleAddBatsman} className="bg-blue-600 hover:bg-blue-700">
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Batsman
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <h4 className="font-medium text-sm">Added Batsmen</h4>
                  {batsmen.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">No batsmen added yet</p>
                  ) : (
                    <div className="space-y-2">
                      {batsmen.map((b, i) => (
                        <div key={i} className="flex items-center justify-between gap-2 p-2 border rounded-md bg-blue-50">
                          <div className="flex-1">
                            <div className="font-medium">{b.name}</div>
                            <div className="text-sm text-blue-700">
                              {b.runs}({b.balls}) | 4s: {b.fours} | 6s: {b.sixes}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant={striker === b.name ? "default" : "outline"}
                              onClick={() => setStriker(b.name)}
                              className="text-xs"
                              disabled={outPlayers.includes(b.name)}
                            >
                              Striker
                            </Button>
                            <Button 
                              size="sm" 
                              variant={nonStriker === b.name ? "default" : "outline"}
                              onClick={() => setNonStriker(b.name)}
                              className="text-xs"
                              disabled={outPlayers.includes(b.name)}
                            >
                              Non-Striker
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className={outPlayers.includes(b.name) ? "bg-red-100 text-red-700" : ""}
                              onClick={() => handleMarkAsOut(b.name)}
                            >
                              {outPlayers.includes(b.name) ? "Out" : "Not Out"}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleRemoveBatsman(b.name)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-green-100 pb-2">
              <CardTitle className="text-lg flex items-center">
                <Zap className="h-5 w-5 mr-2 text-green-700" />
                <span className="text-green-700">Bowlers Setup</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Select Bowler</Label>
                    <Select value={selectedBowler} onValueChange={setSelectedBowler}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bowler" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamB.map((player, i) => (
                          <SelectItem key={i} value={player}>
                            {player}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Overs</Label>
                      <Input
                        type="number"
                        min="0"
                        value={bowlerOvers}
                        onChange={(e) => setBowlerOvers(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Balls</Label>
                      <Input
                        type="number"
                        min="0"
                        max="5"
                        value={bowlerBalls}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setBowlerBalls(val > 5 ? 5 : val);
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Maidens</Label>
                    <Input
                      type="number"
                      min="0"
                      value={bowlerMaidens}
                      onChange={(e) => setBowlerMaidens(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Runs</Label>
                    <Input
                      type="number"
                      min="0"
                      value={bowlerRuns}
                      onChange={(e) => setBowlerRuns(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Wickets</Label>
                    <Input
                      type="number"
                      min="0"
                      value={bowlerWickets}
                      onChange={(e) => setBowlerWickets(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <Button onClick={handleAddBowler} className="w-full bg-green-600 hover:bg-green-700">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Bowler
                </Button>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <h4 className="font-medium text-sm">Added Bowlers</h4>
                  {bowlers.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">No bowlers added yet</p>
                  ) : (
                    <div className="space-y-2">
                      {bowlers.map((b, i) => (
                        <div key={i} className="flex items-center justify-between gap-2 p-2 border rounded-md bg-green-50">
                          <div className="flex-1">
                            <div className="font-medium">{b.name}</div>
                            <div className="text-sm text-green-700">
                              {b.overs}.{b.balls} overs | {b.wickets}/{b.runs} | M: {b.maidens}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant={currentBowler === b.name ? "default" : "outline"}
                              onClick={() => setCurrentBowler(b.name)}
                              className="text-xs"
                            >
                              Current
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleRemoveBowler(b.name)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Button
          onClick={handleApplySetup}
          className="w-full bg-primary hover:bg-primary/90 text-lg font-bold py-6"
        >
          Apply Custom Game Setup
        </Button>
      </CardContent>
    </Card>
  );
}
