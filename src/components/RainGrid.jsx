import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

const AnimatedGrid = () => {
  const ROWS = 15;
  const COLS = 20;
  const [grid, setGrid] = useState([]);
  const [columnColors, setColumnColors] = useState([]);
  const [animationType, setAnimationType] = useState('rain');
  
  // Generate random color with varying opacity
  const getRandomColor = () => {
    const colors = ['#ff0000', '#ff00ff', '#990000', '#cc0000'];
    const opacity = Math.random() * 0.8 + 0.2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    return `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
  };

  const getStarColor = () => {
    const colors = ['#FFD700', '#FFA500', '#FFFF00', '#FFFFFF'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Initialize empty grid and column colors
  useEffect(() => {
    const newGrid = Array(ROWS).fill().map(() => Array(COLS).fill(null));
    const newColumnColors = Array(COLS).fill(null);
    setGrid(newGrid);
    setColumnColors(newColumnColors);
  }, []);

  // Animation 
  useEffect(() => {
    const interval = setInterval(() => {
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(row => [...row]);
        
        if (animationType === 'rain') {
          // Rain animation 
          for (let i = ROWS - 1; i > 0; i--) {
            for (let j = 0; j < COLS; j++) {
              newGrid[i][j] = newGrid[i-1][j];
            }
          }
          
          for (let j = 0; j < COLS; j++) {
            if (newGrid[1] && newGrid[1][j]) {
              newGrid[0][j] = Math.random() < 0.9 ? { active: true } : null;
            } else {
              if (Math.random() < 0.05) {
                setColumnColors(prev => {
                  const newColors = [...prev];
                  newColors[j] = getRandomColor();
                  return newColors;
                });
                newGrid[0][j] = { active: true };
              } else {
                newGrid[0][j] = null;
              }
            }
          }
        } else if (animationType === 'stars1') {
          // Twinkling stars
          return Array(ROWS).fill().map(() => 
            Array(COLS).fill().map(() => 
              Math.random() < 0.1 ? { type: 'star', color: getStarColor() } : null
            )
          );
        } else if (animationType === 'stars2') {
          // Expanding stars 
          for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
              if (newGrid[i][j] && newGrid[i][j].size < 3) {
                newGrid[i][j].size += 0.2;
              } else if (newGrid[i][j]) {
                newGrid[i][j] = null;
              } else if (Math.random() < 0.02) {
                newGrid[i][j] = { 
                  type: 'star',
                  color: getStarColor(),
                  size: 0.5
                };
              }
            }
          }
        }
        
        return newGrid;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [animationType]);

  return (
    <div className="flex flex-col items-center p-4 gap-4">
      <div className="flex gap-2">
        <button 
          onClick={() => setAnimationType('rain')}
          className={`px-4 py-2 rounded ${animationType === 'rain' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
        >
          Rain
        </button>
        <button 
          onClick={() => setAnimationType('stars1')}
          className={`px-4 py-2 rounded ${animationType === 'stars1' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
        >
          Twinkling Stars
        </button>
        <button 
          onClick={() => setAnimationType('stars2')}
          className={`px-4 py-2 rounded ${animationType === 'stars2' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
        >
          Expanding Stars
        </button>
      </div>
      
      <div className="bg-gray-900 p-2 rounded-lg">
        <div 
          className="grid gap-0" 
          style={{ 
            gridTemplateColumns: `repeat(${COLS}, 1.5rem)`,
            gridTemplateRows: `repeat(${ROWS}, 1.5rem)`,
            border: '1px solid #333'
          }}
        >
          {grid.map((row, i) => 
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className="transition-all duration-100 flex items-center justify-center"
                style={{
                  backgroundColor: cell && !cell.type ? columnColors[j] : 'transparent',
                  width: '1.5rem',
                  height: '1.5rem',
                  border: '1px solid #333',
                }}
              >
                {cell?.type === 'star' && (
                  <Star
                    size={cell.size ? 24 * cell.size : 16}
                    color={cell.color}
                    fill={cell.color}
                    className="transition-all duration-100"
                    style={{
                      opacity: cell.size ? cell.size / 3 : 1
                    }}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimatedGrid;