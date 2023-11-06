import { useParams } from "react-router";

// TODO: Show cards to learn
// TODO: 4 buttons, again, hard, normal, easy
// TODO: save due cards
// TODO: mathematics about when card should be reviewed again, based on the 4 buttons
// (Tutorial I used)[https://reactrouter.com/en/main/start/tutorial]

export function Study() {
  const { name, level } = useParams();
  return (
    <>
      Study {name} {level}
    </>
  );
}
