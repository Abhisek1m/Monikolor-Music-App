import React from "react";
import { Home, Compass, Music, User } from "lucide-react";
import { playlists } from "../data/mockData.js";

const Sidebar = () => (
  <aside className="w-64 bg-black/50 p-6 flex-col hidden md:flex">
    <div className="flex items-center gap-2 text-2xl font-bold text-rose-500 mb-8">
      <Music size={32} /> <span>VibeSync</span>
    </div>
    <nav className="space-y-4">
      <a
        href="#"
        className="flex items-center gap-3 text-sm font-semibold text-zinc-200 hover:text-rose-400 transition-colors"
      >
        <Home /> Home
      </a>
      <a
        href="#"
        className="flex items-center gap-3 text-sm font-semibold text-zinc-200 hover:text-rose-400 transition-colors"
      >
        <Compass /> Explore
      </a>
      <a
        href="#"
        className="flex items-center gap-3 text-sm font-semibold text-zinc-200 hover:text-rose-400 transition-colors"
      >
        <Music /> Library
      </a>
      <a
        href="#"
        className="flex items-center gap-3 text-sm font-semibold text-zinc-200 hover:text-rose-400 transition-colors"
      >
        <User /> Profile
      </a>
    </nav>
    <nav className="mt-10 pt-10 border-t border-zinc-800 flex flex-col gap-3">
      <span className="text-xs text-zinc-400 font-semibold">PLAYLISTS</span>
      {playlists.map((playlist) => (
        <a
          key={playlist}
          href="#"
          className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          {playlist}
        </a>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
