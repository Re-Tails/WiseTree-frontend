import { gql } from 'apollo-boost';

export const GET_TREE_BY_ID = gql`
    query queryTreeById($id: ID!) {
        getTreeById(id: $id) {
            and
            because
            childrenIds
            description
            entityType
            id
            if
            isRoot
            lastUpdated
            logic
            name
            necessity
            optionalityAndSequence
            parentId
            referenceId
            status
            sufficiency
            tactic
            then
            treeId
            owner {
                _id
                name
                email
                role
            }
            teams {
                _id
                name
                description
                users {
                    user {
                        _id
                        name
                        email
                    }
                    role
                }
            }
            roles
        }
    }
`;

export const SET_NODE_ATTRIBUTES = gql`
    mutation mutateNodeAttributes(
        $and: String
        $because: String
        $description: String
        $entityType: nodeEntityTypeEnum
        $id: ID
        $if: String
        $logic: String
        $name: String
        $necessity: String
        $optionalityAndSequence: String
        $parentId: String
        $referenceId: String
        $sufficiency: String
        $tactic: String
        $then: String
        $treeId: ID
        $roles: [String]
    ) {
        updateNodeAttributes(
            id: $id
            and: $and
            because: $because
            description: $description
            entityType: $entityType
            if: $if
            logic: $logic
            name: $name
            necessity: $necessity
            optionalityAndSequence: $optionalityAndSequence
            parentId: $parentId
            referenceId: $referenceId
            sufficiency: $sufficiency
            tactic: $tactic
            then: $then
            roles: $roles
            treeId: $treeId
        ) {
            id
            and
            because
            description
            entityType
            if
            logic
            name
            necessity
            optionalityAndSequence
            parentId
            referenceId
            sufficiency
            tactic
            then
            roles
        }
    }
`;

export const CREATE_CHILD_NODE = gql`
    mutation createChildNode(
        $and: String
        $because: String
        $description: String
        $entityType: nodeEntityTypeEnum
        $if: String
        $logic: String
        $necessity: String
        $name: String
        $optionalityAndSequence: String
        $parentId: ID
        $referenceId: String
        $tactic: String
        $then: String
        $sufficiency: String
        $ownerId: String
        $treeId: ID!
    ) {
        createChildNode(
            and: $and
            because: $because
            description: $description
            entityType: $entityType
            if: $if
            logic: $logic
            name: $necessity
            necessity: $name
            optionalityAndSequence: $optionalityAndSequence
            parentId: $parentId
            referenceId: $referenceId
            sufficiency: $sufficiency
            tactic: $tactic
            then: $then
            ownerId: $ownerId
            treeId: $treeId
        ) {
            and
            because
            description
            entityType
            id
            if
            isRoot
            logic
            name
            necessity
            optionalityAndSequence
            parentId
            referenceId
            sufficiency
            tactic
            then
            treeId
            ownerId
        }
    }
`;

export const DELETE_NODE = gql`
    mutation deleteNodeAndAllChildren($id: ID, $treeId: ID) {
        deleteNodeAndAllChildren(id: $id, treeId: $treeId) {
            referenceId
        }
    }
`;
