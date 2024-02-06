import { Link } from "react-router-dom";
import "./App.scss";
import Cookie from "js-cookie";
import Nav from "./components/Nav";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import LanguageSection from "./components/LanguageSection";

export interface Word {
  word_id: number;
  sideA: string;
  sideB: string;
  guessed?: boolean;
}

interface Language {
  language: string;
  level: string;
  countTotal: number;
  countUser: number;
}

function App() {
  const [languages, setLanguages] = useState<Array<Language>>([]);
  const [userProgress, setUserProgress] = useState<Array<number>>([]);

  // Now this runs twice, because of that unmount
  // as we don't abort the fetch if we unmount
  // fix would be to use react-query
  // but it's not that easy to incorporate...
  useEffect(() => {
    if (languages.length !== 0) return
    fetch("http://localhost:6942/api/languages/total")
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        const temp = data.map((lang: object) => ({
          language: lang.language,
          level: lang.level.split(","),
          countTotal: lang.countTotal.split(","),
        } as Language));
        setLanguages((curr: Array<Language>) => [...curr, ...temp]);
      })
      .catch((err) => console.log(err));
    if (!Cookie.get("user_id")) return

    // If user is logged in
    // fetch their progress to show how many they've learnt
    // still needs to udate the languages usestate somehow
    // and merge it in there
    const requestOptions = {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ user_id: Cookie.get("user_id") }),
    };
    fetch("http://localhost:6942/api/languages/user", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        console.log("Got the progress with the boooyysss")
        setUserProgress((curr: Array<number>) => [...curr, ...data]);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Nav />
      <main>
        {languages.map(
          (
            language: { language: string; level: Array<string>, countTotal: Array<string> },
            index: number,
          ) => {
            console.log(language.level, language.countTotal)
            return (
              <LanguageSection
                index={index}
                language={language.language}
                level={language.level}
                countTotal={language.countTotal}
                countLearnt={0}
              />
            );
          },
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;
