import React from 'react';
import { Image } from 'react-bootstrap';

export default function AdvisorsNavigation({ activeSelection, advisors, selectCallback, getAdvisorAvatar }) {

  return (
    <div className="advisors-panel-container">
      <h2>Your Advisors</h2>
      <div className="advisors-list">
        {Array.from(advisors.entries()).map(([advisorId, advisor], idx) => (
          <AdvisorListItem
            key={`advisor-${advisor.id}`}
            advisor={advisor}
            avatar={getAdvisorAvatar(advisorId)}
            selected={advisor.id === activeSelection}
            selectCallback={selectCallback}
          />
        ))}
      </div>
    </div>
  );
}

const AdvisorListItem = ({ advisor, avatar, selected, selectCallback }) => {

  const nameSplit = avatar.name.split(" ");

  return (
    <div className={`advisor-item ${selected ? 'selected' : ''}`}
      onClick={() => selectCallback(advisor.id)}
    >
      <Image
        className="advisor-image"
        src={avatar.src}
        alt={avatar.alt}
        roundedCircle
      />
      <div className="advisor-info">
        <p className="advisor-name">
          {nameSplit[0]}<br />{nameSplit[1]}
        </p>
      </div>
      <div>
        {advisor.responded &&
          (
            advisor.selected ?
              <span className="advisor-responded-pos"> &#x2713; </span>
              :
              <span className="advisor-responded-neg"> &#x2717; </span>
          )}
      </div>
    </div>
  );
}