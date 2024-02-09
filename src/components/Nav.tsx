import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function Nav() {
  const navigate = useNavigate();
  function unsetCookies() {
    Cookies.remove("email");
    navigate("/");
  }
  if (Cookies.get("email") !== undefined) {
    return (
      <>
        <nav>
          <h1>Vocab Master</h1>
          <div className="nav_buttons">
            <Link className="link" to="/">
              Home
            </Link>
            <p>🔥100 days</p>
            {Cookies.get("email")}
            <button type="button" onClick={unsetCookies}>
              Log out
            </button>
          </div>
        </nav>
      </>
    );
  }

  return (
    <>
      <nav>
        <Link to="/" style={{ textDecoration: "none" }}>
          <h1>Vocab Master</h1>
        </Link>
        <div className="nav_buttons">
          <Link className="link" to="/">
            Home
          </Link>
          <Link className="link login" to="/login">
            Login
          </Link>
          <Link className="link register" to="/register">
            Register
          </Link>
        </div>
      </nav>
    </>
  );
}
export default Nav;
