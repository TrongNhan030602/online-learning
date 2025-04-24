import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

const YouTubePlayer = ({ videoId, lessonId, onComplete }) => {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const onPlayerReady = (event) => {
      playerRef.current = event.target;

      // Bắt đầu theo dõi tiến độ video mỗi giây
      const id = setInterval(() => {
        if (!playerRef.current || videoCompleted) return;

        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();

        // Kiểm tra xem có tua nhanh không (tua nhanh quá nhanh)
        if (lastCheckTime > 0 && currentTime - lastCheckTime < 1) {
          playerRef.current.pauseVideo();
          alert("⏩ Vui lòng không tua nhanh video.");
        }

        setLastCheckTime(currentTime);

        // Kiểm tra xem video đã được xem đủ 90% chưa
        if (duration > 0 && currentTime / duration >= 0.9) {
          setVideoCompleted(true);
          onComplete(lessonId); // Gọi callback khi video đã hoàn thành
          clearInterval(id); // Dừng theo dõi khi hoàn thành
        }
      }, 1000); // Cập nhật mỗi giây

      setIntervalId(id);
    };

    const onPlayerStateChange = (event) => {
      if (event.data === window.YT.PlayerState.ENDED) {
        // Nếu video kết thúc mà chưa hoàn thành, gọi lại onComplete
        if (!videoCompleted) {
          setVideoCompleted(true);
          onComplete(lessonId);
        }
        clearInterval(intervalId);
      }
    };

    const createPlayer = () => {
      if (containerRef.current && window.YT?.Player) {
        new window.YT.Player(containerRef.current, {
          videoId,
          width: "100%",
          height: "315",
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
          },
          playerVars: {
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            // Thêm các tham số cần thiết cho video Shorts nếu cần
          },
        });
      }
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      if (intervalId) clearInterval(intervalId); // Dọn dẹp khi component unmount
    };
  }, [
    videoId,
    lessonId,
    onComplete,
    videoCompleted,
    lastCheckTime,
    intervalId,
  ]);

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
