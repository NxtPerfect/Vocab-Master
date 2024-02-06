import { Link } from "react-router-dom"
import Footer from "./components/Footer"
import Nav from "./components/Nav"

function ErrorPage() {
  return (
    <>
      <Nav/>
        <h1>Oops! Something went wrong</h1>
        <p>If you encounter problems please report them to <Link to={"/"}>us</Link></p>
        <Link to={"/"}>Go back</Link>
      <Footer/>
    </>
  )
}

export default ErrorPage
