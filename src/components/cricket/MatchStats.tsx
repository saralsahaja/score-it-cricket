
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 text-center shadow-md border-2 border-blue-300 dark:border-blue-700">
        <div className="text-sm text-blue-700 dark:text-blue-300 mb-1 font-semibold">Current RR</div>
        <div className="text-2xl font-bold flex items-center justify-center text-blue-700 dark:text-blue-300">
          <TrendingUp className="h-5 w-5 mr-1 text-blue-500 dark:text-blue-400" />
          {crr}
        </div>
      </div>
      
      {isSecondInnings && (
        <>
          {displayInfoType === 'reqRate' && (
            <div className="col-span-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 h-24 flex flex-col justify-center text-center shadow-md border-2 border-red-300 dark:border-red-700">
              <div className="text-sm text-red-700 dark:text-red-300 mb-1 font-semibold">Required Run Rate</div>
              <div className="flex items-center justify-center">
                <div className="text-2xl font-bold text-red-700 dark:text-red-300 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-1 text-red-500 dark:text-red-400" />
                  {rrr}
                </div>
                <span className="mx-2 text-red-600 dark:text-red-400">per over</span>
              </div>
            </div>
          )}
          
          {displayInfoType === 'toWin' && (
            <div className="col-span-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 h-24 flex flex-col justify-center text-center shadow-md border-2 border-purple-300 dark:border-purple-700">
              <div className="text-sm text-purple-700 dark:text-purple-300 mb-1 font-semibold">To Win</div>
              <div className="flex items-center justify-center">
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {runsLeft}
                </div>
                <span className="mx-2 text-purple-600 dark:text-purple-400">runs needed from</span>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {ballsLeft}
                </div>
                <span className="ml-2 text-blue-600 dark:text-blue-400">balls</span>
              </div>
            </div>
          )}
          
          {displayInfoType === 'partnership' && (
            <div className="col-span-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 h-24 flex flex-col justify-center text-center shadow-md border-2 border-amber-300 dark:border-amber-700">
              <div className="text-sm text-amber-700 dark:text-amber-300 mb-1 font-semibold">Current Partnership</div>
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="font-semibold py-1 px-2 bg-amber-100 dark:bg-amber-900/40 rounded-md text-amber-800 dark:text-amber-200">{striker || '---'}</span> 
                  <span className="text-xs mx-1">&amp;</span>
                  <span className="font-semibold py-1 px-2 bg-amber-100 dark:bg-amber-900/40 rounded-md text-amber-800 dark:text-amber-200">{nonStriker || '---'}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="flex gap-1 items-center">
                    <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">R</span>
                    </div>
                    <div className="text-xl font-bold text-amber-700 dark:text-amber-300">
                      {partnershipRuns}
                    </div>
                  </div>
                  <span className="text-amber-600 dark:text-amber-400">off</span>
                  <div className="flex gap-1 items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">B</span>
                    </div>
                    <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                      {partnershipBalls}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {!isSecondInnings && (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 h-24 flex flex-col justify-center text-center shadow-md col-span-3 border-2 border-amber-300 dark:border-amber-700">
          <div className="text-sm text-amber-700 dark:text-amber-300 mb-1 font-semibold">Current Partnership</div>
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="font-semibold py-1 px-2 bg-amber-100 dark:bg-amber-900/40 rounded-md text-amber-800 dark:text-amber-200">{striker || '---'}</span> 
              <span className="text-xs mx-1">&amp;</span>
              <span className="font-semibold py-1 px-2 bg-amber-100 dark:bg-amber-900/40 rounded-md text-amber-800 dark:text-amber-200">{nonStriker || '---'}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="flex gap-1 items-center">
                <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">R</span>
                </div>
                <div className="text-xl font-bold text-amber-700 dark:text-amber-300">
                  {partnershipRuns}
                </div>
              </div>
              <span className="text-amber-600 dark:text-amber-400">off</span>
              <div className="flex gap-1 items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">B</span>
                </div>
                <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                  {partnershipBalls}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
