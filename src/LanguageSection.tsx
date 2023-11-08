import { Link, Navigate, useNavigate } from "react-router-dom";

export function LanguageSection({ language }) {
  const navigate = useNavigate();

  return (
    <div className="card">
      <div className="card-top">
        <h3>{language.level}</h3>
        <span>
          words learnt: 0/{language.words.length / 2} (
          {(0 / (language.words.length / 2)) * 100}%) <br />
          last word: {language.words[0]}
        </span>
        <div className="progress-bar">
          <div
            className="progress-bar-completed"
            style={{ width: (1 / language.words.length / 2) * 100 + "%" }}
          />
        </div>
      </div>
      <div className="card-bottom">
        <button onClick={() => navigate("/study", { state: { language } })}>
          Learn
        </button>
        <button>Review</button>
      </div>
    </div>
  );
}
