import { Link, useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import Nav from "./Nav"
import { ChangeEvent, useState } from "react"

function Login() {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const navigate = useNavigate()
  function handleSubmit(e: HTMLFormElement) {
    e.preventDefault()
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify({ username: username, password: password })
    }
    fetch("http://localhost:6942/login", requestOptions)
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        if (data === 'Success') {
          navigate('/')
          Cookies.set('username', username, { expires: 7, samesite: 'strict' })
          return data
        }
        alert('User doesn\'t exist')
      })
      .catch((err) => console.log(err))
  }

  function updateUsername(e: ChangeEvent<HTMLInputElement>) {
    setUsername(e.target.value)
  }

  function updatePassword(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value)
  }

  return (
    <>
      <Nav />
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" value={username} onChange={updateUsername} required></input>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" value={password} onChange={updatePassword} required></input>
        <button type="submit">Login</button>
        <Link to={"/register"} style={{ textdecoration: "none" }}><button>Create new account</button></Link>
      </form >
    </>
  )
}

export default Login
