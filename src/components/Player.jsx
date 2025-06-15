import React from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize2,
  Heart,
  Mic2,
  ListMusic,
  Repeat,
  Shuffle,
} from "lucide-react";
import { useMusic } from "../hooks/useMusic.js";

const Player = () => {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    playNext,
    playPrev,
    trackProgress,
    duration,
    onScrub,
    onScrubEnd,
  } = useMusic();

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const currentPercentage = duration ? (trackProgress / duration) * 100 : 0;

  if (!currentSong) {
    return (
      <footer className="bg-zinc-800/80 backdrop-blur-md border-t border-zinc-700 p-4 flex items-center justify-between fixed bottom-0 w-full">
        <div className="text-zinc-400">Select a song to begin</div>
      </footer>
    );
  }

  return (
    <footer className="bg-zinc-800/80 backdrop-blur-md border-t border-zinc-700 p-4 flex items-center justify-between fixed bottom-0 w-full">
      <div className="flex items-center gap-3 w-1/3">
        <img
          src={currentSong.albumArt}
          alt={currentSong.title}
          className="w-14 h-14 rounded-md"
        />
        <div className="hidden sm:block">
          <strong className="font-normal">{currentSong.title}</strong>
          <span className="text-xs text-zinc-400 block">
            {currentSong.artist}
          </span>
        </div>
        <Heart
          size={20}
          className="text-zinc-400 hover:text-rose-400 cursor-pointer ml-4 hidden md:block"
        />
      </div>

      <div className="flex flex-col items-center gap-2 w-1/3">
        <div className="flex items-center gap-6">
          <Shuffle
            size={20}
            className="text-zinc-300 hover:text-white cursor-pointer hidden sm:block"
          />
          <SkipBack
            size={20}
            className="text-zinc-300 hover:text-white cursor-pointer"
            onClick={playPrev}
          />
          <button
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center pl-0.5 rounded-full bg-white text-black hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause size={24} fill="black" />
            ) : (
              <Play size={24} fill="black" />
            )}
          </button>
          <SkipForward
            size={20}
            className="text-zinc-300 hover:text-white cursor-pointer"
            onClick={playNext}
          />
          <Repeat
            size={20}
            className="text-zinc-300 hover:text-white cursor-pointer hidden sm:block"
          />
        </div>
        <div className="hidden md:flex items-center gap-2 w-full">
          <span className="text-xs text-zinc-400">
            {formatTime(trackProgress)}
          </span>
          <div className="h-1 rounded-full w-full bg-zinc-600 group relative">
            <input
              type="range"
              value={trackProgress}
              step="1"
              min="0"
              max={duration ? duration : 0}
              className="w-full h-1 rounded-full bg-transparent appearance-none cursor-pointer absolute z-10"
              onChange={(e) => onScrub(e.target.value)}
              onMouseUp={onScrubEnd}
              onTouchEnd={onScrubEnd}
            />
            <div
              className="bg-zinc-400 h-1 rounded-full absolute"
              style={{ width: `${currentPercentage}%` }}
            ></div>
            <div
              className="bg-rose-500 h-1 rounded-full absolute group-hover:bg-green-500"
              style={{ width: `${currentPercentage}%` }}
            ></div>
          </div>
          <span className="text-xs text-zinc-400">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 w-1/3 justify-end">
        <Mic2 size={20} className="hidden lg:block" />
        <ListMusic size={20} className="hidden lg:block" />
        <div className="hidden md:flex items-center gap-2">
          <Volume2 size={20} />
          <div className="h-1 rounded-full w-24 bg-zinc-600">
            <div className="bg-white h-1 rounded-full w-3/4"></div>
          </div>
        </div>
        <Maximize2 size={20} className="hidden lg:block" />
      </div>
    </footer>
  );
};

export default Player;
