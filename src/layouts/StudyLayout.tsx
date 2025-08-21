import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { StudyStep, SurveyPage } from "rssa-api";
import Header from "../widgets/Header";
import { studyStepState } from "../states/studyStepState";
import { surveyPageState } from "../states/surveyPageState";


interface StudyLayoutProps {
}

const StudyLayout: React.FC<StudyLayoutProps> = () => {
	return (
		<Container>
			<StepHeaderContent />
			<Outlet />
		</Container>
	)
}

const StepHeaderContent: React.FC = () => {
	const studyStep: StudyStep | null = useRecoilValue(studyStepState);
	const currentPage: SurveyPage | null = useRecoilValue(surveyPageState);

	let headerTitle = "Something went wrong!";
	let headerBody = "If you are seeing this, then something went wrong. Please contact the study administrator.";

	if (studyStep) {
		console.log("Header: ", studyStep);
		if (studyStep.step_type === 'survey' && currentPage) {
			console.log("Header: ", currentPage);
			headerTitle = currentPage.title ? currentPage.title : headerTitle;
			headerBody = currentPage.instructions ? currentPage.instructions : headerBody;
		} else {
			headerTitle = studyStep.title ? studyStep.title : studyStep.name;
			headerBody = studyStep.instructions ? studyStep.instructions : studyStep.description;
		}
	}

	return (
		<Header title={headerTitle} content={headerBody} />
	)
}


export default StudyLayout;