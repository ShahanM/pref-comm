import { atom } from 'recoil';
import { SurveyPage } from 'rssa-api';
import { setItem, removeItem, getItem } from '../utils/localStorageUtils';

export const surveyPageState = atom<SurveyPage | null>({
	key: 'surveyPageState',
	default: null,

	// effects: [
	// 	({ setSelf, onSet }) => {
	// 		const storedData: SurveyPage = getItem('surveyPage');
	// 		if (storedData) {
	// 			try {
	// 				setSelf(storedData);
	// 			} catch (e) {
	// 				console.error("Error parsing study step data from localStorage, clearing data:", e);
	// 				removeItem('surveyPage');
	// 				setSelf(null);
	// 			}
	// 		}

	// 		onSet(newValue => {
	// 			if (newValue) {
	// 				setItem('surveyPage', newValue);
	// 			} else {
	// 				removeItem('surveyPage');
	// 			}
	// 		});
	// 	}
	// ],
});