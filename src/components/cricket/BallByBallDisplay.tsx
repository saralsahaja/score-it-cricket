
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Info } from "lucide-react";

interface BallByBallDisplayProps {
  recentBalls: string[];
  currentOver: number;
  currentBall: number;
  currentOverRuns: number;
  previousOverRuns: number;
  previousOverBalls: string[];
}

export default function BallByBallDisplay({
  recentBalls,
  currentOver,
  currentBall,
  currentOverRuns,
  previousOverRuns,
  previousOverBalls
}: BallByBallDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Format balls for display with consistent styling
  const getBallClassName = (ball: string) => {
    let className = "w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm";
    
    // Style based on ball type
    if (ball === 'W') {
      className += " bg-red-500 text-white";
    } else if (ball === '4') {
      className += " bg-blue-500 text-white";
    } else if (ball === '6') {
      className += " bg-purple-500 text-white";
    } else if (ball === 'WD' || ball === 'NB') {
      className += " bg-yellow-400 text-yellow-800";
    } else if (ball === 'LB' || ball === 'OT') {
      className += " bg-green-500 text-white";
    } else {
      className += " bg-gray-200 text-gray-800";
    }
    
    return className;
  };

  // Get the last 12 balls for display
  const getLastBallsDisplay = () => {
    // Combine previous over balls and current over balls if needed
    const allBalls = [...previousOverBalls, ...recentBalls];
    
    // Take only the last 12 balls
    const lastBalls = allBalls.slice(-12);
    
    // Display balls from left to right (oldest to newest)
    return lastBalls.map((ball, index) => {
      const overNumber = index < previousOverBalls.length ? currentOver - 1 : currentOver;
      const ballNumber = index < previousOverBalls.length ? 
        index + 1 : 
        index - previousOverBalls.length + 1;
      
      return (
        <div key={index} className="flex flex-col items-center">
          <div className={getBallClassName(ball)}>
            {ball}
          </div>
          <span className="text-xs text-muted-foreground mt-1">{overNumber}.{ballNumber}</span>
        </div>
      );
    });
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="flex gap-2 items-center bg-white"
      >
        <Info className="h-4 w-4" />
        View Ball-by-Ball
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Ball-by-Ball Updates</DialogTitle>
          </DialogHeader>
          
          <div className="p-2">
            <Card className="border-2 border-primary/10">
              <CardContent className="p-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-md">
                    Last 12 Balls
                  </h3>
                  <Badge className="bg-blue-600">
                    {previousOverRuns + currentOverRuns} runs
                  </Badge>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  {getLastBallsDisplay()}
                  {recentBalls.length === 0 && previousOverBalls.length === 0 && (
                    <div className="text-center w-full text-sm text-muted-foreground">
                      No balls bowled yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
