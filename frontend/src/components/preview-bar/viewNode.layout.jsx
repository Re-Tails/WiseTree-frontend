import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { PreviewBar } from './previewBar';
import SearchArea from '../search-area/searchArea';

import "./viewNode.scss";

ViewingContent.propTypes = {
    formData: PropTypes.object,
    toggleViewingMode: PropTypes.func,
    resetPreviewBarAndDialogOpen: PropTypes.func,
    getNodeById: PropTypes.func,
    setCurrentNodeById: PropTypes.func,
    isParentRootNode: PropTypes.bool.isRequired,
    triggerHoverOver: PropTypes.func,
    triggerHoverOut: PropTypes.func,
};

function ViewingContent(props) {
    const { formData } = props;

    const [ancestors, setAncestors] = useState([]);

    useEffect(() => {

        console.log(formData.children);

        setAncestors(() => {
            let ancestorsArr = [];

            let parentNode = props.getNodeById(formData.parentId);

            while (parentNode) {
                ancestorsArr.unshift(parentNode);
                parentNode = props.getNodeById(parentNode.parentId);
            } 

            return ancestorsArr;
        });

    }, [formData]); 

    //console.log('ANCESTORS: ', ancestors);


    // Handle some class naming here:
    let nameContainerClass = formData.entityType ? 
    `viewing-grid__name viewing-grid__viewing-item viewing-grid__viewing-item--entity ${formData.entityType}` : 
    'viewing-grid__name viewing-grid__viewing-item viewing-grid__viewing-item--entity tree';

    let labelClass = formData.entityType ? 
    `viewing-grid__label nodeText-${formData.entityType}` : 
    'viewing-grid__label nodeText-tree';


    return (
        <>
        <div className="previewBar">
            <div className="previewBar__viewing-header">
                <SearchArea
                    search={props.search}
                    viewMode={props.viewMode}
                    LAYOUT_SEARCHPANE_WIDTH={props.LAYOUT_SEARCHPANE_WIDTH}
                    LAYOUT_SEARCHPANE_HEIGHT={props.LAYOUT_SEARCHPANE_HEIGHT}
                    LAYOUT_WORDCLOUD_WIDTH={props.LAYOUT_WORDCLOUD_WIDTH}
                    LAYOUT_WORDCLOUD_HEIGHT={props.LAYOUT_WORDCLOUD_HEIGHT}
                    isWordCloudOpen={props.isWordCloudOpen}
                    toggleIsWordCloudOpen={props.toggleIsWordCloudOpen}
                    toggleShowTactics={props.toggleShowTactics}
                    showTactics={props.showTactics}
                    resetSearch={props.resetSearch}
                    //MORE
                    maxWordCloudCount={props.maxWordCloudCount}
                    WORDCLOUD_MINOCCURS={props.WORDCLOUD_MINOCCURS}
                    wordCloudData={props.wordCloudData}
                    setDefaultZoom={props.setDefaultZoom}
                    refetchTree={props.refetchTree}
                    wordCloudColourScale={props.wordCloudColourScale}
                />

                {/* Ancestors Button List */}
                { ancestors.length > 0 &&
                    <div className="previewBar__ancestors">
                        { ancestors.map(ancestor => 
                            <button 
                                key={ancestor.parentId + ' ' + ancestor.id}
                                className={ancestor.entityType ? `previewBar__relativeButton ${ancestor.entityType}` : 'previewBar__relativeButton tree'}
                                onClick={() => { 
                                    props.setCurrentNodeById(ancestor.id);
                                }}
                                onMouseOver={() => { props.triggerHoverOver(props.getNodeById(ancestor.id)) }}
                                onMouseOut={() => { props.triggerHoverOut() } }>
                                { ancestor.referenceId }
                            </button>
                        )}
                    </div>
                }

                <div className={nameContainerClass}>
                    <p className="viewing-grid__data viewing-grid__data--name">{ formData.referenceId + " " + formData.name }</p>
                </div>
            </div>
            
            {/* <div className='previewBar-fieldsContainer'>
                <div className='previewBar-verticalContainer'>
                    <div
                        className={formData.entityType ? `previewBar-verticalContainer-nameContainer ${formData.entityType}` : 'previewBar-verticalContainer-nameContainer tree'}>
                        <p className='previewBar-title'>{formData.referenceId} {formData.name}</p>
                    </div>
                    { formData.description && <div className='previewBar-verticalContainer-descriptionContainer'>
                        <p className='previewBar-content previewBar-description'>{formData.description}</p>
                    </div> }
                    {formData.tactic ? (
                        <div className='previewBar-verticalContainer-tacticContainer'>
                            <p className='previewBar-content'>{formData.tactic}</p>
                        </div>
                    ) : null}
                </div>

                {formData.necessity || formData.logic ? (
                    <div className={formData.entityType ? `previewBar-horizontalContainer` : 'previewBar-horizontalContainer'}>
                        {formData.necessity ? (
                            <div className={formData.entityType ? `previewBar-horizontalContainer-column` : 'previewBar-horizontalContainer-column'}>
                                <h4 className={formData.entityType ? `previewBar-label nodeText-${formData.entityType}` : 'previewBar-label nodeText-tree'}>Necessity</h4>
                                <p className='previewBar-content'>{formData.necessity}</p>
                            </div>
                        ) : null}
                        {formData.logic ? (
                            <div className={formData.entityType ? `previewBar-horizontalContainer-column` : 'previewBar-horizontalContainer-column'}>
                                <h4 className={formData.entityType ? `previewBar-label nodeText-${formData.entityType}` : 'previewBar-label nodeText-tree'}>Logic</h4>
                                <p className='previewBar-content'>{formData.logic}</p>
                            </div>
                        ) : null}
                    </div>
                ) : null}

                {formData.if || formData.and || formData.then || formData.because ? ( //Larger Container in the middle of the preview bar
                    <div className={formData.entityType ? `previewBar-detailContainer` : 'previewBar-detailContainer'}>
                        <div> 
                            {formData.if ? (
                                <div className='previewBar-inputGroup'>
                                    <h4 className={formData.entityType ? `previewBar-label nodeText-${formData.entityType}` : 'previewBar-label nodeText-tree'}>If</h4>
                                    <p className='previewBar-content'>{formData.if}</p>
                                </div>
                            ) : null}

                            {formData.and ? (
                                <div className='previewBar-inputGroup'>
                                    <h4 className={formData.entityType ? `previewBar-label nodeText-${formData.entityType}` : 'previewBar-label nodeText-tree'}>and</h4>
                                    <p className='previewBar-content'>{formData.and}</p>{' '}
                                </div>
                            ) : null}

                            {formData.then ? (
                                <div className='previewBar-inputGroup'>
                                    <h4 className={formData.entityType ? `previewBar-label nodeText-${formData.entityType}` : 'previewBar-label nodeText-tree'}>then</h4>
                                    <p className='previewBar-content'>{formData.then}</p>
                                </div>
                            ) : null}

                            {formData.because ? (
                                <div className='previewBar-inputGroup'>
                                    <h4 className={formData.entityType ? `previewBar-label nodeText-${formData.entityType}` : 'previewBar-label nodeText-tree'}>because</h4>
                                    <p className='previewBar-content'>{formData.because}</p>
                                </div>
                            ) : null}
                        </div>
                    </div>
                ) : null}

                {formData.sufficiency || formData.optionalityAndSequence ? (
                    <div className={formData.entityType ? `previewBar-horizontalContainer` : 'previewBar-horizontalContainer'}>
                        {formData.sufficiency ? (
                            <div className={formData.entityType ? `previewBar-horizontalContainer-column` : 'previewBar-horizontalContainer-column'}>
                                <h4 className={formData.entityType ? `previewBar-label nodeText-${formData.entityType}` : 'previewBar-label nodeText-tree'}>Sufficiency</h4>
                                <p className='previewBar-content'>{formData.sufficiency}</p>
                            </div>
                        ) : null}

                        {formData.optionalityAndSequence ? (
                            <div className={formData.entityType ? `previewBar-horizontalContainer-column` : 'previewBar-horizontalContainer-column'}>
                                <h4 className={formData.entityType ? `previewBar-label nodeText-${formData.entityType}` : 'previewBar-label nodeText-tree'}>Optionality &amp; Sequence</h4>
                                <p className='previewBar-content'>{formData.optionalityAndSequence}</p>
                            </div>
                        ) : null}
                    </div>
                ) : null}
            </div> */}


            <div className="viewing-grid">
                { formData.description &&
                <div className="viewing-grid__description viewing-grid__viewing-item">
                    <p className="viewing-grid__data viewing-grid__data--description">{ formData.description }</p>
                </div> }

                { formData.tactic &&
                <div className="viewing-grid__tactic viewing-grid__viewing-item">
                    <p className="viewing-grid__data viewing-grid__data--tactic">{ formData.tactic }</p>
                </div> }

                { formData.necessity &&
                <div 
                className="viewing-grid__necessity viewing-grid__viewing-item"
                style={{ gridColumn: !formData.logic ? "1 / -1" : "1 / 2" }}>
                    <h4 className={labelClass + " viewing-grid__label--necessity"}>Necessity</h4>
                    <p className="viewing-grid__data viewing-grid__data--necessity">{ formData.necessity }</p>
                </div> }

                { formData.logic &&
                <div 
                className="viewing-grid__logic viewing-grid__viewing-item"
                style={{ gridColumn: !formData.necessity ? "1 / -1" : "2 / 3" }}>
                    <h4 className={labelClass + " viewing-grid__label--logic"}>Logic</h4>
                    <p className="viewing-grid__data viewing-grid__data--logic">{ formData.logic }</p>
                </div> }

                { (formData.if || formData.and || formData.then || formData.because) && 
                <div className="viewing-grid__detail viewing-grid__viewing-item">
                    { formData.if &&
                    <div className="viewing-grid__if">
                        <h4 className={labelClass + " viewing-grid__label--if"}>If</h4>
                        <p className="viewing-grid__data viewing-grid__data--if">{ formData.if }</p>
                    </div> }
                    { formData.and &&
                    <div className="viewing-grid__and">
                        <h4 className={labelClass + " viewing-grid__label--and"}>and</h4>
                        <p className="viewing-grid__data viewing-grid__data--and">{ formData.and }</p>
                    </div> }
                    { formData.then &&
                    <div className="viewing-grid__then">
                        <h4 className={labelClass + " viewing-grid__label--then"}>then</h4>
                        <p className="viewing-grid__data viewing-grid__data--then">{ formData.then }</p>
                    </div> }
                    { formData.because &&
                    <div className="viewing-grid__because">
                        <h4 className={labelClass + " viewing-grid__label--because"}>because</h4>
                        <p className="viewing-grid__data viewing-grid__data--because">{ formData.because }</p>
                    </div> }
                </div> }

                { formData.sufficiency &&
                <div 
                className="viewing-grid__sufficiency viewing-grid__viewing-item"
                style={{ gridColumn: !formData.optionalityAndSequence ? "1 / -1" : "1 / 2" }}>
                    <h4 className={labelClass + " viewing-grid__label--sufficiency"}>Sufficiency</h4>
                    <p className="viewing-grid__data viewing-grid__data--sufficiency">{ formData.sufficiency }</p>
                </div> }

                { formData.optionalityAndSequence &&
                <div 
                className="viewing-grid__optionality viewing-grid__viewing-item"
                style={{ gridColumn: !formData.sufficiency ? "1 / -1" : "2 / 3" }}>
                    <h4 className={labelClass + " viewing-grid__label--optionality"}>Optionality & Sequence</h4>
                    <p className="viewing-grid__data viewing-grid__data--optionality">{ formData.optionalityAndSequence }</p>
                </div> }
            </div>

            <div className="previewBar__viewing-footer">
                {/* Children Button List */}
                { formData?.children?.length > 0 && 
                    <div className="previewBar__children">
                        {formData.children.map(child => (
                            <button className={child.entityType ? `previewBar__relativeButton ${child.entityType}` : 'previewBar__relativeButton tree'}
                                key={child.parentId + ' ' + child.id}
                                onClick={() => { props.setCurrentNodeById(child.id) }}
                                onMouseOver={() => { props.triggerHoverOver(props.getNodeById(child.id)) }}
                                onMouseOut={() => { props.triggerHoverOut() } }>
                                {child.referenceId}
                            </button>
                        ))}
                    </div>
                }
            </div>
        </div>
        </>
    );
}

export default ViewingContent;
