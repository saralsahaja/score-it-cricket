
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, UserCheck, Zap, Slash, Plus, AlertTriangle, Waves, ArrowUpRight, LifeBuoy } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface MatchControlProps {
  teamA: string[];
  teamB: string[];
  handleSelectBatsman: (player: string, isStriker: boolean) => void;
  handleSelectBowler: (player: string) => void;
  handleAddRun: (runs: number, extraType?: string) => void;
  handleWicket: () => void;
  striker: string | null;
  nonStriker: string | null;
  currentBowler: string | null;
  isOverComplete: boolean;
  wickets: number;
}

export default function MatchControl({
  teamA,
  teamB,
  handleSelectBatsman,
  handleSelectBowler,
  handleAddRun,
  handleWicket,
  striker,
  nonStriker,
  currentBowler,
  isOverComplete,
  wickets
}: MatchControlProps) {
  const [extraRunsValue, setExtraRunsValue] = useState<number>(1);

  return (
    <Card className="shadow-lg border-2 border-primary/20">
      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-lg">Set Batsmen</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="p-2 bg-secondary rounded-md text-center">
                  <p className="text-sm font-medium mb-1">Current Striker</p>
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {striker || "Not Selected"}
                  </Badge>
                </div>
                <div className="p-2 bg-secondary rounded-md text-center">
                  <p className="text-sm font-medium mb-1">Non-Striker</p>
                  <Badge variant="outline" className="bg-accent/10 text-accent">
                    {nonStriker || "Not Selected"}
                  </Badge>
                </div>
              </div>
              
              <div className="p-2 bg-yellow-100 rounded-md text-center my-3">
                <p className="text-sm font-bold text-yellow-800">
                  {wickets >= 10 ? (
                    "All Out! Innings Complete."
                  ) : (
                    `Wickets: ${wickets}/10`
                  )}
                </p>
              </div>
              
              {teamA.length === 0 ? (
                <div className="text-muted-foreground italic text-center p-4">
                  No players available. Add players to Team A first.
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {teamA.map((p, i) => (
                    <div key={i} className="flex gap-2 items-center p-2 border border-border rounded-md">
                      <span className="flex-1">{p}</span>
                      <Button 
                        size="sm"
                        variant={striker === p ? "default" : "outline"}
                        onClick={() => handleSelectBatsman(p, true)}
                        className="text-xs"
                        disabled={wickets >= 10}
                      >
                        <UserCheck className="h-3 w-3 mr-1" />
                        Striker
                      </Button>
                      <Button 
                        size="sm"
                        variant={nonStriker === p ? "default" : "outline"}
                        onClick={() => handleSelectBatsman(p, false)}
                        className="text-xs"
                        disabled={wickets >= 10}
                      >
                        <User className="h-3 w-3 mr-1" />
                        Non-Striker
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-lg">Select Bowler</h3>
              </div>
              
              <div className="p-2 bg-secondary rounded-md text-center mb-3">
                <p className="text-sm font-medium mb-1">Current Bowler</p>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {currentBowler || "Not Selected"}
                </Badge>
                {isOverComplete && (
                  <div className="mt-2 p-1 bg-yellow-100/50 text-yellow-800 rounded-md text-xs font-bold animate-pulse">
                    Over completed. Please select next bowler.
                  </div>
                )}
              </div>
              
              {teamB.length === 0 ? (
                <div className="text-muted-foreground italic text-center p-4">
                  No players available. Add players to Team B first.
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {teamB.map((p, i) => (
                    <div key={i} className="flex justify-between items-center p-2 border border-border rounded-md">
                      <span>{p}</span>
                      <Button 
                        size="sm"
                        variant={currentBowler === p ? "default" : "outline"}
                        onClick={() => handleSelectBowler(p)}
                        disabled={(currentBowler === p && !isOverComplete) || wickets >= 10}
                        className={isOverComplete && currentBowler !== p ? "animate-pulse bg-yellow-500 hover:bg-yellow-600 text-white" : ""}
                      >
                        Select Bowler
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Separator />
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Plus className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg">Run Entry</h3>
            </div>
            
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mb-4">
              {[0, 1, 2, 3, 4, 6].map((r) => (
                <Button 
                  key={r} 
                  onClick={() => handleAddRun(r)}
                  variant={r === 4 || r === 6 ? "default" : "outline"}
                  className={`text-lg font-bold ${
                    r === 4 ? 'bg-blue-500 hover:bg-blue-600 text-white' : 
                    r === 6 ? 'bg-purple-500 hover:bg-purple-600 text-white' : ''
                  }`}
                  disabled={wickets >= 10}
                >
                  {r}
                </Button>
              ))}
              <Button 
                onClick={handleWicket}
                variant="destructive"
                className="text-lg font-bold"
                disabled={wickets >= 10}
              >
                <Slash className="h-4 w-4 mr-1" />
                W
              </Button>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Extras</h4>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs font-medium mb-1">Extra Runs</p>
                  <div className="grid grid-cols-6 gap-1">
                    {[1, 2, 3, 4, 5, 6].map((value) => (
                      <Button
                        key={value}
                        size="sm"
                        variant={extraRunsValue === value ? "default" : "outline"}
                        onClick={() => setExtraRunsValue(value)}
                        className="h-8 w-8 p-0"
                        disabled={wickets >= 10}
                      >
                        {value}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium mb-1">Run Details</p>
                  <p>Wide & No Ball: +1 run automatically</p>
                  <p>Leg Bye & Overthrow: Select runs above</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button 
                  variant="outline" 
                  className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
                  onClick={() => handleAddRun(extraRunsValue, 'wide')}
                  disabled={wickets >= 10}
                >
                  <Waves className="h-4 w-4 mr-1" />
                  Wide
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-red-100 text-red-800 border-red-300 hover:bg-red-200"
                  onClick={() => handleAddRun(extraRunsValue, 'noBall')}
                  disabled={wickets >= 10}
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  No Ball
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                  onClick={() => handleAddRun(extraRunsValue, 'overThrow')}
                  disabled={wickets >= 10}
                >
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Overthrow
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200"
                  onClick={() => handleAddRun(extraRunsValue, 'legBye')}
                  disabled={wickets >= 10}
                >
                  <LifeBuoy className="h-4 w-4 mr-1" />
                  Leg Bye
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
