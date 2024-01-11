import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Modal from "./Modal";

/** If modal then show modal
 * if clicked yes then navigate
 * else close modal
 * @param (boolean) modal
 */
function Nav(modal: boolean) {
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
					<button type="button" onClick={unsetCookies}>
						Log out
					</button>
				</nav>
			</>
		);
	}

	/* This doesn't make sense yet
	 * We should conditionally show modal in a function here instead
	 * for example
	 * close(route: string) {
	 * --show modal
	 * --if confirm then navigate(route)
	 * --else close
	 * }
	 */
	if (modal) {
		return (
			<>
				<nav>
					<h1>Vocab Master</h1>
					<button type="button" onClick={() => Modal("/")}>
						Home
					</button>
					<button type="button" onClick={() => Modal("/login")}>
						Login
					</button>
					<button type="button" onClick={() => Modal("/register")}>
						Register
					</button>
				</nav>
			</>
		);
	}
	return (
		<>
			<nav>
				<h1>Vocab Master</h1>
				<button type="button" onClick={() => navigate("/")}>
					Home
				</button>
				<button type="button" onClick={() => navigate("/login")}>
					Login
				</button>
				<button type="button" onClick={() => navigate("/register")}>
					Register
				</button>
			</nav>
		</>
	);
}
export default Nav;
