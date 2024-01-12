import { useBlocker, useNavigate } from "react-router-dom";
import Nav from "./Nav";
import { ChangeEvent, useState } from "react";
import Cookies from "js-cookie";
import Modal from "./Modal";
import Footer from "./Footer";

function Register() {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  let blocker: Blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      (email !== "" ||
        username !== "" ||
        password !== "" ||
        confirmPassword !== "") &&
      currentLocation.pathname !== nextLocation.pathname,
  );

  const navigate = useNavigate();
  function handleSubmit(e: HTMLFormElement) {
    e.preventDefault();
    setErrorMessage(
      validateRegister(email, username, password, confirmPassword),
    );
    if (errorMessage !== "Success") return "Failed";
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      body: JSON.stringify({
        email: email,
        username: username,
        password: password,
      }),
    };
    fetch("http://localhost:6942/register", requestOptions)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data === "Success") {
          navigate("/");
          Cookies.set("username", username, { expires: 7, samesite: "strict" });
          return data;
        }
        console.log(data);
        alert("User exists");
      })
      .catch((err) => console.log(err));
  }

  function updateEmail(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  function updateUsername(e: ChangeEvent<HTMLInputElement>) {
    setUsername(e.target.value);
  }

  function updatePassword(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  function updateConfirmPassword(e: ChangeEvent<HTMLInputElement>) {
    setConfirmPassword(e.target.value);
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

  return (
    <>
      <Nav />
      <form onSubmit={handleSubmit}>
        {errorMessage !== "Success" ? errorMessage : null}
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="email@proton.com"
          value={email}
          onChange={updateEmail}
          required
        />
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          placeholder="username"
          value={username}
          onChange={updateUsername}
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
        <label htmlFor="password">Confirm Password</label>
        <input
          type="password"
          name="confirm_password"
          placeholder="********"
          value={confirmPassword}
          onChange={updateConfirmPassword}
          required
        />
        <button type="submit">Register</button>
        {blocker.state === "blocked" ? <Modal blocker={blocker} /> : null}
      </form>
      <Footer />
    </>
  );
}
export default Register;
