import axios from "axios";
import Cookie from "js-cookie";
import "./App.scss";
import Footer from "./components/Footer";
import LanguageSection from "./components/LanguageSection";
import Nav from "./components/Nav";
import { useState } from "react";
import { useQuery } from "react-query";

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
  const [userStreak, setUserStreak] = useState<number>(0);

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
        countUser: []
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
      const data = await axios.post("http://localhost:6942/api/user", {
        user_id: Cookie.get("user_id")
      });
      console.log("Got the progress with the boooyysss")
      // We return the correct data, now we have to merge it
      // language, level, total words learnt
      if (data.data === undefined || data.data.length === 0) return;

      // Modify languages array to add user's word learnt
      // Currently .includes will always return true if item in array
      // Instead it should see if item already added in there, if yes
      // then ignore it
      // Currently will only find first match, then ignore all other attempts
      let last_index: number = 0 
      setLanguages((curr: Array<Language>) => {
        curr.map((lang: Language) => {
          data.data.map((progress: { language: string, level: string, userProgressTotal: number, streak: number }) => {
            if (lang.language === progress.language && lang.level.includes(progress.level, last_index)) {
              lang.countUser.push(progress.userProgressTotal)
              setUserStreak(progress.streak)
              last_index = lang.level.findIndex(element => {element === progress.level})
            }
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

  async function queryWhenLastWord() {
    try {
      const data = await axios.get('http://localhost:6942/api/languages/');
      // Process the data into array
      // I need to win the battle with these types below
      const temp = data.data.map((lang: LanguageDataRaw) => ({
        language: lang.language as string,
        level: lang.level.split(",") as Array<string>,
        countTotal: lang.countTotal.split(",") as Array<number>,
        countUser: []
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

  return (
    <>
      <Nav streak={userStreak} />
      <main>
        {languages.map(
          (
            language: Language,
            index: number,
          ) => {
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
