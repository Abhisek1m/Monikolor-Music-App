import React from "react";
import { Play, Pause } from "lucide-react";
import { useMusic } from "../hooks/useMusic.js";
import Header from "./Header.jsx";
import { topArtists } from "../data/mockData.js";

const MainContent = () => {
  const { songs, playSong, currentSong, isPlaying, togglePlay } = useMusic();

  return (
    <main className="flex-1 p-6 overflow-y-auto pb-36 md:pb-24">
      <Header />
      <h1 className="font-bold text-3xl mt-10">Good Afternoon</h1>
      <section className="mt-8">
        <h2 className="font-semibold text-xl mb-4">Made For You</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {songs.map((song, index) => (
            <div
              key={song.id}
              className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-all group"
            >
              <div className="relative">
                <img
                  src={song.albumArt}
                  alt={song.title}
                  className="w-full rounded-md"
                />
                <button
                  onClick={() =>
                    currentSong?.id === song.id && isPlaying
                      ? togglePlay()
                      : playSong(index)
                  }
                  className="absolute right-2 bottom-2 w-12 h-12 flex items-center justify-center pl-0.5 rounded-full bg-green-500 text-black opacity-0 group-hover:opacity-100 group-hover:bottom-4 transition-all duration-300 shadow-lg cursor-pointer"
                >
                  {currentSong?.id === song.id && isPlaying ? (
                    <Pause size={24} fill="black" />
                  ) : (
                    <Play size={24} fill="black" />
                  )}
                </button>
              </div>
              <h3 className="font-semibold mt-4">{song.title}</h3>
              <p className="text-sm text-zinc-400">{song.artist}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-10">
        <h2 className="font-semibold text-xl mb-4">Your Top Artists</h2>
        <div className="flex flex-wrap gap-6">
          {topArtists.map((artist) => (
            <div
              key={artist.name}
              className="flex flex-col items-center gap-2 text-center group cursor-pointer"
            >
              <img
                src={artist.avatar}
                alt={artist.name}
                className="w-32 h-32 rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <h3 className="font-semibold mt-2">{artist.name}</h3>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default MainContent;
