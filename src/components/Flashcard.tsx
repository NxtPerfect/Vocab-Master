import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Word } from "../App"
import Nav from "./Nav"

function Flashcard() {
  const [words, setWords] = useState<Array<Word>>([]) // 2: true 3: true 0 1 -> guessed: nie ma
  const [randomIndexes, setRandomIndexes] = useState<Array<number>>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [show, setShow] = useState<boolean>(false)
  const [changedWords, setChangedWords] = useState<boolean>(false)
  const params = useParams()
  const language = params.language
  const level = params.level

  // Access api
  // and get words
  useEffect(() => {
    fetch(`http://localhost:6942/api/german/a1`)
      .then(res => res.json())
      .then(data => {
        setWords(data)
        setChangedWords((curr) => !curr)
      })
      .catch(err => console.log(err))
  }, [])

  // Populate array with indexes of words
  // randomize them
  // then pick from them, to pick random word from "words"
  // Somehow now it's undefined, and won't make it work like that
  useEffect(() => {
    const indexes = Array.from(Array(words.length).keys())
    for (let index = 0; index < words.length; index++) {
      setRandomIndexes(indexes)
    }
    setRandomIndexes((curr) => curr.sort(() => Math.random() - 0.5))
    randomIndexes.sort(() => Math.random() - 0.5)
  }, [changedWords])

  function incrementIndex() {
    if (currentIndex + 1 >= randomIndexes.length) {
      setCurrentIndex(0)
      return
    }
    setCurrentIndex((curr) => curr + 1)
  }

  function decrementIndex() {
    if (currentIndex - 1 < 0) {
      setCurrentIndex(0)
      return
    }
    setCurrentIndex((curr) => curr - 1)
  }

  function guessedCorrect() {
    if (words[randomIndexes[currentIndex]].guessed === true && words[randomIndexes[currentIndex]].guessed !== undefined) {
      setRandomIndexes((curr) => curr.filter((index) => index !== randomIndexes[currentIndex]))
      setShow(false)
      return
    }
    setWords((words) => {
      return words.map((word, index) => {
        if (index === randomIndexes[currentIndex]) return { ...word, guessed: true }
        return word
      })
    })
    setShow(false)
    incrementIndex()
  }

  function guessedWrong() {
    if (words[randomIndexes[currentIndex]].guessed === true) {
      setWords((words) => {
        return words.map((word, index) => {
          if (index === randomIndexes[currentIndex]) return { ...word, guessed: false }
          return word
        })
      })
    }
    setShow(false)
    incrementIndex()
  }

  if (words.length === 0) return (<><Nav />Loading words...</>)
  if (randomIndexes.length === 0 || words[randomIndexes[currentIndex]] === undefined) {
    return (<><Nav />All words lernt</>)
  }
  if (show === true) {
    return (
      <>
        <Nav />
        <div>
          <div key={words[randomIndexes[currentIndex]].word_id}>{words[randomIndexes[currentIndex]].sideA} {words[randomIndexes[currentIndex]].sideB}</div>
          <button onClick={guessedCorrect}>Correct</button>
          <button onClick={guessedWrong}>Wrong</button>
        </div>
      </>
    )
  }

  return (
    <>
      <Nav />
      Flashcard
      {language}
      {level}
      <div>
        <div key={words[randomIndexes[currentIndex]].word_id}>{words[randomIndexes[currentIndex]].sideA} {words[randomIndexes[currentIndex]].sideB}</div>
        <button onClick={() => { setShow(true) }}>Haha</button>
      </div>
    </>
  )
}
export default Flashcard
