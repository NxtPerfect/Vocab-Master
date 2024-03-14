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
import { useAuth } from "./AuthProvider";
import IconSpinner from "./IconSpinner";

function Flashcard() {
  const [words, setWords] = useState<Array<Word>>([]);
  const [randomIndexes, setRandomIndexes] = useState<Array<number>>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [show, setShow] = useState<boolean>(false);
  const [changedWords, setChangedWords] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [countWordsReview, setCountWordsReview] = useState<number>(0);
  const { isAuthenticated } = useAuth();
  const params: Params = useParams();
  const language: string | undefined = params.language;
  const level: string | undefined = params.level;
  const navigate: NavigateFunction = useNavigate();
  let blocker: Blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      randomIndexes.length !== 0 &&
      currentLocation.pathname !== nextLocation.pathname &&
      errorMessage !== null,
  );

  /** Access api
   * and get words
   */
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      if (!isAuthenticated) {
        setErrorMessage("Not authenticated")
        return
      }
      await queryWords()
    },
    onError: (err: Error) => setErrorMessage(err.toString())
  })

  async function queryWords() {
    try {
      const data = await axios.post(`http://localhost:6942/api/${language}&${level}`, {
      }, { withCredentials: true });
      if (data.data.type !== "success") {
        setErrorMessage(data.data.message)
      }
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
      const progressData: Array<{ word_id: number, language: string, level: string }> = [];
      for (const word of words) {
        progressData.push({
          word_id: word.word_id,
          language: language as string,
          level: level as string,
        });
      }
      querySaveProgress(progressData)
    }
  }, [randomIndexes]);

  // Doesn't send the jwt token
  async function querySaveProgress(progressData: Array<{ word_id: number, language: string, level: string }>) {
    try {
      const data = await axios.post("http://localhost:6942/api/save_progress", { progressData }, { withCredentials: true }).finally(navigate("/"))
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
      setCountWordsReview((curr) => curr - 1);
      return;
    }
    setWords((words) => {
      return words.map((word, index) => {
        if (index === randomIndexes[currentIndex])
          return { ...word, guessed: true };
        return word;
      });
    });
    setCountWordsReview((curr) => curr + 1);
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
      setCountWordsReview((curr) => curr - 1);
    }
    setShow(false);
    incrementIndex();
  }

  if (!isAuthenticated) {
    return (
      <>
        {errorMessage}
      </>
    );
  }

  if (isPending || words.length === 0) {
    return (
      <>
        <IconSpinner style={{ gridColumn: "span 2", scale: "2" }} />
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
        <div className="flashcard-open">
          <div className="flashcard-top">
            <span>Flashcard {language.charAt(0)?.toUpperCase() + language.slice(1)} {level.charAt(0)?.toUpperCase() + level.slice(1)}</span>
            <div className="flashcard-words" key={words[randomIndexes[currentIndex]].word_id}>
              {words[randomIndexes[currentIndex]].sideA}{" "}
              {words[randomIndexes[currentIndex]].sideB}
            </div>
          </div>
          <div className="flashcard-buttons">
            <button className="flashcard-button-correct" type="button" onClick={guessedCorrect}>
              Correct
            </button>
            <button className="flashcard-button-wrong" type="button" onClick={guessedWrong}>
              Wrong
            </button>
          </div>
          <span className="flashcard-words-left">Words left:
            <p>
              <i className={!words[randomIndexes[currentIndex]].guessed ? "active" : ""}>{randomIndexes.length - countWordsReview}</i> <i className={words[randomIndexes[currentIndex]].guessed ? "active" : ""}>{countWordsReview}</i>
            </p>
          </span>
          {blocker.state === "blocked" ? <Modal blocker={blocker} /> : null}
        </div>
      </>
    );
  }

  // Needs back arrow to navigate to home
  return (
    <>
      <div className="flashcard-closed">
        <div className="flashcard-top">
          <span>Flashcard {language.charAt(0)?.toUpperCase() + language.slice(1)} {level.charAt(0)?.toUpperCase() + level.slice(1)}</span>
          <div className="flashcard-words" key={words[randomIndexes[currentIndex]].word_id}>
            {words[randomIndexes[currentIndex]].sideA}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setShow(true);
          }}
        >
          Show
        </button>
        <span className="flashcard-words-left">Words left:
          <p>
            <i className={!words[randomIndexes[currentIndex]].guessed ? "active" : ""}>{randomIndexes.length - countWordsReview}</i> <i className={words[randomIndexes[currentIndex]].guessed ? "active" : ""}>{countWordsReview}</i>
          </p>
        </span>
        {blocker.state === "blocked" ? <Modal blocker={blocker} /> : null}
      </div >
    </>
  )
}
export default Flashcard

export function flashcardLoader() {
  return "Free sex"
}
