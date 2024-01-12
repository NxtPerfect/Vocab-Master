import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowTurnDown,
} from "@fortawesome/free-solid-svg-icons";

function LanguageSection({
  index,
  language,
  level,
}: { index: number; language: string; level: Array<string> }) {
  const [fold, setFold] = useState<boolean>(false);
  return (
    <>
      <div className="language_section" key={index}>
        <div className="language_section_top">
          <h1>{language}</h1>
          <button type="button" onClick={() => setFold((curr) => !curr)}>
            <FontAwesomeIcon
              className="icon"
              icon={!fold ? faArrowTurnDown : faArrowLeft}
            />
          </button>
        </div>
        {!fold
          ? level.map((levelLevel: string, levelIndex: number) => (
            <>
              {levelLevel}
              <Link
                className="link"
                key={levelIndex}
                to={`/flashcard/${language}/${levelLevel}`}
                style={{ textDecoration: "none" }}
              >
                <button type="button">Learn</button>
              </Link>
            </>
          ))
          : "(...)"}
      </div>
    </>
  );
}

export default LanguageSection;
