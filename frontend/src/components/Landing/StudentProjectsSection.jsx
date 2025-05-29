import { useState } from "react";
import "../../styles/landing/student-projects-section.css";

const videos = [
  { id: "L9RoPh3m_sA" },
  { id: "7Ya1HzAS-LE" },
  { id: "STUvSWGn8HY" },
  { id: "rdP9YUaW1dQ" },
  { id: "Srio6wNB1Xg" },
  { id: "WQYD-DMVE8I" },
  { id: "t7N3BGY8-K8" },
  { id: "koM9fn4aq9g" },
  { id: "OK1YNfLgoDk" },
  { id: "pOQi1aAYMlU" },
];

const StudentProjectsSection = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <section className="student-projects-masonry">
      <div className="student-projects-masonry__overlay" />
      <div className="student-projects-masonry__container">
        <h2 className="student-projects-masonry__title">Dự Án Học Viên</h2>
        <div className="student-projects-masonry__grid">
          {videos.map((video, idx) => (
            <div
              key={idx}
              className={`student-projects-masonry__item ${
                idx === 1 ? "highlighted-video" : ""
              }`}
              onClick={() => setSelectedVideo(video.id)}
            >
              <img
                src={`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`}
                onError={(e) => {
                  const fallback1 = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
                  const fallback2 = `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`;

                  if (e.currentTarget.src.includes("maxresdefault.jpg")) {
                    e.currentTarget.src = fallback1;
                  } else if (e.currentTarget.src.includes("hqdefault.jpg")) {
                    e.currentTarget.src = fallback2;
                  }
                }}
                alt="Student project"
              />
              {idx === 1 && (
                <div className="student-projects-masonry__play">▶</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedVideo && (
        <div
          className="student-projects-modal"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="student-projects-modal__content"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&rel=0`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Student Project"
            />
            <button
              className="student-projects-modal__close"
              onClick={() => setSelectedVideo(null)}
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default StudentProjectsSection;
