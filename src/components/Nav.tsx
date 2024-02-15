import { Link, useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useQuery } from "react-query";

function Nav({ streak, isAuthenticated, setIsAuthenticated, queryAuthStatus }: { streak: number, isAuthenticated: boolean, setIsAuthenticated: Dispatch<SetStateAction<boolean>>, queryAuthStatus: () => Promise<void> }) {
  const navigate = useNavigate();
  async function unsetCookies() {
    Cookie.remove("username");
    try {
      await axios.get('http://localhost:6942/logout', { withCredentials: true })
      setIsAuthenticated(false)
    }
    catch (err) {
      console.log(err)
      throw (err)
    }
    navigate("/");
  }

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      await queryAuthStatus()
    },
  })

  // async function queryAuthStatus() {
  //   try {
  //     const data = await axios.get("http://localhost:6942/auth-status", { withCredentials: true })
  //     setIsAuthenticated(data.data.isAuthenticated)
  //   } catch (err) {
  //     console.log(err);
  //     throw err;
  //   }
  // }



  // this if statement should instead call the auth-status
  if (isAuthenticated) {
    return (
      <>
        <nav>
          <h1>Vocab Master</h1>
          <div className="nav_buttons">
            <Link className="link" to="/">
              Home
            </Link>
            <p>{streak !== 0 ? "🔥" : "❌"} days</p>
            {Cookie.get("username")}
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
