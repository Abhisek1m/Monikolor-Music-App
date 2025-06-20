// src/components/MainContent.jsx
import React, { useRef, useCallback } from "react";
import { Play, Pause, Music, Loader } from "lucide-react";
import { useMusic } from "../hooks/useMusic.js";

const SongCard = ({ song, onCardClick, isCurrent, isPlaying }) => (
  <div className="bg-white/5 p-3 sm:p-4 rounded-lg hover:bg-white/10 transition-all group">
    <div className="relative">
      <img
        src={song.albumArt}
        alt={song.title}
        className="w-full rounded-md aspect-square object-cover"
      />
      <button
        onClick={() => onCardClick(song)}
        className="absolute right-2 bottom-2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center pl-0.5 rounded-full bg-green-500 text-black opacity-0 group-hover:opacity-100 group-hover:bottom-4 transition-all duration-300 shadow-lg cursor-pointer"
      >
        {isCurrent && isPlaying ? (
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
);

const SongRow = ({ title, songs, onCardClick, currentSong, isPlaying }) => (
  <section className="mt-10">
    <h2 className="font-semibold text-2xl mb-4">{title}</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {songs.map((song, index) => (
        <SongCard
          key={`${song.id}-${index}`}
          song={song}
          onCardClick={onCardClick}
          isCurrent={currentSong?.id === song.id}
          isPlaying={isPlaying}
        />
      ))}
    </div>
  </section>
);

const MainContent = () => {
  const {
    songs,
    playSong,
    currentSong,
    isPlaying,
    isLoading,
    error,
    loadMoreSongs,
    isFetchingMore,
    hasMoreSongs,
    togglePlay,
    recentlyPlayed,
    latestBollywood,
    oldBollywood,
  } = useMusic();
  const mainContentRef = useRef(null);

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
      if (
        scrollHeight - scrollTop - clientHeight < 200 &&
        !isFetchingMore &&
        hasMoreSongs
      ) {
        loadMoreSongs();
      }
    }
  }, [loadMoreSongs, isFetchingMore, hasMoreSongs]);

  React.useEffect(() => {
    const element = mainContentRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
      return () => element.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const renderContent = () => {
    if (isLoading && songs.length === 0) {
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
          <h1 className="font-bold text-3xl mb-8">Search Results</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {songs.map((song, index) => (
              <SongCard
                key={`${song.id}-${index}`}
                song={song}
                onCardClick={handleCardClick}
                isCurrent={currentSong?.id === song.id}
                isPlaying={isPlaying}
              />
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

    // Default Homepage View
    return (
      <>
        {recentlyPlayed.length > 0 && (
          <SongRow
            title="Recently Played"
            songs={recentlyPlayed}
            onCardClick={handleCardClick}
            currentSong={currentSong}
            isPlaying={isPlaying}
          />
        )}
        {latestBollywood.length > 0 && (
          <SongRow
            title="Latest Bollywood"
            songs={latestBollywood}
            onCardClick={handleCardClick}
            currentSong={currentSong}
            isPlaying={isPlaying}
          />
        )}
        {oldBollywood.length > 0 && (
          <SongRow
            title="Old is Gold"
            songs={oldBollywood}
            onCardClick={handleCardClick}
            currentSong={currentSong}
            isPlaying={isPlaying}
          />
        )}
        {recentlyPlayed.length === 0 &&
          latestBollywood.length === 0 &&
          oldBollywood.length === 0 && (
            <div className="text-center text-zinc-500 mt-20 flex flex-col items-center">
              <Music size={48} className="mb-4" />
              <h2 className="text-xl font-bold">Welcome to VibeSync</h2>
              <p>Search for a song or artist to begin your journey.</p>
            </div>
          )}
      </>
    );
  };

  return (
    <main
      ref={mainContentRef}
      className="flex-1 px-4 sm:px-6 pt-0 pb-28 overflow-y-auto"
    >
      {renderContent()}
    </main>
  );
};

export default MainContent;
