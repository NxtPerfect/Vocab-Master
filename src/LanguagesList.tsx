import { LanguageHeading } from "./LanguageHeading.tsx";
import { LanguageSection } from "./LanguageSection.tsx";

export function LanguagesList({ languages }) {
  return (
    <>
      {languages.length === 0 && "No languages"}
      {languages.map((language) => {
        return (
          <>
            <LanguageHeading name={language.name} />
            <LanguageSection language={language} />
          </>
        );
      })}
    </>
  );
}
