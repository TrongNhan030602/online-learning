// hooks/useYouTubeAPI.js
import { useEffect } from "react";

const useYouTubeAPI = () => {
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }
  }, []);
};

export default useYouTubeAPI;
