// src/App.jsx
import React from "react";
import YouTube from "react-youtube";
import { MusicProvider } from "./context/MusicContext.jsx";
import { useMusic } from "./hooks/useMusic.js";
import MainContent from "./components/MainContent.jsx";
import Player from "./components/Player.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";

// This new component renders the main app layout
const AppLayout = () => {
  return (
    <div className="bg-zinc-900 text-white font-sans w-full h-screen flex antialiased overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <MainContent />
      </div>
      <Player />
    </div>
  );
};

// This new component handles the YouTube player logic and visibility
const YouTubePlayerPortal = () => {
  const { currentSong, onPlayerReady, onPlayerStateChange, showVideo } =
    useMusic();

  const videoContainerClass = showVideo
    ? "fixed z-50 bottom-24 sm:bottom-32 right-4 bg-black p-2 rounded-lg shadow-2xl transition-all w-[320px] sm:w-[480px]"
    : "fixed -z-10 -top-[1000px] -left-[1000px] opacity-0";

  return (
    <div className={videoContainerClass}>
      {currentSong && (
        <YouTube
          videoId={currentSong.id}
          opts={{
            height: "180",
            width: "100%",
            playerVars: { autoplay: 1, controls: 0 },
          }}
          onReady={onPlayerReady}
          onStateChange={onPlayerStateChange}
          key={currentSong.id}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <MusicProvider>
      <AppLayout />
      <YouTubePlayerPortal />
    </MusicProvider>
  );
}

export default App;
