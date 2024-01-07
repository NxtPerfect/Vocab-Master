import { Link } from "react-router-dom"

function Login() {
  return (
    <>
      <form method="POST">
        <label htmlFor="username">Username</label>
        <input type="text" name="username"></input>
        <label htmlFor="password">Password</label>
        <input type="password" name="password"></input>
        <button>Login</button>
        <Link to={"/register"} style={{ textdecoration: "none" }}><button>Create new account</button></Link>
      </form >
    </>
  )
}

export default Login
