import React from "react";
import { Home, Compass, Music, Search } from "lucide-react";

const MobileNav = () => (
  <nav className="md:hidden fixed bottom-[88px] w-full bg-zinc-900/90 backdrop-blur-md border-t border-zinc-800 flex justify-around p-2">
    <a
      href="#"
      className="flex flex-col items-center gap-1 text-xs text-rose-400 font-semibold"
    >
      <Home size={20} /> <span>Home</span>
    </a>
    <a
      href="#"
      className="flex flex-col items-center gap-1 text-xs text-zinc-400 hover:text-rose-400"
    >
      <Compass size={20} /> <span>Explore</span>
    </a>
    <a
      href="#"
      className="flex flex-col items-center gap-1 text-xs text-zinc-400 hover:text-rose-400"
    >
      <Music size={20} /> <span>Library</span>
    </a>
    <a
      href="#"
      className="flex flex-col items-center gap-1 text-xs text-zinc-400 hover:text-rose-400"
    >
      <Search size={20} /> <span>Search</span>
    </a>
  </nav>
);

export default MobileNav;
