import Cookie from "js-cookie";
import { useEffect, useState } from "react";
import {
  NavigateFunction,
  Params,
  useBlocker,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Word } from "./Home";
import Modal from "./Modal";
import axios from "axios";
import { useQuery } from "react-query";

function Flashcard() {
  const [words, setWords] = useState<Array<Word>>([]);
  const [randomIndexes, setRandomIndexes] = useState<Array<number>>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [show, setShow] = useState<boolean>(false);
  const [changedWords, setChangedWords] = useState<boolean>(false);
  const params: Params = useParams();
  const language: string | undefined = params.language;
  const level: string | undefined = params.level;
  const navigate: NavigateFunction = useNavigate();
  let blocker: Blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      randomIndexes.length !== 0 &&
      currentLocation.pathname !== nextLocation.pathname,
  );

  /** Access api
   * and get words
   */
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      await queryWords()
    },
    onError: (err: Error) => console.log(err)
  })

  async function queryWords() {
    try {
      const data = await axios.post(`http://localhost:6942/api/${language}&${level}`, {
        username: Cookie.get("username")
      });
      setWords(data.data.message);
      setChangedWords(true);
      return data.data;
    } catch (err) {
      console.log(err);
      setChangedWords(true);
      throw err;
    }
  }

  /** Populate array with indexes of words
   * randomize them
   * then pick from them, to pick random word from "words"
   * Somehow now it's undefined, and won't make it work like that
   */

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const indexes = Array.from(Array(words.length).keys());
    for (let index = 0; index < words.length; index++) {
      setRandomIndexes(indexes);
    }
    setRandomIndexes((curr) => curr.sort(() => Math.random() - 0.5));
    randomIndexes.sort(() => Math.random() - 0.5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changedWords]);

  /** When all words were learnt, save progress
   * and show appropriate html
   */
  useEffect(() => {
    if (randomIndexes.length === 0 && changedWords) {
      const progressData: Array<{ username: string, word_id: number, language: string, level: string }> = [];
      for (const word of words) {
        progressData.push({
          username: Cookie.get("username"),
          word_id: word.word_id,
          language: language as string,
          level: level as string,
        });
      }
      querySaveProgress(progressData)
    }
  }, [randomIndexes]);

  async function querySaveProgress(progressData: Array<{ username: string, word_id: number, language: string, level: string }>) {
    try {
      const data = await axios.post("http://localhost:6942/api/save_progress", { progressData }).finally(navigate("/"))
    } catch (err) {
      console.log(err)
      throw (err)
    }
  }

  function incrementIndex() {
    if (currentIndex + 1 >= randomIndexes.length) {
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex((curr) => curr + 1);
  }

  function guessedCorrect() {
    if (
      words[randomIndexes[currentIndex]].guessed === true &&
      words[randomIndexes[currentIndex]].guessed !== undefined
    ) {
      setRandomIndexes((curr) =>
        curr.filter((index) => index !== randomIndexes[currentIndex]),
      );
      setShow(false);
      // If randomindexes length 0 then save progress
      return;
    }
    setWords((words) => {
      return words.map((word, index) => {
        if (index === randomIndexes[currentIndex])
          return { ...word, guessed: true };
        return word;
      });
    });
    setShow(false);
    incrementIndex();
  }

  function guessedWrong() {
    if (words[randomIndexes[currentIndex]].guessed === true) {
      setWords((words) => {
        return words.map((word, index) => {
          if (index === randomIndexes[currentIndex])
            return { ...word, guessed: false };
          return word;
        });
      });
    }
    setShow(false);
    incrementIndex();
  }

  if (words.length === 0) {
    return (
      <>
        Loading words...
      </>
    );
  }

  if (randomIndexes.length === 0) {
    return (
      <>
        All words learnt!!!
      </>
    );
  }

  if (show === true) {
    return (
      <>
        Flashcard
        {language}
        {level}
        <div>
          <div key={words[randomIndexes[currentIndex]].word_id}>
            {words[randomIndexes[currentIndex]].sideA}{" "}
            {words[randomIndexes[currentIndex]].sideB}
          </div>
          <button type="button" onClick={guessedCorrect}>
            Correct
          </button>
          <button type="button" onClick={guessedWrong}>
            Wrong
          </button>
        </div>
        {blocker.state === "blocked" ? <Modal blocker={blocker} /> : null}
      </>
    );
  }

  // Needs back arrow to navigate to home
  return (
    <>
      Flashcard
      {language}
      {level}
      <div>
        <div key={words[randomIndexes[currentIndex]].word_id}>
          {words[randomIndexes[currentIndex]].sideA}
        </div>
        <button
          type="button"
          onClick={() => {
            setShow(true);
          }}
        >
          Haha
        </button>
      </div>
      {blocker.state === "blocked" ? <Modal blocker={blocker} /> : null}
    </>
  )
}
export default Flashcard

export function flashcardLoader() {
  return "Free sex"
}
