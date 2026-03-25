import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4 md:p-8 font-sans overflow-hidden relative">
      {/* Background Neon Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 blur-[120px] rounded-full"></div>
        
        {/* Grid lines for cyberpunk feel */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>

      <header className="mb-8 md:mb-12 text-center z-10">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-blue-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)] uppercase animate-pulse">
          Neon Beats
        </h1>
        <p className="text-cyan-300/70 mt-2 tracking-[0.3em] text-xs md:text-sm uppercase font-bold">
          Snake & Synthwave
        </p>
      </header>

      <div className="flex flex-col xl:flex-row gap-8 xl:gap-12 items-center xl:items-start justify-center w-full max-w-6xl z-10">
        <div className="w-full max-w-md xl:w-1/3 xl:sticky xl:top-8">
          <MusicPlayer />
        </div>
        
        <div className="flex-none">
          <SnakeGame />
        </div>
      </div>
      
      <footer className="mt-12 text-gray-600 text-xs font-mono tracking-widest uppercase z-10">
        AI Studio Build // 2026
      </footer>
    </div>
  );
}
