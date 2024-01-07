import { Link } from 'react-router-dom'
import './App.scss'
import Nav from './components/Nav'
import { useEffect, useState } from 'react'

function App() {

  const [languages, setLanguages] = useState([])

  useEffect(() => {
    fetch('http://localhost:6942/api')
      .then(res => res.json())
      .then(data => {
        setLanguages((curr) => [...curr, data])
        console.log(languages)
      })
      .catch(err => console.log(err))
  }, [])

  return (
    <>
      <Nav />
      <main><Link to="/flashcard/a1/german" style={{ textdecoration: "none" }}>Flashcard</Link></main>
      <footer>Footer</footer>
    </>
  )
}

export default App
