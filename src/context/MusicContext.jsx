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
  const [volume, setVolume] = useState(1);
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState("none"); // 'none', 'one', 'all'

  const audioRef = useRef(new Audio());
  const intervalRef = useRef();
  const isReady = useRef(false);

  const currentSong =
    currentSongIndex !== null ? songs[currentSongIndex] : null;

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (isPlaying && isReady.current) {
      audioRef.current.play();
      startTimer();
    } else {
      clearInterval(intervalRef.current);
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (currentSong) {
      isReady.current = false;
      audioRef.current.pause();
      audioRef.current = new Audio(currentSong.src);
      audioRef.current.volume = volume;
      setTrackProgress(0);

      audioRef.current.oncanplaythrough = () => {
        isReady.current = true;
        setDuration(audioRef.current.duration);
        if (isPlaying) {
          audioRef.current.play();
          startTimer();
        }
      };

      audioRef.current.onended = () => {
        handleSongEnd();
      };
    }
  }, [currentSongIndex]);

  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTrackProgress(audioRef.current.currentTime);
    }, 1000);
  };

  const handleSongEnd = () => {
    if (repeatMode === "one") {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      playNext(true); // Pass true to indicate it's an auto-next
    }
  };

  const onScrub = (value) => {
    clearInterval(intervalRef.current);
    audioRef.current.currentTime = value;
    setTrackProgress(audioRef.current.currentTime);
  };

  const onScrubEnd = () => {
    if (isPlaying) {
      startTimer();
    }
  };

  const togglePlay = useCallback(() => {
    if (currentSongIndex === null && songs.length > 0) {
      setCurrentSongIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  }, [currentSongIndex, songs]);

  const playSong = useCallback(
    (index) => {
      if (currentSongIndex === index) {
        togglePlay();
      } else {
        setCurrentSongIndex(index);
        setIsPlaying(true);
      }
    },
    [currentSongIndex, togglePlay]
  );

  const playNext = useCallback(
    (isAutoNext = false) => {
      if (songs.length === 0) return;

      if (isShuffling) {
        let nextIndex;
        do {
          nextIndex = Math.floor(Math.random() * songs.length);
        } while (songs.length > 1 && nextIndex === currentSongIndex);
        setCurrentSongIndex(nextIndex);
        return;
      }

      const isLastSong = currentSongIndex === songs.length - 1;
      if (repeatMode === "all" || !isLastSong) {
        const newIndex = isLastSong ? 0 : currentSongIndex + 1;
        setCurrentSongIndex(newIndex);
      } else if (isAutoNext && isLastSong) {
        // Stop at the end of the playlist if not repeating
        setIsPlaying(false);
        setCurrentSongIndex(null);
      } else if (!isAutoNext) {
        // Allow manual next to loop to start
        setCurrentSongIndex(0);
      }
    },
    [songs, currentSongIndex, isShuffling, repeatMode]
  );

  const playPrev = useCallback(() => {
    if (songs.length > 0) {
      const newIndex = (currentSongIndex - 1 + songs.length) % songs.length;
      setCurrentSongIndex(newIndex);
      setIsPlaying(true);
    }
  }, [songs, currentSongIndex]);

  const toggleShuffle = () => setIsShuffling((prev) => !prev);

  const cycleRepeatMode = () => {
    const modes = ["none", "all", "one"];
    const currentModeIndex = modes.indexOf(repeatMode);
    const nextModeIndex = (currentModeIndex + 1) % modes.length;
    setRepeatMode(modes[nextModeIndex]);
  };

  const value = {
    songs,
    currentSong,
    isPlaying,
    trackProgress,
    duration,
    volume,
    isShuffling,
    repeatMode,
    playSong,
    togglePlay,
    playNext,
    playPrev,
    onScrub,
    onScrubEnd,
    setVolume,
    toggleShuffle,
    cycleRepeatMode,
  };

  return (
    <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
  );
};
