import axios from "axios";
import Cookie from "js-cookie";
import "../App.scss";
import LanguageSection from "./LanguageSection";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useAuth } from "./AuthProvider";

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
  isLearnt: Array<boolean>;
}

type LanguageDataRaw = {
  language: string;
  level: string;
  countTotal: string;
}

function Home() {
  const [languages, setLanguages] = useState<Array<Language>>([])
  const isAuthenticated = useAuth()

  // Fetch all languages and user's progress if logged in
  const { isLoading, isError, isFetching, data, error } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const langQuery: { language: string, level: Array<string>, countTotal: Array<number> } = await queryLanguageData()
      if (!langQuery && !isAuthenticated) return
      const userQuery: { language: string, level: string, userProgressTotal: Array<number>, streak: number } = await queryUserProgress()
      if (!userQuery) return
      await queryIsLearntToday()
    },
    onError: (err) => console.log(err),
    enabled: true
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
        countUser: [],
        isLearnt: []
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
        username: Cookie.get("username")
      });
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
              last_index = lang.level.findIndex(element => { element === progress.level })
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

  // It requests for level array, we need to split it into query for each level or return array of each of them
  // Issue is that this query only works if i specifically refresh this component
  // so i should manually refetch it or something idrk
  async function queryIsLearntToday() {
    try {
      const data = await axios.post("http://localhost:6942/api/learnt", { username: Cookie.get("username") });

      // Instead change languages state
      // to get the isLearnt array
      // setIsLearnt([...data.data])
      let last_index: number = 0
      setLanguages((curr: Array<Language>) => {
        curr.map((lang: Language) => {
          data.data.map((learnt: { language: string, level: string, isLearnt: boolean }) => {
            if (lang.language === learnt.language && lang.level.includes(learnt.level, last_index)) {
              lang.isLearnt.push(learnt.isLearnt)
              last_index = lang.level.findIndex(element => { element === learnt.level })
            }
          })
        })
        return [...curr]
      }
      );
      return data.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  return (
    <>
      <main>
        {isError ? "Failed to fetch" : error}
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
                isLearnt={language.isLearnt}
              />
            );
          },
        )}
      </main>
    </>
  );
}

export default Home;

export function languageLoader() {
  return "Gamers"
}
