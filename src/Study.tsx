import { useParams, useLocation } from "react-router";
import { StudyCard } from "./StudyCard.tsx";

// TODO: Show cards to learn
// TODO: 4 buttons, again, hard, normal, easy
// TODO: save due cards
// TODO: mathematics about when card should be reviewed again, based on the 4 buttons
// (Tutorial I used)[https://reactrouter.com/en/main/start/tutorial]

export function Study(props) {
  const location = useLocation();
  const language = location.state.language;
  return (
    <>
      <div className="study">
        <h2>{language.name}</h2>
        <h5>{language.level}</h5>
        <StudyCard words={language.words} />
      </div>
    </>
  );
}
