import { Link } from "react-router-dom";

function Nav() {
  return (
    <>
      <nav>
        <Link to={'/'}>Home</Link>
        <Link to={'/login'}>Login</Link>
        <Link to={'/register'}>Register</Link>
      </nav>
    </>
  )
}
export default Nav 
