import { Link, useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import axios from "axios";
import { Dispatch, SetStateAction, Suspense, useEffect } from "react";
import { useQuery } from "react-query";
import { useAuth } from "./AuthProvider";

function Nav({ streak, queryUserStreak }: { streak: number, queryUserStreak: () => Promise<void>, isAuthenticated: boolean, setIsAuthenticated: Dispatch<SetStateAction<boolean>>, queryAuthStatus: () => Promise<void> }) {
  const { isAuthenticated, setIsAuthenticated, _, logout } = useAuth();
  const navigate = useNavigate();
  async function unsetCookies() {
    Cookie.remove("username");
    Cookie.remove("token")
    logout()
    try {
      await axios.post('http://localhost:6942/logout').then(setIsAuthenticated(false)).then(navigate(0))
    }
    catch (err) {
      console.log(err)
      throw (err)
    }
    finally {
      navigate(0)
    }
  }

  const { isLoading, isError, isFetching, data, error } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      if (!isAuthenticated) return
      await queryUserStreak()
    },
    onError: (err) => console.log(err),
    enabled: true
  })


  // this if statement should instead call the auth-status
  if (isAuthenticated) {
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
            <Suspense fallback={"Loading..."}>
              <span>{streak !== 0 ? `🔥 ${streak} days ` : "❌fail "}
                {Cookie.get("username")}</span>
            </Suspense>
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
