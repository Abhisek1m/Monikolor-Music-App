// src/components/MainContent.jsx
import React from "react";
import { Play, Pause, Music, Loader } from "lucide-react";
import { useMusic } from "../hooks/useMusic.js";

const SongCard = ({ song, onCardClick, isCurrent, isPlaying }) => (
  <div className="bg-zinc-800/50 p-4 rounded-lg hover:bg-zinc-700/70 transition-all group">
    <div className="relative">
      <img
        src={song.albumArt}
        alt={song.title}
        className="w-full rounded-md aspect-square object-cover bg-zinc-700"
      />
      <button
        onClick={() => onCardClick(song)}
        className="absolute right-2 bottom-2 w-12 h-12 flex items-center justify-center pl-0.5 rounded-full bg-green-500 text-black opacity-0 group-hover:opacity-100 group-hover:bottom-4 transition-all duration-300 shadow-lg cursor-pointer"
      >
        {isCurrent && isPlaying ? (
          <Pause size={24} fill="black" />
        ) : (
          <Play size={24} fill="black" />
        )}
      </button>
    </div>
    <h3 className="font-semibold mt-4 text-white truncate" title={song.title}>
      {song.title}
    </h3>
    <p className="text-sm text-zinc-400 truncate" title={song.artist}>
      {song.artist}
    </p>
  </div>
);

const SongRow = ({
  title,
  songs,
  playSong,
  currentSong,
  isPlaying,
  togglePlay,
}) => {
  if (!songs || songs.length === 0) return null;

  const handleCardClick = (song) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      playSong(song, songs);
    }
  };

  return (
    <section className="mb-12">
      <h2 className="font-bold text-2xl mb-4 text-white">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {songs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            onCardClick={handleCardClick}
            isCurrent={currentSong?.id === song.id}
            isPlaying={isPlaying}
          />
        ))}
      </div>
    </section>
  );
};

const MainContent = () => {
  const {
    searchResults,
    currentSong,
    isPlaying,
    isLoading,
    error,
    playSong,
    togglePlay,
    recentlyPlayed,
    latestBollywood,
    oldBollywood,
    favorites,
  } = useMusic();

  const renderContent = () => {
    if (isLoading)
      return (
        <div className="text-center text-zinc-400 mt-20 animate-pulse">
          Searching...
        </div>
      );
    if (error)
      return (
        <div className="text-center text-rose-500 mt-20">Error: {error}</div>
      );

    return (
      <>
        {searchResults.length > 0 && (
          <SongRow
            title="Search Results"
            songs={searchResults}
            playSong={playSong}
            togglePlay={togglePlay}
            currentSong={currentSong}
            isPlaying={isPlaying}
          />
        )}

        {!searchResults.length && (
          <>
            {recentlyPlayed.length > 0 && (
              <div className="mb-12">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-2xl text-white">
                    Recently Played
                  </h2>
                  <button
                    className="text-sm text-rose-500 hover:underline"
                    onClick={() => alert("Show more Recently Played")}
                  >
                    More
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {recentlyPlayed.slice(0, 5).map((song) => (
                    <SongCard
                      key={song.id}
                      song={song}
                      onCardClick={(s) => playSong(s, recentlyPlayed)}
                      isCurrent={currentSong?.id === song.id}
                      isPlaying={isPlaying}
                    />
                  ))}
                </div>
              </div>
            )}

            {latestBollywood.length > 0 && (
              <div className="mb-12">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-transparent bg-clip-text">
                    Latest Bollywood Hits 🎵
                  </h2>
                  <button
                    className="text-sm text-rose-500 hover:underline"
                    onClick={() => alert("Show more Latest Bollywood")}
                  >
                    More
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {latestBollywood.slice(0, 5).map((song) => (
                    <div
                      key={song.id}
                      className="group relative transform transition-all duration-300 hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/30 via-pink-500/30 to-purple-500/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                      <SongCard
                        song={song}
                        onCardClick={(s) => playSong(s, latestBollywood)}
                        isCurrent={currentSong?.id === song.id}
                        isPlaying={isPlaying}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {oldBollywood.length > 0 && (
              <div className="mb-12">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-transparent bg-clip-text">
                    Old is Gold 🎸
                  </h2>
                  <button
                    className="text-sm text-amber-500 hover:underline"
                    onClick={() => alert("Show more Old is Gold")}
                  >
                    More
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {oldBollywood.slice(0, 5).map((song) => (
                    <div
                      key={song.id}
                      className="group relative transform transition-all duration-300 hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 via-yellow-500/30 to-orange-500/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                      <SongCard
                        song={song}
                        onCardClick={(s) => playSong(s, oldBollywood)}
                        isCurrent={currentSong?.id === song.id}
                        isPlaying={isPlaying}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {favorites.length > 0 && (
              <div className="mb-12">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-2xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text">
                    Favorites ❤️
                  </h2>
                  <button
                    className="text-sm text-pink-500 hover:underline"
                    onClick={() => alert("Show more Favorites")}
                  >
                    More
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {favorites.slice(0, 5).map((song) => (
                    <div
                      key={song.id}
                      className="group relative transform transition-all duration-300 hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 via-red-500/30 to-yellow-500/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                      <SongCard
                        song={song}
                        onCardClick={(s) => playSong(s, favorites)}
                        isCurrent={currentSong?.id === song.id}
                        isPlaying={isPlaying}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!recentlyPlayed.length &&
              !latestBollywood.length &&
              !oldBollywood.length &&
              !favorites.length && (
                <div className="text-center text-zinc-500 mt-20 flex flex-col items-center">
                  <Music size={48} className="mb-4" />
                  <h2 className="text-xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-transparent bg-clip-text">
                    Welcome to VibeSync
                  </h2>
                  <p>Search for any song or artist to begin.</p>
                </div>
              )}
          </>
        )}
      </>
    );
  };

  return (
    <main className="flex-1 px-6 pt-6 pb-28 overflow-y-auto bg-gradient-to-b from-zinc-900 to-black">
      {renderContent()}
    </main>
  );
};

export default MainContent;
