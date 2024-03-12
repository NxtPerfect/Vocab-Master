import axios from "axios";
import Cookie from "js-cookie";
import "../App.scss";
import LanguageSection from "./LanguageSection";
import { useState } from "react";
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
  isLearntToday: Array<boolean>;
  due: Array<boolean>;
}

type LanguageDataRaw = {
  language: string;
  level: string;
  countTotal: string;
}

function Home() {
  const [languages, setLanguages] = useState<Array<Language>>([])
  const { isAuthenticated } = useAuth()

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
    enabled: true,
    retry: false,
    refetchOnWindowFocus: false
  })

  async function queryLanguageData() {
    try {
      const data = await axios.get('http://localhost:6942/api/languages/total');
      // Process the data into array
      // I need to win the battle with these types below
      const temp = data.data.message.map((lang: LanguageDataRaw) => (
        {
          language: lang.language as string,
          level: lang.level.split(",") as Array<string>,
          countTotal: lang.countTotal.split(",").map((l) => { return parseInt(l, 10) }) as Array<number>,
          countUser: [],
          isLearntToday: [],
          due: []
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
      }, { withCredentials: true });
      // We return the correct data, now we have to merge it
      // language, level, total words learnt
      if (data.data.message === undefined || data.data.message.length === 0) return;

      // Modify languages array to add user's word learnt
      // Currently .includes will always return true if item in array
      // Instead it should see if item already added in there, if yes
      // then ignore it
      // Currently will only find first match, then ignore all other attempts
      let last_index: number = 0
      setLanguages((curr: Array<Language>) => {
        curr.map((lang: Language) => {
          data.data.message.map((progress: { language: string, level: string, userProgressTotal: number, streak: number }) => {
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
      const data = await axios.post("http://localhost:6942/api/learnt", {}, { withCredentials: true });

      // Instead change languages state
      // to get the isLearnt array
      // setIsLearnt([...data.data])
      let last_index: number = 0
      setLanguages((curr: Array<Language>) => {
        curr.map((lang: Language) => {
          data.data.message.map((learnt: { language: string, level: string, isLearntToday: boolean, due: boolean }) => {
            if (lang.language === learnt.language && lang.level.includes(learnt.level, last_index)) {
              lang.isLearntToday.push(learnt.isLearntToday)
              lang.due.push(learnt.due)
              last_index = lang.level.findIndex(element => { element === learnt.level })
            }
          })
        })
        return [...curr]
      }
      );
      console.log(languages)
      return data.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  return (
    <>
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
              isLearntToday={language.isLearntToday}
              countDue={language.due.filter((due) => due).length}
            />
          );
        },
      )}
    </>
  );
}

export default Home;

export function languageLoader() {
  return "Gamers"
}
