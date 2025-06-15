import { useContext } from "react";
import { MusicContext } from "../context/MusicContext.jsx";

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
};
