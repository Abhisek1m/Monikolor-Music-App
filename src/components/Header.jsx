// src/components/Header.jsx

import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight, User } from "lucide-react";
import { useMusic } from "../hooks/useMusic.js";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { searchSongs } = useMusic();

  const handleSearch = (e) => {
    e.preventDefault();
    searchSongs(searchTerm);
  };

  return (
    <header className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <button className="p-1 rounded-full bg-black/20 hover:bg-black/40">
          <ChevronLeft size={20} />
        </button>
        <button className="p-1 rounded-full bg-black/20 hover:bg-black/40">
          <ChevronRight size={20} />
        </button>
      </div>
      <form
        onSubmit={handleSearch}
        className="relative w-full max-w-xs hidden sm:block"
      >
        <input
          type="text"
          placeholder="Search songs on YouTube..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-800 rounded-full px-4 py-2 pl-10 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <button
          type="submit"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
        >
          <Search size={20} />
        </button>
      </form>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full bg-black/20 hover:bg-black/40">
          <User size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
