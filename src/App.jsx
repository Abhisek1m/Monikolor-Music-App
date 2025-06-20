// src/App.jsx
import React from "react";
import { MusicProvider } from "./context/MusicContext.jsx";
import MainContent from "./components/MainContent.jsx";
import Player from "./components/Player.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";

function App() {
  return (
    <MusicProvider>
      <div className="bg-zinc-900 text-white font-sans w-full h-screen flex antialiased overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <MainContent />
        </div>
        <Player />
      </div>
    </MusicProvider>
  );
}

export default App;
