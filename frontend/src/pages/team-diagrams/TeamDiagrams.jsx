import React, { useEffect } from 'react';

import './TeamDiagrams.scss';
import { useQuery } from '@apollo/react-hooks';
import { 
    GET_USER_TEAM_DIAGRAMS,
    ADD_ROOT_NODE_TO_TEAM,
    REMOVE_ROOT_NODE_FROM_TEAM,
    SET_TEAM_DIAGRAM_PRIVACY
     
} from '../../services/graphQL/dashboardApiHelper';
import TreeList from '../tree-list/treeList';
import { useUser } from '../../services/AuthenticationContextProvider';
import { useHistory } from 'react-router';

function TeamDiagrams(props) {

    const user = useUser();
    const history = useHistory();

    const { data, error, refetch } = useQuery(GET_USER_TEAM_DIAGRAMS, {
        pollInterval: 10000,
        variables: { diagramStatus: props.treeStatus }
    });

    useEffect(() => {
        refetch();
    });

    const sortTeamId = history.location.search.replace("?", "");

    const teams = data?.getUser?.teams;
    
    if(sortTeamId && sortTeamId !== ""){
        for(let i = teams?.length-1; i >= 1; i--){
            if(teams[i].team._id === sortTeamId){
                const temp = teams[i-1];
                teams[i-1] = teams[i];
                teams[i] = temp;
            }
        }
    }
    

    return (
        <div className="team-diagrams">
            <h1 className="team-diagrams__heading">Team { props.treeStatus == 'published' ? "Published" : "Drafts" }</h1>
            <hr />
            {
                teams?.map(team => 
                    <React.Fragment key={team.team._id}>
                        <div className="team-diagrams__team">
                            <h4 className="team-diagrams__team-name">{ team.team.name }</h4>
                            <p className="team-diagrams__team-description">{ team.team.description }</p>
                            <div className="team-diagrams__team-diagrams">
                                <TreeList 
                                    queryRefetch={refetch} 
                                    team={team?.team} 
                                    moderator={team?.role === 'moderator' || user?.role === 'admin'} 
                                    treeStatus={props.treeStatus} 
                                    treeList={team.team.diagrams} 
                                />
                            </div>
                        </div>  
                        <hr />
                    </React.Fragment>
                )
            }
        </div>
    );
}

export default TeamDiagrams;