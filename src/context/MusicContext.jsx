// src/context/MusicContext.jsx
import React, {
  useState,
  useRef,
  createContext,
  useCallback,
  useEffect,
} from "react";
import YouTube from "react-youtube";

export const MusicContext = createContext();
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const MusicProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVideo, setShowVideo] = useState(true);
  const [duration, setDuration] = useState(0);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState("");
  const [currentQuery, setCurrentQuery] = useState("");
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState("none");
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  // FIX: Added the missing state declarations
  const [latestBollywood, setLatestBollywood] = useState([]);
  const [oldBollywood, setOldBollywood] = useState([]);

  const playerRef = useRef(null);
  const intervalRef = useRef();

  useEffect(() => {
    const saved = localStorage.getItem("vibesync-recently-played");
    if (saved) {
      setRecentlyPlayed(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const fetchCategory = async (query, setter) => {
      if (!API_KEY) return; // Don't fetch if API key is missing
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=8&q=${query}&key=${API_KEY}&type=video`
        );
        const data = await response.json();
        if (data.items) {
          const categorySongs = data.items.map((item) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            artist: item.snippet.channelTitle,
            albumArt: item.snippet.thumbnails.high.url,
          }));
          setter(categorySongs);
        }
      } catch (err) {
        console.error(`Failed to fetch ${query}`, err);
      }
    };
    fetchCategory("latest bollywood songs 2024", setLatestBollywood);
    fetchCategory("old bollywood songs 90s", setOldBollywood);
  }, []);

  useEffect(() => {
    if (currentSong) {
      setRecentlyPlayed((prev) => {
        const newHistory = [
          currentSong,
          ...prev.filter((s) => s.id !== currentSong.id),
        ].slice(0, 8);
        localStorage.setItem(
          "vibesync-recently-played",
          JSON.stringify(newHistory)
        );
        return newHistory;
      });
    }
  }, [currentSong]);

  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (playerRef.current?.setVolume) {
      playerRef.current.setVolume(volume * 100);
    }
  }, [volume]);

  const searchSongs = async (query) => {
    if (!query) return;
    setIsLoading(true);
    setError(null);
    setSongs([]);
    setCurrentQuery(query);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${query}&key=${API_KEY}&type=video`
      );
      const data = await response.json();
      if (data.items) {
        const searchedSongs = data.items.map((item) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          artist: item.snippet.channelTitle,
          albumArt: item.snippet.thumbnails.high.url,
        }));
        setSongs(searchedSongs);
        setNextPageToken(data.nextPageToken || "");
        if (searchedSongs.length > 0) {
          setCurrentSong(searchedSongs[0]);
          setIsPlaying(true);
        } else {
          setCurrentSong(null);
        }
      } else if (data.error) {
        setError(data.error.message || "An error occurred with the API.");
      }
    } catch (err) {
      console.error("Error searching for songs:", err);
      setError("Failed to fetch songs. Check your API key and network.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreSongs = useCallback(async () => {
    if (!nextPageToken || isFetchingMore) return;
    setIsFetchingMore(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${currentQuery}&key=${API_KEY}&type=video&pageToken=${nextPageToken}`
      );
      const data = await response.json();
      if (data.items) {
        const moreSongs = data.items.map((item) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          artist: item.snippet.channelTitle,
          albumArt: item.snippet.thumbnails.high.url,
        }));
        setSongs((prevSongs) => [...prevSongs, ...moreSongs]);
        setNextPageToken(data.nextPageToken || "");
      }
    } catch (err) {
      console.error("Error fetching more songs:", err);
    } finally {
      setIsFetchingMore(false);
    }
  }, [nextPageToken, currentQuery, isFetchingMore]);

  const playNext = useCallback(() => {
    if (songs.length === 0 && recentlyPlayed.length === 0) return;
    const currentList = songs.length > 0 ? songs : recentlyPlayed;
    const currentIndex = currentList.findIndex(
      (song) => song.id === currentSong?.id
    );
    const nextIndex = (currentIndex + 1) % currentList.length;
    setCurrentSong(currentList[nextIndex]);
    setIsPlaying(true);
  }, [songs, recentlyPlayed, currentSong]);

  const playPrev = useCallback(() => {
    if (songs.length === 0 && recentlyPlayed.length === 0) return;
    const currentList = songs.length > 0 ? songs : recentlyPlayed;
    const currentIndex = currentList.findIndex(
      (song) => song.id === currentSong?.id
    );
    const prevIndex =
      (currentIndex - 1 + currentList.length) % currentList.length;
    setCurrentSong(currentList[prevIndex]);
    setIsPlaying(true);
  }, [songs, recentlyPlayed, currentSong]);

  const togglePlay = useCallback(() => {
    if (currentSong) {
      setIsPlaying((prev) => !prev);
    }
  }, [currentSong]);

  const playSong = useCallback(
    (song) => {
      if (currentSong?.id === song.id) {
        togglePlay();
      } else {
        setCurrentSong(song);
        setIsPlaying(true);
      }
    },
    [currentSong, togglePlay]
  );

  const onScrub = (value) => {
    if (playerRef.current) {
      playerRef.current.seekTo(value);
    }
  };

  const toggleVideo = () => setShowVideo((prev) => !prev);
  const toggleShuffle = () => setIsShuffling((prev) => !prev);
  const cycleRepeatMode = () =>
    setRepeatMode((prev) =>
      prev === "none" ? "all" : prev === "all" ? "one" : "none"
    );

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
  };

  const onPlayerStateChange = (event) => {
    clearInterval(intervalRef.current);
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      setDuration(playerRef.current.getDuration());
      intervalRef.current = setInterval(() => {
        setTrackProgress(playerRef.current.getCurrentTime());
      }, 500);
    } else {
      setIsPlaying(false);
    }
    if (event.data === window.YT.PlayerState.ENDED) {
      playNext();
    }
  };

  const videoContainerClass = showVideo
    ? "fixed z-50 bottom-24 sm:bottom-36 right-4 bg-black p-2 rounded-lg shadow-2xl transition-all w-[320px] sm:w-[480px]"
    : "fixed -z-10 -top-full -left-full opacity-0";

  const value = {
    songs,
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
    loadMoreSongs,
    isFetchingMore,
    hasMoreSongs: !!nextPageToken,
    isShuffling,
    toggleShuffle,
    repeatMode,
    cycleRepeatMode,
    recentlyPlayed,
    latestBollywood,
    oldBollywood,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
      <div className={videoContainerClass}>
        {currentSong && (
          <YouTube
            videoId={currentSong.id}
            opts={{
              height: "180",
              width: "100%",
              playerVars: { autoplay: 1, controls: 0 },
            }}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange}
            key={currentSong.id}
          />
        )}
      </div>
    </MusicContext.Provider>
  );
};
