import { gql } from 'apollo-boost';

export const SET_TREE_STATUS = gql`
    mutation mutateTreeStatus($treeId: ID, $newStatus: nodeStatusEnum) {
        updateRootNodeStatus(id: $treeId, status: $newStatus) {
            id
            status
        }
    }
`;

export const GET_ALL_TREES = gql`
    {
        getUserDiagrams {
            id
            lastUpdated
            name
            status
            treeId
            ownerId
            roles
        }
    }
`;

export const CREATE_NEW_ROOT_NODE = gql`
    mutation ($ownerId: String!, $teamId: String!) {
        createRootNode(
            name: "New Tree"
            description: ""
            tactic: ""
            necessity: ""
            logic: ""
            if: ""
            and: ""
            then: ""
            because: ""
            sufficiency: ""
            optionalityAndSequence: ""
            ownerId: $ownerId,
            teamId: $teamId
        ) {
            id
        }
    }
`;

export const GET_TEAMS_AND_USERS = gql`
    query GetTeamsAndUsers {
        getTeams {
            _id
            name
            description
            users {
                user {
                    _id
                    name
                    email
                    role
                }
                role
            }
        }
        getUsers {
            _id
            name
            email
        }
    }
`;

export const MODERATOR_GET_TEAMS_AND_USERS = gql`
    query ModeratorGetTeamsAndUsers {
        getUser {
            _id
            moderatorTeams {
                _id
                name
                description
                users {
                    user {
                        _id
                        email
                        name
                    }
                    role
                }
            }
        }
        getUsers {
            _id
            name
            email
        }
    }
`;

export const ADD_TEAM = gql`
    mutation AddTeam($name: String, $description: String) {
        addTeam(name: $name, description: $description) {
            _id
            name
            description
        }
    }
`;

export const CHANGE_USER_ROLE_IN_TEAM = gql`
    mutation ChangeUserRoleInTeam($userId: String, $teamId: String, $role: String) {
        changeUserRoleInTeam(userId: $userId, teamId: $teamId, role: $role) {
            _id
        }
    }
`;

export const REMOVE_TEAM = gql`
    mutation RemoveTeam($_id: String) {
        removeTeam(_id: $_id) {
            _id
        }
    }
`;

export const ADD_USER_TO_TEAM = gql`
    mutation AddUserToTeam($userId: String, $teamId: String, $role: String) {
        addUserToTeam(userId: $userId, teamId: $teamId, role: $role) {
            _id
        }
    }
`;

export const REMOVE_USER_FROM_TEAM = gql`
    mutation RemoveUserFromTeam($userId: String, $teamId: String) {
        removeUserFromTeam(userId: $userId, teamId: $teamId) {
            _id
        }
    }
`;

// Team Diagram Operations
export const ADD_ROOT_NODE_TO_TEAM = gql`
    mutation AddRootNodeToTeam($diagramId: String, $teamId: String) {
        addRootNodeToTeam(diagramId: $diagramId, teamId: $teamId) {
            _id
        }
    }
`;

export const REMOVE_ROOT_NODE_FROM_TEAM = gql`
    mutation RemoveRootNodeFromTeam($diagramId: String, $teamId: String) {
        removeRootNodeFromTeam(diagramId: $diagramId, teamId: $teamId) {
            _id
        }
    }
`;

export const SET_TEAM_DIAGRAM_PRIVACY = gql`
    mutation SetDiagramPrivacy($treeId: String, $privacy: Boolean) {
        setDiagramPrivacy(treeId: $treeId, privacy: $privacy) {
            _id
        }
    }
`;

export const GET_COMPANY_DIAGRAMS = gql`
    query GetCompanyDiagrams {
        getPublicDiagrams {
            _id
            lastUpdated
            name
            status
            treeId
            ownerId
            teams {
                _id
                name
                description
            }
        }
    }
`;

export const GET_USER_TEAM_DIAGRAMS = gql`
    query GetUserTeamDiagrams($diagramStatus:nodeStatusEnum) {
        getUser {
            _id
            teams {
                team {
                _id
                name
                description
                    diagrams(status:$diagramStatus) {
                        _id
                        lastUpdated
                        name
                        status
                        treeId
                        ownerId
                        isPublic
                    }
                }
                role
            }
        }
    } 
`

export const GET_USER_TEAMS = gql`
    query GetUserTeams {
        getUser {
            _id
            teams {
                team {
                    _id
                    name
                    description
                    users {
                        user {
                            _id
                            name
                        }
                    }
                }
                role
            }
        }
    } 
`


export const EDIT_TEAM = gql`
    mutation EditTeam($teamId: String!, $name: String!, $description: String!) {
        editTeam(teamId: $teamId, name: $name, description: $description) {
            _id
            name
            description
        }
    }
`;

export const GET_ALL_USERS = gql`
    query GetAllUsers {
        getUsers{
            _id
            name
            email
            role
        }
    }

`;

export const REMOVE_USER = gql`
    mutation RemoveUser($_id: String) {
        removeUser(_id: $_id) {
            _id
        }
    }
`;
