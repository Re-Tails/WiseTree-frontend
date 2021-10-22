import React from 'react';

import './TeamCard.scss';

import { Link } from 'react-router-dom';

function TeamCard(props) {

    const userProfiles = [];
    for(let i = 0; i < props.team?.users?.length && i < 3; i++){
        let name = props?.team?.users[i]?.user.name;
        let nameArr = name.split(" ");
        userProfiles.push({
            initial: (nameArr[0].charAt(0) + nameArr[1].charAt(0)).toUpperCase(),
            _id: props?.team?.users[i]?.user._id
        });
    }

    return (
        <Link to={`/dashboard/team-published?${props?.team._id}`} className="team-card">
            <div className="team-card__top-background"></div>
            <div className="team-card__image-container">
                { userProfiles.map(userProfile => <div key={userProfile._id} className="team-card__user-profile">{ userProfile.initial }</div>) }
                { props.team?.users?.length > 3 && <div className="team-card__user-profile">+{ props.team?.users?.length-3 }</div>}
            </div>
            <h4 className="team-card__name">{ props?.team.name }</h4>
            <p className="team-card__description">{ props?.team.description }</p>
        </Link>
    );
}

export default TeamCard;