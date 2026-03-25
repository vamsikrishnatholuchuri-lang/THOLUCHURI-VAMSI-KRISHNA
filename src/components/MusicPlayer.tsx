import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  { id: 1, title: "Neon Dreams", artist: "AI Gen - Synthwave", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "Cybernetic Pulse", artist: "AI Gen - Cyberpunk", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "Digital Horizon", artist: "AI Gen - Retrowave", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Audio playback failed:", error);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(e => console.error("Audio play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-900/50 p-6 rounded-2xl border border-fuchsia-500/30 shadow-[0_0_30px_rgba(217,70,239,0.15)] backdrop-blur-sm w-full">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-fuchsia-600 to-cyan-600 flex items-center justify-center shadow-[0_0_15px_rgba(217,70,239,0.4)] relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <Music className={`text-white z-10 ${isPlaying ? 'animate-pulse' : ''}`} size={28} />
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center gap-1 z-0 opacity-50">
              <div className="w-1 h-8 bg-white animate-[bounce_1s_infinite_0.1s]"></div>
              <div className="w-1 h-12 bg-white animate-[bounce_1s_infinite_0.3s]"></div>
              <div className="w-1 h-6 bg-white animate-[bounce_1s_infinite_0.5s]"></div>
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-hidden">
          <h3 className="text-fuchsia-400 font-bold text-lg truncate drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]">
            {currentTrack.title}
          </h3>
          <p className="text-cyan-300/70 text-sm truncate uppercase tracking-wider text-xs mt-1">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <input 
          type="range" 
          min="0" 
          max={duration || 100} 
          value={progress} 
          onChange={handleProgressChange}
          className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-500 hover:accent-fuchsia-400 transition-all"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-cyan-400 transition-colors p-2">
            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume} 
            onChange={(e) => {
              setVolume(Number(e.target.value));
              if (Number(e.target.value) > 0) setIsMuted(false);
            }}
            className="w-20 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 hidden sm:block"
          />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={prevTrack}
            className="p-2 text-gray-300 hover:text-fuchsia-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]"
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center bg-fuchsia-500 hover:bg-fuchsia-400 text-white rounded-full transition-all shadow-[0_0_15px_rgba(217,70,239,0.5)] hover:shadow-[0_0_25px_rgba(217,70,239,0.8)] hover:scale-105"
          >
            {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
          </button>
          
          <button 
            onClick={nextTrack}
            className="p-2 text-gray-300 hover:text-fuchsia-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]"
          >
            <SkipForward size={24} />
          </button>
        </div>
        
        <div className="w-8 sm:w-28"></div> {/* Spacer for balance */}
      </div>
      
      {/* Playlist Preview */}
      <div className="mt-8 border-t border-gray-800 pt-4">
        <h4 className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-bold">Up Next</h4>
        <div className="space-y-2">
          {TRACKS.map((track, idx) => (
            <div 
              key={track.id} 
              onClick={() => {
                setCurrentTrackIndex(idx);
                setIsPlaying(true);
              }}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                currentTrackIndex === idx 
                  ? 'bg-fuchsia-500/10 border border-fuchsia-500/20' 
                  : 'hover:bg-gray-800/50 border border-transparent'
              }`}
            >
              <div className={`text-xs font-mono w-4 ${currentTrackIndex === idx ? 'text-fuchsia-400' : 'text-gray-600'}`}>
                {idx + 1}
              </div>
              <div className="flex-1 truncate">
                <div className={`text-sm truncate ${currentTrackIndex === idx ? 'text-fuchsia-300' : 'text-gray-300'}`}>
                  {track.title}
                </div>
              </div>
              {currentTrackIndex === idx && isPlaying && (
                <div className="flex gap-0.5 h-3 items-end">
                  <div className="w-0.5 bg-fuchsia-500 animate-[bounce_0.8s_infinite_0.1s] h-full"></div>
                  <div className="w-0.5 bg-fuchsia-500 animate-[bounce_0.8s_infinite_0.3s] h-2/3"></div>
                  <div className="w-0.5 bg-fuchsia-500 animate-[bounce_0.8s_infinite_0.5s] h-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
