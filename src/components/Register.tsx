import { useBlocker, useNavigate } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import Cookies from "js-cookie";
import Modal from "./Modal";
import { useQuery } from "react-query";
import axios from "axios";
import IconSpinner from "./IconSpinner";
import { useAuth } from "./AuthProvider";

function Register() {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const {isAuthenticated, login} = useAuth();
  const navigate = useNavigate();

  let blocker: Blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      (email !== "" ||
        username !== "" ||
        password !== "" ||
        confirmPassword !== "") &&
      currentLocation.pathname !== nextLocation.pathname,
  );

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["register"],
    queryFn: async () => {
      await queryRegister()
    },
    onSuccess: (data) => {
      console.log(data)
      login()
      window.location.assign("/")
    },
    onError: (err) => setErrorMessage(err.response.data),
    refetchOnWindowFocus: false,
    enabled: false
  })

  async function queryRegister() {
    try {
      const data = await axios.post("http://localhost:6942/register", { email: email, username: username, password: password })
      console.log("Before check", data)
      console.log("Type", data.data.type)
      if (data.data.type === "success") {
        Cookies.set("username", data.data.username, { expires: 14, samesite: "Lax" });
        Cookies.set("token", data.data.token, { expires: 14, samesite:"Lax"})
        navigate("/");
        return data.data;
      }
      console.log("After check", data);
      setErrorMessage(data.status.toString())
      alert("User exists");
    } catch (err) {
      console.log(err)
    }
  }

  function handleSubmit(e: HTMLFormElement) {
    e.preventDefault();

    if (validateRegister(email, username, password, confirmPassword) !== "Success") return "Failed";
    setErrorMessage("Success")
    refetch()
  }

  function validateRegister(
    email: string,
    username: string,
    password: string,
    confirmPassword: string,
  ) {
    if (password !== confirmPassword) return "Passwords don't match";
    if (email.length <= 5) return "Incorrect email address";
    if (username.length < 2) return "Username must be longer than 2 characters";
    if (password.length < 8) return "Password must be longer than 8 characters";
    const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid_email = email.match(email_regex);
    if (!valid_email) return "Not a valid email address";
    const username_regex = /^[a-zA-Z0-9]+$/;
    const valid_username = username.match(username_regex);
    if (!valid_username)
      return "Not a valid username, make sure you only use alphanumeric username (no special characters)";
    const password_regex = /^[a-zA-Z0-9]+$/;
    const valid_password = password.match(password_regex);
    if (!valid_password)
      return "Not a valid password, make sure you only use alphanumeric password (no special characters)";
    return "Success";
  }

  if (isAuthenticated) {
    return (
    <>
        <main>
          User already logged in
        </main>
    </>
    )
  }

  return (
    <>
      <main>
        <form onSubmit={handleSubmit}>
          <h1>Register</h1>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="email@proton.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            minLength={5}
            maxLength={64}
            required
          />
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            minLength={2}
            maxLength={32}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            maxLength={64}
            required
          />
          <label htmlFor="password">Confirm Password</label>
          <input
            type="password"
            name="confirm_password"
            placeholder="********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
            maxLength={64}
            required
          />
          {errorMessage ? <p className="error-msg">{errorMessage}</p> : null}
          <button type="submit" disabled={isLoading}>{isLoading ? <IconSpinner/> : null}Register</button>
        </form>
        {blocker.state === "blocked" ? <Modal blocker={blocker} /> : null}
      </main>
    </>
  );
}
export default Register;
