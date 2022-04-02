import { useQuery } from '@apollo/react-hooks';
import React, { useEffect } from 'react';

import './ViewTeams.scss';
import { GET_USER_TEAMS } from '../../services/graphQL/dashboardApiHelper';
import TeamCard from '../../components/team-card/TeamCard';

function ViewTeams(props) {

    const { data, error, loading, refetch } = useQuery(GET_USER_TEAMS, { pollInterval: 10000 });

    useEffect(() => {
        refetch();
    }, []);

    return (
        <div className="view-teams">
            {
                data?.getUser?.teams.map(team => 
                    <TeamCard team={team.team} key={team.team._id} />
                )
            }
        </div>
    );
}

export default ViewTeams;