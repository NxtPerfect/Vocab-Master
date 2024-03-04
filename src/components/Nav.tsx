import { Link, useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import axios from "axios";
import { Dispatch, SetStateAction, Suspense, useEffect } from "react";
import { useQuery } from "react-query";

function Nav({ streak, queryUserStreak, isAuthenticated, setIsAuthenticated, queryAuthStatus }: { streak: number, queryUserStreak: () => Promise<void>, isAuthenticated: boolean, setIsAuthenticated: Dispatch<SetStateAction<boolean>>, queryAuthStatus: () => Promise<void> }) {
  const navigate = useNavigate();
  async function unsetCookies() {
    Cookie.remove("username");
    Cookie.remove("token")
    setIsAuthenticated(false)
    navigate(0)
    try {
      await axios.post('http://localhost:6942/logout').then(setIsAuthenticated(false)).then(navigate(0))
    }
    catch (err) {
      console.log(err)
      throw (err)
    }
  }

  const { isLoading, isError, isFetching, data, error } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      // await queryAuthStatus()
      if (!isAuthenticated) return
      await queryUserStreak()
    },
    onError: (err) => console.log(err),
    enabled: true
  })

  // const { isPend, isErr, dat, err } = useQuery({
  //   queryKey: ["streak"],
  //   queryFn: async () => {
  //     await queryUserStreak()
  //   },
  // })

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
  if (isAuthenticated || Cookie.get("username")) {
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
