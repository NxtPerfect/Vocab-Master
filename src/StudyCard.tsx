import { useState } from "react";

// Use priority for words
// Again == word in <10 min
// Hard == word in <5 min
// Normal == if normal twice repeat in 1d, 3d, 7d etc
// Easy == word repeat 2d, 6d, 14d etc

export function StudyCard({ words }) {
  const [wordsToRevise, setWordsToRevise] = useState([]); // Add all the words that need revision, along with priority
  const [current, setCurrent] = useState(0); // Set current word index to show correct card
  // Make sure to randomize the words before they're in the list, and then matching the priorities, add words that were revised once accordingly

  function addWordToRevise(word, priority) {
    setWordsToRevise((currentWords) => {
      return [...currentWords, { word: word, priority: priority }];
    });
  }
  return (
    <>
      <div className="study_card">
        <p className="to_guess">{words[0]}</p>
        <p className="guessed">{words[1]}</p>
        <div>
          <button onClick={() => setWordsToRevise([...wordsToRevise])}>
            Again
          </button>
          <button>Easy</button>
          <button>Normal</button>
          <button>Hard</button>
        </div>
      </div>
    </>
  );
}
