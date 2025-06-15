// src/App.jsx
import React from "react";
import { MusicProvider } from "./context/MusicContext.jsx";
import MainContent from "./components/MainContent.jsx";
import Player from "./components/Player.jsx";

function App() {
  return (
    <MusicProvider>
      <div className="bg-zinc-900 text-white font-sans w-full h-screen flex flex-col antialiased overflow-hidden">
        <MainContent />
        <Player />
      </div>
    </MusicProvider>
  );
}

export default App;
