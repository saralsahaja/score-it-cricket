
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, UserCheck, Target, Trophy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MatchControlProps {
  teamA: string[];
  teamB: string[];
  handleSelectBatsman: (player: string, isStriker: boolean) => void;
  handleSelectBowler: (player: string) => void;
  handleAddRun: (runs: number, extraType?: string) => void;
  handleWicket: (wicketType?: string) => void;
  handleRetireHurt: (player: string) => void;
  striker: string | null;
  nonStriker: string | null;
  currentBowler: string | null;
  isOverComplete: boolean;
  wickets: number;
  totalOvers: number;
  totalBalls: number;
  outPlayers: string[];
  retiredHurtPlayers: string[];
  isRunEntryAllowed: () => boolean;  // New prop
}

export default function MatchControl({
  teamA,
  teamB,
  handleSelectBatsman,
  handleSelectBowler,
  handleAddRun,
  handleWicket,
  handleRetireHurt,
  striker,
  nonStriker,
  currentBowler,
  isOverComplete,
  wickets,
  totalOvers,
  totalBalls,
  outPlayers,
  retiredHurtPlayers,
  isRunEntryAllowed
}: MatchControlProps) {
  const [wicketType, setWicketType] = useState("bowled");
  const [extraType, setExtraType] = useState<string | null>(null);
  
  // Calculate current over
  const currentOver = Math.floor(totalBalls / 6) + 1;
  const ballsInCurrentOver = totalBalls % 6;
  
  // Check if match is complete (all overs bowled or 10 wickets fallen)
  const isMatchComplete = wickets >= 10 || totalBalls >= totalOvers * 6;

  // Constants for validation
  const isRunEntryDisabled = !isRunEntryAllowed() || isMatchComplete;
  const isWicketDisabled = !striker || !currentBowler || isMatchComplete || isOverComplete;
  
  // Function to check if a player is unavailable (out or retired hurt)
  const isPlayerUnavailable = (player: string) => {
    return outPlayers.includes(player) || retiredHurtPlayers.includes(player);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <UserCheck className="h-6 w-6 text-blue-500" />
              Batting Controls
            </h3>
            
            <div className="space-y-6">
              {/* Striker Selection */}
              <div className="space-y-2">
                <Label htmlFor="striker">Striker</Label>
                <div className="flex gap-2">
                  <Select 
                    value={striker || ""} 
                    onValueChange={(value) => handleSelectBatsman(value, true)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select striker" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamA
                        .filter(player => !isPlayerUnavailable(player) && player !== nonStriker)
                        .map((player) => (
                          <SelectItem key={player} value={player}>
                            {player}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                {striker && (
                  <Badge className="bg-blue-500">Striker: {striker}</Badge>
                )}
              </div>
              
              {/* Non-Striker Selection */}
              <div className="space-y-2">
                <Label htmlFor="non-striker">Non-Striker</Label>
                <div className="flex gap-2">
                  <Select 
                    value={nonStriker || ""} 
                    onValueChange={(value) => handleSelectBatsman(value, false)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select non-striker" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamA
                        .filter(player => !isPlayerUnavailable(player) && player !== striker)
                        .map((player) => (
                          <SelectItem key={player} value={player}>
                            {player}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                {nonStriker && (
                  <Badge className="bg-green-500">Non-Striker: {nonStriker}</Badge>
                )}
              </div>
              
              {/* Retired Hurt */}
              <div className="space-y-2">
                <Label htmlFor="retired-hurt">Retired Hurt</Label>
                <div className="flex gap-2">
                  <Select 
                    onValueChange={(value) => {
                      handleRetireHurt(value);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select player to retire hurt" />
                    </SelectTrigger>
                    <SelectContent>
                      {striker && (
                        <SelectItem key={striker} value={striker}>
                          {striker} (Striker)
                        </SelectItem>
                      )}
                      {nonStriker && (
                        <SelectItem key={nonStriker} value={nonStriker}>
                          {nonStriker} (Non-Striker)
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target className="h-6 w-6 text-purple-500" />
              Bowling Controls
            </h3>
            
            <div className="space-y-6">
              {/* Bowler Selection */}
              <div className="space-y-2">
                <Label htmlFor="bowler">Current Bowler</Label>
                <div className="flex gap-2">
                  <Select 
                    value={currentBowler || ""} 
                    onValueChange={(value) => handleSelectBowler(value)}
                    disabled={!isOverComplete && currentBowler !== null}
                  >
                    <SelectTrigger className={`w-full ${!isOverComplete && currentBowler ? 'opacity-50' : ''}`}>
                      <SelectValue placeholder="Select bowler" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamB.map((player) => (
                        <SelectItem key={player} value={player}>
                          {player}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {!isOverComplete && currentBowler ? (
                  <div className="text-sm text-amber-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    Complete over before changing bowler
                  </div>
                ) : isOverComplete && (
                  <div className="text-sm text-green-600 mt-1 flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    Over complete - select new bowler
                  </div>
                )}
                {currentBowler && (
                  <Badge className="bg-purple-500">Bowler: {currentBowler}</Badge>
                )}
              </div>
              
              {/* Current Over Status */}
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Current Status</h4>
                <div className="flex justify-between">
                  <span className="text-sm">Over: {currentOver}</span>
                  <span className="text-sm">Balls: {ballsInCurrentOver}/6</span>
                  <span className="text-sm">Wickets: {wickets}/10</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Scoring Controls
          </h3>
          
          <Tabs defaultValue="runs" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="runs">Runs</TabsTrigger>
              <TabsTrigger value="extras">Extras</TabsTrigger>
              <TabsTrigger value="wicket">Wicket</TabsTrigger>
            </TabsList>
            
            <TabsContent value="runs" className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((run) => (
                  <Button 
                    key={run} 
                    variant={run === 4 ? "outline" : run === 6 ? "outline" : "secondary"}
                    className={`h-16 text-xl font-bold ${
                      run === 4 ? 'border-blue-500 border-2 hover:bg-blue-500 hover:text-white' : 
                      run === 6 ? 'border-purple-500 border-2 hover:bg-purple-500 hover:text-white' : ''
                    }`}
                    onClick={() => handleAddRun(run)}
                    disabled={isRunEntryDisabled}
                  >
                    {run}
                  </Button>
                ))}
              </div>
              
              {isRunEntryDisabled && (
                <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-md mt-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm text-amber-800 dark:text-amber-200">
                    {!striker || !nonStriker
                      ? "Select both batsmen to enable scoring"
                      : !currentBowler
                      ? "Select a bowler to enable scoring"
                      : isOverComplete
                      ? "Over complete - select new bowler"
                      : isMatchComplete
                      ? "Match is complete"
                      : "Cannot add runs at this time"}
                  </span>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="extras" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Extra Type</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline" 
                      className={extraType === 'wide' ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500' : ''}
                      onClick={() => setExtraType('wide')}
                      disabled={isRunEntryDisabled}
                    >
                      Wide
                    </Button>
                    <Button
                      variant="outline"
                      className={extraType === 'noBall' ? 'bg-red-100 dark:bg-red-900/30 border-red-500' : ''}
                      onClick={() => setExtraType('noBall')}
                      disabled={isRunEntryDisabled}
                    >
                      No Ball
                    </Button>
                    <Button
                      variant="outline"
                      className={extraType === 'legBye' ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-500' : ''}
                      onClick={() => setExtraType('legBye')}
                      disabled={isRunEntryDisabled}
                    >
                      Leg Bye
                    </Button>
                    <Button
                      variant="outline"
                      className={extraType === 'overThrow' ? 'bg-green-100 dark:bg-green-900/30 border-green-500' : ''}
                      onClick={() => setExtraType('overThrow')}
                      disabled={isRunEntryDisabled}
                    >
                      Overthrow
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                {extraType && (
                  <>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                      <h4 className="font-medium mb-2">Select runs for {extraType}</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {(extraType === 'legBye' || extraType === 'overThrow') ? (
                          [1, 2, 3, 4, 5, 6, 7, 8].map((run) => (
                            <Button 
                              key={run}
                              variant="secondary"
                              onClick={() => {
                                handleAddRun(run, extraType);
                                setExtraType(null);
                              }}
                              disabled={isRunEntryDisabled}
                            >
                              {run}
                            </Button>
                          ))
                        ) : (
                          <Button
                            className="col-span-4 bg-primary text-white"
                            onClick={() => {
                              handleAddRun(0, extraType);
                              setExtraType(null);
                            }}
                            disabled={isRunEntryDisabled}
                          >
                            Add {extraType === 'wide' ? 'Wide' : 'No Ball'}
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline"
                      onClick={() => setExtraType(null)}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="wicket" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Wicket Type</Label>
                  <Select 
                    value={wicketType} 
                    onValueChange={setWicketType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select wicket type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bowled">Bowled</SelectItem>
                      <SelectItem value="lbw">LBW</SelectItem>
                      <SelectItem value="caught">Caught</SelectItem>
                      <SelectItem value="stumped">Stumped</SelectItem>
                      <SelectItem value="runOut">Run Out</SelectItem>
                      <SelectItem value="hitWicket">Hit Wicket</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleWicket(wicketType)}
                  disabled={isWicketDisabled}
                >
                  {striker ? `${striker} is Out (${wicketType})` : "Record Wicket"}
                </Button>
                
                {isWicketDisabled && (
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-md flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <span className="text-sm text-amber-800 dark:text-amber-200">
                      {!striker
                        ? "Select striker to record wicket"
                        : !currentBowler
                        ? "Select a bowler to record wicket"
                        : isOverComplete
                        ? "Over complete - select new bowler"
                        : isMatchComplete
                        ? "Match is complete"
                        : "Cannot record wicket at this time"}
                    </span>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
