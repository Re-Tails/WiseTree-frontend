import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import cogoToast from 'cogo-toast';
import { DELETE_NODE } from '../../services/graphQL/editorApiHelper';

import './deleteAlert.scss';

DeleteAlert.propTypes = {
    toggleDeleteDialog: PropTypes.func,
    nodeData: PropTypes.object,
    refreshView: PropTypes.func,
    setCurrentNodeById: PropTypes.func,
    updateWordCloudData: PropTypes.func.isRequired
};

export default function DeleteAlert(props) {
    const [deleteNodeAndAllChildren] = useMutation(DELETE_NODE);
    function deleteNodeAndToggleDialog() {
        deleteNodeAndAllChildren({
            variables: { id: props.nodeData.id, treeId: props.nodeData.treeId },
        })
            .then(async res => {
                cogoToast.success(`Succesfully deleted node ${res.data.deleteNodeAndAllChildren.referenceId}`);
                props.setCurrentNodeById(props.nodeData.parentId);

                let parent = props.getNodeByIdForCurrentTree(props.nodeData.parentId);
                let children = parent.children.filter(child => child.id !== props.nodeData.id);

                props.setFormData({
                    ...parent,
                    children
                });

                await props.refreshView();
                props.updateWordCloudData();
                
            })
            .catch(err => cogoToast.error(err.message));
        props.toggleDeleteDialog();
    }
    return (
        <div className="delete-dialog-background">
            <div className='deleteDialog'>
                <div className='deleteDialog-label'>
                    All children of {props.nodeData.referenceId ? <span className="deleteDialog__text-highlight">{props.nodeData.referenceId}</span> : "this node"} will also be deleted. Are you sure?
                </div>
                <div className='deleteDialog-buttonGroup'>
                    <button onClick={props.toggleDeleteDialog} className='deleteDialog-buttonGroup--cancel'>
                        Cancel
                    </button>
                    <button onClick={deleteNodeAndToggleDialog} className='deleteDialog-buttonGroup--delete'>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
