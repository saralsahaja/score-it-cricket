
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Zap, Trophy, Award } from "lucide-react";

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

export default function MatchRecords() {
  const location = useLocation();
  const state = location.state as {
    batsmen: BatsmanStats[];
    bowlersList: BowlerStats[];
    teamAName: string;
    teamBName: string;
    outPlayers: string[];
    retiredHurtPlayers: string[];
    gameTitle: string;
  } | null;

  const [activeTab, setActiveTab] = useState("batting");
  
  // Use default values if no state is passed
  const batsmen = state?.batsmen || [];
  const bowlersList = state?.bowlersList || [];
  const teamAName = state?.teamAName || "Team A";
  const teamBName = state?.teamBName || "Team B";
  const outPlayers = state?.outPlayers || [];
  const retiredHurtPlayers = state?.retiredHurtPlayers || [];
  const gameTitle = state?.gameTitle || "Match Records";

  return (
    <div className="min-h-screen bg-secondary/50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="outline" size="icon" className="rounded-full">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-primary">{gameTitle}: Full Match Records</h1>
          </div>
        </div>

        <Tabs defaultValue="batting" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="batting" className="text-lg py-3">
              <Users className="mr-2 h-5 w-5" /> Batting Records
            </TabsTrigger>
            <TabsTrigger value="bowling" className="text-lg py-3">
              <Zap className="mr-2 h-5 w-5" /> Bowling Records
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="batting" className="space-y-6">
            <Card className="border-2 border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  All Batsmen
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {batsmen.length === 0 ? (
                  <div className="text-muted-foreground italic text-center p-4 text-lg">
                    No batting records available
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-12 text-sm text-blue-700 px-2 py-2 font-semibold border-b-2 border-blue-100">
                      <div className="col-span-4">Batsman</div>
                      <div className="col-span-1 text-center">R</div>
                      <div className="col-span-1 text-center">B</div>
                      <div className="col-span-2 text-center">SR</div>
                      <div className="col-span-1 text-center">4s</div>
                      <div className="col-span-1 text-center">6s</div>
                      <div className="col-span-2 text-center">Status</div>
                    </div>
                    
                    <div className="space-y-2 mt-2">
                      {batsmen
                        .sort((a, b) => b.runs - a.runs) // Sort by runs (highest first)
                        .map((b, i) => {
                          const isOut = outPlayers.includes(b.name);
                          const isRetiredHurt = retiredHurtPlayers.includes(b.name);
                          const strikeRate = b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(1) : "0.0";
                          
                          return (
                            <div 
                              key={i} 
                              className={`grid grid-cols-12 p-3 rounded-md ${
                                isOut 
                                  ? 'bg-red-50 border border-red-200' 
                                  : isRetiredHurt
                                    ? 'bg-yellow-50 border border-yellow-200'
                                    : i % 2 === 0 
                                      ? 'bg-blue-50 border border-blue-100' 
                                      : 'bg-white border border-gray-100'
                              }`}
                            >
                              <div className="col-span-4 font-medium flex items-center">
                                {b.name}
                                {b.runs >= 50 && <Award className="h-4 w-4 ml-2 fill-amber-400 text-amber-400" />}
                              </div>
                              <div className="col-span-1 text-center font-bold">{b.runs}</div>
                              <div className="col-span-1 text-center">{b.balls}</div>
                              <div className="col-span-2 text-center">{strikeRate}</div>
                              <div className="col-span-1 text-center">
                                <Badge variant="outline" className="bg-blue-100">{b.fours}</Badge>
                              </div>
                              <div className="col-span-1 text-center">
                                <Badge variant="outline" className="bg-purple-100">{b.sixes}</Badge>
                              </div>
                              <div className="col-span-2 text-center">
                                {isOut ? (
                                  <Badge variant="destructive">OUT</Badge>
                                ) : isRetiredHurt ? (
                                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                    RETIRED HURT
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                                    NOT OUT
                                  </Badge>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bowling" className="space-y-6">
            <Card className="border-2 border-green-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-800 text-white">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Zap className="h-6 w-6" />
                  All Bowlers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {bowlersList.length === 0 ? (
                  <div className="text-muted-foreground italic text-center p-4 text-lg">
                    No bowling records available
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-10 text-sm text-green-700 px-2 py-2 font-semibold border-b-2 border-green-100">
                      <div className="col-span-3">Bowler</div>
                      <div className="col-span-2 text-center">Overs</div>
                      <div className="col-span-1 text-center">M</div>
                      <div className="col-span-1 text-center">R</div>
                      <div className="col-span-1 text-center">W</div>
                      <div className="col-span-2 text-center">Economy</div>
                    </div>
                    
                    <div className="space-y-2 mt-2">
                      {bowlersList
                        .sort((a, b) => b.wickets - a.wickets) // Sort by wickets (highest first)
                        .map((b, idx) => {
                          const economy = b.balls > 0 ? ((b.runs / (b.balls/6)) || 0).toFixed(2) : "0.00";
                          
                          return (
                            <div 
                              key={idx} 
                              className={`grid grid-cols-10 p-3 rounded-md ${
                                idx % 2 === 0 
                                  ? 'bg-green-50 border border-green-100' 
                                  : 'bg-white border border-gray-100'
                              } ${b.wickets >= 3 ? 'ring-2 ring-emerald-300' : ''}`}
                            >
                              <div className="col-span-3 font-medium flex items-center">
                                {b.name}
                                {b.wickets >= 3 && <Trophy className="h-4 w-4 ml-2 fill-emerald-400 text-emerald-400" />}
                              </div>
                              <div className="col-span-2 text-center">
                                {Math.floor(b.balls/6)}.{b.balls%6}
                              </div>
                              <div className="col-span-1 text-center">{b.maidens}</div>
                              <div className="col-span-1 text-center">{b.runs}</div>
                              <div className="col-span-1 text-center font-bold">{b.wickets}</div>
                              <div className="col-span-2 text-center">
                                <Badge variant={parseFloat(economy) < 6 ? "success" : parseFloat(economy) < 8 ? "outline" : "destructive"} className="px-2">
                                  {economy}
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
