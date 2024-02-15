import { Link, useBlocker, useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import Nav from "./Nav";
import { ChangeEvent, FormEventHandler, useRef, useState } from "react";
import Modal from "./Modal";
import Footer from "./Footer";
import { useQuery } from "react-query";
import axios from "axios";

function Login() {
  const email = useRef();
  const password = useRef();
  let blocker: Blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      (email.current.value !== "" || password.current.value !== "") &&
      currentLocation.pathname !== nextLocation.pathname,
  );

  const navigate = useNavigate();

  const { data, refetch } = useQuery({
    queryKey: ["login"],
    queryFn: async () => {
      await queryLogin()
    },
    onSuccess: (data) => console.log(data),
    onError: (err) => console.log(err),
    refetchOnWindowFocus: false,
    enabled: false
  })

  async function queryLogin() {
    try {
      const data = await axios.post('http://localhost:6942/login', { email: email.current.value, password: password.current.value, withCredentials: true });
      if (data.data.message === "Login successful.") {
        navigate("/");
        // Cookie.set("email", email, { expires: 7, samesite: "none", secure: true });
        // Cookie.set("user_id", data.data.user_id[0].id, {
        //   expires: 7,
        //   samesite: "strict",
        // });
        Cookie.set("username", data.data.username, {expires: 14, samesite: "strict", secure: true});
        return data.data
      }
      alert("User doesn't exist")
      return data.data
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  function handleSubmit(e: FormEventHandler<HTMLFormElement>) {
    e.preventDefault();
    // Manually fetches useQuery
    refetch();
  }

  return (
    <>
      <Nav />
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
            required
          />
          <button type="submit">Login</button>
          <Link to={"/register"} style={{ textDecoration: "none" }}>
            <button type="button">Create new account</button>
          </Link>
        </form>
        {blocker.state === "blocked" ? <Modal blocker={blocker} /> : null}
      </main>
      <Footer />
    </>
  );
}

export default Login;
