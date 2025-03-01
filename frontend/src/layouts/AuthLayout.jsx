import PropTypes from "prop-types";

const AuthLayout = ({ children, imageUrl, title, description }) => {
  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center">
      <div className="row w-100">
        {/* Bên trái: Hình ảnh với overlay, chỉ hiển thị trên tablet & desktop */}
        <div
          className="col-lg-8 d-none d-lg-flex position-relative"
          style={{
            background: `url(${imageUrl}) no-repeat center center/cover`,
            minHeight: "100vh",
            filter: "brightness(0.8)",
          }}
        >
          <div className="position-absolute bottom-0 start-0 p-5 text-white col-lg-8">
            <h1
              className="text-white"
              style={{
                fontWeight: "bold",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)", // Bóng chữ
              }}
            >
              {title}
            </h1>
            <p
              className="text-white"
              style={{
                fontSize: "1.2rem",
                textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)",
              }}
            >
              {description}
            </p>
          </div>
        </div>

        {/* Bên phải: Form Login/Register */}
        <div className="col-12 col-lg-4 d-flex align-items-center justify-content-center">
          <div
            className="w-100 px-4 py-4"
            style={{ maxWidth: "400px" }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
  imageUrl: PropTypes.string.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
};

AuthLayout.defaultProps = {
  title: "Welcome to Our Platform",
  description: "Join us today and explore amazing opportunities.",
};

export default AuthLayout;
