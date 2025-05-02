
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { TossInfo } from "@/pages/Index";

interface TossFormProps {
  teamAName: string;
  teamBName: string;
  onSubmit: (tossInfo: TossInfo) => void;
  currentToss: TossInfo | null;
}

const TossForm = ({ teamAName, teamBName, onSubmit, currentToss }: TossFormProps) => {
  const [winner, setWinner] = useState(currentToss?.winner || teamAName);
  const [decision, setDecision] = useState<"bat" | "bowl">(currentToss?.decision || "bat");

  // Update local state if props change
  useEffect(() => {
    if (currentToss) {
      setWinner(currentToss.winner);
      setDecision(currentToss.decision);
    }
  }, [currentToss]);

  // Update winner if team names change
  useEffect(() => {
    if (!currentToss) {
      setWinner(teamAName); // Default to team A if no toss info exists
    }
  }, [teamAName, teamBName, currentToss]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      winner: winner,
      decision: decision
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-2">Toss Winner</h4>
          <RadioGroup 
            value={winner} 
            onValueChange={(value) => setWinner(value)}
            className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={teamAName} id="teamA" />
              <Label htmlFor="teamA" className="cursor-pointer">{teamAName}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={teamBName} id="teamB" />
              <Label htmlFor="teamB" className="cursor-pointer">{teamBName}</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold mb-2">Elected to</h4>
          <RadioGroup 
            value={decision} 
            onValueChange={(value: "bat" | "bowl") => setDecision(value)}
            className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bat" id="bat" />
              <Label htmlFor="bat" className="cursor-pointer">Bat</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bowl" id="bowl" />
              <Label htmlFor="bowl" className="cursor-pointer">Bowl</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full md:w-auto"
        disabled={currentToss?.winner === winner && currentToss?.decision === decision}
      >
        {currentToss ? "Update Toss Information" : "Save Toss Information"}
      </Button>

      {currentToss && (
        <div className="text-sm text-green-600 dark:text-green-400 font-medium">
          Current toss: {currentToss.winner} won and elected to {currentToss.decision} first
        </div>
      )}
    </form>
  );
};

export default TossForm;
