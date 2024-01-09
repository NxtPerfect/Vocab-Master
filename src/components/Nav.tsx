import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function Nav() {
	const navigate = useNavigate();
	function unsetCookies() {
		Cookies.remove("email");
		navigate("/");
	}
	if (Cookies.get("email") !== undefined) {
		return (
			<>
				<nav>
					<h1>Vocab Master</h1>
					<Link to={"/"} style={{ textDecoration: "none" }}>
						Home
					</Link>
					{Cookies.get("email")}
					<button onClick={unsetCookies}>Log out</button>
				</nav>
			</>
		);
	}
	return (
		<>
			<nav>
				<h1>Vocab Master</h1>
				<Link to={"/"} style={{ textDecoration: "none" }}>
					Home
				</Link>
				<Link to={"/login"} style={{ textDecoration: "none" }}>
					Login
				</Link>
				<Link to={"/register"} style={{ textDecoration: "none" }}>
					Register
				</Link>
			</nav>
		</>
	);
}
export default Nav;
