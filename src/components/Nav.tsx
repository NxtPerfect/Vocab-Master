import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie"

function Nav() {
  const navigate = useNavigate()
  function unsetCookies() {
    Cookies.remove('username')
    navigate('/')
  }
  if (Cookies.get('username') !== undefined) {
    return (
      <>
        <nav>
          <h1>Vocab Master</h1>
          <Link to={'/'}>Home</Link>
          {Cookies.get('username')}
          <button onClick={unsetCookies}>Log out</button>
        </nav>
      </>
    )
  }
  return (
    <>
      <nav>
        <h1>Vocab Master</h1>
        <Link to={'/'}>Home</Link>
        <Link to={'/login'}>Login</Link>
        <Link to={'/register'}>Register</Link>
      </nav>
    </>
  )
}
export default Nav 
