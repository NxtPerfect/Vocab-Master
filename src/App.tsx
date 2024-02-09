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
  level: string;
  countTotal: number;
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
      if (!langQuery && !Cookie.get("user-id")) return;
      await queryUserProgress()
    },
    onSuccess: (data) => console.log(data),
    onError: (err) => console.log(err)
  })

  async function queryLanguageData() {
    try {
      const data = await axios.get('http://localhost:6942/api/languages/total');
      // Process the data into array
      const temp = data.data.map((lang: object) => ({
        language: lang.language,
        level: lang.level.split(","),
        countTotal: lang.countTotal.split(",")
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
      console.log("Got the progress with the boooyysss");
      console.log(data.data);
      // We get array with object with userProgressTotal: number
      // Instead we should return language + level + number
      setUserProgress((curr: Array<number>) => [...curr, ...data.data.userProgressTotal]);
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
                countLearnt={userProgress.length > 0 ? userProgress[index] : 0}
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
