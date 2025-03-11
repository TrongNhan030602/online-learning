import PropTypes from "prop-types";
import { Spinner } from "react-bootstrap";

const Loading = ({ text, size = "md" }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center gap-2">
      <Spinner
        animation="border"
        role="status"
        size={size}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      {text && <p className="text-primary fw-semibold">{text}</p>}
    </div>
  );
};

Loading.propTypes = {
  text: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
};

export default Loading;
