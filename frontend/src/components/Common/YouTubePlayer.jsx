import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

const YouTubePlayer = ({ videoId, lessonId, onComplete }) => {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(0);

  useEffect(() => {
    const handlePlayerReady = (event) => {
      playerRef.current = event.target;

      intervalRef.current = setInterval(() => {
        if (!playerRef.current || videoCompleted) return;

        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();

        // Nếu tua quá nhanh (không hợp lệ)
        if (lastCheckTime > 0 && currentTime - lastCheckTime > 10) {
          playerRef.current.pauseVideo();
          alert("⏩ Vui lòng không tua nhanh video.");
          return;
        }

        setLastCheckTime(currentTime);

        // Nếu đã xem hơn 90% video
        if (duration > 0 && currentTime / duration >= 0.9) {
          setVideoCompleted(true);
          onComplete(lessonId);
          clearInterval(intervalRef.current);
        }
      }, 1000);
    };

    const handlePlayerStateChange = (event) => {
      if (event.data === window.YT?.PlayerState.ENDED && !videoCompleted) {
        setVideoCompleted(true);
        onComplete(lessonId);
        clearInterval(intervalRef.current);
      }
    };

    const createPlayer = () => {
      if (containerRef.current && !playerRef.current) {
        new window.YT.Player(containerRef.current, {
          videoId,
          width: "100%",
          height: "315",
          events: {
            onReady: handlePlayerReady,
            onStateChange: handlePlayerStateChange,
          },
          playerVars: {
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            fs: 0,
            disablekb: 0,
          },
        });
      }
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      // Load API nếu chưa có
      const scriptExists = document.getElementById("youtube-iframe-api");
      if (!scriptExists) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        tag.id = "youtube-iframe-api";
        document.body.appendChild(tag);
      }

      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [videoId, lessonId, onComplete, videoCompleted, lastCheckTime]);

  return (
    <div
      className={`youtube-player ${
        videoCompleted ? "youtube-player--completed" : ""
      }`}
    >
      <div ref={containerRef}></div>
      {videoCompleted && (
        <div className="youtube-player__badge">✔️ Đã hoàn thành</div>
      )}
    </div>
  );
};

YouTubePlayer.propTypes = {
  videoId: PropTypes.string.isRequired,
  lessonId: PropTypes.string.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default YouTubePlayer;
