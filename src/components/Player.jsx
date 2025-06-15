import React from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  Maximize2,
  Heart,
  Mic2,
  ListMusic,
  Repeat,
  Repeat1,
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
    volume,
    setVolume,
    isShuffling,
    toggleShuffle,
    repeatMode,
    cycleRepeatMode,
  } = useMusic();

  const formatTime = (time) => {
    if (isNaN(time) || time === 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const currentPercentage = duration ? (trackProgress / duration) * 100 : 0;

  const getRepeatIcon = () => {
    const commonProps = { size: 20 };
    switch (repeatMode) {
      case "one":
        return <Repeat1 {...commonProps} className="text-green-500" />;
      case "all":
        return <Repeat {...commonProps} className="text-green-500" />;
      default:
        return (
          <Repeat {...commonProps} className="text-zinc-300 hover:text-white" />
        );
    }
  };

  const getVolumeIcon = () => {
    if (Number(volume) === 0) return <VolumeX size={20} />;
    if (Number(volume) < 0.5) return <Volume1 size={20} />;
    return <Volume2 size={20} />;
  };

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
          <button onClick={toggleShuffle} className="hidden sm:block">
            <Shuffle
              size={20}
              className={
                isShuffling
                  ? "text-green-500"
                  : "text-zinc-300 hover:text-white"
              }
            />
          </button>
          <button onClick={playPrev}>
            <SkipBack size={20} className="text-zinc-300 hover:text-white" />
          </button>
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
          <button onClick={() => playNext()}>
            <SkipForward size={20} className="text-zinc-300 hover:text-white" />
          </button>
          <button onClick={cycleRepeatMode} className="hidden sm:block">
            {getRepeatIcon()}
          </button>
        </div>
        <div className="hidden md:flex items-center gap-2 w-full">
          <span className="text-xs text-zinc-400">
            {formatTime(trackProgress)}
          </span>
          <div
            className="h-1 rounded-full w-full bg-zinc-600 group relative cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickPosition = e.clientX - rect.left;
              const newTime = (clickPosition / rect.width) * duration;
              onScrub(newTime);
              onScrubEnd();
            }}
          >
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
          {getVolumeIcon()}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className="w-24 h-1 bg-zinc-600 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
        </div>
        <Maximize2 size={20} className="hidden lg:block" />
      </div>
    </footer>
  );
};

export default Player;
