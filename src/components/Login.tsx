import { Link, useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { useAuth } from "./AuthProvider";
import IconSpinner from "./IconSpinner";

function Login() {
  const email = useRef()
  const password = useRef()
  const { isAuthenticated, setIsAuthenticated, login, logout } = useAuth()
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string>("")
  const navigate = useNavigate();

  const { isLoading, isError, error, data, refetch } = useQuery({
    queryKey: ["login"],
    queryFn: async () => {
      await queryLogin()
    },
    onError: (err) => setErrorMessage(err.response.data),
    onSuccess: () => {
      // reload website to get language sections
      console.log("Successful Login")
      window.location.assign("/")
    },
    refetchOnWindowFocus: false,
    enabled: false,
  })

  async function queryLogin() {
    try {
      setErrorMessage("")
      const data = await axios.post('http://localhost:6942/login', { email: email.current.value, password: password.current.value });
      if (data.data.type !== "success") {
        console.log(data.status)
        setErrorMessage(data.status.toString())
        return
      }
      console.log(data.data)
      Cookie.set("username", data.data.username, { expires: 14, samesite: "Lax" })
      Cookie.set("token", data.data.token, { expires: 14, samesite:"Lax"})
      await setIsAuthenticated(true)
      console.log(isAuthenticated)
      navigate("/")
      return data.data
    } catch (err) {
      console.log(err)
      throw err
    }
  }
  //
  // useEffect(() => {
  //   queryClient.invalidateQueries("languages")
  //   queryClient.invalidateQueries("auth")
  // }, [queryClient])

  function handleSubmit(e: FormEventHandler<HTMLFormElement>) {
    e.preventDefault();
    // Manually fetches useQuery
    refetch();
  }

  return (
    <>
      <main>
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="email@proton.com"
            ref={email}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="********"
            ref={password}
            minLength={5}
            maxLength={128}
            required
          />
          <p className="error-msg">{errorMessage}</p>
          <button type="submit" disabled={isLoading}>{isLoading ? <IconSpinner/> : null}Login</button>
          <Link to={"/register"} style={{ textDecoration: "none" }}>
            <button type="button">Create new account</button>
          </Link>
        </form>
      </main>
    </>
  );
}

export default Login;
