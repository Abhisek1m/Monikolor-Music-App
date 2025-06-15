import React from "react";
import { MusicProvider } from "./context/MusicContext.jsx";
import Sidebar from "./components/Sidebar.jsx";
import MainContent from "./components/MainContent.jsx";
import Player from "./components/Player.jsx";
import MobileNav from "./components/MobileNav.jsx";

function App() {
  return (
    <MusicProvider>
      <div className="bg-zinc-900 text-white font-sans w-full h-screen flex flex-col antialiased">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <MainContent />
        </div>
        <MobileNav />
        <Player />
      </div>
    </MusicProvider>
  );
}

export default App;
