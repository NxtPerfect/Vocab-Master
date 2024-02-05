import { Link, useBlocker, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Nav from "./Nav";
import { ChangeEvent, useState } from "react";
import Modal from "./Modal";
import Footer from "./Footer";

function Login() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	let blocker: Blocker = useBlocker(
		({ currentLocation, nextLocation }) =>
			(email !== "" || password !== "") &&
			currentLocation.pathname !== nextLocation.pathname,
	);

	const navigate = useNavigate();
	function handleSubmit(e: HTMLFormElement) {
		e.preventDefault();
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			mode: "cors",
			body: JSON.stringify({ email: email, password: password }),
		};
		fetch("http://localhost:6942/login", requestOptions)
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				if (data.message === "Success") {
					navigate("/");
					Cookies.set("email", email, { expires: 7, samesite: "none", secure: true });
					Cookies.set("user_id", data.user_id[0].id, {
						expires: 7,
						samesite: "strict",
					});
					return data;
				}
				alert("User doesn't exist");
			})
			.catch((err) => console.log(err));
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
			<form onSubmit={handleSubmit}>
				<label htmlFor="email">Email</label>
				<input
					type="email"
					name="email"
					placeholder="email@proton.com"
					value={email}
					onChange={updateEmail}
					required
				></input>
				<label htmlFor="password">Password</label>
				<input
					type="password"
					name="password"
					placeholder="********"
					value={password}
					onChange={updatePassword}
					required
				></input>
				<button type="submit">Login</button>
				<Link to={"/register"} style={{ textDecoration: "none" }}>
					<button type="button">Create new account</button>
				</Link>
			</form>
			{blocker.state === "blocked" ? <Modal blocker={blocker} /> : null}
			<Footer />
		</>
	);
}

export default Login;
