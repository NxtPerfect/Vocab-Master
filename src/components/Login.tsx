import { Link } from "react-router-dom"
import Cookies from "js-cookie"

function Login() {
  function handleSubmit(e) {
    e.preventDefault()
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin' })
    }
    const res = fetch("http://localhost:6942/api/login", requestOptions)
      .then((response) => {
        console.log(response)
        response.json()
      })
      .catch((err) => console.log(err))

    setCookies(res)
  }

  function setCookies(res) {
    if (!res.ok) return
    const data = res.json()
    Cookies.set('username', username, { expires: 7 })
    Cookies.set('userId', userId, { expires: 7 })
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input type="text" name="username"></input>
        <label htmlFor="password">Password</label>
        <input type="password" name="password"></input>
        <button type="submit">Login</button>
        <Link to={"/register"} style={{ textdecoration: "none" }}><button>Create new account</button></Link>
      </form >
    </>
  )
}

export default Login
