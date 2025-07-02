import 'bootstrap/dist/css/bootstrap.min.css';
import { Suspense, useEffect, useState } from 'react';
import { ThemeProvider } from 'react-bootstrap';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './styles/App.css';
import './styles/components.css';
import './styles/main.css';
import { WarningDialog } from './widgets/dialogs/warningDialog';

import AdvisorsPage from './pages/advisors/AdvisorsPage';
import Demographics from './pages/demographics/DemographicsPage';
import MovieRatingPage from './pages/MovieRatingPage';
import Survey from './pages/SurveyPage';
import SystemIntro from './pages/SystemIntro';
import Welcome from './pages/Welcome';

import { STRINGS } from './constants/defaults';

import { useRecoilState } from 'recoil';
import {
	Participant,
	StudyStep,
	useStudy
} from 'rssa-api';
import FeedbackPage from './pages/feedback/FeedbackPage';
import { participantState, studyStepState } from './state/studyState';

// TODO: Test the survey pages

const customBreakpoints = {
	xl: 1200,
	xxl: 1400,
	xxxl: 1800, // Custom breakpoint for viewport size greater than 1800px
	xl4: 2000
};

function App() {

	const { studyApi } = useStudy();
	const [showWarning, setShowWarning] = useState<boolean>(false);
	const [participant, setParticipant] = useRecoilState(participantState);
	const [studyStep, setStudyStep] = useRecoilState(studyStepState);
	const [checkpointUrl, setCheckpointUrl] = useState<string>('/');
	const [studyError, setStudyError] = useState<boolean>(false);
	const [isLoading, setIsLoaiding] = useState<boolean>(true);

	const handleStepUpdate = (step: StudyStep, currentParticipant: Participant, referrer: string) => {
		const newParticipant: Participant = {
			...currentParticipant,
			current_step: step.id,
		};
		console.log("Updating participant with new step:", newParticipant, currentParticipant);
		console.log("Current step:", step);
		try {
			studyApi.put('participants/', newParticipant).then(() => {
				localStorage.setItem('participant', JSON.stringify(newParticipant));
				localStorage.setItem('studyStep', JSON.stringify(step));
				localStorage.setItem('lastUrl', referrer);
			});
			setParticipant(newParticipant);
			setStudyStep(step);
			setCheckpointUrl(referrer);
			studyApi.setParticipantId(newParticipant.id);
		} catch (error) {
			console.error("Error updating participant", error);
			setStudyError(true);
		}
	}


	useEffect(() => {
		const loadCachedData = () => {
			const participantCache = localStorage.getItem('participant');
			const studyStepCache = localStorage.getItem('studyStep');
			const checkpointUrl = localStorage.getItem('lastUrl');

			if (participantCache && studyStepCache) {
				try {
					const cparticipant = JSON.parse(participantCache);
					const cstudyStep = JSON.parse(studyStepCache);

					if (cparticipant) {
						setParticipant(cparticipant);
						studyApi.setParticipantId(cparticipant.id);
					}
					if (cstudyStep) { setStudyStep(cstudyStep); }
					if (checkpointUrl) { setCheckpointUrl(checkpointUrl); }
					return true;
				} catch (error) {
					console.error("Error parsing cached data", error);

					localStorage.removeItem('participant');
					localStorage.removeItem('studyStep');
					localStorage.removeItem('lastUrl');
					return false;

				}
			}
			return false;
		};

		const fetchInitialData = async () => {
			setIsLoaiding(true);
			try {
				const studyStep = await studyApi.get<StudyStep>('studies/steps/first');
				setStudyStep(studyStep);
				setStudyError(false);
			} catch (error) {
				console.error("Error fetching initial study data:", error);
				setStudyError(true);
			} finally {
				setIsLoaiding(false);
			}
		};

		if (!participant && !studyStep) {
			if (!loadCachedData()) {
				fetchInitialData();
			} else {
				setIsLoaiding(false);
			}
		} else {
			setIsLoaiding(false);
		}
	}, [studyApi, setParticipant, setStudyStep, participant, studyStep, isLoading, studyError]);

	useEffect(() => {
		const handleResize = () => { setShowWarning(window.innerWidth < 1200); }
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	if (isLoading) { return <div>Loading...</div> }

	return (
		<ThemeProvider breakpoints={Object.keys(customBreakpoints)}>
			<div className="App">
				{showWarning && <WarningDialog show={showWarning} title="Warning"
					message={STRINGS.WINDOW_TOO_SMALL} disableHide={true} />
				}
				{
					studyError && <WarningDialog show={studyError} title="Error"
						message={STRINGS.STUDY_ERROR} />
				}
				<Router basename='/preference-community'>
					<Suspense fallback={<div>Loading...</div>}>
						<Routes>
							<Route path="/" element={
								<Welcome
									next="/demographics"
									checkpointUrl={checkpointUrl}
									setNewParticipant={setParticipant}
									onStepUpdate={handleStepUpdate}
									sizeWarning={showWarning}
								/>
							} />
							<Route path="/presurvey" element={
								<Survey
									next="/systemintro"
									checkpointUrl={checkpointUrl}
									onStepUpdate={handleStepUpdate}
									sizeWarning={showWarning}
								/>
							} />
							<Route path="/systemintro" element={
								<SystemIntro
									next="/ratemovies"
									checkpointUrl={checkpointUrl}
									onStepUpdate={handleStepUpdate}
									sizeWarning={showWarning}
								/>
							} />
							<Route path="/ratemovies" element={
								<MovieRatingPage
									next="/advisors"
									checkpointUrl={checkpointUrl}
									onStepUpdate={handleStepUpdate}
									sizeWarning={showWarning}
								/>
							} />
							<Route path="/advisors" element={
								<AdvisorsPage
									next="/postsurvey"
									checkpointUrl={checkpointUrl}
									onStepUpdate={handleStepUpdate}
									sizeWarning={showWarning}
								/>
							} />
							<Route path="/demographics" element={
								<Demographics
									next="/presurvey"
									checkpointUrl={checkpointUrl}
									onStepUpdate={handleStepUpdate}
									sizeWarning={showWarning}
								/>
							} />
							<Route path="/postsurvey" element={
								<Survey
									next="/feedback"
									checkpointUrl={checkpointUrl}
									onStepUpdate={handleStepUpdate}
									sizeWarning={showWarning}
								/>
							} />

							<Route path="/feedback" element={
								<FeedbackPage
									next="/quit"
									checkpointUrl={checkpointUrl}
									onStepUpdate={handleStepUpdate}
									sizeWarning={showWarning}
								/>

							} />
							<Route path="/quit" element={<h1>Thank you for participating!</h1>} />
						</Routes>
					</Suspense>
				</Router>
			</div>
		</ThemeProvider>
	);
}

export default App;