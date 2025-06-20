// src/components/Sidebar.jsx
import React from "react";
import { Home, User, Music } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-zinc-900 p-6 flex-col hidden md:flex">
      <div className="flex items-center gap-2 text-2xl font-bold text-rose-500 mb-10">
        <Music size={32} />
        <span>VibeSync</span>
      </div>
      <nav className="space-y-5">
        <a
          href="#"
          className="flex items-center gap-3 text-lg font-semibold text-zinc-200 hover:text-rose-400 transition-colors"
        >
          <Home />
          Home
        </a>
        <a
          href="#"
          className="flex items-center gap-3 text-lg font-semibold text-zinc-200 hover:text-rose-400 transition-colors"
        >
          <User />
          Profile
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;
