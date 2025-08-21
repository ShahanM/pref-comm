import DOMPurify from "dompurify";
import parse from "html-react-parser";
import FormGroup from "react-bootstrap/FormGroup";
import Row from "react-bootstrap/Row";

import { clsx } from "clsx";
import { memo } from "react";
import { useRecoilValue } from "recoil";
import { ConstructItem, PageContent, ScaleLevel } from "rssa-api";
import LikertBar from "../../components/LikertBar";
import { surveyResponseState } from "../../states/surveyResponseState";
import "./SurveyTemplate.css";


const parseHTML = (htmlstr: string) => {
	const clean = DOMPurify.sanitize(htmlstr);
	const parsed = parse(clean);
	return parsed;
}

interface SurveyTemplateProps {
	pageContents: PageContent[];
	attemptedSubmit: boolean;
}

const SurveyTemplate: React.FC<SurveyTemplateProps> = ({
	pageContents,
	attemptedSubmit,
}) => {

	return (
		<Row style={{ maxWidth: "1320px", margin: "auto" }}>
			{
				pageContents.map((pageContent) =>
					<SurveyConstructBlock
						key={pageContent.id}
						constructId={pageContent.construct_id}
						scaleId={pageContent.scale_id}
						items={pageContent.items}
						scaleLevels={pageContent.scale_levels}
						attemptedSubmit={attemptedSubmit}
					/>
				)
			}
		</Row>

	)
}

interface SurveyConstructBlockProps {
	constructId: string;
	scaleId: string;
	items: ConstructItem[];
	scaleLevels: ScaleLevel[];
	attemptedSubmit?: boolean;
}


const SurveyConstructBlock: React.FC<SurveyConstructBlockProps> = memo(({
	constructId,
	scaleId,
	items,
	scaleLevels,
	attemptedSubmit,
}) => {

	const surveyResponse = useRecoilValue(surveyResponseState);

	return (
		<div className="survey-construct-block">
			{
				items.map((item, index) => {
					const constructItemKey = constructId + ":" + item.id;
					return (
						< FormGroup key={item.id + '_' + index}
							className={
								clsx(
									attemptedSubmit ?
										surveyResponse.get(constructItemKey) ?
											"survey-item-responded"
											: "survey-item-unanswered"
										: "survey-item"
								)}>
							<div>
								<label className="survey-item-label">
									{parseHTML(item.text)}
								</label>
							</div>
							<LikertBar
								constructId={constructId}
								scaleId={scaleId}
								itemId={item.id}
								scaleLevels={scaleLevels}
							/>
						</FormGroup>
					)
				})
			}
		</div >
	);
});

export default SurveyTemplate;