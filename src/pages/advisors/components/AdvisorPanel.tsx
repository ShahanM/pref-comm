import React from 'react';
import { Col } from 'react-bootstrap';
import UserResponsePanel from './UserResponsePanel';

interface AdvisorPanelProps {
    participantId: string;
    advisor: AdvisorProfile;
    avatar: Avatar;
    updateCallback: (advisorId: number, response: UserResponseFlag) => void;
}

const AdvisorPanel: React.FC<AdvisorPanelProps> = ({ participantId, advisor, avatar, updateCallback }) => {
    return (
        <>
            <Col xs={6} xl={7} className="advisors-widget-column">
                <AdvisorDetails advisor={advisor} avatar={avatar} />
            </Col>
            <Col xs={4} xl={3} className="advisors-widget-column">
                <UserResponsePanel
                    participantId={participantId}
                    advisor={advisor}
                    updateCallback={updateCallback}
                    avatar={avatar}
                />
            </Col>
        </>
    );
};

export default AdvisorPanel;
