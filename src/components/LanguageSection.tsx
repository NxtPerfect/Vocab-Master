import {
	faArrowLeft,
	faArrowTurnDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";

function LanguageSection({
	index,
	language,
	level,
}: { index: number; language: string; level: Array<string> }) {
	const [fold, setFold] = useState<boolean>(false);
	return (
		<>
			<div
				className="language_section"
				style={fold ? { height: "4rem" } : {}}
				key={index}
			>
				<div className="language_section_top">
					<h1>{language}</h1>
					<button type="button" onClick={() => setFold((curr) => !curr)}>
						<FontAwesomeIcon
							className="icon"
							icon={!fold ? faArrowTurnDown : faArrowLeft}
						/>
					</button>
				</div>
				<div className="language_levels_wrapper">
					{!fold
						? level.map((levelLevel: string, levelIndex: number) => (
							<div className="language_level">
								<h3> Level: {levelLevel.toUpperCase()}</h3>
								<p>Progress: 0/4</p>
								<Link
									className="link"
									key={levelIndex}
									to={`/ flashcard / ${language} / ${levelLevel}`}
									style={{ textDecoration: "none" }}
								>
									<button type="button">Learn now</button>
								</Link>
							</div>
						))
						: "(...)"}
				</div>
			</div>
		</>
	);
}

export default LanguageSection;
