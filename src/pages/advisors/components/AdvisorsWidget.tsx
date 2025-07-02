import React, { useCallback, useState } from "react";
import { Col, Row } from "react-bootstrap";
import {AdvisorProfile, AdvisorWidgetProps, Avatar, UserResponseFlag } from "../Advisor.types";
import cow from "../assets/cow.jpeg";
import duck from "../assets/duck.jpeg";
import elephant from "../assets/elephant.jpeg";
import fox from "../assets/fox.jpeg";
import llama from "../assets/llama.jpeg";
import tiger from "../assets/tiger.jpeg";
import zebra from "../assets/zebra.jpeg";
import AdvisorDetails from "./AdvisorDetails";
import UserResponsePanel from "./UserResponsePanel";
import AdvisorsNavigation from "./AdvisorsNavigation";
import RecommendationForm from "./RecommendationForm";
import AdvisorPanel from "./AdvisorPanel";




type AvatarMap = {
	[key: string]: Avatar;
}

// TODO: Move this to a constants file
const AVATARS: AvatarMap = {
	cow: {
		src: cow,
		alt: 'Anonymous Cow',
		name: 'Anonymous Cow'
	},
	duck: {
		src: duck,
		alt: 'Anonymous Duck',
		name: 'Anonymous Duck'
	},
	elephant: {
		src: elephant,
		alt: 'Anonymous Elephant',
		name: 'Anonymous Elephant'
	},
	zebra: {
		src: zebra,
		alt: 'Anonymous Zebra',
		name: 'Anonymous Zebra'
	},
	llama: {
		src: llama,
		alt: 'Anonymous Llama',
		name: 'Anonymous Llama'
	},
	fox: {
		src: fox,
		alt: 'Anonymous Fox',
		name: 'Anonymous Fox'
	},
	tiger: {
		src: tiger,
		alt: 'Anonymous Tiger',
		name: 'Anonymous Tiger'
	}
}


const AdvisorsWidget: React.FC<AdvisorWidgetProps> = ({
	participantId,
	currentAdvisors
}) => {
	const [advisors, setAdvisors] = useState(new Map(currentAdvisors));
	const [activeSelection, setActiveSelection] = useState<AdvisorProfile>();
	const [approvalPressed, setApprovalPressed] = useState(false);
	const [formData, setFormData] = useState({});
	const [recommendationSubmitted, setRecommendationSubmitted] = useState(false);

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

	const getAdvisorAvatar = (advisorId: string) => {
		return avatarKeyMap().get(advisorId);
	}

	const handleSelect = (advisorId: string, idx: number) => {
		const selectedAdvisor = advisors.get(advisorId);
		setActiveSelection(selectedAdvisor);
		setApprovalPressed(false);
		setFormData({});
		setRecommendationSubmitted(false);
	};

	const handleAccept = (advisorId: string) => {
		const selectedAdvisor = advisors.get(advisorId);
		selectedAdvisor.status = "Accepted";
		setApprovalPressed(true);
		const newAdvisors = new Map(advisors);
		newAdvisors.set(advisorId, selectedAdvisor);
		setAdvisors(newAdvisors);
	};

	const handleReject = (advisorId: string) => {
		const selectedAdvisor = advisors.get(advisorId);
		selectedAdvisor.status = "Rejected";
		setApprovalPressed(true);
		// const newAdvisors = mapReplace(advisors, "id", advisorId, (advisor) => {
		//   return selectedAdvisor;
		// });
		const newAdvisors = new Map(advisors);
		newAdvisors.set(advisorId, selectedAdvisor);
		setAdvisors(newAdvisors);
	};

	const handleAdvisorUpdate = (advisorId: string, response: UserResponseFlag) => {
		console.log("Advisor updated:", advisorId, response);
		const selectedAdvisor = advisors.get(advisorId);
		response.selected ? selectedAdvisor.selected = true : selectedAdvisor.selected = false;
		response.responded ? selectedAdvisor.responded = true : selectedAdvisor.responded = false;
		const newAdvisors = new Map(advisors);
		newAdvisors.set(advisorId, selectedAdvisor);
		setAdvisors(newAdvisors);
	}

	// const handleRecommendationSubmit = (newFormData) => {
	//   setFormData(newFormData);
	//   setRecommendationSubmitted(true);
	//   console.log("Form data:", newFormData);
	// };

	const handleRecommendationSubmit = (newFormData: any) => {
		// do nothing
	}

	return (
		<Row className="advisors-widget-row">
			<Col xs={2} xl={2} className="advisors-widget-column">
				<AdvisorsNavigation
					advisors={advisors}
					activeSelection={activeSelection && activeSelection.id}
					selectCallback={handleSelect}
					getAdvisorAvatar={getAdvisorAvatar}
				/>
			</Col>
			{activeSelection && (
				<AdvisorPanel 
					participantId={participantId}
					advisor={activeSelection}
					avatar={getAdvisorAvatar(activeSelection.id) as Avatar}
					updateCallback={handleAdvisorUpdate} />
			)}
		</Row>
	);
}

export default AdvisorsWidget;