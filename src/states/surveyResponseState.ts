import { atom } from 'recoil';
import { SurveyItemResponse } from 'rssa-api';
import { getItem, removeItem, setItem } from '../utils/localStorageUtils';

export const surveyResponseState = atom<Map<string, SurveyItemResponse>>({
	key: 'surveyResponseState',
	default: new Map<string, SurveyItemResponse>(),

	// atomEffect for localStorage persistence
	// Note: effects_UNSTABLE is the current stable name for atomEffect in Recoil 0.7+
	effects: [
		({ setSelf, onSet }) => {
			const storedData = getItem('surveyResponseData');
			if (storedData) {
				try {
					const parsedData: { [key: string]: SurveyItemResponse } = storedData;
					const loadedMap = new Map<string, SurveyItemResponse>(
						Object.values(parsedData)
							.map(response => [response.construct_id + ":" + response.item_id, response])
					);
					setSelf(loadedMap);
				} catch (e) {
					console.error("Error parsing rated movies from localStorage, clearing data:", e);
					removeItem('surveyResponseData'); // Clear bad data
					setSelf(new Map());
				}
			}

			onSet(newValue => {
				const plainObject: { [key: string]: SurveyItemResponse } = {};
				newValue.forEach((value, key) => {
					plainObject[key] = value;
				});
				setItem('surveyResponseData', plainObject);
			});
		},
	],
});