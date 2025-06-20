// src/components/Header.jsx
import React, { useState } from "react";
import { Search } from "lucide-react";
import { useMusic } from "../hooks/useMusic.js";

const Header = () => {
  const { searchSongs } = useMusic();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    searchSongs(searchTerm);
  };

  return (
    <header className="p-6">
      <form
        onSubmit={handleSearch}
        className="relative w-full max-w-lg mx-auto"
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
    </header>
  );
};

export default Header;
