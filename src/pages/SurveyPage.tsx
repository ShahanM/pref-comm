import { useCallback, useEffect, useMemo, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useRecoilState, useRecoilValue } from "recoil";
import { CurrentStep, Participant, StudyStep, SurveyItemResponse, SurveyPage, SurveyResponse, useStudy } from "rssa-api";
import SurveyTemplate from "../layouts/templates/SurveyTemplate";
import { participantState } from "../states/participantState";
import { studyStepState } from "../states/studyStepState";
import { surveyPageState } from "../states/surveyPageState";
import { surveyResponseState } from "../states/surveyResponseState";
import Footer from "../widgets/Footer";
import { StudyPageProps } from "./StudyPage.types";


const Survey: React.FC<StudyPageProps> = ({ next, navigateToNextStep }) => {

	const [isLoading, setIsLoading] = useState(false);
	const [attemptedSubmit, setAttemptedSubmit] = useState<boolean>(false);

	const surveyResponse = useRecoilValue(surveyResponseState);
	const [participant, setParticipant] = useRecoilState(participantState);
	const [surveyPage, setSurveyPage] = useRecoilState(surveyPageState);
	const [studyStep, setStudyStep] = useRecoilState(studyStepState);

	const { studyApi } = useStudy();

	useEffect(() => {
		if (studyStep && !surveyPage) {
			studyApi.get<SurveyPage>(`surveys/${studyStep.id}/first`)
				.then((surveyPage: SurveyPage) => {
					setSurveyPage(surveyPage);
				})
				.catch(error => {
					console.error("Error fetching first survey page content:", error);
				});
		}
	}, [studyApi, studyStep, surveyPage, setSurveyPage]);

	const fetchNextSurveyPage = useCallback(async () => {
		if (!studyStep) {
			console.warn("Study step is undefined in fetchNextSurveyPage.");
			return;
		}

		studyApi.get<SurveyPage>(`surveys/${studyStep.id}/pages/${surveyPage?.id}/next`)
			.then((surveyPage: SurveyPage) => {
				setSurveyPage(surveyPage);
			})
			.catch(error => {
				console.error("Error fetching survey page content:", error);
				// TODO: Handle error appropriately, maybe show a message to the user
			});
	}, [studyApi, studyStep, surveyPage, setSurveyPage]);

	const handleNavigation = useCallback(async () => {
		if (!participant || !studyStep) {
			console.warn("Participant or study step is undefined in navigateToNextStep.");
			return;
		}

		try {
			setIsLoading(true);
			const nextStep: StudyStep = await studyApi.post<CurrentStep, StudyStep>('studies/steps/next', {
				current_step_id: participant.current_step
			});
			setStudyStep(nextStep);
			const updatedParticipant: Participant = {
				...participant,
				current_step: nextStep.id,
			};
			await studyApi.put('participants/', updatedParticipant);
			setParticipant(updatedParticipant);
			navigateToNextStep(next);
		} catch (error) {
			console.error("Error getting next step:", error);
		} finally {
			setIsLoading(false);
		}
	}, [studyApi, participant, next, setStudyStep, setParticipant, studyStep, navigateToNextStep]);

	const itemsToRespondCount = useMemo(() => {
		return surveyPage?.page_contents
			.reduce((acc, content) => acc + content.items.length, 0) ?? 0;
	}, [surveyPage]);

	const dispatchSurveyResponseRequest = useCallback(async (currentResponse: Map<string, SurveyItemResponse>) => {
		if (!surveyPage || !participant || !studyStep) {
			console.warn("SurveyPage or participant is undefined in transformedSurveyReponse.");
			return null;
		}
		const responseValues = [...currentResponse.values()].filter(Boolean);

		if (responseValues.length !== itemsToRespondCount) {
			console.warn("Need to respond to all items before submitting.");
			throw new Error("Validation failed: Not all items answered.");
		}
		const responseData = {
			participant_id: participant.id,
			step_id: studyStep.id,
			page_id: surveyPage.id,
			responses: responseValues
		}
		try {
			setIsLoading(true);
			await studyApi.post<SurveyResponse, boolean>(`responses/survey`, responseData);
		} catch (error) {
			console.error("Error submitting survey response:", error);
			throw error;
		} finally {
			setIsLoading(false);
		}

	}, [studyApi, itemsToRespondCount, participant, studyStep, surveyPage]);

	const submitResponse = useCallback(async () => {
		setAttemptedSubmit(true);
		if (!surveyPage) return;
		try {
			await dispatchSurveyResponseRequest(surveyResponse);
			if (surveyPage.last_page) {
				await handleNavigation();
			} else {
				await fetchNextSurveyPage();
			}
		} catch (error) {
			console.log("Submission failed.");
		}
	}, [surveyPage, fetchNextSurveyPage, handleNavigation, dispatchSurveyResponseRequest, surveyResponse]);

	// const handleSurveyNext = useCallback(() => { submitResponse(); }, [submitResponse]);

	if (!studyStep || !participant || isLoading) {
		return <div>Loading Survey...</div>;
	}

	if (!surveyPage) {
		return <div>Loading survey page content...</div>;
	}

	return (
		<Container>
			<Row>
				{surveyPage !== undefined &&
					<SurveyTemplate
						pageContents={surveyPage.page_contents}
						attemptedSubmit={attemptedSubmit}
					/>
				}
			</Row>
			<Footer callback={submitResponse} text="Next" loading={isLoading} />
		</Container>
	)

}

export default Survey;