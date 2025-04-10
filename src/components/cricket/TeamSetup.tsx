
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Upload, Pencil } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

interface TeamSetupProps {
  teamA: string[];
  teamB: string[];
  playerName: string;
  setPlayerName: (name: string) => void;
  activeTeam: string;
  setActiveTeam: (team: string) => void;
  handleAddPlayer: () => void;
  teamAName: string;
  setTeamAName: (name: string) => void;
  teamBName: string;
  setTeamBName: (name: string) => void;
  teamALogo: string | null;
  teamBLogo: string | null;
  handleLogoUpload: (team: 'A' | 'B', e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TeamSetup({
  teamA,
  teamB,
  playerName,
  setPlayerName,
  activeTeam,
  setActiveTeam,
  handleAddPlayer,
  teamAName,
  setTeamAName,
  teamBName,
  setTeamBName,
  teamALogo,
  teamBLogo,
  handleLogoUpload
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
            {teamAName} {activeTeam === "A" && "(Active)"}
          </Button>
          <Button 
            onClick={() => setActiveTeam("B")} 
            variant={activeTeam === "B" ? "default" : "outline"}
            className="w-full"
          >
            {teamBName} {activeTeam === "B" && "(Active)"}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="py-1">A</Badge>
                  <div className="flex items-center">
                    <Input 
                      value={teamAName}
                      onChange={(e) => setTeamAName(e.target.value)}
                      className="font-bold text-lg border-0 focus-visible:ring-0 p-0 h-auto"
                    />
                    <Pencil className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <Badge>{teamA.length}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    {teamALogo ? (
                      <AvatarImage src={teamALogo} alt={teamAName} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary">{teamAName.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <Label htmlFor="teamALogo" className="cursor-pointer">
                      <div className="flex items-center gap-1 text-xs text-primary hover:underline">
                        <Upload className="h-3 w-3" />
                        Logo
                      </div>
                    </Label>
                    <Input 
                      id="teamALogo" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleLogoUpload('A', e)}
                    />
                  </div>
                </div>
              </div>
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
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="py-1">B</Badge>
                  <div className="flex items-center">
                    <Input 
                      value={teamBName}
                      onChange={(e) => setTeamBName(e.target.value)}
                      className="font-bold text-lg border-0 focus-visible:ring-0 p-0 h-auto"
                    />
                    <Pencil className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <Badge>{teamB.length}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    {teamBLogo ? (
                      <AvatarImage src={teamBLogo} alt={teamBName} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary">{teamBName.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <Label htmlFor="teamBLogo" className="cursor-pointer">
                      <div className="flex items-center gap-1 text-xs text-primary hover:underline">
                        <Upload className="h-3 w-3" />
                        Logo
                      </div>
                    </Label>
                    <Input 
                      id="teamBLogo" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleLogoUpload('B', e)}
                    />
                  </div>
                </div>
              </div>
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
