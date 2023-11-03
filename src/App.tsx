import logo from "./logo.svg";
import { Nav } from "./Nav.tsx";
import { Top } from "./Top.tsx";
import "./style.scss";
import { useState, useEffect } from "react";
import { LanguagesList } from "./LanguagesList.tsx";

// languages should be { name: "German", level: ("A1", [("das Auto", "Car")...]...)} -> This needs to be in languages.json, i'm not writing 2000 words here just for one level

function App() {
  const [languages, setLanguages] = useState([
    {
      name: "German",
      level: ["A1", ["Das auto", "Car"]],
    },
    {
      name: "Spanish",
      level: ["A1", ["Puta", "Mother"]],
    },
  ]);
  // const [languages, setLanguages] = useState(() => {
  //   const localValue = localStorage.getItem("ITEMS");
  //   if (localValue == null) return [];
  //   return JSON.parse(localValue);
  // });
  //
  // useEffect(() => {
  //   localStorage.setItem("ITEMS", JSON.stringify(languages));
  // }, [languages]);

  // Think if i want to draw learning on top, or go to another site
  function learn(name, level) {
    console.log("Learning");
    return 0;
  }

  return (
    <>
      <Nav />
      <Top />
      <LanguagesList languages={languages} learn={learn} />
    </>
  );
}

export default App;
