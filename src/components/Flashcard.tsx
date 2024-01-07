import { useParams } from "react-router-dom"

function Flashcard() {
  const params = useParams()
  const language = params.language
  const level = params.level
  return (
    <>
      Flashcard
      {language}
      {level}
    </>
  )
}
export default Flashcard
