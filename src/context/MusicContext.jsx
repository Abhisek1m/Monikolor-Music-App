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
  const [error, setError] = useState(null);

  const playerRef = useRef(null);
  const intervalRef = useRef();

  // This effect handles telling the YouTube player to play or pause
  useEffect(() => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [isPlaying, playerRef]);

  // This effect handles volume changes
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
        if (searchedSongs.length > 0) {
          setCurrentSong(searchedSongs[0]);
          setIsPlaying(true);
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

  const playNext = useCallback(() => {
    const currentIndex = songs.findIndex((song) => song.id === currentSong?.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
  }, [songs, currentSong]);

  const playPrev = useCallback(() => {
    const currentIndex = songs.findIndex((song) => song.id === currentSong?.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSong(songs[prevIndex]);
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
    if (playerRef.current) {
      playerRef.current.seekTo(value);
      setTrackProgress(value);
    }
  };

  const toggleVideo = () => setShowVideo((prev) => !prev);

  // --- YouTube Player Event Handlers ---
  const onPlayerReady = (event) => {
    playerRef.current = event.target;
    playerRef.current.setVolume(volume * 100);
  };

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      setDuration(playerRef.current.getDuration());
      intervalRef.current = setInterval(() => {
        setTrackProgress(playerRef.current.getCurrentTime());
      }, 500);
    } else {
      setIsPlaying(false);
      clearInterval(intervalRef.current);
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
