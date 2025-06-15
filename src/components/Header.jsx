import React from "react";
import { Search, ChevronLeft, ChevronRight, User } from "lucide-react";

const Header = () => (
  <header className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <button className="p-1 rounded-full bg-black/20 hover:bg-black/40">
        <ChevronLeft size={20} />
      </button>
      <button className="p-1 rounded-full bg-black/20 hover:bg-black/40">
        <ChevronRight size={20} />
      </button>
    </div>
    <div className="relative w-full max-w-xs hidden sm:block">
      <input
        type="text"
        placeholder="Search artists, songs..."
        className="w-full bg-zinc-800 rounded-full px-4 py-2 pl-10 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
      />
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
        size={20}
      />
    </div>
    <div className="flex items-center gap-4">
      <button className="p-2 rounded-full bg-black/20 hover:bg-black/40">
        <User size={20} />
      </button>
    </div>
  </header>
);

export default Header;
