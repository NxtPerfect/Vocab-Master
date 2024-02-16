import { Link } from "react-router-dom"
import Footer from "./Footer"
import Nav from "./Nav"
import Layout from "./Layout"

function ErrorPage() {
  return (
    <>
      <Layout>
        <main>
          <h1>Oops! Something went wrong</h1>
          <p>If you encounter problems please report them to <Link to={"/"}>us</Link></p>
          <Link to={"/"}>Go back</Link>
        </main>
      </Layout>
    </>
  )
}

export default ErrorPage
