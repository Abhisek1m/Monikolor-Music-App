// src/context/MusicContext.jsx
import {
  mockLatestBollywood,
  mockOldBollywood,
  mockFavorites,
  mockRecentlyPlayed,
} from "../data/mockData.js";
import React, {
  useState,
  useRef,
  createContext,
  useCallback,
  useEffect,
} from "react";
import { db, auth } from "../firebase.js";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, deleteDoc } from "firebase/firestore";

export const MusicContext = createContext();
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const MusicProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVideo, setShowVideo] = useState(true);
  const [duration, setDuration] = useState(0);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState(mockRecentlyPlayed);
  const [latestBollywood, setLatestBollywood] = useState(mockLatestBollywood);
  const [oldBollywood, setOldBollywood] = useState(mockOldBollywood);
  const [favorites, setFavorites] = useState(mockFavorites);
  const [userId, setUserId] = useState(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off"); // "off" | "all" | "one"

  const playerRef = useRef(null);
  const intervalRef = useRef();
  const shuffledQueueRef = useRef([]);

  // --- AUTH & DATA FETCHING ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        signInAnonymously(auth).catch((err) =>
          console.error("Anonymous sign-in failed:", err)
        );
      }
    });
    return () => unsubscribe();
  }, []);

  // --- FAVORITES HANDLING ---
  const addFavorite = async (song) => {
    if (!userId) return;
    try {
      const docRef = doc(db, `users/${userId}/favorites`, song.id);
      await setDoc(docRef, song);
      setFavorites((prev) => [...prev, song]);
    } catch (err) {
      console.error("Error adding favorite:", err);
    }
  };

  const removeFavorite = async (songId) => {
    if (!userId) return;
    try {
      const docRef = doc(db, `users/${userId}/favorites`, songId);
      await deleteDoc(docRef);
      setFavorites((prev) => prev.filter((song) => song.id !== songId));
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  const isFavorite = (songId) => {
    return favorites.some((song) => song.id === songId);
  };

  useEffect(() => {
    if (currentSong && userId) {
      const docRef = doc(db, `users/${userId}/recentlyPlayed`, currentSong.id);
      setDoc(docRef, { ...currentSong, playedAt: new Date() }, { merge: true });
    }
  }, [currentSong, userId]);

  // --- PLAYER CONTROLS ---
  const playSong = useCallback(
    (song, fromPlaylist = null) => {
      if (fromPlaylist) {
        setSearchResults(fromPlaylist);
      }
      if (currentSong?.id === song.id) {
        togglePlay();
      } else {
        setCurrentSong(song);
      }
    },
    [currentSong]
  );

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;
    const playerState = playerRef.current.getPlayerState();
    if (playerState === 1) {
      // 1 = playing
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }, []);

  const getShuffledQueue = useCallback((currentList, currentSongId) => {
    if (!currentList.length) return [];
    const queue = [...currentList];
    const currentIndex = queue.findIndex((s) => s.id === currentSongId);

    // Remove current song if it exists
    if (currentIndex !== -1) {
      queue.splice(currentIndex, 1);
    }

    // Fisher-Yates shuffle
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }

    // Add current song back at the start if it existed
    if (currentIndex !== -1) {
      queue.unshift(currentList[currentIndex]);
    }

    return queue;
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffling((prev) => {
      const newIsShuffling = !prev;
      if (newIsShuffling) {
        const currentList =
          searchResults.length > 0 ? searchResults : recentlyPlayed;
        shuffledQueueRef.current = getShuffledQueue(
          currentList,
          currentSong?.id
        );
      }
      return newIsShuffling;
    });
  }, [searchResults, recentlyPlayed, currentSong, getShuffledQueue]);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((current) => {
      switch (current) {
        case "off":
          return "all";
        case "all":
          return "one";
        case "one":
          return "off";
        default:
          return "off";
      }
    });
  }, []);

  const playNext = useCallback(() => {
    const currentList =
      searchResults.length > 0 ? searchResults : recentlyPlayed;
    if (currentList.length === 0) return;

    if (repeatMode === "one") {
      if (playerRef.current) {
        playerRef.current.seekTo(0);
        playerRef.current.playVideo();
      }
      return;
    }

    if (isShuffling) {
      const currentIndex = shuffledQueueRef.current.findIndex(
        (s) => s.id === currentSong?.id
      );
      if (currentIndex === shuffledQueueRef.current.length - 1) {
        if (repeatMode === "all") {
          shuffledQueueRef.current = getShuffledQueue(currentList, null);
          setCurrentSong(shuffledQueueRef.current[0]);
        }
      } else {
        setCurrentSong(shuffledQueueRef.current[currentIndex + 1]);
      }
    } else {
      const currentIndex = currentList.findIndex(
        (s) => s.id === currentSong?.id
      );
      if (currentIndex === currentList.length - 1) {
        if (repeatMode === "all") {
          setCurrentSong(currentList[0]);
        }
      } else {
        setCurrentSong(currentList[currentIndex + 1]);
      }
    }
  }, [
    searchResults,
    recentlyPlayed,
    currentSong,
    isShuffling,
    repeatMode,
    getShuffledQueue,
  ]);

  const playPrev = useCallback(() => {
    const currentList =
      searchResults.length > 0 ? searchResults : recentlyPlayed;
    if (currentList.length === 0) return;

    if (repeatMode === "one") {
      if (playerRef.current) {
        playerRef.current.seekTo(0);
        playerRef.current.playVideo();
      }
      return;
    }

    if (isShuffling) {
      const currentIndex = shuffledQueueRef.current.findIndex(
        (s) => s.id === currentSong?.id
      );
      if (currentIndex === 0) {
        if (repeatMode === "all") {
          shuffledQueueRef.current = getShuffledQueue(currentList, null);
          setCurrentSong(
            shuffledQueueRef.current[shuffledQueueRef.current.length - 1]
          );
        }
      } else {
        setCurrentSong(shuffledQueueRef.current[currentIndex - 1]);
      }
    } else {
      const currentIndex = currentList.findIndex(
        (s) => s.id === currentSong?.id
      );
      if (currentIndex === 0) {
        if (repeatMode === "all") {
          setCurrentSong(currentList[currentList.length - 1]);
        }
      } else {
        setCurrentSong(currentList[currentIndex - 1]);
      }
    }
  }, [
    searchResults,
    recentlyPlayed,
    currentSong,
    isShuffling,
    repeatMode,
    getShuffledQueue,
  ]);

  const onScrub = (value) => {
    if (playerRef.current) {
      playerRef.current.seekTo(value);
      setTrackProgress(Number(value));
    }
  };

  const toggleVideo = () => setShowVideo((prev) => !prev);

  // --- YOUTUBE API ---
  const searchSongs = async (query) => {
    if (!query || !API_KEY) {
      setError("API Key is missing.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=18&q=${query}&key=${API_KEY}&type=video`
      );
      const data = await response.json();
      if (data.items) {
        const newSongs = data.items.map((item) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          artist: item.snippet.channelTitle,
          albumArt: item.snippet.thumbnails.high.url,
        }));
        setSearchResults(newSongs);
        if (newSongs.length > 0) {
          playSong(newSongs[0], newSongs);
        } else {
          setCurrentSong(null);
        }
      } else if (data.error) {
        setError(data.error.message);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch songs.");
    } finally {
      setIsLoading(false);
    }
  };

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
    playerRef.current.setVolume(volume * 100);
    event.target.playVideo();
  };

  const onPlayerStateChange = (event) => {
    const playerState = event.data;
    clearInterval(intervalRef.current);
    if (playerState === 1) {
      // Playing
      setIsPlaying(true);
      setDuration(playerRef.current.getDuration());
      intervalRef.current = setInterval(() => {
        setTrackProgress(playerRef.current?.getCurrentTime() || 0);
      }, 500);
    } else {
      setIsPlaying(false);
    }
    if (playerState === 0) {
      // Ended
      playNext();
    }
  };

  const value = {
    playerRef,
    searchResults,
    currentSong,
    isPlaying,
    trackProgress,
    duration,
    volume,
    showVideo,
    isLoading,
    error,
    playSong,
    togglePlay,
    playNext,
    playPrev,
    onScrub,
    setVolume,
    searchSongs,
    toggleVideo,
    recentlyPlayed,
    latestBollywood,
    oldBollywood,
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    onPlayerReady,
    onPlayerStateChange,
    isShuffling,
    toggleShuffle,
    repeatMode,
    cycleRepeatMode,
  };

  return (
    <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
  );
};
