
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface TeamSetupProps {
  teamA: string[];
  teamB: string[];
  playerName: string;
  setPlayerName: (name: string) => void;
  activeTeam: string;
  setActiveTeam: (team: string) => void;
  handleAddPlayer: () => void;
}

export default function TeamSetup({
  teamA,
  teamB,
  playerName,
  setPlayerName,
  activeTeam,
  setActiveTeam,
  handleAddPlayer
}: TeamSetupProps) {
  return (
    <Card className="shadow-lg border-2 border-primary/20">
      <CardContent className="space-y-6 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Team Setup</h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <Input 
            value={playerName} 
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter player name" 
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddPlayer();
            }}
          />
          <Button onClick={handleAddPlayer} className="w-full md:w-auto">
            Add Player
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 p-4 bg-secondary rounded-lg">
          <Button 
            onClick={() => setActiveTeam("A")} 
            variant={activeTeam === "A" ? "default" : "outline"}
            className="w-full"
          >
            Team A {activeTeam === "A" && "(Active)"}
          </Button>
          <Button 
            onClick={() => setActiveTeam("B")} 
            variant={activeTeam === "B" ? "default" : "outline"}
            className="w-full"
          >
            Team B {activeTeam === "B" && "(Active)"}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg flex items-center gap-2 mb-3">
                <Badge variant="outline" className="py-1">A</Badge>
                Team A <Badge>{teamA.length}</Badge>
              </h3>
              {teamA.length === 0 ? (
                <div className="text-muted-foreground italic">No players added yet</div>
              ) : (
                <ul className="space-y-1">
                  {teamA.map((p, i) => (
                    <li key={i} className="p-2 border border-border rounded-md flex justify-between items-center">
                      <span>{i+1}. {p}</span>
                      <Badge variant="secondary">Batsman</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg flex items-center gap-2 mb-3">
                <Badge variant="outline" className="py-1">B</Badge>
                Team B <Badge>{teamB.length}</Badge>
              </h3>
              {teamB.length === 0 ? (
                <div className="text-muted-foreground italic">No players added yet</div>
              ) : (
                <ul className="space-y-1">
                  {teamB.map((p, i) => (
                    <li key={i} className="p-2 border border-border rounded-md flex justify-between items-center">
                      <span>{i+1}. {p}</span>
                      <Badge variant="secondary">Bowler</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
