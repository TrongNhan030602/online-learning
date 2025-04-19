import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

const YouTubePlayer = ({ videoId, lessonId, onComplete }) => {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [lastTime, setLastTime] = useState(0); // Để theo dõi thời gian xem video
  const [videoDuration, setVideoDuration] = useState(0); // Tổng thời gian video

  useEffect(() => {
    // Hàm khi player đã sẵn sàng
    const onPlayerReady = (event) => {
      playerRef.current = event.target;
      setVideoDuration(event.target.getDuration()); // Lấy thời gian tổng của video
    };

    // Hàm khi trạng thái video thay đổi
    const onPlayerStateChange = (event) => {
      if (event.data === window.YT.PlayerState.ENDED) {
        console.log(`✅ Bài học ${lessonId} hoàn thành`);
        onComplete(lessonId); // Khi video kết thúc, gọi hàm onComplete
      }
    };

    // Hàm theo dõi việc tua nhanh và kiểm soát tốc độ
    const onTimeUpdate = () => {
      const currentTime = playerRef.current.getCurrentTime();

      // Kiểm tra tốc độ tua
      if (currentTime - lastTime < 1) {
        // Nếu thời gian thay đổi quá nhanh, dừng video
        playerRef.current.pauseVideo();
        alert("Vui lòng xem video thay vì tua nhanh");
      }

      setLastTime(currentTime);

      // Kiểm tra xem học viên đã xem đủ 90% video chưa
      const percentageWatched = (currentTime / videoDuration) * 100;
      if (percentageWatched >= 90) {
        console.log(`✅ Bài học ${lessonId} đã được xem 90%`);
        onComplete(lessonId); // Gọi hàm onComplete khi đã xem đủ 90%
      }
    };

    // Tạo player
    const createPlayer = () => {
      if (containerRef.current && window.YT && window.YT.Player) {
        new window.YT.Player(containerRef.current, {
          videoId, // ID video từ YouTube
          height: "315",
          width: "100%",
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
            onPlay: () => {
              setLastTime(playerRef.current.getCurrentTime()); // Reset lastTime khi bắt đầu video
            },
            onTimeUpdate, // Gọi hàm kiểm tra tiến độ video
          },
        });
      }
    };

    // Kiểm tra nếu API đã có sẵn, tạo player ngay lập tức
    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      // Nếu chưa tải xong API, đợi đến khi có sẵn
      window.onYouTubeIframeAPIReady = createPlayer;
    }
  }, [videoId, lessonId, onComplete, lastTime, videoDuration]);

  return <div ref={containerRef}></div>;
};

YouTubePlayer.propTypes = {
  videoId: PropTypes.string.isRequired,
  lessonId: PropTypes.string.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default YouTubePlayer;
