import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const INITIAL_FOOD = { x: 15, y: 10 };
const SPEED = 120;

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const directionRef = useRef(direction);

  const moveSnake = useCallback(() => {
    if (gameOver || !isPlaying) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + directionRef.current.x,
        y: head.y + directionRef.current.y,
      };

      // Check collision with walls
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        setIsPlaying(false);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      // Check collision with self
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        setIsPlaying(false);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        // Generate new food that is not on the snake
        let newFood;
        while (true) {
          newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
          };
          if (!newSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
            break;
          }
        }
        setFood(newFood);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, gameOver, isPlaying, score, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (!isPlaying && !gameOver && e.key === ' ') {
        setIsPlaying(true);
        return;
      }

      if (gameOver && e.key === ' ') {
        resetGame();
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (directionRef.current.y === 0) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (directionRef.current.y === 0) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (directionRef.current.x === 0) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (directionRef.current.x === 0) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver]);

  useEffect(() => {
    const interval = setInterval(moveSnake, SPEED);
    return () => clearInterval(interval);
  }, [moveSnake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(INITIAL_FOOD);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col items-center bg-gray-900/50 p-6 rounded-2xl border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] backdrop-blur-sm">
      <div className="flex justify-between w-full mb-4 px-2">
        <div className="text-cyan-400 font-bold tracking-widest uppercase text-sm">
          Score: <span className="text-white text-lg">{score}</span>
        </div>
        <div className="text-fuchsia-400 font-bold tracking-widest uppercase text-sm">
          Best: <span className="text-white text-lg">{highScore}</span>
        </div>
      </div>

      <div 
        className="relative bg-black/80 border-2 border-cyan-500/50 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] overflow-hidden"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      >
        {/* Food */}
        <div
          className="absolute bg-fuchsia-500 rounded-full shadow-[0_0_10px_rgba(217,70,239,0.8)]"
          style={{
            width: 20,
            height: 20,
            left: food.x * 20,
            top: food.y * 20,
            transform: 'scale(0.8)'
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={`${segment.x}-${segment.y}-${index}`}
            className={`absolute ${index === 0 ? 'bg-cyan-300 z-10' : 'bg-cyan-500'} rounded-sm`}
            style={{
              width: 20,
              height: 20,
              left: segment.x * 20,
              top: segment.y * 20,
              boxShadow: index === 0 ? '0 0 15px rgba(103,232,249,0.8)' : '0 0 5px rgba(6,182,212,0.5)',
              transform: 'scale(0.9)'
            }}
          />
        ))}

        {/* Overlays */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-[2px]">
            <button 
              onClick={() => setIsPlaying(true)}
              className="flex items-center gap-2 px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400 text-cyan-300 rounded-full transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-105 uppercase tracking-widest font-bold text-sm"
            >
              <Play size={18} /> Start Game
            </button>
            <p className="text-cyan-500/70 mt-4 text-xs tracking-widest uppercase">Press Space to start</p>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-[3px]">
            <h2 className="text-3xl font-black text-fuchsia-500 mb-2 drop-shadow-[0_0_10px_rgba(217,70,239,0.8)] uppercase tracking-widest">Game Over</h2>
            <p className="text-cyan-300 mb-6 font-mono">Final Score: {score}</p>
            <button 
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-3 bg-fuchsia-500/20 hover:bg-fuchsia-500/40 border border-fuchsia-400 text-fuchsia-300 rounded-full transition-all hover:shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:scale-105 uppercase tracking-widest font-bold text-sm"
            >
              <RotateCcw size={18} /> Play Again
            </button>
            <p className="text-fuchsia-500/70 mt-4 text-xs tracking-widest uppercase">Press Space to restart</p>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex gap-4 text-cyan-500/50 text-xs uppercase tracking-widest">
        <span>Use Arrow Keys or WASD to move</span>
      </div>
    </div>
  );
}
