import { Link } from "react-router-dom";
import "./App.scss";
import Cookie from "js-cookie";
import Nav from "./components/Nav";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import LanguageSection from "./components/LanguageSection";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";

export interface Word {
  word_id: number;
  sideA: string;
  sideB: string;
  guessed?: boolean;
}

interface Language {
  language: string;
  level: Array<string>;
  countTotal: Array<number>;
  countUser: Array<number>;
}

type LanguageDataRaw = {
  language: string;
  level: string;
  countTotal: string;
}

type UserProgressDataRaw = {
  language: string;
  level: string;
  countUser: number;
}

function App() {
  const [languages, setLanguages] = useState<Array<Language>>([]);
  const [userProgress, setUserProgress] = useState<Array<number>>([]);

  // Fetch all languages and user's progress if logged in
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const langQuery = await queryLanguageData()
      if (!langQuery && !Cookie.get("user_id")) return;
      await queryUserProgress()
    },
    onSuccess: (data) => console.log(data),
    onError: (err) => console.log(err)
  })

  async function queryLanguageData() {
    try {
      const data = await axios.get('http://localhost:6942/api/languages/total');
      // Process the data into array
      // I need to win the battle with these types below
      const temp = data.data.map((lang: LanguageDataRaw) => ({
        language: lang.language as string,
        level: lang.level.split(",") as Array<string>,
        countTotal: lang.countTotal.split(",") as Array<number>,
        countUser: 0
      } as Language));
      // Add languages, levels and amount of words they have
      // To show proper LanguageSection
      setLanguages((curr: Array<Language>) => [...curr, ...temp]);
      return data.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async function queryUserProgress() {
    try {
      const data = await axios.post("http://localhost:6942/api/languages/user", {
        user_id: Cookie.get("user_id")
      });
      console.log("Got the progress with the boooyysss")
      console.log(data.data[0].userProgressTotal)
      console.log(data.data[0])
      // We return the correct data, now we have to merge it
      // language, level, total words learnt
      if (data.data === undefined || data.data.length === 0) return;
      // setUserProgress((curr: Array<number>) => [...curr, ...data.data[0].userProgressTotal]);
      setLanguages((curr: Array<Language>) => {
        curr.map((lang: Language) => {
          data.data.map((progress: { language: string, level: string, userProgressTotal: number }) => {
            if (lang.language === progress.language && lang.level === progress.level) lang.countUser = progress.userProgressTotal
          })
        })
        return curr
      })
      return data.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  return (
    <>
      <Nav />
      <main>
        {languages.map(
          (
            language: Language,
            index: number,
          ) => {
            console.log(language.level, language.countTotal)
            return (
              <LanguageSection
                index={index}
                language={language.language}
                level={language.level}
                countTotal={language.countTotal}
                countLearnt={language.countUser}
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
