
import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";

interface MatchStatsProps {
  crr: string;
  isSecondInnings: boolean;
  rrr: string;
  runsLeft: number;
  ballsLeft: number;
  striker: string | null;
  nonStriker: string | null;
  partnershipRuns: number;
  partnershipBalls: number;
}

export default function MatchStats({
  crr,
  isSecondInnings,
  rrr,
  runsLeft,
  ballsLeft,
  striker,
  nonStriker,
  partnershipRuns,
  partnershipBalls
}: MatchStatsProps) {
  const [displayInfoType, setDisplayInfoType] = useState<'reqRate' | 'toWin' | 'partnership'>(isSecondInnings ? 'reqRate' : 'partnership');

  useEffect(() => {
    if (!isSecondInnings) {
      setDisplayInfoType('partnership');
      return;
    }
    
    const interval = setInterval(() => {
      setDisplayInfoType(current => {
        if (current === 'reqRate') return 'toWin';
        if (current === 'toWin') return 'partnership';
        return 'reqRate';
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isSecondInnings]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-2 text-center shadow-sm border border-blue-300 dark:border-blue-700">
        <div className="text-xs text-blue-700 dark:text-blue-300 font-semibold">Current RR</div>
        <div className="text-lg font-bold flex items-center justify-center text-blue-700 dark:text-blue-300">
          <TrendingUp className="h-4 w-4 mr-1 text-blue-500 dark:text-blue-400" />
          {crr}
        </div>
      </div>
      
      {isSecondInnings && (
        <>
          {displayInfoType === 'reqRate' && (
            <div className="col-span-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-2 h-14 flex flex-col justify-center text-center shadow-sm border border-red-300 dark:border-red-700">
              <div className="text-xs text-red-700 dark:text-red-300 font-semibold">Required Run Rate</div>
              <div className="flex items-center justify-center">
                <div className="text-lg font-bold text-red-700 dark:text-red-300 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1 text-red-500 dark:text-red-400" />
                  {rrr}
                </div>
                <span className="mx-1 text-xs text-red-600 dark:text-red-400">per over</span>
              </div>
            </div>
          )}
          
          {displayInfoType === 'toWin' && (
            <div className="col-span-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-2 h-14 flex flex-col justify-center text-center shadow-sm border border-purple-300 dark:border-purple-700">
              <div className="text-xs text-purple-700 dark:text-purple-300 font-semibold">To Win</div>
              <div className="flex items-center justify-center text-sm">
                <span className="font-bold text-purple-700 dark:text-purple-300">{runsLeft}</span>
                <span className="mx-1 text-purple-600 dark:text-purple-400">runs from</span>
                <span className="font-bold text-blue-700 dark:text-blue-300">{ballsLeft}</span>
                <span className="ml-1 text-blue-600 dark:text-blue-400">balls</span>
              </div>
            </div>
          )}
          
          {displayInfoType === 'partnership' && (
            <div className="col-span-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-2 h-14 flex flex-col justify-center text-center shadow-sm border border-amber-300 dark:border-amber-700">
              <div className="text-xs text-amber-700 dark:text-amber-300 font-semibold">Partnership</div>
              <div className="flex items-center justify-center gap-1 text-xs">
                <span className="font-semibold px-1 bg-amber-100 dark:bg-amber-900/40 rounded text-amber-800 dark:text-amber-200">{striker || '---'}</span> 
                <span>&amp;</span>
                <span className="font-semibold px-1 bg-amber-100 dark:bg-amber-900/40 rounded text-amber-800 dark:text-amber-200">{nonStriker || '---'}</span>
                <span className="mx-1">|</span>
                <span className="font-bold text-amber-700 dark:text-amber-300">{partnershipRuns}</span>
                <span className="text-amber-600 dark:text-amber-400">({partnershipBalls})</span>
              </div>
            </div>
          )}
        </>
      )}
      
      {!isSecondInnings && (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-2 h-14 flex flex-col justify-center text-center shadow-sm col-span-3 border border-amber-300 dark:border-amber-700">
          <div className="text-xs text-amber-700 dark:text-amber-300 font-semibold">Partnership</div>
          <div className="flex items-center justify-center gap-1 text-xs">
            <span className="font-semibold px-1 bg-amber-100 dark:bg-amber-900/40 rounded text-amber-800 dark:text-amber-200">{striker || '---'}</span> 
            <span>&amp;</span>
            <span className="font-semibold px-1 bg-amber-100 dark:bg-amber-900/40 rounded text-amber-800 dark:text-amber-200">{nonStriker || '---'}</span>
            <span className="mx-1">|</span>
            <span className="font-bold text-amber-700 dark:text-amber-300">{partnershipRuns}</span>
            <span className="text-amber-600 dark:text-amber-400">({partnershipBalls})</span>
          </div>
        </div>
      )}
    </div>
  );
}
