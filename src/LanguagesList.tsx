import { LanguageHeading } from "./LanguageHeading.tsx";
import { LanguageSection } from "./LanguageSection.tsx";

export function LanguagesList({ languages }) {
  return (
    <>
      {languages.length === 0 && "No languages"}
      {languages.map((language) => {
        return (
          <>
            <hr />
            <div className="language_list">
              <LanguageHeading name={language.name} />
              <div className="language_list_sections">
                <LanguageSection language={language} />
              </div>
            </div>
          </>
        );
      })}
    </>
  );
}
