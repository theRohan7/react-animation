import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const RainGrid = () => {
  const ROWS = 15;
  const COLS = 20;
  const [color, setColor] = useState('#0000FF');
  const [grid, setGrid] = useState(Array(ROWS).fill(Array(COLS).fill(false)));

  useEffect(() => {
    const colorInterval = setInterval(() => {
      const hue = (Date.now() / 50) % 360;
      setColor(`hsl(${hue}, 100%, 50%)`);
    }, 100);

    const rainInterval = setInterval(() => {
      setGrid((prev) => {
        const newGrid = prev.map((row) => [...row]);

        for (let i = ROWS - 1; i > 0; i--) {
          newGrid[i] = newGrid[i - 1];
        }
        // Generate new drops with reduced density
        newGrid[0] = Array(COLS).fill().map(() => Math.random() < 0.02);
        return newGrid;
      });
    }, 50);

    return () => {
      clearInterval(colorInterval);
      clearInterval(rainInterval);
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-black">
      <div
        className="grid "
        style={{ gridTemplateColumns: `repeat(${COLS}, 40px)` }}
      >
        {grid.map((row, i) =>
          row.map((isActive, j) => (
            <motion.div
              key={`${i}-${j}`}
              className="h-10 w-10 border border-gray-800"
              animate={{
                backgroundColor: isActive ? color : '#000000',
                opacity: isActive ? 1 - (i / ROWS) * 0.7 : 1,
              }}
              transition={{ duration: 0.2 }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default RainGrid;