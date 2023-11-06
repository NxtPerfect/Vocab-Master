import { LanguageHeading } from "./LanguageHeading.tsx";
import { LanguageSection } from "./LanguageSection.tsx";

export function LanguagesList({ languages, learn }) {
  return (
    <>
      {languages.length === 0 && "No languages"}
      {languages.map((language) => {
        return (
          <>
            <LanguageHeading name={language.name} />
            <LanguageSection
              name={language.name}
              level={language.level[0]}
              words={language.level[1]}
              learn={learn}
            />
          </>
        );
      })}
    </>
  );
}
