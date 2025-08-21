import { useCallback, useMemo } from "react";
import { FormLabel } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { ScaleLevel, SurveyItemResponse } from "rssa-api";
import { surveyResponseState } from "../states/surveyResponseState";


interface LikertBarProps {
	constructId: string;
	itemId: string;
	scaleId: string;
	scaleLevels: ScaleLevel[];
}

const LikertBar: React.FC<LikertBarProps> = ({
	constructId,
	itemId,
	scaleId,
	scaleLevels,
}) => {

	const [surveyResponse, setSurveyResponse] = useRecoilState(surveyResponseState);

	const constructItemKey = useMemo(() => {
		return constructId + ':' + itemId;
	}, [constructId, itemId]);

	const selectedLevel = surveyResponse?.get(constructItemKey)?.scale_level_id;

	const handleRadioChange = useCallback(async (levelId: string) => {
		if (!constructId || !itemId || !scaleId) {
			console.error("Something went wrong!");
			return;
		}

		const itemResponse = {
			scale_level_id: levelId,
			construct_id: constructId,
			scale_id: scaleId,
			item_id: itemId,
		}
		setSurveyResponse(prevResponse => {
			const newResponse = new Map<string, SurveyItemResponse>(prevResponse);
			newResponse.set(constructItemKey, itemResponse);
			return newResponse;
		});
	}, [setSurveyResponse, constructId, itemId, scaleId, constructItemKey]);

	const scaleLevelsSorted = useMemo(() => {
		return [...scaleLevels].sort((a, b) => a.order_position - b.order_position);
	}, [scaleLevels]);

	return (
		<div className="checkboxGroup">
			{scaleLevelsSorted.map((scaleLevel) => {
				const inputId = `${itemId}_${scaleLevel.value}`;
				return (
					<FormLabel htmlFor={inputId}
						key={inputId}
						className={selectedLevel === scaleLevel.id ? "checkboxBtn checkboxBtnChecked" : "checkboxBtn"}>

						<p className="checkboxLbl">{scaleLevel.label}</p>

						<input
							className="radio-margin"
							type="radio"
							name={itemId}
							value={scaleLevel.id}
							id={inputId}
							checked={selectedLevel === scaleLevel.id}
							onChange={() => handleRadioChange(scaleLevel.id)}
							title={scaleLevel.label}
						/>
					</FormLabel>
				);
			}
			)}
		</div>
	)
}

export default LikertBar;