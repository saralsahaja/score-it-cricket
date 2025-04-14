
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Users, Shield, Image, Clock } from "lucide-react";
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
  totalOvers: number;
  handleTotalOversChange: (overs: number) => void;
  gameTitle: string;
  setGameTitle: (title: string) => void;
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
  handleTotalOversChange,
  gameTitle,
  setGameTitle
}: TeamSetupProps) {
  const [customOvers, setCustomOvers] = useState<number>(totalOvers);
  
  const handleOversChange = (value: number) => {
    setCustomOvers(value);
    handleTotalOversChange(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="shadow-lg border-2 border-primary/20">
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-6 w-6 text-primary" />
            <h3 className="font-bold text-xl">Team Setup</h3>
          </div>
          
          <div className="bg-secondary/30 p-4 rounded-lg border border-primary/10">
            <div className="mb-4">
              <Label htmlFor="gameTitle" className="block text-sm font-medium mb-1">Game Title</Label>
              <Input
                id="gameTitle"
                value={gameTitle}
                onChange={(e) => setGameTitle(e.target.value)}
                placeholder="Enter game title"
                className="mb-2"
              />
              <p className="text-xs text-muted-foreground">This will be displayed on the scoreboard.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="teamAName" className="block text-sm font-medium mb-1">Team A Name</Label>
                <Input
                  id="teamAName"
                  value={teamAName}
                  onChange={(e) => setTeamAName(e.target.value)}
                  placeholder="Batting Team"
                />
              </div>
              <div>
                <Label htmlFor="teamBName" className="block text-sm font-medium mb-1">Team B Name</Label>
                <Input
                  id="teamBName"
                  value={teamBName}
                  onChange={(e) => setTeamBName(e.target.value)}
                  placeholder="Bowling Team"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium mb-1">Team A Logo</Label>
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10 border-2 border-primary/30">
                    {teamALogo ? (
                      <AvatarImage src={teamALogo} alt={teamAName} />
                    ) : (
                      <AvatarFallback className="bg-primary/10">{teamAName.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                  <Button variant="outline" className="flex-1 relative overflow-hidden" size="sm">
                    <Image className="h-4 w-4 mr-1" />
                    Upload Logo
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => handleLogoUpload('A', e)}
                    />
                  </Button>
                </div>
              </div>
              <div>
                <Label className="block text-sm font-medium mb-1">Team B Logo</Label>
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10 border-2 border-primary/30">
                    {teamBLogo ? (
                      <AvatarImage src={teamBLogo} alt={teamBName} />
                    ) : (
                      <AvatarFallback className="bg-primary/10">{teamBName.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                  <Button variant="outline" className="flex-1 relative overflow-hidden" size="sm">
                    <Image className="h-4 w-4 mr-1" />
                    Upload Logo
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => handleLogoUpload('B', e)}
                    />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-secondary/30 p-4 rounded-lg border border-primary/10">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-primary" />
              <h4 className="font-bold">Match Format</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              <Button 
                variant={totalOvers === 20 ? "default" : "outline"} 
                onClick={() => handleOversChange(20)}
                className={totalOvers === 20 ? "border-2 border-primary" : ""}
              >
                T20 (20 Overs)
              </Button>
              <Button 
                variant={totalOvers === 50 ? "default" : "outline"} 
                onClick={() => handleOversChange(50)}
                className={totalOvers === 50 ? "border-2 border-primary" : ""}
              >
                ODI (50 Overs)
              </Button>
              <Button 
                variant={totalOvers === 10 ? "default" : "outline"} 
                onClick={() => handleOversChange(10)}
                className={totalOvers === 10 ? "border-2 border-primary" : ""}
              >
                T10 (10 Overs)
              </Button>
              <Button 
                variant={totalOvers === 5 ? "default" : "outline"} 
                onClick={() => handleOversChange(5)}
                className={totalOvers === 5 ? "border-2 border-primary" : ""}
              >
                Quick (5 Overs)
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="customOvers" className="text-sm whitespace-nowrap">Custom:</Label>
              <Input
                id="customOvers"
                type="number"
                min="1"
                max="50"
                value={customOvers}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value > 0 && value <= 50) {
                    setCustomOvers(value);
                  }
                }}
                className="w-24"
              />
              <Button 
                onClick={() => handleOversChange(customOvers)}
                className="ml-2"
                disabled={customOvers === totalOvers}
              >
                Apply
              </Button>
              <p className="text-xs text-muted-foreground ml-2">Current: {totalOvers} overs</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg border-2 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="h-6 w-6 text-primary" />
            <h3 className="font-bold text-xl">Add Players</h3>
          </div>
          
          <Tabs value={activeTeam} onValueChange={setActiveTeam} className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="A" className="relative">
                {teamAName}
                <Badge className="absolute -top-2 -right-2 bg-primary">{teamA.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="B" className="relative">
                {teamBName}
                <Badge className="absolute -top-2 -right-2 bg-primary">{teamB.length}</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-end gap-2 mb-4">
            <div className="flex-1">
              <Label htmlFor="playerName" className="block text-sm font-medium mb-1">
                Player Name
              </Label>
              <Input
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter player name"
                onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
              />
            </div>
            <Button onClick={handleAddPlayer} className="flex-shrink-0">
              Add to {activeTeam === "A" ? teamAName : teamBName}
            </Button>
          </div>
          
          <div className="bg-secondary/30 p-3 rounded-md border border-primary/10 min-h-[240px] max-h-[240px] overflow-y-auto">
            <TabsContent value="A" className="space-y-2 mt-0">
              {teamA.length === 0 ? (
                <div className="text-center italic text-muted-foreground p-4">
                  No players added to {teamAName} yet
                </div>
              ) : (
                teamA.map((player, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-background rounded-md shadow-sm">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span>{player}</span>
                    </div>
                    <Badge variant="outline">{index + 1}</Badge>
                  </div>
                ))
              )}
            </TabsContent>
            <TabsContent value="B" className="space-y-2 mt-0">
              {teamB.length === 0 ? (
                <div className="text-center italic text-muted-foreground p-4">
                  No players added to {teamBName} yet
                </div>
              ) : (
                teamB.map((player, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-background rounded-md shadow-sm">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span>{player}</span>
                    </div>
                    <Badge variant="outline">{index + 1}</Badge>
                  </div>
                ))
              )}
            </TabsContent>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
