import "../../styles/landing/landing-footer.css";

const LandingFooter = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <p className="footer__hotline">
          <strong>Hotline tư vấn & hỗ trợ:</strong>{" "}
          <a href="tel:0704888009">0704 888 009</a> –{" "}
          <a href="tel:0784888009">0784 888 009</a>
        </p>
        <p className="footer__address">
          <strong>Địa chỉ:</strong> 166 Nguyễn Văn Cừ, P. An Bình, Q. Ninh Kiều,
          TP. Cần Thơ, Việt Nam
        </p>
        <p className="footer__website">
          <strong>Website:</strong>{" "}
          <a
            href="https://www.design24.edu.vn"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.design24.edu.vn
          </a>
        </p>
        <p className="footer__fanpage">
          <strong>Fanpage:</strong>{" "}
          <a
            href="https://www.facebook.com/www.design24.edu.vn"
            target="_blank"
            rel="noopener noreferrer"
          >
            Học viện Design24
          </a>
        </p>
      </div>
    </footer>
  );
};

export default LandingFooter;
