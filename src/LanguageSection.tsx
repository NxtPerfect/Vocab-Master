export function LanguageSection({ name, level, words, learn }) {
  return (
    <div className="card">
      <div className="card-top">
        <h3>{level}</h3>
        <span>
          words learnt: <i>0/{words.length / 2}</i>(
          {(0 / (words.length / 2)) * 100}%) <br />
          last word: {words[0]}
        </span>
      </div>
      <div className="card-bottom">
        <button onClick={() => learn(name, level)}>Learn</button>
        <button>Review</button>
      </div>
    </div>
  );
}
