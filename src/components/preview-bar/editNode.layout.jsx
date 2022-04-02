import React, { useRef } from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import cogoToast from 'cogo-toast';
import { SET_NODE_ATTRIBUTES } from '../../services/graphQL/editorApiHelper';

EditingContent.propTypes = {
    formData: PropTypes.object.isRequired,
    toggleViewingMode: PropTypes.func.isRequired,
    updateCurrentNode: PropTypes.func.isRequired,
    isParentRootNode: PropTypes.bool.isRequired,
    setFormData: PropTypes.func.isRequired,
    addNode: PropTypes.func.isRequired,
    deleteNode: PropTypes.func.isRequired
};

function EditingContent(props) {
    const [mutateNodeAttributes] = useMutation(SET_NODE_ATTRIBUTES);

    function handleFormChange(event) {
        const { name, value } = event.target;
        props.updateFormData(name, value);
    }

    function updateCurrentNode(event) {
        event.preventDefault();

        mutateNodeAttributes({
            variables: {
                id: props.formData.id,
                and: props.formData.and,
                because: props.formData.because,
                description: props.formData.description,
                entityType: props.formData.entityType,
                if: props.formData.if,
                logic: props.formData.logic,
                name: props.formData.name,
                necessity: props.formData.necessity,
                optionalityAndSequence: props.formData.optionalityAndSequence,
                parentId: props.formData.parentId,
                referenceId: props.formData.referenceId,
                sufficiency: props.formData.sufficiency,
                tactic: props.formData.tactic,
                then: props.formData.then,
                treeId: props.formData.treeId,
                roles: (props.formData.roles.length > 0) ? props.formData.roles.split(",") : [],
            },
        })
            .then(res => {
                props.setFormData(res.data.updateNodeAttributes);
                cogoToast.success(`Updated node ${props.formData.referenceId}`);

                props.updateCurrentNode({
                    ...res.data.updateNodeAttributes,
                    children: props.formData.children
                });
                
                props.toggleViewingMode();
                props.updateWordCloudData();
            })
            .catch((e) => {
                cogoToast.error(`Failed to update node ${props.formData.referenceId}`);
                console.log(e);
            });
    }

    return (
        <>
        <form className='previewBar previewBarWordCloudHidden' onSubmit={updateCurrentNode} onChange={handleFormChange}>
            {/* <form onSubmit={updateCurrentNode} onChange={handleFormChange}> */}
                <input type='submit' style={{ display: 'none' }} />
                <div className="previewBar__editing-header">
                    <p className='previewBar__node-title previewBar__edit-title'>{props.formData.referenceId}</p>
                    <button onClick={() => props.addNode()} type="button" className="btn btn-success mr-2">Add Child</button>
                    <button onClick={() => props.deleteNode()} type="button" className="btn btn-danger ">Delete</button>
                </div>
                <div className="previewBar__input-wrapper">
                    <div className='previewBar-inputGroup previewBar-inputGroup--edit'>
                        <label className='previewBar-inputGroup-label--edit'>Reference ID</label>
                        <input
                            className='previewBar-inputGroup-input'
                            name='referenceId'
                            value={props.formData.referenceId || ""}
                            autoFocus
                        ></input>
                    </div>
                    {!props.formData.isRoot ? (
                        <div className='previewBar-inputGroup previewBar-inputGroup--edit'>
                            <label className='previewBar-inputGroup-label--edit'>Entity Type</label>
                            <select
                                name='entityType'
                                value={props.formData.entityType || ''}
                                className='previewBar-inputGroup-dropdown'
                            >
                                {props.isParentRootNode ? (
                                    <option className='previewBar-inputGroup-dropdown-item' value='horizon'>
                                        Horizon
                                    </option>
                                ) : null}
                                <option className='previewBar-inputGroup-dropdown-item' value='lever'>
                                    Lever
                                </option>
                                <option className='previewBar-inputGroup-dropdown-item' value='injection'>
                                    Injection
                                </option>
                                <option className='previewBar-inputGroup-dropdown-item' value='strategy'>
                                    Strategy
                                </option>
                            </select>
                        </div>
                    ) : null}
                    <div className='previewBar-inputGroup previewBar-inputGroup--edit'>
                        <label className='previewBar-inputGroup-label--edit'>Name</label>
                        <input className='previewBar-inputGroup-input' name='name' value={props.formData.name}></input>
                    </div>
                    <div className='previewBar-inputGroup previewBar-inputGroup--edit'>
                        <label className='previewBar-inputGroup-label--edit'>Description</label>
                        <textarea
                            className='previewBar-inputGroup-textarea'
                            name='description'
                            value={props.formData.description}
                        ></textarea>
                    </div>
                    <div className='previewBar-inputGroup previewBar-inputGroup--edit'>
                        <label className='previewBar-inputGroup-label--edit'>Tactic</label>
                        <textarea
                            className='previewBar-inputGroup-textarea'
                            name='tactic'
                            value={props.formData.tactic}
                        ></textarea>
                    </div>
                    <div className='previewBar-inputGroup previewBar-inputGroup--edit'>
                        <label className='previewBar-inputGroup-label--edit'>Necessity</label>
                        <textarea
                            className='previewBar-inputGroup-textarea'
                            name='necessity'
                            value={props.formData.necessity}
                        ></textarea>
                    </div>
                    <div className='previewBar-inputGroup previewBar-inputGroup--edit'>
                        <label className='previewBar-inputGroup-label--edit'>Logic</label>
                        <textarea
                            className='previewBar-inputGroup-textarea'
                            name='logic'
                            value={props.formData.logic}
                        ></textarea>
                    </div>
                    <div className='previewBar-inputGroup previewBar-inputGroup--edit'>
                        <label className='previewBar-inputGroup-label--edit'>If</label>
                        <textarea
                            className='previewBar-inputGroup-textarea'
                            name='if'
                            value={props.formData.if}
                            placeholder={props.formData.necessity !== '' ? '[If] is recommended if you have [Necessity]' : ''}
                        ></textarea>
                    </div>
                    <div className='previewBar-inputGroup previewBar-inputGroup--edit'>
                        <label className='previewBar-inputGroup-label--edit'>and</label>
                        <textarea
                            className='previewBar-inputGroup-textarea'
                            name='and'
                            value={props.formData.and}
                            placeholder={props.formData.tactic !== '' ? '[And] is recommended if you have [Tactic]' : ''}
                        ></textarea>
                    </div>
                    <div className='previewBar-inputGroup previewBar-inputGroup--edit'>
                        <label className='previewBar-inputGroup-label--edit'>then</label>
                        <textarea
                            className='previewBar-inputGroup-textarea'
                            name='then'
                            value={props.formData.then}
                            placeholder={
                                props.formData.description !== '' ? '[Then] is recommended if you have [Description]' : ''
                            }
                        ></textarea>
                    </div>
                    <div className='previewBar-inputGroup previewBar-inputGroup--edit'>
                        <label className='previewBar-inputGroup-label--edit'>because</label>
                        <textarea
                            className='previewBar-inputGroup-textarea'
                            name='because'
                            value={props.formData.because}
                            placeholder={props.formData.logic !== '' ? '[Because] is recommended if you have [Logic]' : ''}
                        ></textarea>
                    </div>
                    <div className='previewBar-inputGroup previewBar-inputGroup--edit'>
                        <label className='previewBar-inputGroup-label--edit'>Sufficiency</label>
                        <textarea
                            className='previewBar-inputGroup-textarea'
                            name='sufficiency'
                            value={props.formData.sufficiency}
                        ></textarea>
                    </div>
                    <div className='previewBar-inputGroup previewBar-inputGroup--edit'>
                        <label className='previewBar-inputGroup-label--edit'>Optionality &amp; Sequence</label>
                        <textarea
                            className='previewBar-inputGroup-textarea'
                            name='optionalityAndSequence'
                            value={props.formData.optionalityAndSequence}
                        ></textarea>
                    </div>
                    <div className='previewBar-inputGroup previewBar-inputGroup--edit'>
                        <label className='previewBar-inputGroup-label--edit'>Roles</label>
                        <textarea
                            className='previewBar-inputGroup-textarea'
                            name='roles'
                            value={props.formData.roles}
                        ></textarea>
                    </div>
                </div>
                <div className="previewBar__save-wrapper">
                    <div className='row m-1'>
                        <button
                        className='btn btn-block btn-primary'
                        type='submit'>
                            Save
                        </button>
                    </div>
                    <div className='row m-1'>
                        <button
                        className='btn btn-block btn-danger'
                        onClick={props.toggleViewingMode}>
                            Cancel
                        </button>
                    </div>
                </div>
            {/* </form> */}
        </form>
        </>
    );
}

export default EditingContent;
