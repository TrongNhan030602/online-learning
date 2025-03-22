import PropTypes from "prop-types";
import { Spinner } from "react-bootstrap";

const Loading = ({
  text,
  size,
  variant = "primary",
  textVariant = "primary",
  className = "",
}) => {
  return (
    <div
      className={`d-flex flex-column align-items-center justify-content-center gap-2 ${className}`}
    >
      <Spinner
        animation="border"
        role="status"
        size={size}
        variant={variant}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      {text && <p className={`text-${textVariant} fw-semibold`}>{text}</p>}
    </div>
  );
};

Loading.propTypes = {
  text: PropTypes.string,
  size: PropTypes.oneOf(["sm", "lg"]),
  variant: PropTypes.string, // Màu của Spinner
  textVariant: PropTypes.string, // Màu của text (theo Bootstrap)
  className: PropTypes.string,
};

export default Loading;
