
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, UserCheck, CircleBolt, Slash, Plus } from "lucide-react";

interface MatchControlProps {
  teamA: string[];
  teamB: string[];
  handleSelectBatsman: (player: string, isStriker: boolean) => void;
  handleSelectBowler: (player: string) => void;
  handleAddRun: (runs: number) => void;
  handleWicket: () => void;
  striker: string | null;
  nonStriker: string | null;
  currentBowler: string | null;
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
  currentBowler
}: MatchControlProps) {
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
                      >
                        <UserCheck className="h-3 w-3 mr-1" />
                        Striker
                      </Button>
                      <Button 
                        size="sm"
                        variant={nonStriker === p ? "default" : "outline"}
                        onClick={() => handleSelectBatsman(p, false)}
                        className="text-xs"
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
                <CircleBolt className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-lg">Select Bowler</h3>
              </div>
              
              <div className="p-2 bg-secondary rounded-md text-center mb-3">
                <p className="text-sm font-medium mb-1">Current Bowler</p>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {currentBowler || "Not Selected"}
                </Badge>
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
            
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
              {[0, 1, 2, 3, 4, 6].map((r) => (
                <Button 
                  key={r} 
                  onClick={() => handleAddRun(r)}
                  variant={r === 4 || r === 6 ? "default" : "outline"}
                  className={`text-lg font-bold ${r === 4 || r === 6 ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}`}
                >
                  {r}
                </Button>
              ))}
              <Button 
                onClick={handleWicket}
                variant="destructive"
                className="text-lg font-bold"
              >
                <Slash className="h-4 w-4 mr-1" />
                W
              </Button>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
