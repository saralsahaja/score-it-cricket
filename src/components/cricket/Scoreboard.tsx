
  // Simple ball rendering without animations for the main view
  const renderLastTwelveBalls = () => {
    const last12Balls = recentBalls.slice(-12);
    
    return (
      <div className="flex flex-wrap gap-2 justify-center items-center w-full">
        {last12Balls.map((ball, idx) => {
          // Style based on ball value
          let ballStyle = "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg";
          
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
          
          // Highlight the latest ball
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
