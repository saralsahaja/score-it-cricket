
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface BallByBallProps {
  recentBalls: string[];
  totalBalls: number;
  striker: string | null;
  bowler: { name: string } | null;
}

export default function BallByBall({
  recentBalls,
  totalBalls,
  striker,
  bowler
}: BallByBallProps) {
  const [showBallsPopover, setShowBallsPopover] = useState(false);

  const getLatestBallDescription = () => {
    const latestBall = recentBalls[recentBalls.length - 1];
    if (!latestBall) return '';

    switch (latestBall) {
      case 'W':
        return `WICKET! ${striker || 'Batsman'} is out!`;
      case '4':
        return `FOUR! ${striker || 'Batsman'} hits a boundary!`;
      case '6':
        return `SIX! ${striker || 'Batsman'} clears the rope!`;
      case 'WD':
        return `Wide ball! Extra run added.`;
      case 'NB':
        return `No ball! Free hit coming up.`;
      case 'LB':
        return `Leg bye! One run taken.`;
      case 'OT':
        return `Overthrow! Extra runs to the batting team.`;
      case '0':
        return `Dot ball! Good delivery by ${bowler?.name || 'bowler'}.`;
      default:
        return `${latestBall} run(s) taken by ${striker || 'batsman'}.`;
    }
  };

  const groupBallsByOver = () => {
    const groupedBalls: { [key: number]: string[] } = {};
    let legalBallCount = 0;
    
    // Count legal balls to determine which over each ball belongs to
    // Extras (WD, NB) don't count as legal deliveries but stay in the same over
    for (let i = 0; i < recentBalls.length; i++) {
      const ball = recentBalls[i];
      const currentOver = Math.floor(legalBallCount / 6);
      
      if (!groupedBalls[currentOver]) {
        groupedBalls[currentOver] = [];
      }
      
      groupedBalls[currentOver].push(ball);
      
      // Only increment legal ball count for legal deliveries (not WD or NB)
      if (!['WD', 'NB'].includes(ball)) {
        legalBallCount++;
      }
    }
    
    return groupedBalls;
  };

  const renderLastTwelveBalls = () => {
    const last12Balls = recentBalls.slice(-12);
    
    return (
      <div className="flex flex-wrap gap-1 justify-start items-center w-full">
        {last12Balls.map((ball, idx) => {
          let ballStyle = "w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs";
          
          if (ball === 'W') {
            ballStyle += " bg-red-600 text-white";
          } else if (ball === '4') {
            ballStyle += " bg-blue-500 text-white";
          } else if (ball === '6') {
            ballStyle += " bg-purple-600 text-white";
          } else if (ball === '0') {
            ballStyle += " bg-gray-400 dark:bg-gray-600 text-white";
          } else if (['WD', 'NB', 'LB', 'OT'].includes(ball)) {
            ballStyle += " bg-yellow-500 text-white";
          } else {
            ballStyle += " bg-green-500 text-white";
          }
          
          if (idx === last12Balls.length - 1) {
            ballStyle += " ring-2 ring-yellow-300 dark:ring-yellow-500";
          }
          
          return (
            <div key={`ball-${idx}`} className={ballStyle}>
              {ball}
            </div>
          );
        })}
      </div>
    );
  };

  const renderBallByBallPopover = () => {
    const groupedBalls = groupBallsByOver();
    const currentOverNumber = Math.floor(totalBalls / 6);
    
    return (
      <div className="w-full max-w-xl p-2">
        <div className="text-center font-bold text-xl text-primary mb-2">Ball-by-Ball Updates</div>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {Object.entries(groupedBalls)
            .sort((a, b) => Number(b[0]) - Number(a[0]))
            .map(([overNumber, balls]) => (
              <div key={`over-${overNumber}`} className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <div className="font-medium text-blue-700 dark:text-blue-300 mb-2">
                  Over {overNumber} {Number(overNumber) === currentOverNumber ? '(Current)' : ''}
                </div>
                <div className="flex flex-wrap gap-2">
                  {balls.map((ball, idx) => {
                    const isLatestInOver = Number(overNumber) === currentOverNumber && idx === balls.length - 1;
                    const isLatestBall = Number(overNumber) === currentOverNumber && idx === balls.length - 1 && 
                                        (Number(overNumber) === currentOverNumber);
                    
                    let ballStyle = "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all duration-300";
                    
                    if (ball === 'W') {
                      ballStyle += " bg-red-600 animate-pulse";
                    } else if (ball === '4') {
                      ballStyle += " bg-blue-500";
                    } else if (ball === '6') {
                      ballStyle += " bg-purple-600";
                    } else if (ball === '0') {
                      ballStyle += " bg-gray-400 dark:bg-gray-600";
                    } else if (['WD', 'NB', 'LB', 'OT'].includes(ball)) {
                      ballStyle += " bg-yellow-500";
                    } else {
                      ballStyle += " bg-green-500";
                    }
                    
                    if (isLatestBall) {
                      ballStyle += " ring-4 ring-yellow-300 dark:ring-yellow-500 shadow-lg scale-110";
                    } else if (isLatestInOver) {
                      ballStyle += " ring-2 ring-blue-300 dark:ring-blue-500";
                    }
                    
                    return (
                      <div key={`ball-${overNumber}-${idx}`} className={ballStyle}>
                        {ball}
                      </div>
                    );
                  })}
                </div>
                
                {Number(overNumber) === currentOverNumber && balls.length > 0 && (
                  <div className="mt-3 bg-white dark:bg-gray-800 p-3 rounded-md shadow text-center text-lg font-medium border-l-4 border-primary">
                    {getLatestBallDescription()}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mb-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-2 shadow-sm border border-gray-300 dark:border-gray-700">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold">Last 12 Balls</span>
        <Dialog open={showBallsPopover} onOpenChange={setShowBallsPopover}>
          <DialogTrigger asChild>
            <button 
              className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-0.5 rounded-full transition-colors"
            >
              View All
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            {renderBallByBallPopover()}
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center justify-center overflow-x-auto py-1">
        {renderLastTwelveBalls()}
      </div>
    </div>
  );
}
