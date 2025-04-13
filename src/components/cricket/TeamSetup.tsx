
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users, Upload, Clock, Info } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  totalOvers: number;
  handleTotalOversChange: (overs: number) => void;
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
  handleLogoUpload,
  totalOvers,
  handleTotalOversChange
}: TeamSetupProps) {
  // Common match formats
  const matchFormats = [
    { name: "T20", overs: 20 },
    { name: "ODI", overs: 50 },
    { name: "T10", overs: 10 },
    { name: "Test", overs: 90 }
  ];

  const handleCustomOvers = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      handleTotalOversChange(value);
    }
  };

  return (
    <Card className="shadow-lg border-2 border-primary/20">
      <CardContent className="space-y-6 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Team Setup
          </h2>
          
          <Card className="bg-blue-50 border-2 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-lg">Match Format</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Format</label>
                  <div className="grid grid-cols-4 gap-2">
                    {matchFormats.map((format) => (
                      <Button
                        key={format.name}
                        variant={totalOvers === format.overs ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTotalOversChange(format.overs)}
                        className={totalOvers === format.overs ? "bg-primary" : ""}
                      >
                        {format.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Custom Overs</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      max="50"
                      value={totalOvers}
                      onChange={handleCustomOvers}
                      className="w-24"
                    />
                    <span className="text-sm font-medium">overs</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <Info className="h-3 w-3 inline mr-1" />
                    Enter between 1-50 overs
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="A" onValueChange={(value) => setActiveTeam(value)}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="A">Team A</TabsTrigger>
            <TabsTrigger value="B">Team B</TabsTrigger>
          </TabsList>
          
          <TabsContent value="A">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Team Name</label>
                    <Input
                      value={teamAName}
                      onChange={(e) => setTeamAName(e.target.value)}
                      className="max-w-xs"
                      placeholder="Enter team name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Team Logo</label>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 border-2 border-border">
                        {teamALogo ? (
                          <AvatarImage src={teamALogo} alt={teamAName} />
                        ) : (
                          <AvatarFallback>{teamAName.charAt(0)}</AvatarFallback>
                        )}
                      </Avatar>
                      <label className="cursor-pointer">
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleLogoUpload('A', e)}
                        />
                        <div className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm">
                          <Upload className="h-4 w-4" />
                          Upload Logo
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Enter player name"
                      onKeyDown={(e) => e.key === "Enter" && handleAddPlayer()}
                    />
                    <Button onClick={handleAddPlayer}>Add Player</Button>
                  </div>
                  
                  <div className="border rounded-md overflow-hidden">
                    <div className="bg-muted p-2 text-sm font-medium">
                      Team A Players ({teamA.length}/11)
                    </div>
                    {teamA.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No players added yet
                      </div>
                    ) : (
                      <div className="divide-y">
                        {teamA.map((p, i) => (
                          <div key={i} className="p-2 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-2">
                              {i + 1}
                            </span>
                            {p}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="B">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Team Name</label>
                    <Input
                      value={teamBName}
                      onChange={(e) => setTeamBName(e.target.value)}
                      className="max-w-xs"
                      placeholder="Enter team name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Team Logo</label>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 border-2 border-border">
                        {teamBLogo ? (
                          <AvatarImage src={teamBLogo} alt={teamBName} />
                        ) : (
                          <AvatarFallback>{teamBName.charAt(0)}</AvatarFallback>
                        )}
                      </Avatar>
                      <label className="cursor-pointer">
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleLogoUpload('B', e)}
                        />
                        <div className="flex items-center gap-1 bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-md text-sm">
                          <Upload className="h-4 w-4" />
                          Upload Logo
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Enter player name"
                      onKeyDown={(e) => e.key === "Enter" && handleAddPlayer()}
                    />
                    <Button onClick={handleAddPlayer}>Add Player</Button>
                  </div>
                  
                  <div className="border rounded-md overflow-hidden">
                    <div className="bg-muted p-2 text-sm font-medium">
                      Team B Players ({teamB.length}/11)
                    </div>
                    {teamB.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No players added yet
                      </div>
                    ) : (
                      <div className="divide-y">
                        {teamB.map((p, i) => (
                          <div key={i} className="p-2 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-2">
                              {i + 1}
                            </span>
                            {p}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
