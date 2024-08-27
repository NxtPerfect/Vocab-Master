import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
      <footer>
        <h2>Vocab Master</h2>
        <div className="footer_center">
          <Link to="/" className="link" style={{ textDecoration: "none" }}>
            Home
          </Link>
          <Link to="/terms" className="link" style={{ textDecoration: "none" }}>
            Terms of Service
          </Link>
        </div>
        Copyright (c) 2024. All Rights Reserved.
      </footer>
    </>
  );
}

export default Footer;
