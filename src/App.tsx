import { Link } from "react-router-dom";
import "./App.scss";
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

function App() {
  const [languages, setLanguages] = useState<Array<object>>([]);

  useEffect(() => {
    fetch("http://localhost:6942/api/languages")
      .then((res) => res.json())
      .then((data) => {
        const temp = data.map((lang: object) => ({
          language: lang.language,
          level: lang.level.split(","),
        }));
        console.log(temp);
        setLanguages((curr) => [...curr, ...temp]);
        console.log(languages);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Nav />
      <main>
        {languages.map(
          (
            language: { language: string; level: Array<string> },
            index: number,
          ) => {
            return (
              <LanguageSection
                index={index}
                language={language.language}
                level={language.level}
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
