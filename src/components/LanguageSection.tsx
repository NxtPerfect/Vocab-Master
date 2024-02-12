import { useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useQuery } from "react-query";
import axios from "axios";


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
  countLearnt
}: { index: number; language: string; level: Array<string>, countTotal: Array<number>, countLearnt: Array<number> }) {
  const [fold, setFold] = useState<boolean>(false)
  const [learnt, setLearnt] = useState<boolean>(false)

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      await queryIsLearntToday()
    },
    onSuccess: (data) => console.log(data),
    onError: (err) => console.log(err)
  })

  // It requests for level array, we need to split it into query for each level or return array of each of them
  async function queryIsLearntToday() {
    try {
      const data = await axios.post(`http://localhost:6942/api/${language}&${level}/learnt`, { user_id: Cookies.get("user_id") });
      console.log("Test query", data)
      console.log(data.data)
      setLearnt(data.data)
      return data.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }


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
                {learnt ? "✅" : "❌"}
                <h3> Level: {levelLevel.toUpperCase()}</h3>
                <p>Progress: {countLearnt[levelIndex] !== undefined ? countLearnt[levelIndex] : 0}/{countTotal[levelIndex]}</p>
                <div>
                  Progress bar
                </div>
                <Link
                  className="link"
                  key={levelIndex}
                  to={Cookies.get("email") ? `/flashcard/${language}/${levelLevel}` : '/login'}
                  style={{ textDecoration: "none" }}
                >
                  {Cookies.get("email") ? <button type="button">Learn now</button> : <button type="button">Log in to learn</button>}
                </Link>
              </div>
            ))
            : "(...)"}
        </div>
      </div>
    </>
  );
}

export default LanguageSection;
