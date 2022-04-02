import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import cogoToast from 'cogo-toast';
import { Link, useHistory } from 'react-router-dom';

import { ReactComponent as PlusIcon } from '../../assets/icons/icon-plus.svg';
import { ReactComponent as WTLogo } from '../../assets/icons/logo-brand-full.svg';
import toShortDate from '../../services/dateService';
import StatusDropdown from '../tree-status-dropdown/statusDropdown';
import { CREATE_NEW_ROOT_NODE } from '../../services/graphQL/dashboardApiHelper';
import './treeCard.scss';
import { useUser } from '../../services/AuthenticationContextProvider';

export default function TreeCard(props) {
    // const { authenticationData, clearAuthenticationData } = useContext(AuthenticationContext);

    // useEffect(() => {}, [authenticationData]);

    // const temp_auth_role = "User";

    const user = useUser();

    const [createNewRootNode] = useMutation(CREATE_NEW_ROOT_NODE);
    const history = useHistory();
    
    const treeStatusOptions = {
        published: [
            { label: 'Unpublish', value: 'draft' },
            { label: 'Archive', value: 'archived' },
        ],
        draft: [
            { label: 'Publish', value: 'published' },
            { label: 'Archive', value: 'archived' },
        ],
    };

    function handleNewCardClick() {
        createNewRootNode({
            variables: {
                ownerId: user.id,
                teamId: props.team._id
            },
        })
            .then(res => {
                cogoToast.success('This can be found in Drafts', {
                    heading: 'Created a new tree',
                });
                history.replace(`/tree/${res.data.createRootNode.id}`);
            })
            .catch(() => {
                cogoToast.error('Failed to create new node');
            });
    }

    function modifyTreeStatus(selection) {
        if (selection === 'archived') {
            const { hide } = cogoToast.warn('Archived trees can only be restored by Admins', {
                heading: 'Are you sure? Click this to continue',
                onClick: () => {
                    props.modifyTreeStatus(props.treeId, selection);
                    hide();
                },
                hideAfter: 5,
            });
        } else {
            props.modifyTreeStatus(props.treeId, selection);
        }
    }
    
    try {
        if (props.treeId) {
            // Checking Authentication Roles
            // console.log("roles "+props.roles)
            // console.log("owners "+props.ownerId)

            // console.log(props);

            // if (props.roles.filter(element => authenticationData.roles.includes(element)).length > 0 || props.roles.length === 0 || props.ownerId === authenticationData.userId){
                return (
                    <Link to={`/tree/${props.treeId}`}>
                        <div key={props.treeId} className='treeCard'>
                            <div alt={props.name} className='treeCard-thumbnail'>
                                <WTLogo fill='#1d1765' />
                            </div>
                            <div className='treeCard-title'>
                                <div className='treeCard-container'>
                                    <p className='treeCard-name'>{props.name}</p>
                                    { props.moderator &&
                                    <StatusDropdown
                                        options={treeStatusOptions[props.status]}
                                        modifyTreeStatus={modifyTreeStatus}
                                        moderator={props.moderator}
                                        isCompany={props.isCompany}
                                        treeId={props.treeId}
                                        queryRefetch={props.queryRefetch}
                                    />}
                                </div>
                                <p className='treeCard-info'>Last edited: {toShortDate(props.lastUpdated)}</p>
                            </div>
                        </div>
                    </Link>
                );
            // }
        } else {
            return (
                <div className='treeCard newCard' onClick={handleNewCardClick}>
                    <div className='newCard-content'>
                        <PlusIcon fill='#0f2a46' className='newCard-icon'></PlusIcon>
                        <p className='treeCard-name'>Create a new Tree</p>
                    </div>
                </div>
            );
        }
    } catch (error) {
        console.log("Auth issue")
    }
    
    return null
}

TreeCard.propTypes = {
    lastUpdated: PropTypes.string,
    name: PropTypes.string,
    status: PropTypes.string,
    thumbnail: PropTypes.string,
    treeId: PropTypes.string,
    modifyTreeStatus: PropTypes.func,
    ownerId: PropTypes.string,
    roles: PropTypes.array,
};
