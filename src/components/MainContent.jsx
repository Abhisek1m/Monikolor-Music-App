// src/components/MainContent.jsx
import React, { useState, useRef, useCallback } from "react";
import { Play, Pause, Search, Music, Loader } from "lucide-react";
import { useMusic } from "../hooks/useMusic.js";

const MainContent = () => {
  const {
    songs,
    playSong,
    currentSong,
    isPlaying,
    searchSongs,
    isLoading,
    error,
    loadMoreSongs,
    isFetchingMore,
    hasMoreSongs,
    togglePlay,
  } = useMusic();
  const [searchTerm, setSearchTerm] = useState("");
  const mainContentRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    searchSongs(searchTerm);
  };

  const handleCardClick = (song) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      playSong(song);
    }
  };

  const handleScroll = useCallback(() => {
    const element = mainContentRef.current;
    if (element) {
      const { scrollTop, scrollHeight, clientHeight } = element;
      // Load more when user is 200px from the bottom
      if (
        scrollHeight - scrollTop - clientHeight < 200 &&
        !isFetchingMore &&
        hasMoreSongs
      ) {
        loadMoreSongs();
      }
    }
  }, [loadMoreSongs, isFetchingMore, hasMoreSongs]);

  // This useEffect now correctly uses the handleScroll function
  React.useEffect(() => {
    const element = mainContentRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
      return () => element.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center text-zinc-400 mt-20 animate-pulse">
          Searching...
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center text-rose-500 mt-20">Error: {error}</div>
      );
    }
    if (songs.length > 0) {
      return (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {songs.map((song, index) => (
              <div
                key={`${song.id}-${index}`}
                className="bg-white/5 p-3 sm:p-4 rounded-lg hover:bg-white/10 transition-all group"
              >
                <div className="relative">
                  <img
                    src={song.albumArt}
                    alt={song.title}
                    className="w-full rounded-md aspect-square object-cover"
                  />
                  <button
                    onClick={() => handleCardClick(song)}
                    className="absolute right-2 bottom-2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center pl-0.5 rounded-full bg-green-500 text-black opacity-0 group-hover:opacity-100 group-hover:bottom-4 transition-all duration-300 shadow-lg cursor-pointer"
                  >
                    {currentSong?.id === song.id && isPlaying ? (
                      <Pause size={24} fill="black" />
                    ) : (
                      <Play size={24} fill="black" />
                    )}
                  </button>
                </div>
                <h3
                  className="font-semibold mt-2 sm:mt-4 text-sm sm:text-base truncate"
                  title={song.title}
                >
                  {song.title}
                </h3>
                <p
                  className="text-xs sm:text-sm text-zinc-400 truncate"
                  title={song.artist}
                >
                  {song.artist}
                </p>
              </div>
            ))}
          </div>
          {isFetchingMore && (
            <div className="flex justify-center items-center mt-8">
              <Loader className="animate-spin text-zinc-400" />
            </div>
          )}
        </>
      );
    }
    return (
      <div className="text-center text-zinc-500 mt-20 flex flex-col items-center">
        <Music size={48} className="mb-4" />
        <h2 className="text-xl font-bold">Welcome to VibeSync</h2>
        <p>Search for a song or artist to begin your journey.</p>
      </div>
    );
  };

  return (
    <main
      ref={mainContentRef}
      className="flex-1 px-4 sm:px-6 pt-6 pb-28 overflow-y-auto"
      onScroll={handleScroll}
    >
      <form
        onSubmit={handleSearch}
        className="relative w-full max-w-xl mx-auto mb-10"
      >
        <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
          <Search size={24} className="text-zinc-400" />
        </div>
        <input
          type="text"
          placeholder="Search for songs, artists, albums..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-800 rounded-full px-6 py-3 pl-16 text-lg placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
      </form>
      {renderContent()}
    </main>
  );
};

export default MainContent;
