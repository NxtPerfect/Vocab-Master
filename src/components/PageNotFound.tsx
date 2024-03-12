import React from 'react'
import { Link } from 'react-router-dom'

function PageNotFound() {
  return (
    <>
      <div className="page-not-found">
        <h1>Oops, website doesn't exist!</h1>
        <p>Check that your url is correct, if issue persists contact support.</p>
        <Link to={"/"}>Go back home</Link>
      </div>
    </>
  )
}
export default PageNotFound
