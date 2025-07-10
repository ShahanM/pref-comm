import React from 'react';
import { Col } from 'react-bootstrap';
import { AdvisorProfile, Avatar, UserResponseFlag } from '../Advisor.types';
import AdvisorDetails from './AdvisorDetails';
import UserResponsePanel from './UserResponsePanel';

interface AdvisorPanelProps {
	advisor: AdvisorProfile,
	avatar: Avatar,
	updateCallback: (advisorId: string, response: UserResponseFlag) => void
}


const AdvisorPanel: React.FC<AdvisorPanelProps> = ({
	advisor,
	avatar,
	updateCallback
}) => {

	return (
		<>
			<Col xs={6} xl={7} className="advisors-widget-column">
				<AdvisorDetails
					advisor={advisor}
					avatar={avatar}
				/>
			</Col>
			<Col xs={4} xl={3} className="advisors-widget-column">
				<UserResponsePanel
					updateCallback={updateCallback}
					avatar={avatar}
				/>
			</Col>
		</>
	);
}

export default AdvisorPanel;