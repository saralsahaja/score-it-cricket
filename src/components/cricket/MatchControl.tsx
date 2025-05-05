
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, UserCheck, Zap, Slash, Plus, AlertTriangle, Waves, ArrowUpRight, LifeBuoy, Clock, Heart } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

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
  retiredHurtPlayers
}: MatchControlProps) {
  const [extraRunsValue, setExtraRunsValue] = useState<number>(1);
  const [showRunsPopover, setShowRunsPopover] = useState<string | null>(null);
  const [wicketDialogOpen, setWicketDialogOpen] = useState(false);

  const handleExtraRunsSelect = (runs: number, extraType: string) => {
    handleAddRun(runs, extraType);
    setShowRunsPopover(null);
  };

  const handleWicketSelection = (wicketType: string) => {
    handleWicket(wicketType);
    setWicketDialogOpen(false);
  };

  const handleBatsmanSelection = (player: string, isStriker: boolean) => {
    handleSelectBatsman(player, isStriker);
    
    const position = isStriker ? "striker" : "non-striker";
    const batsmanNumber = teamA.indexOf(player) + 1;
    
    const toastMessage = `New batsman: ${player}${batsmanNumber > 0 ? ` (No. ${batsmanNumber})` : ''} as ${position}`;
    
    toast.success(toastMessage, {
      duration: 3000,
      position: "top-center",
      icon: "🏏",
      style: {
        backgroundColor: isStriker ? "#e0f2fe" : "#dcfce7",
        color: isStriker ? "#0369a1" : "#166534",
        border: `2px solid ${isStriker ? "#0ea5e9" : "#22c55e"}`,
      },
    });
  };

  // Check conditions for blocking run updates
  const isRunUpdateBlocked = () => {
    // Block if over is complete and no bowler is selected
    if (isOverComplete && !currentBowler) {
      return {blocked: true, message: "Please select a bowler for the new over first"};
    }
    
    // Block if no bowler is selected at all
    if (!currentBowler) {
      return {blocked: true, message: "Please select a bowler first"};
    }
    
    // Block if a wicket fell and no new batsman is selected
    if (wickets > 0 && (!striker || !nonStriker)) {
      return {blocked: true, message: "Please select a batsman first"};
    }
    
    return {blocked: false, message: ""};
  };

  const currentOver = Math.floor(totalBalls / 6) + 1;
  const remainingOvers = totalOvers - Math.floor(totalBalls / 6);
  const remainingBalls = 6 - (totalBalls % 6);
  const oversDisplay = `${currentOver}/${totalOvers}`;
  const remainingDisplay = remainingBalls === 6 
    ? `${remainingOvers} overs left` 
    : `${remainingOvers - 1}.${remainingBalls} overs left`;

  const renderRunsSelector = (extraType: string) => {
    return (
      <div className="p-2 space-y-3">
        <h4 className="font-semibold text-center text-sm">Select Runs</h4>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map((run) => (
            <Button
              key={run}
              size="sm"
              variant={run === 4 || run === 6 ? "default" : "outline"}
              className={`
                ${run === 4 ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}
                ${run === 6 ? 'bg-purple-500 hover:bg-purple-600 text-white' : ''}
              `}
              onClick={() => handleExtraRunsSelect(run, extraType)}
              disabled={isRunUpdateBlocked().blocked}
            >
              {run}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const isPlayerOut = (player: string) => outPlayers.includes(player);
  const isPlayerRetiredHurt = (player: string) => retiredHurtPlayers.includes(player);
  
  // Get the block status
  const blockStatus = isRunUpdateBlocked();
  
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
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="p-2 bg-yellow-100 rounded-md text-center">
                  <p className="text-sm font-bold text-yellow-800">
                    {wickets >= 10 ? (
                      "All Out! Innings Complete."
                    ) : (
                      `Wickets: ${wickets}/10`
                    )}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 rounded-md text-center">
                  <p className="text-sm font-bold text-blue-800 flex items-center justify-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {oversDisplay} overs
                  </p>
                  <p className="text-xs text-blue-700">
                    {remainingDisplay}
                  </p>
                </div>
              </div>
              
              {teamA.length === 0 ? (
                <div className="text-muted-foreground italic text-center p-4">
                  No players available. Add players to Team A first.
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {teamA.map((p, i) => (
                    <div 
                      key={i} 
                      className={`flex gap-2 items-center p-2 border rounded-md ${
                        isPlayerOut(p) 
                          ? 'border-red-500 bg-red-50 text-red-700' 
                          : isPlayerRetiredHurt(p)
                            ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                            : 'border-border'
                      }`}
                    >
                      <span className="flex-1">
                        {p} 
                        <span className="text-xs text-muted-foreground ml-1">
                          #{i+1}
                        </span>
                      </span>
                      <Button 
                        size="sm"
                        variant={striker === p ? "default" : "outline"}
                        onClick={() => handleBatsmanSelection(p, true)}
                        className="text-xs"
                        disabled={wickets >= 10 || isPlayerOut(p)}
                      >
                        <UserCheck className="h-3 w-3 mr-1" />
                        Striker
                      </Button>
                      <Button 
                        size="sm"
                        variant={nonStriker === p ? "default" : "outline"}
                        onClick={() => handleBatsmanSelection(p, false)}
                        className="text-xs"
                        disabled={wickets >= 10 || isPlayerOut(p)}
                      >
                        <User className="h-3 w-3 mr-1" />
                        Non-Striker
                      </Button>
                      {(striker === p || nonStriker === p) && (
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleRetireHurt(p)}
                          className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
                        >
                          <Heart className="h-3 w-3 mr-1" />
                          Retire
                        </Button>
                      )}
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
            
            {/* Show warning if run updates are blocked */}
            {blockStatus.blocked && (
              <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg font-medium animate-pulse border border-red-300 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                {blockStatus.message}
              </div>
            )}
            
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
                  disabled={wickets >= 10 || blockStatus.blocked}
                >
                  {r}
                </Button>
              ))}
              <Dialog open={wicketDialogOpen} onOpenChange={setWicketDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="destructive"
                    className="text-lg font-bold"
                    disabled={wickets >= 10 || blockStatus.blocked}
                  >
                    <Slash className="h-4 w-4 mr-1" />
                    W
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold">Select Wicket Type</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-2 py-4">
                    <Button onClick={() => handleWicketSelection('Bowled')} className="bg-red-600 hover:bg-red-700">Bowled</Button>
                    <Button onClick={() => handleWicketSelection('Caught')} className="bg-red-600 hover:bg-red-700">Caught</Button>
                    <Button onClick={() => handleWicketSelection('LBW')} className="bg-red-600 hover:bg-red-700">LBW</Button>
                    <Button onClick={() => handleWicketSelection('Run Out')} className="bg-red-600 hover:bg-red-700">Run Out</Button>
                    <Button onClick={() => handleWicketSelection('Stumped')} className="bg-red-600 hover:bg-red-700">Stumped</Button>
                    <Button onClick={() => handleWicketSelection('Hit Wicket')} className="bg-red-600 hover:bg-red-700">Hit Wicket</Button>
                    <Button onClick={() => handleWicketSelection('Other')} className="bg-red-600 hover:bg-red-700 col-span-2">Other</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Extras</h4>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="bg-slate-50 p-2 rounded-md">
                  <p className="text-xs font-medium mb-1 text-slate-600">Extra Type Rules:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Wide: +1 run, no striker change</li>
                    <li>• No Ball: +1 run, no striker change</li>
                    <li>• Leg Bye: Select runs, change striker for odd runs</li>
                    <li>• Overthrow: Select runs, change striker for odd runs</li>
                  </ul>
                </div>
                
                <div className="flex flex-col justify-center">
                  <p className="text-xs font-medium mb-2 text-slate-600">Quick Entry Guide:</p>
                  <div className="text-xs text-muted-foreground flex items-center justify-between">
                    <span>Auto +1 run</span>
                    <span>Select runs</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
                      onClick={() => handleAddRun(1, 'wide')}
                      disabled={wickets >= 10 || blockStatus.blocked}
                    >
                      <Waves className="h-4 w-4 mr-1" />
                      Wide
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">+1 run, no striker change</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="bg-red-100 text-red-800 border-red-300 hover:bg-red-200"
                      onClick={() => handleAddRun(1, 'noBall')}
                      disabled={wickets >= 10 || blockStatus.blocked}
                    >
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      No Ball
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">+1 run, no striker change</p>
                  </TooltipContent>
                </Tooltip>

                <Popover open={showRunsPopover === 'overThrow'} onOpenChange={(open) => {
                  if (open) setShowRunsPopover('overThrow');
                  else setShowRunsPopover(null);
                }}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                      disabled={wickets >= 10 || blockStatus.blocked}
                    >
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      Overthrow
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    {renderRunsSelector('overThrow')}
                  </PopoverContent>
                </Popover>

                <Popover open={showRunsPopover === 'legBye'} onOpenChange={(open) => {
                  if (open) setShowRunsPopover('legBye');
                  else setShowRunsPopover(null);
                }}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200"
                      disabled={wickets >= 10 || blockStatus.blocked}
                    >
                      <LifeBuoy className="h-4 w-4 mr-1" />
                      Leg Bye
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    {renderRunsSelector('legBye')}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
