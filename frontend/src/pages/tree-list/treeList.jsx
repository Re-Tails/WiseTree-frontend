import React from 'react';
import TreeCard from '../../components/tree-card/treeCard.jsx';
import cogoToast from 'cogo-toast';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import './treeList.scss';

function TreeList(props) {

    const [mutateTreeStatus] = useMutation(
        gql`
            mutation mutateTreeStatus($treeId: ID, $newStatus: nodeStatusEnum) {
                updateRootNodeStatus(id: $treeId, status: $newStatus) {
                    id
                    status
                }
            }
        `
    );

    function modifyTreeStatus(treeId, newStatus) {
        mutateTreeStatus({
            variables: { treeId, newStatus },
        })
            .then(() => cogoToast.success(`Tree status updated to ${newStatus.toUpperCase()}`))
            .catch(() => cogoToast.error('Failed to update Tree. Please try again later'));
    }

    return (
        <div className='treeList'>
            {props.treeList
                ?.filter(tree => tree.status === props.treeStatus)
                .map(tree => {
                    return (
                        <TreeCard
                            key={tree.treeId}
                            name={tree.name}
                            treeId={tree.treeId}
                            status={tree.status}
                            lastUpdated={tree.lastUpdated}
                            thumbnail={tree.thumbnail}
                            modifyTreeStatus={modifyTreeStatus}
                            ownerId={tree.ownerId}
                            roles={tree.roles}
                            isCompany={tree.isPublic}
                            moderator={props.moderator}
                            queryRefetch={props.queryRefetch}
                        />
                    );
                })}
            { !props.company && props.moderator && props.treeStatus == 'draft' && <TreeCard key='0' team={props.team}/> }
        </div>
    );
}

export default TreeList;