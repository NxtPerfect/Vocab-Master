import { useNavigate } from "react-router-dom"
import Nav from "./Nav"
import { useState } from "react"

function Register() {
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
    fetch("http://localhost:6942/register", requestOptions)
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        if (data === 'Success') {
          navigate('/')
          Cookies.set('username', username, { expires: 7, samesite: 'strict' })
          return data
        }
        alert('User exists')
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
        <label htmlFor="email">Email</label>
        <input type="email" name="email"></input>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" value={username} onChange={updateUsername}></input>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" value={password} onChange={updatePassword}></input>
        <label htmlFor="password">Confirm Password</label>
        <input type="password" name="confirm_password"></input>
        <button type="submit">Register</button>
      </form>
    </>
  )
}
export default Register
