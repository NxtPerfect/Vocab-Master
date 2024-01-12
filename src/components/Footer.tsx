import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
      <footer>
        <div>
          <h2>Vocab Master</h2>
        </div>
        <div>
          <Link to="/" style={{ textDecoration: "none" }}>
            Home
          </Link>
          <Link to="/terms" style={{ textDecoration: "none" }}>
            Terms of Service
          </Link>
        </div>
      </footer>
    </>
  );
}

export default Footer;
