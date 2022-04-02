import React, { useRef } from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import cogoToast from 'cogo-toast';
import { CREATE_CHILD_NODE } from '../../services/graphQL/editorApiHelper';

CreatingContent.propTypes = {
    createNewNode: PropTypes.func.isRequired,
    closeForm: PropTypes.func.isRequired,
    isParentRootNode: PropTypes.bool.isRequired,
    parentId: PropTypes.string.isRequired,
};

function CreatingContent(props) {
    // Define defaults for all form fields so they can be reset on form submission or cancellation
    const defaultState = {
        and: '',
        because: '',
        description: '',
        entityType: 'strategy',
        if: '',
        logic: '',
        name: 'New Node',
        necessity: '',
        optionalityAndSequence: '',
        referenceId: '',
        sufficiency: '',
        tactic: '',
        then: '',
    };
    const [formData, setFormData] = useState(defaultState);
    const [createNewChildNode] = useMutation(CREATE_CHILD_NODE);
    const formRef = useRef();

    function handleFormChange(event) {
        const { name, value } = event.target;
        setFormData(formData => ({
            ...formData,
            [name]: value,
        }));
    }

    function createNewData(event) {
        event.preventDefault();

        console.log(formData);

        createNewChildNode({
            variables: {
                and: formData.and,
                because: formData.because,
                description: formData.description,
                entityType: formData.entityType,
                if: formData.if,
                logic: formData.logic,
                name: formData.necessity,
                necessity: formData.name,
                optionalityAndSequence: formData.optionalityAndSequence,
                parentId: props.parentId,
                referenceId: formData.referenceId,
                sufficiency: formData.sufficiency,
                tactic: formData.tactic,
                then: formData.then,
                treeId: props.formData.treeId,
            },
        })
            .then(res => {
                cogoToast.success('Created new node');
                formRef.current.scrollTop = 0;
                // console.log(res.data.createChildNode);
                props.createNewNode(res.data.createChildNode);
                props.setFormData(res.data.createChildNode);
                props.closeForm();
                // setFormData(defaultState);
            })
            .catch(err => cogoToast.error(err.message));
    }

    function handleCloseFormClick(event) {
        event.preventDefault();
        props.closeForm();
        formRef.current.scrollTop = 0;
        setFormData(defaultState);
    }

    useEffect(() => {}, [formData]);

    const referenceInput = useRef();
    const [id, setId] = useState("");

    return (
        <form onSubmit={createNewData} onChange={handleFormChange} ref={formRef} className='previewBar previewBarWordCloudHidden'>
            {/* <form onSubmit={createNewData} onChange={handleFormChange}> */}
                <input type='submit' style={{ display: 'none' }} />
                
                    <div className="previewBar__viewing-header">
                        <p className="previewBar__node-title previewBar__create-title">Create Child Node: <span className="previewBar__highlight-ref">{ id }</span></p>
                    </div>

                    <div className="previewBar__input-wrapper">
                        <div className='previewBar-inputGroup previewBar-inputGroup--edit'>
                            <label className='previewBar-inputGroup-label--edit'>Reference ID</label>
                            <input
                                ref={referenceInput}
                                onChange={() => setId(() => referenceInput.current.value)}
                                className='previewBar-inputGroup-input'
                                id='referenceId'
                                name='referenceId'
                                autoFocus
                                value={formData.referenceId}
                            ></input>
                        </div>
                        <div className='previewBar-inputGroup previewBar-inputGroup--edit'>
                            <label className='previewBar-inputGroup-label--edit'>Entity Type</label>
                            <select
                                name='entityType'
                                value={formData.entityType}
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
                        <div className='previewBar-inputGroup previewBar-inputGroup--edit'>
                            <label className='previewBar-inputGroup-label--edit'>Name</label>
                            <input className='previewBar-inputGroup-input' name='name' value={formData.name}></input>
                        </div>
                        <div className='previewBar-inputGroup previewBar-inputGroup--edit'>
                            <label className='previewBar-inputGroup-label--edit'>Description</label>
                            <textarea
                                className='previewBar-inputGroup-textarea'
                                name='description'
                                value={formData.description}
                            ></textarea>
                        </div>
                        <div className='previewBar-inputGroup previewBar-inputGroup--edit'>
                            <label className='previewBar-inputGroup-label--edit'>Tactic</label>
                            <textarea
                                className='previewBar-inputGroup-textarea'
                                name='tactic'
                                value={formData.tactic}
                            ></textarea>
                        </div>
                        <div className='previewBar-inputGroup previewBar-inputGroup--edit'>
                            <label className='previewBar-inputGroup-label--edit'>Necessity</label>
                            <textarea
                                className='previewBar-inputGroup-textarea'
                                name='necessity'
                                value={formData.necessity}
                            ></textarea>
                        </div>
                        <div className='previewBar-inputGroup previewBar-inputGroup--edit'>
                            <label className='previewBar-inputGroup-label--edit'>Logic</label>
                            <textarea
                                className='previewBar-inputGroup-textarea'
                                name='logic'
                                value={formData.logic}
                            ></textarea>
                        </div>
                        <div className='previewBar-inputGroup previewBar-inputGroup--edit'>
                            <label className='previewBar-inputGroup-label--edit'>If</label>
                            <textarea
                                className='previewBar-inputGroup-textarea'
                                value={formData.if}
                                placeholder={formData.necessity !== '' ? '[If] is recommended if you have [Necessity]' : ''}
                                name='if'
                            ></textarea>
                        </div>
                        <div className='previewBar-inputGroup previewBar-inputGroup--edit'>
                            <label className='previewBar-inputGroup-label--edit'>and</label>
                            <textarea
                                className='previewBar-inputGroup-textarea'
                                value={formData.and}
                                placeholder={formData.tactic !== '' ? '[And] is recommended if you have [Tactic]' : ''}
                                name='and'
                            ></textarea>
                        </div>
                        <div className='previewBar-inputGroup previewBar-inputGroup--edit'>
                            <label className='previewBar-inputGroup-label--edit'>then</label>
                            <textarea
                                className='previewBar-inputGroup-textarea'
                                value={formData.then}
                                placeholder={
                                    formData.description !== '' ? '[Then] is recommended if you have [Description]' : ''
                                }
                                name='then'
                            ></textarea>
                        </div>
                        <div className='previewBar-inputGroup previewBar-inputGroup--edit'>
                            <label className='previewBar-inputGroup-label--edit'>because</label>
                            <textarea
                                className='previewBar-inputGroup-textarea'
                                value={formData.because}
                                placeholder={formData.logic !== '' ? '[Because] is recommended if you have [Logic]' : ''}
                                name='because'
                            ></textarea>
                        </div>
                        <div className='previewBar-inputGroup previewBar-inputGroup--edit'>
                            <label className='previewBar-inputGroup-label--edit'>Sufficiency</label>
                            <textarea
                                className='previewBar-inputGroup-textarea'
                                value={formData.sufficiency}
                                name='sufficiency'
                            ></textarea>
                        </div>
                        <div className='previewBar-inputGroup previewBar-inputGroup--edit'>
                            <label className='previewBar-inputGroup-label--edit'>Optionality &amp; Sequence</label>
                            <textarea
                                className='previewBar-inputGroup-textarea'
                                value={formData.optionalityAndSequence}
                                name='optionalityAndSequence'
                            ></textarea>
                        </div>
                    </div>

                    <div className="previewBar__save-wrapper">
                        <div className='row m-1'>
                            <button className='btn btn-block btn-primary' type='submit'>
                                Create
                            </button>
                            </div>
                            <div className='row m-1'>
                            <button
                                className='btn btn-block btn-danger'
                                onClick={handleCloseFormClick}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                          
            </form>
        // </div>
    );
}

export default CreatingContent;
