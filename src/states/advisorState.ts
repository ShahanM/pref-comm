import { atom, selector } from "recoil";
import { AdvisorProfile } from "../pages/advisors/Advisor.types";

export const advisorsMapState = atom<Map<string, AdvisorProfile>>({
	key: 'advisorMapState',
	default: new Map(),
});

export const activateAdvisorIdState = atom<string | undefined>({
	key: 'activateAdvisorIdState',
	default: undefined,
});

export const activeAdvisorSelector = selector<AdvisorProfile | undefined>({
	key: 'activeAdvisorSelector',
	get: ({ get }) => {
		const advisors = get(advisorsMapState);
		const activeId = get(activateAdvisorIdState);
		if (activeId) {
			return advisors.get(activeId);
		}
		return undefined;
	}
});