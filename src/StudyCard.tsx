export function StudyCard({ words }) {
  return (
    <>
      <div className="study_card">
        <p>{words[0]}</p>
        <p>{words[1]}</p>
        <div>
          <button>Again</button>
          <button>Easy</button>
          <button>Normal</button>
          <button>Hard</button>
        </div>
      </div>
    </>
  );
}
