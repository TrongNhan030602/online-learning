import { useState } from "react";
import "../../styles/landing/sticky-contact-buttons.css";

const StickyContactButtons = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`sticky-contacts${expanded ? " expanded" : ""}`}>
      <a
        href="tel:0704888009"
        className="sticky-contacts__button sticky-contacts__button--phone"
        title="Gọi điện"
      >
        <img
          src="/images/icons/call-icon.png"
          alt="Phone"
          className="sticky-contacts__icon"
        />
      </a>
      <a
        href="https://m.me/0704888009"
        target="_blank"
        rel="noopener noreferrer"
        className="sticky-contacts__button sticky-contacts__button--messenger"
        title="Messenger"
      >
        <img
          src="/images/icons/messenger.png"
          alt="Messenger"
          className="sticky-contacts__icon"
        />
      </a>
      <a
        href="https://zalo.me/0704888009"
        target="_blank"
        rel="noopener noreferrer"
        className="sticky-contacts__button sticky-contacts__button--zalo"
        title="Zalo"
      >
        <img
          src="/images/icons/zalo-icon.png"
          alt="Zalo"
          className="sticky-contacts__icon"
        />
      </a>

      <button
        className={`sticky-contacts__button sticky-contacts__button--toggle ${
          expanded ? "expanded" : ""
        }`}
        onClick={() => setExpanded(!expanded)}
        title={expanded ? "Đóng liên hệ" : "Mở liên hệ"}
        aria-label={expanded ? "Đóng liên hệ" : "Mở liên hệ"}
      >
        <img
          src="/images/icons/group-icon.png"
          alt="Toggle contacts"
          className="sticky-contacts__icon"
        />
      </button>
    </div>
  );
};

export default StickyContactButtons;
