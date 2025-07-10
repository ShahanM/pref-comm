import React, { useCallback, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { AdvisorWidgetProps, Avatar, UserResponseFlag } from "../Advisor.types";

import { useRecoilState, useRecoilValue } from "recoil";
import { activateAdvisorIdState, activeAdvisorSelector, advisorsMapState } from "../../../state/advisorState";
import { AVATARS } from "../constants";
import AdvisorPanel from "./AdvisorPanel";
import AdvisorsNavigation from "./AdvisorsNavigation";


const AdvisorsWidget: React.FC<AdvisorWidgetProps> = () => {
	const [advisors, setAdvisors] = useRecoilState(advisorsMapState);
	// const advisors = useRecoilValue(advisorsMapState);
	const [activeAdvisorId, setActiveAdvisorId] = useRecoilState(activateAdvisorIdState);

	// const [activeSelection, setActiveSelection] = useState<AdvisorProfile | undefined>(() => {
	// 	const firstAdvisor = Array.from(advisors.values())[0];
	// 	return firstAdvisor || undefined;
	// });

	useEffect(() => {
		// if (currentAdvisors && currentAdvisors.size > 0) {
		// setAdvisors(new Map(currentAdvisors));
		if (advisors && advisors.size > 0 && !activeAdvisorId) {
			const firstAdvisor = advisors.values().next().value;
			if (firstAdvisor) {
				setActiveAdvisorId(firstAdvisor.id);
			}
		}
	}, [advisors, setActiveAdvisorId, activeAdvisorId]);

	const avatarKeyMap = useCallback(() => {
		const sortedAdvisorIds = Array.from(advisors.keys()).sort();
		const avatarKeys = Object.keys(AVATARS);
		const newMap = new Map<string, Avatar>();

		for (let i = 0; i < sortedAdvisorIds.length; i++) {
			const advisorKey = sortedAdvisorIds[i];
			newMap.set(advisorKey, AVATARS[avatarKeys[i]]);
		}
		return newMap;
	}, [advisors])

	const getAdvisorAvatar = useCallback((advisorId: string) => {
		return avatarKeyMap().get(advisorId);
	}, [avatarKeyMap]);

	const handleSelect = useCallback((advisorId: string) => {
		setActiveAdvisorId(advisorId);
	}, [setActiveAdvisorId]);

	const handleAdvisorUpdate = useCallback((advisorId: string, response: UserResponseFlag) => {

		setAdvisors(prevAdvisors => {
			const selectedAdvisor = prevAdvisors.get(advisorId);
			if (!selectedAdvisor) {
				console.error(`Advisor with ID ${advisorId} not found.`);
				return prevAdvisors;
			}
			const updatedAdvisor = { ...selectedAdvisor };
			if (response.selected !== undefined) {
				updatedAdvisor.selected = response.selected;
			}
			if (response.responded !== undefined) {
				updatedAdvisor.responded = response.responded;
			}
			const newAdvisors = new Map(prevAdvisors);
			newAdvisors.set(advisorId, updatedAdvisor);

			return newAdvisors;
		});

		// setAdvisors(newAdvisors);

		// if (activeSelection && activeSelection.id === advisorId) {
		// 	setActiveSelection(updatedAdvisor);
		// }
	}, [setAdvisors]);

	const activeSelection = useRecoilValue(activeAdvisorSelector);

	return (
		<Row className="advisors-widget-row">
			<Col xs={2} xl={2} className="advisors-widget-column">
				<AdvisorsNavigation
					advisors={advisors}
					activeSelection={activeAdvisorId}
					selectCallback={handleSelect}
					getAdvisorAvatar={getAdvisorAvatar}
				/>
			</Col>
			{activeSelection && (
				<AdvisorPanel
					advisor={activeSelection}
					avatar={getAdvisorAvatar(activeSelection.id) as Avatar}
					updateCallback={handleAdvisorUpdate} />
			)}
		</Row>
	);
}

export default AdvisorsWidget;