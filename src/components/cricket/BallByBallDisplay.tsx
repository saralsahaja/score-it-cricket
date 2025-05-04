
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Info } from "lucide-react";

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
  const [animateBox, setAnimateBox] = useState(false);

  // Pulse animation when a new ball is added
  useEffect(() => {
    if (recentBalls.length > 0) {
      setAnimateBox(true);
      const timer = setTimeout(() => setAnimateBox(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [recentBalls.length]);

  // Format balls for display
  const getCurrentOverDisplay = () => {
    // Only show the balls for the current over
    return recentBalls.slice(-currentBall).map((ball, index) => {
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
      
      return (
        <div key={index} className={className}>
          {ball}
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
        className={`flex gap-2 items-center ${animateBox ? 'animate-pulse bg-amber-100' : 'bg-white'}`}
      >
        <Info className="h-4 w-4" />
        View Ball-by-Ball
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Ball-by-Ball Updates</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 p-2">
            <Card className="border-2 border-primary/10">
              <CardContent className="p-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-md">
                    Current Over: {currentOver}.{currentBall}
                  </h3>
                  <Badge className="bg-blue-600">{currentOverRuns} runs</Badge>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  {getCurrentOverDisplay()}
                  {currentBall === 0 && (
                    <div className="text-center w-full text-sm text-muted-foreground">
                      No balls bowled in this over yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-primary/10">
              <CardContent className="p-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-md">
                    Previous Over: {currentOver > 1 ? currentOver - 1 : '-'}
                  </h3>
                  <Badge className="bg-blue-600">{previousOverRuns} runs</Badge>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {previousOverBalls.length > 0 ? (
                    previousOverBalls.map((ball, index) => {
                      let className = "w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm";
                      
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
                      
                      return (
                        <div key={index} className={className}>
                          {ball}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center w-full text-sm text-muted-foreground">
                      No previous over data
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
