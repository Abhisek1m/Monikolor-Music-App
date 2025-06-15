// src/context/MusicContext.jsx

import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useCallback,
} from "react";
import { initialSongs } from "../data/mockData.js";

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [songs] = useState(initialSongs);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(new Audio());
  const intervalRef = useRef();

  const currentSong =
    currentSongIndex !== null ? songs[currentSongIndex] : null;

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      startTimer();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (currentSong) {
      audioRef.current.pause();
      audioRef.current = new Audio(currentSong.src);
      setTrackProgress(0);
      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current.duration);
      };
      if (isPlaying) {
        audioRef.current.play();
        startTimer();
      }
    }
  }, [currentSongIndex]);

  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        playNext();
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, 1000);
  };

  const onScrub = (value) => {
    clearInterval(intervalRef.current);
    audioRef.current.currentTime = value;
    setTrackProgress(audioRef.current.currentTime);
  };

  const onScrubEnd = () => {
    if (!isPlaying) {
      setIsPlaying(true);
    }
    startTimer();
  };

  const playSong = useCallback(
    (index) => {
      if (currentSongIndex !== index) {
        setCurrentSongIndex(index);
        setIsPlaying(true);
      } else {
        togglePlay();
      }
    },
    [currentSongIndex]
  );

  const togglePlay = useCallback(() => {
    if (currentSongIndex !== null) {
      setIsPlaying((prev) => !prev);
    } else if (songs.length > 0) {
      setCurrentSongIndex(0);
      setIsPlaying(true);
    }
  }, [currentSongIndex, songs]);

  const playNext = useCallback(() => {
    if (songs.length > 0) {
      const newIndex =
        currentSongIndex === null ? 0 : (currentSongIndex + 1) % songs.length;
      setCurrentSongIndex(newIndex);
      setIsPlaying(true);
    }
  }, [songs, currentSongIndex]);

  const playPrev = useCallback(() => {
    if (songs.length > 0) {
      const newIndex =
        currentSongIndex === null
          ? songs.length - 1
          : (currentSongIndex - 1 + songs.length) % songs.length;
      setCurrentSongIndex(newIndex);
      setIsPlaying(true);
    }
  }, [songs, currentSongIndex]);

  const value = {
    songs,
    currentSong,
    isPlaying,
    trackProgress,
    duration,
    playSong,
    togglePlay,
    playNext,
    playPrev,
    onScrub,
    onScrubEnd,
  };

  return (
    <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
  );
};
