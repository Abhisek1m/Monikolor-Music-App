// src/components/Player.jsx
import React from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  Heart,
  Video,
  VideoOff,
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
    showVideo,
    toggleVideo,
    isShuffling,
    toggleShuffle,
    repeatMode,
    cycleRepeatMode,
    addFavorite,
    removeFavorite,
    isFavorite,
  } = useMusic();

  const formatTime = (time) => {
    if (isNaN(time) || time === 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const getVolumeIcon = () => {
    if (Number(volume) === 0) return <VolumeX size={20} />;
    if (Number(volume) < 0.5) return <Volume1 size={20} />;
    return <Volume2 size={20} />;
  };

  const getRepeatIcon = () => {
    const commonProps = { size: 20 };
    switch (repeatMode) {
      case "one":
        return <Repeat1 {...commonProps} className="text-green-500" />;
      case "all":
        return <Repeat {...commonProps} className="text-green-500" />;
      default:
        return (
          <Repeat {...commonProps} className="text-zinc-400 hover:text-white" />
        );
    }
  };

  const toggleFavorite = () => {
    if (!currentSong) return;
    if (isFavorite(currentSong.id)) {
      removeFavorite(currentSong.id);
    } else {
      addFavorite(currentSong);
    }
  };

  return (
    <footer className="bg-zinc-900/80 backdrop-blur-md border-t border-zinc-700 p-4 flex flex-col sm:flex-row items-center justify-between fixed bottom-0 w-full">
      <div className="flex items-center gap-3 w-full sm:w-1/3 mb-3 sm:mb-0">
        {currentSong ? (
          <img
            src={currentSong.albumArt}
            alt={currentSong.title}
            className="w-14 h-14 rounded-md"
          />
        ) : (
          <div className="w-14 h-14 rounded-md bg-zinc-700"></div>
        )}
        <div>
          <strong className="font-normal truncate block max-w-[150px] sm:max-w-xs">
            {currentSong?.title || "No song selected"}
          </strong>
          <span className="text-xs text-zinc-400 block truncate">
            {currentSong?.artist || ""}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 w-full sm:w-1/3">
        <div className="flex items-center gap-6">
          <button
            onClick={toggleShuffle}
            disabled={!currentSong}
            className="disabled:opacity-50"
          >
            <Shuffle
              size={20}
              className={
                isShuffling
                  ? "text-green-500"
                  : "text-zinc-400 hover:text-white"
              }
            />
          </button>
          <button
            onClick={playPrev}
            disabled={!currentSong}
            className="disabled:opacity-50"
          >
            <SkipBack size={20} />
          </button>
          <button
            onClick={togglePlay}
            disabled={!currentSong}
            className="w-12 h-12 flex items-center justify-center pl-0.5 rounded-full bg-white text-black hover:scale-105 transition-transform disabled:opacity-50"
          >
            {isPlaying ? (
              <Pause size={24} fill="black" />
            ) : (
              <Play size={24} fill="black" />
            )}
          </button>
          <button
            onClick={() => playNext()}
            disabled={!currentSong}
            className="disabled:opacity-50"
          >
            <SkipForward size={20} />
          </button>
          <button
            onClick={cycleRepeatMode}
            disabled={!currentSong}
            className="disabled:opacity-50"
          >
            {getRepeatIcon()}
          </button>
        </div>
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-zinc-400">
            {formatTime(trackProgress)}
          </span>
          <input
            type="range"
            value={trackProgress}
            step="1"
            min="0"
            max={duration || 0}
            className="w-full h-1 rounded-full bg-zinc-700 appearance-none cursor-pointer accent-rose-500"
            onChange={(e) => onScrub(e.target.value)}
            onMouseUp={onScrubEnd}
            onTouchEnd={onScrubEnd}
            disabled={!currentSong}
          />
          <span className="text-xs text-zinc-400">{formatTime(duration)}</span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-1/3 justify-end px-4">
        <div className="flex items-center gap-4 w-full justify-between sm:justify-end">
          <button
            onClick={toggleVideo}
            className="p-2 rounded-full hover:bg-zinc-700"
          >
            {showVideo ? (
              <Video size={20} />
            ) : (
              <VideoOff size={20} className="text-rose-500" />
            )}
          </button>
          <button
            onClick={toggleFavorite}
            disabled={!currentSong}
            className="p-2 rounded-full hover:bg-zinc-700"
          >
            <Heart
              size={20}
              className={isFavorite(currentSong?.id) ? "text-rose-500" : ""}
            />
          </button>
          <div className="flex items-center gap-2 w-1/2 sm:w-auto">
            {getVolumeIcon()}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="w-full sm:w-24 h-1 bg-zinc-600 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Player;
