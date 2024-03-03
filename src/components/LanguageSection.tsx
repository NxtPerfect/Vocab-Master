import { useState } from "react";
import { Link } from "react-router-dom";
import Cookie from "js-cookie";


/*
  * Showing words learnt is currently a very wacky way, but it works
  * should be done a little bit different
  * also needs cleanup from all the ternary operators
  */
function LanguageSection({
  index,
  language,
  level,
  countTotal,
  countLearnt,
  isLearnt
}: { index: number; language: string; level: Array<string>, countTotal: Array<number>, countLearnt: Array<number>, isLearnt: Array<boolean> }) {
  const [fold, setFold] = useState<boolean>(false)

  return (
    <>
      <div
        className="language_section"
        style={fold ? { height: "4rem" } : {}}
        key={index}
      >
        <div className="language_section_top">
          <h1>{language}</h1>
          <button type="button" onClick={() => setFold((curr) => !curr)}>
            <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{!fold ? <path d="M6 9l6 6 6-6" /> : <path d="M15 18l-6-6 6-6" />}</svg>
          </button>
        </div>
        <div className="language_levels_wrapper">
          {!fold
            ? level.map((levelLevel: string, levelIndex: number) => (
              <div className="language_level">
                {isLearnt[levelIndex] ? "✅" : "❌"}
                <h3> Level: {levelLevel.toUpperCase()}</h3>
                <p>Progress: {countLearnt[levelIndex] !== undefined ? countLearnt[levelIndex] : 0}/{countTotal[levelIndex]}</p>
                <div className="progress_bar_container">
                  <div className="progress_bar" style={{ width: `${countLearnt[levelIndex] === undefined ? 0 : (countLearnt[levelIndex] / countTotal[levelIndex]) * 100}%` }} />
                </div>
                {countLearnt[levelIndex] === countTotal[levelIndex] ? <p className="disabled">All words learnt</p> : (!isLearnt[levelIndex] ? (<Link
                  className="link"
                  key={levelIndex}
                  to={Cookie.get("username") ? `/flashcard/${language}/${levelLevel}` : '/login'}
                  style={{ textDecoration: "none" }}
                >
                  {Cookie.get("username") ? <button type="button">Learn now</button> : <button type="button">Log in to learn</button>}
                </Link>) : <p className="disabled">Come back tomorrow</p>)}
              </div>
            ))
            : "(...)"}
        </div>
      </div>
    </>
  );
}

export default LanguageSection;
