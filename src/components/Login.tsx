import { Link, useBlocker, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Nav from "./Nav";
import { ChangeEvent, FormEventHandler, useState } from "react";
import Modal from "./Modal";
import Footer from "./Footer";
import { useQuery } from "react-query";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  let blocker: Blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      (email !== "" || password !== "") &&
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
      const data = await axios.post('http://localhost:6942/login', { email: email, password: password });
      if (data.data.message === "Success") {
        navigate("/");
        Cookies.set("email", email, { expires: 7, samesite: "none", secure: true });
        Cookies.set("user_id", data.data.user_id[0].id, {
          expires: 7,
          samesite: "strict",
        });
        return data.data;
      }
      alert("User doesn't exist")
      return data.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  function handleSubmit(e: FormEventHandler<HTMLFormElement>) {
    e.preventDefault();
    // Manually fetches useQuery
    refetch();
  }

  function updateEmail(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  function updatePassword(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
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
            value={email}
            onChange={updateEmail}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="********"
            value={password}
            onChange={updatePassword}
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
