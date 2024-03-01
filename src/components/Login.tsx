import { Link, redirect, useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import { FormEventHandler, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { useAuth } from "./AuthProvider";

function Login() {
  const email = useRef()
  const password = useRef()
  const { isAuthenticated, setIsAuthenticated, login, logout } = useAuth()
  const queryClient = useQueryClient()

  const navigate = useNavigate();

  const { isLoading, isError, error, data, refetch } = useQuery({
    queryKey: ["login"],
    queryFn: async () => {
      await queryLogin()
    },
    onError: (err) => console.log(err),
    onSuccess: () => console.log("Successful Login"),
    refetchOnWindowFocus: false,
    enabled: false,
  })

  async function queryLogin() {
    try {
      const data = await axios.post('http://localhost:6942/login', { email: email.current.value, password: password.current.value });
      if (data.data.message !== "Success") {
        alert("User doesn't exist")
        return data.data
      }
      Cookie.set("username", data.data.username, { expires: 14, samesite: "strict", secure: true })
      await setIsAuthenticated(true)
      console.log(isAuthenticated)
      navigate("/")
      return data.data
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  useEffect(() => {
    queryClient.invalidateQueries("languages")
    queryClient.invalidateQueries("auth")
  }, [queryClient])

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
          <button type="submit">Login</button>
          <Link to={"/register"} style={{ textDecoration: "none" }}>
            <button type="button">Create new account</button>
          </Link>
          {isError ? error : null}
        </form>
      </main>
    </>
  );
}

export default Login;
