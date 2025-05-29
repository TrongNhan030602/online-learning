import { useState, useEffect, useRef } from "react";

const useCountUp = (end, start = 0, duration = 3000, trigger) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (!trigger) return;

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, start, duration, trigger]);

  return count;
};

const Stats = () => {
  const statsRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) observer.observe(statsRef.current);

    return () => observer.disconnect();
  }, []);

  const countYear = useCountUp(5, 0, 1500, visible);
  const countStudents = useCountUp(1120, 0, 2000, visible);
  const countCenters = useCountUp(10, 0, 1500, visible);

  return (
    <div className="stats-wrapper">
      <section
        className="stats"
        ref={statsRef}
      >
        <div className="stats__container">
          <div className="stats__item">
            <div className="stats__number">{countYear}</div>
            <div className="stats__label">Năm</div>
          </div>
          <div className="stats__item">
            <div className="stats__number">
              {countStudents.toLocaleString()}+
            </div>
            <div className="stats__label">Học viên</div>
          </div>
          <div className="stats__item">
            <div className="stats__number">{countCenters}</div>
            <div className="stats__label">Trung tâm</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Stats;
