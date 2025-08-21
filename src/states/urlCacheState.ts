import { atom } from 'recoil';
import { getItem, removeItem, setItem } from '../utils/localStorageUtils';


export const urlCacheState = atom<string>({
	key: 'urlCacheState',
	default: '/',

	effects: [
		({ setSelf, onSet }) => {
			const storedUrl = getItem('lastUrl');
			if (storedUrl) {
				setSelf(storedUrl);
			}

			onSet(newValue => {
				if (newValue) {
					setItem('lastUrl', newValue);
				} else {
					removeItem('lastUrl');
				}
			});
		},
	],
});
