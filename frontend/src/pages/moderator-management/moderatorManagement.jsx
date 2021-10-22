import { useApolloClient, useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import React, { useRef, useState, useEffect } from 'react';

import { ReactComponent as ArrowIcon } from '../../assets/icons/icon-arrow-left.svg';
import { ReactComponent as GearIcon } from '../../assets/icons/icon-gear.svg';
import { ReactComponent as PlusIcon } from '../../assets/icons/icon-plus.svg';

import './moderatorManagement.scss';

import {
  GET_TEAMS_AND_USERS,
  CHANGE_USER_ROLE_IN_TEAM,
  ADD_TEAM, REMOVE_TEAM,
  ADD_USER_TO_TEAM,
  REMOVE_USER_FROM_TEAM,
  MODERATOR_GET_TEAMS_AND_USERS,
  EDIT_TEAM
} from '../../services/graphQL/dashboardApiHelper';

import { useUser } from '../../services/AuthenticationContextProvider';
import { useHistory } from 'react-router';

function TeamManagement(props) {

  const user = useUser();

  const history = useHistory();

  useEffect(() => {
    const userIsAuthorized = async () => {

      if (!user) {
        history.push("/login");
      } else if (user?.role !== 'admin') {
        if (!user?.isModerator) {
          history.push("/dashboard");
        }
      }
    }

    userIsAuthorized();
  }, []);


  // const query = (user?.isModerator) ? GET_TEAMS_AND_USERS : MODERATOR_GET_TEAMS_AND_USERS;

  const { data, error, refetch } = useQuery(MODERATOR_GET_TEAMS_AND_USERS, { pollInterval: 10000 });

  const client = useApolloClient();

  const [toggledTeam, setToggledTeam] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const teamNameRef = useRef();
  const teamDescriptionRef = useRef();

  const [teamName, setTeamName] = useState(null);
  const [teamDescription, setTeamDescription] = useState(null);

  const [loading, setLoading] = useState(false);
  const [addTeam, setAddTeam] = useState(false);
  const [editTeam, setEditTeam] = useState(false);
  const [addTeamMember, setTeamAddMember] = useState(false);

  const handleToggle = (team) => {
    setToggledTeam(current => current?._id == team?._id ? null : team);
  }

  const handleChangeRole = async (event) => {
    event.preventDefault();
    if (loading) return;
    setLoading(() => true);
    let response = await client.mutate({
      mutation: CHANGE_USER_ROLE_IN_TEAM, variables: {
        userId: currentUser.user._id,
        teamId: toggledTeam._id,
        role: event.target[0].value
      }
    });
    await refetch();
    setLoading(() => false);
    setCurrentUser(() => false);
  }

  const handleEditTeam = async (event) => {
    event.preventDefault();
    let name = event.target[0].value;
    let description = event.target[1].value;

    if (loading) return;
    setLoading(() => true);
    let response = await client.mutate({ mutation: EDIT_TEAM, variables: { teamId: toggledTeam._id, name, description } });
    await refetch();
    setLoading(() => false);
    setEditTeam(() => false);
  }

  const handleAddUserToTeam = async (event) => {
    event.preventDefault();
    if (loading) return;
    setLoading(() => true);

    console.log(event.target[0].value);
    console.log(toggledTeam._id);
    console.log(event.target[1].value);

    let response = await client.mutate({
      mutation: ADD_USER_TO_TEAM, variables: {
        userId: event.target[0].value,
        teamId: toggledTeam._id,
        role: event.target[1].value
      }
    });

    await refetch();
    setLoading(() => false);
    setTeamAddMember(() => false);
  }

  const handleRemoveUserFromTeam = async (userId, teamId) => {
    if (loading) return;
    setLoading(() => true);
    let response = await client.mutate({ mutation: REMOVE_USER_FROM_TEAM, variables: { userId, teamId } });
    await refetch();
    setLoading(() => false);
  }

  useEffect(() => {
    if (!addTeam) {
      setTeamName(() => null);
      setTeamDescription(() => null);
    }
  }, [addTeam]);

  let teams = data?.getUser?.moderatorTeams;

  return (
    <div className="team-management">
      <div className="team-management__header">
        <h1 className="team-management__title">Team Management</h1>
      </div>
      <hr />
      <div className="team-management__container">
        {teams?.map(team => {

          const toggled = toggledTeam?._id == team._id;

          return <div className="team-management__team" key={team._id}>
            <div className="team-management__team-header">
              <div className="team-management__team-info">
                <h4 className="team-management__team-name">{team.name}</h4>
                <p className="team-management__team-description">{team.description}</p>
              </div>

              <div className="team-management__settings">
                <GearIcon
                  className="team-management__team-settings dropdown-toggle"
                  id="team-management__team-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                ></GearIcon>

                <div className="team-management__team-dropdown dropdown-menu dropdown-menu-right" aria-labelledby="team-management__team-dropdown">
                  <a
                    onClick={() => {
                      setToggledTeam(() => team);
                      setTeamAddMember(() => true);
                    }}
                    className="team-management__dropdown-item dropdown-item" href="#">Add Member</a>
                </div>
              </div>


              <ArrowIcon className="team-management__team-toggle"
                style={{ transform: `rotateZ(${toggled ? 270 : 180}deg)` }}
                onClick={() => handleToggle(team)} />
            </div>
            {toggled && team.users.length > 0 &&
              <div className="team-management__team-dropdown">
                {team.users.map(teamUser => 
                  <div className="team-management__user" key={teamUser.user._id}>
                    <div className="team-management__user-info">
                      <p className="team-management__user-name">{teamUser.user.name}</p>
                      <p className="team-management__user-email">{teamUser.user.email}</p>
                    </div>
                    <div className="team-management__user-role">{teamUser.role}</div>
                    
                    { teamUser.user._id !== user?.id &&
                    <div className="team-management__user-settings">

                      <button
                        className="team-management__btn dropdown-toggle"
                        id="team-management__user-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Edit</button>

                      <div className="team-management__user-dropdown dropdown-menu dropdown-menu-right" aria-labelledby="team-management__user-dropdown">
                        <a onClick={() => setCurrentUser(() => teamUser)} className="team-management__dropdown-item dropdown-item" href="#">Change User Role</a>
                        <a onClick={() => handleRemoveUserFromTeam(teamUser.user._id, team._id)} className="team-management__dropdown-item dropdown-item" href="#">Remove User</a>
                      </div>

                    </div>}

                  </div>
                )}
              </div>}
          </div>
        })}
      </div>

      { currentUser &&
                <div className="modal-background">
                    <div className="modal-content">
                        <div className="team-management-modal__header">
                            <h3 className="team-management-modal__title">Change User Role</h3>
                            <PlusIcon className="team-management-modal__cross" onClick={() => setCurrentUser(() => false)} />
                        </div>
                        <form action="#" onSubmit={handleChangeRole} className="team-management-modal__form">
                            <label className="team-management-modal__label" htmlFor="role">Team Role</label>
                            <select name="role" id="" className="team-management-modal__input">
                                <option value="viewer">Viewer</option>
                                <option value="editor">Editor</option>
                            </select>
                        <button className="team-management__btn team-management-modal__submit">Submit</button>
                        </form>
                    </div>
                </div>
            }

            { addTeamMember &&
                <div className="modal-background">
                    <div className="modal-content">
                        <div className="team-management-modal__header">
                            <h3 className="team-management-modal__title">Add Team Member</h3>
                            <PlusIcon className="team-management-modal__cross" onClick={() => setTeamAddMember(() => false)} />
                        </div>
                        <form action="#" onSubmit={handleAddUserToTeam} className="team-management-modal__form">
                            <select name="user" id="" className="team-management-modal__input">
                                {   
                                    data.getUsers.map(user => {

                                        if(toggledTeam.users.find(teamUser => teamUser.user._id == user._id)) return;

                                        return <option key={user._id} value={user._id}>{ `${user.name} - ${user.email}` }</option>

                                    })
                                }
                            </select>
                            <select name="role" id="" className="team-management-modal__input">
                                <option value="viewer">Viewer</option>
                                <option value="editor">Editor</option>
                            </select>
                            <button 
                            disabled={
                                data.getUsers.filter(user => {
                                    return !toggledTeam.users.find(teamUser => teamUser.user._id == user._id)
                                }).length == 0
                            }
                            className="team-management__btn team-management-modal__submit">Submit</button>
                        </form>
                    </div>
                </div>
            }
    </div>
  );
}

export default TeamManagement;

// const addRootNodeToTeam = async (event) => {
//     event.preventDefault();
//     if(loading) return;
//     setLoading(() => true);
//     let response = await client.mutate({ mutation: ADD_ROOT_NODE_TO_TEAM, variables: {
//         diagramId: "ID",
//         teamId: "ID"
//     }});
//     await refetch();
//     setLoading(() => false);
//     setCurrentUser(() => false);
// }

// const removeRootNodeFromTeam = async (event) => {
//     event.preventDefault();
//     if(loading) return;
//     setLoading(() => true);
//     let response = await client.mutate({ mutation: REMOVE_ROOT_NODE_FROM_TEAM, variables: {
//         diagramId: "ID",
//         teamId: "ID"
//     }});
//     await refetch();
//     setLoading(() => false);
//     setCurrentUser(() => false);
// }

// const setDiagramPrivacy = async (event) => {
//     event.preventDefault();
//     if(loading) return;
//     setLoading(() => true);
//     let response = await client.mutate({ mutation: SET_TEAM_DIAGRAM_PRIVACY, variables: {
//         treeId: "ID",
//         privacy: true,
//     }});
//     await refetch();
//     setLoading(() => false);
//     setCurrentUser(() => false);
// }

