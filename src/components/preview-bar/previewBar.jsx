import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import EditNodeLayout from './editNode.layout';
import ViewNode from './viewNode.layout';
import CreateNodeLayout from './createNode.layout';
import './previewBar.scss';

import { ReactComponent as ArrowIcon } from '../../assets/icons/icon-arrow-left.svg';

export function PreviewBar(props) {

    let layout;

    switch(props.chooseMode){
        case 'viewing':
            layout = <ViewNode
            resetPreviewBarAndDialogOpen={props.closePreview}

            // This was changed to use a prop from treeEditor to edit the main viewingMode state
            toggleViewingMode={props.toggleViewingMode}
            formData={props.nodeData}

            // This was included to update currentPreviewNode state in treeEditor
            updateFormData={props.updateFormData}
            setFormData={props.setFormData}

            getNodeById={props.getNodeById}
            setCurrentNodeById={props.setCurrentNodeById}
            isParentRootNode={props.nodeData.parentId === props.rootNodeId}
            triggerHoverOut={props.triggerHoverOut}
            triggerHoverOver={props.triggerHoverOver}

            // These props handle the SearchArea and are not updated in PropTypes
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
        />;
        break;
        
        case 'editing':
            layout = <EditNodeLayout
            updateCurrentNode={props.handleNodeAttributesUpdate}
            toggleViewingMode={props.toggleViewingMode}

            // This was included to update currentPreviewNode state in treeEditor
            formData={props.nodeData}
            setFormData={props.setFormData}
            updateFormData={props.updateFormData}

            addNode={props.addNode}
            deleteNode={props.deleteNode}
            
            isParentRootNode={props.nodeData.parentId === props.rootNodeId}

            //Fix word cloud data
            updateWordCloudData={props.updateWordCloudData}
        />;
        break;

        case 'creating':
            layout = <CreateNodeLayout
            createNewNode={props.refreshView}
            closeForm={props.closePreview}
            isParentRootNode={!props.nodeData.parentId}
            parentId={props.nodeData.id}
            formData={props.nodeData}
            setFormData={props.setFormData}
        />;
        break;
    }

    return (
        <div className="previewBar-wrapper">
            {/* Comment out layout to test the toggle-show component */}
            { props.togglePreview && layout } 
            <div className="previewBar__toggle" onClick={() => props.handleTogglePreview()}>
                <ArrowIcon className="previewBar__toggle-arrow" style={{ transform: props.togglePreview ? 'rotateZ(0)' : 'rotateZ(180deg)' }}/>
            </div>
        </div>
    );
}

PreviewBar.propTypes = {
    rootNodeId: PropTypes.string.isRequired,
    nodeData: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        entityType: PropTypes.string,
        description: PropTypes.string,
        tactic: PropTypes.string,
        necessity: PropTypes.string,
        logic: PropTypes.string,
        if: PropTypes.string,
        and: PropTypes.string,
        then: PropTypes.string,
        because: PropTypes.string,
        sufficiency: PropTypes.string,
        optionalityAndSequence: PropTypes.string,
        nodeDataColor: PropTypes.string,
        customProperty: PropTypes.string,
        parentId: PropTypes.string,
        children: PropTypes.array,
    }).isRequired,
    closeForm: PropTypes.func.isRequired,
    handleNodeAttributesUpdate: PropTypes.func.isRequired,
    chooseMode: PropTypes.string.isRequired,
    closePreview: PropTypes.func.isRequired,
    refreshView: PropTypes.func.isRequired,
    getNodeById: PropTypes.func.isRequired,
    setCurrentNodeById: PropTypes.func.isRequired,
    triggerHoverOver: PropTypes.func.isRequired,
    triggerHoverOut: PropTypes.func.isRequired,
    toggleViewingMode: PropTypes.func.isRequired,
    setFormData: PropTypes.func.isRequired,
    updateFormData: PropTypes.func.isRequired,
    addNode: PropTypes.func.isRequired,
    deleteNode: PropTypes.func.isRequired
};
