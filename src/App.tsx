import { Link } from 'react-router-dom'
import './App.scss'
import Nav from './components/Nav'
import { useEffect, useState } from 'react'

//
// {languages.map((lang, id) => (
//   <Link to="/flashcard/${lang.lang}/${lang.level}" key={id} style={{ textdecoration: "none" }}>Flashcard</Link>
// ))}
//

export interface Word {
  word_id: number,
  sideA: string,
  sideB: string,
  guessed?: boolean
}

function App() {

  // const [languages, setLanguages] = useState([])
  //
  // useEffect(() => {
  //   fetch('http://localhost:6942/api/languages')
  //     .then(res => res.json())
  //     .then(data => {
  //       setLanguages((curr) => [...curr, data as Array<Word>])
  //       console.log(languages)
  //     })
  //     .catch(err => console.log(err))
  // }, [])

  return (
    <>
      <Nav />
      <main>
        <Link to="/flashcard/german/a1" style={{ textDecoration: "none" }}>Flashcard</Link>

      </main>
      <footer>Footer</footer>
    </>
  )
}

export default App
