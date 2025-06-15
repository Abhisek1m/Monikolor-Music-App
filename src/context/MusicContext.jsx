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

  const playerRef = useRef(null);
  const intervalRef = useRef();

  const startTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (playerRef.current?.getCurrentTime) {
        setTrackProgress(playerRef.current.getCurrentTime());
      }
    }, 500);
  }, []);

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

  const playNext = useCallback(
    (isAutoEnd = false) => {
      if (songs.length === 0) return;
      const currentIndex = songs.findIndex(
        (song) => song.id === currentSong?.id
      );

      if (isShuffling) {
        let nextIndex;
        do {
          nextIndex = Math.floor(Math.random() * songs.length);
        } while (songs.length > 1 && nextIndex === currentIndex);
        setCurrentSong(songs[nextIndex]);
        return;
      }

      const isLastSong = currentIndex === songs.length - 1;
      if (isAutoEnd && repeatMode === "none" && isLastSong) {
        setIsPlaying(false);
        return;
      }

      const nextIndex = isLastSong ? 0 : currentIndex + 1;
      setCurrentSong(songs[nextIndex]);
    },
    [songs, currentSong, isShuffling, repeatMode]
  );

  const playPrev = useCallback(() => {
    if (songs.length === 0) return;
    const currentIndex = songs.findIndex((song) => song.id === currentSong?.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSong(songs[prevIndex]);
    setIsPlaying(true);
  }, [songs, currentSong]);

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
    clearInterval(intervalRef.current);
    setTrackProgress(Number(value));
  };

  const onScrubEnd = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(trackProgress);
      if (isPlaying) {
        // Only restart timer if it was playing
        startTimer();
      }
    }
  };

  const toggleVideo = () => setShowVideo((prev) => !prev);
  const toggleShuffle = () => setIsShuffling((prev) => !prev);
  const cycleRepeatMode = () => {
    const modes = ["none", "all", "one"];
    const currentModeIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentModeIndex + 1) % modes.length]);
  };

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
    if (isPlaying) {
      event.target.playVideo();
    }
  };

  const onPlayerStateChange = (event) => {
    const playerState = event.data;

    if (playerState === window.YT.PlayerState.PLAYING) {
      if (!isPlaying) setIsPlaying(true); // Sync state
      setDuration(playerRef.current.getDuration());
      startTimer();
    } else if (playerState === window.YT.PlayerState.PAUSED) {
      if (isPlaying) setIsPlaying(false); // Sync state
      clearInterval(intervalRef.current);
    }
    if (playerState === window.YT.PlayerState.ENDED) {
      if (repeatMode === "one") {
        playerRef.current.seekTo(0);
        playerRef.current.playVideo();
      } else {
        playNext(true);
      }
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
    onScrubEnd,
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
