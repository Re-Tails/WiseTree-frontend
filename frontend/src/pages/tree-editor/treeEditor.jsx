import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { select, hierarchy, tree, linkHorizontal, zoom, zoomTransform, easeLinear, scaleSequential, interpolateBlues, event } from 'd3';
import { getNodeById, treeFormatter, getNodeColorByEntityType, getNodeStrokeByEntityType, addBlurFilter, getNodeStrokeWidth } from './treeEditorHelper';
import { GET_TREE_BY_ID } from '../../services/graphQL/editorApiHelper';
import {
    renderNode,
    renderLabel,
    renderPath,
    renderDescription,
    renderDescriptionNode,
    removeDuplicateDOM,
    renderTactics,
    renderTacticsNode,
    renderMenu1,
    renderMenu2,
    renderMenu3,
    transformWhenZoom,
    expandLabelCoverTactics,
    hideDescriptionAndTacticsWhenZoom,
    hideEmptyDescriptionTactics
} from './d3Helper';
import useResizeObserver from './treeResizeObserver';
import { PreviewBar } from '../../components/preview-bar/previewBar';
import Menu from '../../components/editor-dropdown-menu/dropdownMenu';
import DeleteAlert from '../../components/delete-node-alert/deleteAlert';
import ErrorLayout from '../../components/error-layout/errorLayout';
import LoadingLayout from '../../components/loading-layout/loadingLayout';
import Tooltip from '../../components/legend-tooltip/tooltip';
import ZoomToast from '../../components/zoom-toast/zoomToast';
import SearchArea from '../../components/search-area/searchArea';
import TreeNavbar from '../../components/tree-nav-bar/tree-nav-bar';
import './treeEditor.scss';


// import WordCloud from 'wordcloud';
// import { ReactComponent as WordCloudIcon } from '../../assets/icons/icon-wordcloud.svg';
// import { ReactComponent as ShowTacticsIcon } from '../../assets/icons/icon-showtactics.svg';
import { empty } from 'apollo-link';
import { useUser, useUserAuth } from '../../services/AuthenticationContextProvider';
import { object } from 'prop-types';


// var hoverTip = select('body')
//     .append('div')
//     .attr('id', 'hoverTip')
//     .style('position', 'absolute')
//     .style('padding', '10px')
//     .style('background', 'white')
//     .style('opacity', '0')
//     .style('z-index', '1000')



// Poll for new data every five minutes
const DATA_POLL_INTERVAL = 5 * 60 * 1000;

// LAYOUT
const TREE_ITEM_HEIGHT = 95;
const TREE_ITEM_HEIGHT_COLLAPSED = 55;
const TREE_ITEM_WIDTH_SHOWTACTICS = 1050;
const TREE_ITEM_WIDTH_HIDETACTICS = 750;
const TREE_ITEM_WIDTH_COLLAPSED = 350;

const LAYOUT_PREVIEWPANE_WIDTH = 500;

const LAYOUT_SEARCHPANE_WIDTH = 500;
const LAYOUT_SEARCHPANE_HEIGHT = 90;

const LAYOUT_WORDCLOUD_WIDTH = 500;
const LAYOUT_WORDCLOUD_HEIGHT = 300;

const LAYOUT_MENU_OFFSET_WITHTACTIC = 40;
const LAYOUT_MENU_OFFSET_WITHOUTTACTIC = 340;

const LAYOUT_DROPDOWN_WIDTH = 100;
const LAYOUT_DROPDOWN_HEIGHT = 120;

const LAYOUT_DIALOG_WIDTH = 300;
const LAYOUT_DIALOG_HEIGHT = 125;

const LAYOUT_LINK_OFFSET_X = 160;
const LAYOUT_LINK_OFFSET_Y = 175;

const LAYOUT_HEADER_WIDTH = 120; 
const LAYOUT_HEADER_WIDTH_WITHOUTTACTIC = 300;
const LAYOUT_HEADER_WIDTH_WITHTACTIC = 600;
const LAYOUT_HEADER_HEIGHT = 40;
const LAYOUT_HEADER_OFFSET_X = 50;
const LAYOUT_HEADER_OFFSET_Y = 160;

const LAYOUT_TACTIC_WIDTH = 300;
const LAYOUT_TACTIC_HEIGHT = 50;
const LAYOUT_TACTIC_OFFSET_X = 350;
const LAYOUT_TACTIC_OFFSET_Y = 200;

const LAYOUT_DESCRIPTION_WIDTH = 300;
const LAYOUT_DESCRIPTION_HEIGHT = 50;
const LAYOUT_DESCRIPTION_OFFSET_X = 50;
const LAYOUT_DESCRIPTION_OFFSET_Y = 200;

const LAYOUT_HAMBURGER_WIDTH = 20;
const LAYOUT_HAMBURGER_HEIGHT = 2;
const LAYOUT_HAMBURGER_OFFSET_X_WITHTACTIC = 626;
const LAYOUT_HAMBURGER_OFFSET_X_WITHOUTTACTIC = 326;
const LAYOUT_HAMBURGER_1_OFFSET_Y = 164;
const LAYOUT_HAMBURGER_2_OFFSET_Y = 168;
const LAYOUT_HAMBURGER_3_OFFSET_Y = 172;

const SCROLL_X_DEFAULT = 100;
const SCROLL_Y_DEFAULT = 350;

const ZOOM_LEVEL_DEFAULT = 0.6;
const ZOOM_X_DEFAULT = 200;
const ZOOM_Y_DEFAULT = 400;
const ZOOM_LEVEL_COLLAPSED = 0.6;
const ZOOM_STEP = 0.1;

const NAVMODE_TOP = 'top';
const NAVMODE_CENTRE = 'centre';
const NAVMODE_CHILD = NAVMODE_CENTRE;

const WORDCLOUD_MINOCCURS = 5;
const WORDCLOUD_KEY_TERM_WEIGHTING = 20;

const wordCloudColourScale = scaleSequential().domain([1,100]).interpolator(interpolateBlues);
const wordCloudExcludedWords = ['and','then','the','are','not','with','use','may','for','how','our','they','have','which','when','can','into','what','undefined','all','that',"don't"];

const wordCloudWeightedTerms = ['speed','quality','delivery','customer','product','productivity','culture'];

// const wordCloudData = [];


// const wordCloudNodeIds = [];

var isInitialised = false;
// var currentViewMode = 'viewing';
// var currentPreviewNodeId;

function TreeEditor() {
    const wordCloudDataRef = useRef([]);
    const wordCloudNodeIds = useRef([]);

    const user = useUser();

    // console.log(user);
    const history = useHistory();

    useEffect(() => {
        if(!user) history.push("/login");
    }, [user]);

    const [wordCloudData, setWordCloudData] = useState([]);

    const treeId = history.location.pathname.substring(6);

    const { data, error, refetch } = useQuery(GET_TREE_BY_ID, {
        variables: {
            id: treeId,
        },
        pollInterval: DATA_POLL_INTERVAL,
    });

    const diagramOwner = data?.getTreeById[0].owner.name;

    const [isEditor, setIsEditor] = useState(() => false);

    useEffect(() => {
        setIsEditor(() => {
            const teams = data?.getTreeById[0].teams;
            if(!teams) return false;

            for(let i = 0; i < teams.length; i++){
                for(let j = 0; j < teams[i].users.length; j++){
                    if(teams[i].users[j].user._id === user.id){
                        if(teams[i].users[j].role !== 'viewer'){
                            return true;
                        } else break;
                    }
                }
            }

            return false;
        });
    }, [data]);

    const [searchCriteria, setCurrentSearchCriteria] = useState('');

    // Handle D3 Graph Generation & MouseControl Logic
    const [currentZoomState, setCurrentZoomState] = useState({
        k: ZOOM_LEVEL_DEFAULT,
        x: ZOOM_X_DEFAULT,
        y: ZOOM_Y_DEFAULT,
    });

    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);
    const zoomBehavior = zoom().scaleExtent([0.45, 1]).on('zoom', handleZoom, { passive: true });
    const refetchTree = async () => await refetch();

    const [toolTip, setToolTip] = useState({ show: false, x: 0, y: 0 });

    const [currentPreviewNodeId, setCurrentPreviewNodeId] = useState("");
    const [currentPreviewNode, setCurrentPreviewNode] = useState({});

    const [togglePreview, setTogglePreview] = useState(() => false);
    const handleTogglePreview = () => {
        if(!currentPreviewNode.treeId){
            setCurrentPreviewNode(() => data?.getTreeById[0]);
        }
        setTogglePreview(current => !current);
    };

    function updateFormData(name, value){
        setCurrentPreviewNode(formData => ({
            ...formData,
            [name]: value,
        }));
    }

    function setFormData(nodeData){
        setCurrentPreviewNode(() => nodeData);
    }

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isPreviewBarOpen, setIsPreviewBarOpen] = useState(true);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isWordCloudOpen, setIsWordCloudOpen] = useState(false);

    // viewMode determines which preview-bar layout is displayed
    const [viewMode, updateViewMode] = useState('viewing');

    function changeViewMode(viewmode){
        updateViewMode(() => viewmode);
    }

    // Prop for preview bar
    function toggleViewingMode(){
        updateViewMode((current) => current === "viewing" ? "editing" : "viewing");
    }

    const [formattedTree, setFormattedTree] = useState('');
    const [showTactics, setShowTactics] = useState(true);

    const toggleIsWordCloudOpen = useCallback(() => { 
        setIsWordCloudOpen(!isWordCloudOpen);

        if (isWordCloudOpen) {
            select('body').selectAll('.previewBar').attr("class", "previewBar previewBarWordCloudHidden");
        }
        else {
            select('body').selectAll('.previewBar').attr("class", "previewBar");
        }
    }, [isWordCloudOpen]);

    const toggleShowTactics = useCallback(() => { setShowTactics(!showTactics); }, [showTactics]);
    const toggleIsDialogOpen = useCallback(() => { if (!isPreviewBarOpen) setIsDialogOpen(!isDialogOpen); }, [isDialogOpen, isPreviewBarOpen]);
    const toggleIsPreviewBarOpen = useCallback(() => { setIsPreviewBarOpen(!isPreviewBarOpen); setIsDialogOpen(false); }, [isPreviewBarOpen]);
    const toggleDeleteDialog = useCallback(() => setIsDeleteDialogOpen(!isDeleteDialogOpen), [isDeleteDialogOpen]);
    const resetPreviewBarAndDialogOpen = useCallback(() => 
    { 
        setIsPreviewBarOpen(true); 
        setIsDialogOpen(false); 
        updateViewMode('viewing'); 
        // currentViewMode = 'viewing'; 
        setIsWordCloudOpen(false);
    }, []);

    const [isWordCloudInitialised, setIsWordCloudInitialised] = useState(false);
    const maxWordCloudCount = useRef(0);
    
    function handleKeyDown(key)
    {
        let keyArr = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
        if(!keyArr.includes(key)) return;
        
        var searchBox = document.getElementById('searchBox');

        if (document.activeElement === searchBox || viewMode !== 'viewing') {
            return;
        }

        triggerHoverOut();

        // var originNode = getNodeByIdForCurrentTree(currentPreviewNodeId);
        let originNode = currentPreviewNode;
        
        if (key === "ArrowLeft" && originNode.parentId) {
                setCurrentNodeById(originNode.parentId);
        }

        else if (key === "ArrowRight" && originNode?.children && originNode?.children?.length > 0) {
            var numChildren = originNode.children.length;
            var targetChild = numChildren === 1 ? 0 : Math.round(numChildren / 2) - 1;

            if (NAVMODE_CHILD === NAVMODE_TOP)
            {
                targetChild = 0;
            }

            setCurrentNodeById(originNode.childrenIds[targetChild]);
        }
        else if (key === "ArrowUp" || key === "ArrowDown") {
            if (originNode.parentId) {
                var parent = getNodeByIdForCurrentTree(originNode.parentId);
                var nodeSiblingIndex = parent.childrenIds.indexOf(originNode.id);
                var targetSiblingIndex = nodeSiblingIndex;
                
                if (key === "ArrowUp") {
                    targetSiblingIndex--;

                    if (targetSiblingIndex < 0) {
                        targetSiblingIndex = 0;
                    }
                }
                else {
                    targetSiblingIndex++;
                    
                    if (targetSiblingIndex > (parent.childrenIds.length - 1)) {
                        targetSiblingIndex = parent.childrenIds.length - 1;
                    }
                }
                setCurrentNodeById(parent.childrenIds[targetSiblingIndex]);
            }
        }

        // Scroll
        ensureCurrenNodeOnScreen();
    }

    function ensureCurrenNodeOnScreen() {
        var nodeHeight = (currentZoomState.k < ZOOM_LEVEL_COLLAPSED) ? TREE_ITEM_HEIGHT_COLLAPSED : TREE_ITEM_HEIGHT;
        
        var element = document.getElementById(currentPreviewNodeId);

        if (!element)
        {
            return;
        }

        var elementBbox = element.getBoundingClientRect();

        var nodeBottom = elementBbox.y + nodeHeight;

        if (elementBbox.y < 0) {
            scroll(0, Math.abs(elementBbox.y / 2 - nodeHeight));
        }
        else if (nodeBottom > window.innerHeight) {
            scroll(0, -(nodeBottom - window.innerHeight));
        }

        var nodeLeft = elementBbox.x - LAYOUT_PREVIEWPANE_WIDTH;
        var nodeRight = elementBbox.x + elementBbox.width;
        var scrollX = nodeRight - window.innerWidth;

        if (nodeLeft < 0) {
            scroll(-nodeLeft, 0);
        }
        else if (nodeRight > window.innerWidth) {
            scroll(-scrollX, 0);
        }
    }

    function getNodeByIdForCurrentTree(nodeId) {
        return getNodeById(nodeId, data.getTreeById)
    }

    function addWordCloudData(node) {

        // Handles information from editNode.layout.jsx as it is not in "Node" form prior to this
        // if(!node?.data){
        //     node = { data: node, newData: true };
        // }

        if (currentPreviewNode === null) {
            setCurrentPreviewNode(getNodeById(node.data.id, data.getTreeById));
        }

        if (wordCloudNodeIds.current.find(n => n === node.data.id)) {
            setIsWordCloudInitialised(true);
            return 0;
        }

        // console.count("node")

        // if(!node?.newData) wordCloudNodeIds.current.push(node.data.id);
        wordCloudNodeIds.current.push(node.data.id)

        var sentence = (node.data.description + ' ' + 
                        node.data.tactic + ' ' + 
                        node.data.necessity + ' ' + 
                        node.data.logic + ' ' + 
                        node.data.if + ' ' + 
                        node.data.and + ' ' + 
                        node.data.then + ' ' + 
                        node.data.because + ' ' + 
                        node.data.sufficiency + ' ' + 
                        node.data.optionalityAndSequence).toLowerCase();

        var words = getWords(sentence);

        words.forEach(word => {
            if (word !== null && word[0] !== null && word[0].length > 2 && wordCloudExcludedWords.find(e => e === word[0]) === undefined) {
                var dataElement = wordCloudDataRef.current.find(e => e[0] === word[0]);

                if (dataElement === undefined) {
                    dataElement = word;

                    wordCloudDataRef.current.push(dataElement);
                }
                dataElement[1] = dataElement[1] + 1;

                if (dataElement[1] > maxWordCloudCount.current) {
                    maxWordCloudCount.current = dataElement[1];
                }
            }
        });


        setWordCloudData(() => {
            return JSON.parse(JSON.stringify(wordCloudDataRef.current));
        });


        return wordCloudDataRef.current.length;
    }

    async function updateWordCloudData(){
        
        let newData = await refetchTree();

        wordCloudDataRef.current = [];
        wordCloudNodeIds.current = [];
        maxWordCloudCount.current = 0;

        newData.data.getTreeById.forEach(node => {
            addWordCloudData({ data: node });
        });
    }


    function getWords(sentence) {
      return sentence
             .replace(/[!\.,:;()\?]/g, '')
             .split(' ')
             .map(function(d) { return [d, wordCloudWeightedTerms.find(t => t === d) ? WORDCLOUD_KEY_TERM_WEIGHTING : 0 ] });
    }
    
    function handleZoom() {
        const zoomState = zoomTransform(svgRef.current);
        setCurrentZoomState(zoomState);
        setIsDialogOpen(false);
    } 

    function handleZoomIn() {
        var zoomState = zoomTransform(svgRef.current);
        zoomState.k += ZOOM_STEP;
        setCurrentZoomState(zoomState);
        transformWhenZoom(select(svgRef.current), currentZoomState);
        
        if (currentZoomState.k < ZOOM_LEVEL_COLLAPSED) {
            hideDescriptionAndTacticsWhenZoom(select(svgRef.current));
            refetchTree();
        }
    }

    function handleZoomOut() {
        var zoomState = zoomTransform(svgRef.current);
        zoomState.k -= ZOOM_STEP;
        setCurrentZoomState(zoomState);
        transformWhenZoom(select(svgRef.current), currentZoomState);
        
        if (currentZoomState.k < ZOOM_LEVEL_COLLAPSED) {
            hideDescriptionAndTacticsWhenZoom(select(svgRef.current));
            refetchTree();
        }
    }

    // This is where the bug is happening
    function scroll(scrollX, scrollY) {
        var zoomState = zoomTransform(svgRef.current);
        zoomState.x += scrollX;
        zoomState.y += scrollY;
        setCurrentZoomState(zoomState);
        setIsDialogOpen(false);
    }

    function setDefaultZoom() {
        currentZoomState.k = ZOOM_LEVEL_DEFAULT;
        currentZoomState.x = ZOOM_X_DEFAULT;
        currentZoomState.y = ZOOM_Y_DEFAULT;
    }

    function setPreviewMode(view) {
        updateViewMode(view);
        // currentViewMode = view;
    }

    function updateCurrentNode(node) {
        setCurrentPreviewNode(node);
    }

    function setCurrentNodeByIdAndScroll(id) {
        setIsDeleteDialogOpen(false);
        setCurrentNodeById(id);
        ensureCurrenNodeOnScreen();
    }

    function setCurrentNodeById(id) {
        var node = getNodeById(id, data.getTreeById);
        setCurrentPreviewNode(() => node);
        setCurrentPreviewNodeId(() => id);
    }

    function triggerHoverOut() { 
        // hoverTip.transition().duration('500').ease(easeLinear).style('opacity', 0) 
    }
    

    function triggerHoverOver(node) {
        /*
        if (!node || isDialogOpen || viewMode !== 'viewing')
        {
            triggerHoverOut();
        }
        else
        { 
            buildHoverContent(isSearchResult, node);
        }
        */
    }
    
    function buildHoverContent(isSearchResult, node) {
    
        if (!event) event = window.event;

        var nodeData = node.data;
        if (!nodeData) nodeData = node;

        var colorSearchResult = getNodeColorByEntityType(isSelected(node), isSearchResult(node), nodeData.entityType);
        var color = getNodeColorByEntityType(false, false, nodeData.entityType);
    
        // hoverTip.selectAll('*').remove();
    
        // hoverTip
        //     .style('left', (event.pageX + 35) + 'px')
        //     .style('top', (event.pageY) + 'px')
        //     .style('min-width', '200px')
        //     .style('max-width', '500px')
        //     .style('box-shadow', '0 4px 8px 0 ' + colorSearchResult + ', 0 4px 20px 0 ' + colorSearchResult);
    
        buildHoverHeading(node);
        buildHoverNecessityLogic(node, color);
        buildHoverIfAndThenBecause(node, color);
        buildHoverSufficiencyOptionalityAndSequence(node, color);
    
        // var bbox = document.getElementById('hoverTip').getBoundingClientRect();

        // if (bbox.bottom > window.innerHeight)
        // {
        //     var offscreenOffset = bbox.bottom - window.innerHeight + 20;
        //     hoverTip.style('top', (event.pageY - offscreenOffset) + 'px')
        // }

        // if (bbox.right > window.innerWidth)
        // {
        //     var offscreenOffset = bbox.right - window.innerWidth + bbox.width;
        //     hoverTip.style('left', (event.pageX - offscreenOffset) + 'px')
        // }
        // hoverTip.transition().duration('500').ease(easeLinear).style('opacity', '1');
    }
    
    function buildHoverSufficiencyOptionalityAndSequence(node, color) {
        // var nodeData = node.data;
        // if (!nodeData) nodeData = node;

        // if (nodeData.sufficiency || nodeData.optionalityAndSequence) {
        //     var sufoptdiv = hoverTip.append('div').attr('class', 'previewBar-horizontalContainer').style('border', '1px solid ' + color);
    
        //     if (nodeData.sufficiency) {
        //         var sufdiv = sufoptdiv.append('div').attr('class', 'previewBar-horizontalContainer-column').style('border', '1px solid ' + color);
        //         sufdiv.append('h4').attr('class', 'previewBar-label').text('Sufficiency');
        //         sufdiv.append('p').attr('class', 'previewBar-content').text(nodeData.sufficiency);
        //     }
    
        //     if (nodeData.optionalityAndSequence) {
        //         var optdiv = sufoptdiv.append('div').attr('class', 'previewBar-horizontalContainer-column').style('border', '1px solid ' + color);
        //         optdiv.append('h4').attr('class', 'previewBar-label').text('Optionality & Sequence');
        //         optdiv.append('p').attr('class', 'previewBar-content').text(nodeData.optionalityAndSequence);
        //     }
        // }
    }
    
    function buildHoverIfAndThenBecause(node, color) {
        // var nodeData = node.data;
        // if (!nodeData) nodeData = node;

        // if (nodeData.if || nodeData.and || nodeData.then || nodeData.because) {
        //     var horzdiv = hoverTip.append('div').attr('class', 'previewBar-horizontalContainer2').style('border', '2px solid ' + color);
        //     var vertdiv = horzdiv.append('div').attr('class', 'previewBar-verticalContainer');
    
        //     if (nodeData.if) {
        //         var ifdiv = vertdiv.append('div').attr('class', 'previewBar-inputGroup').style('padding', '4px');
        //         ifdiv.append('h4').attr('class', 'previewBar-label').text('If');
        //         ifdiv.append('p').attr('class', 'previewBar-content').text(nodeData.if);
        //     }
    
        //     if (nodeData.and) {
        //         var anddiv = vertdiv.append('div').attr('class', 'previewBar-inputGroup').style('padding', '4px');
        //         anddiv.append('h4').attr('class', 'previewBar-label').text('and');
        //         anddiv.append('p').attr('class', 'previewBar-content').text(nodeData.and);
        //     }
    
        //     if (nodeData.then) {
        //         var thendiv = vertdiv.append('div').attr('class', 'previewBar-inputGroup').style('padding', '4px');
        //         thendiv.append('h4').attr('class', 'previewBar-label').text('then');
        //         thendiv.append('p').attr('class', 'previewBar-content').text(nodeData.then);
        //     }
    
        //     if (nodeData.because) {
        //         var becdiv = vertdiv.append('div').attr('class', 'previewBar-inputGroup').style('padding', '4px');
        //         becdiv.append('h4').attr('class', 'previewBar-label').text('because');
        //         becdiv.append('p').attr('class', 'previewBar-content').text(nodeData.because);
        //     }
        // }
    }
    
    function buildHoverNecessityLogic(node, color) {
        // var nodeData = node.data;
        // if (!nodeData) nodeData = node;

        // if (nodeData.necessity || nodeData.logic) {
        //     var neclogdiv = hoverTip.append('div').attr('class', 'previewBar-horizontalContainer').style('border', '1px solid ' + color);
    
        //     if (nodeData.necessity) {
        //         var necdiv = neclogdiv.append('div').attr('class', 'previewBar-horizontalContainer-column').style('border', '1px solid ' + color);
        //         necdiv.append('h4').attr('class', 'previewBar-label').text('Necessity');
        //         necdiv.append('p').attr('class', 'previewBar-content').text(nodeData.necessity);
        //     }
    
        //     if (nodeData.logic) {
        //         var logdiv = neclogdiv.append('div').attr('class', 'previewBar-horizontalContainer-column').style('border', '1px solid ' + color);
        //         logdiv.append('h4').attr('class', 'previewBar-label').text('Logic');
        //         logdiv.append('p').attr('class', 'previewBar-content').text(nodeData.logic);
        //     }
        // }
    }
    
    function buildHoverHeading(node) {
        // var nodeData = node.data;
        // if (!nodeData) nodeData = node;

        // var titlecontdiv = hoverTip.append('div').attr('class', 'previewBar-verticalContainer');
        // var titlediv = titlecontdiv.append('div').attr('class', 'previewBar-verticalContainer-rowTopRadius ' + (nodeData.entityType ? nodeData.entityType : 'tree'));
        // titlediv.append('p').attr('class', 'previewBar-title').text((nodeData.referenceId === null ? '' : nodeData.referenceId + ' ') + nodeData.name);
    
        // var descriptiondiv = titlecontdiv.append('div').attr('class', nodeData.tactic ? 'previewBar-verticalContainer-rowMiddleRadius' : 'previewBar-verticalContainer-rowBottomRadius');
        // descriptiondiv.append('p').attr('class', 'previewBar-description').text(nodeData.description);
    
        // if (nodeData.tactic) {
        //     var tacticdiv = titlecontdiv.append('div').attr('class', 'previewBar-verticalContainer-rowBottomRadius');
        //     tacticdiv.append('p').attr('class', 'previewBar-content').text(nodeData.tactic);
        // }
    }
    
    function closeForm() {
        setCurrentNodeById(currentPreviewNodeId);
    }

    function search() {
        var searchBox = document.getElementById('searchBox');
        

        if (searchBox !== null) {
            var newSearchCriteria = (searchBox.value + '').toLowerCase();

            if ((newSearchCriteria === '' || newSearchCriteria.length <= 2) && searchCriteria !== '') {
                setCurrentSearchCriteria('');
                refetchTree();
            }
            else if (newSearchCriteria !== '' && newSearchCriteria.length > 2 && newSearchCriteria !== searchCriteria) {
                setCurrentSearchCriteria(newSearchCriteria);
                // setDefaultZoom();
                refetchTree();
            }
        }
    }

    function resetSearch() {
        var searchBox = document.getElementById('searchBox');
        

        if (searchBox !== null) {
            searchBox.value = searchCriteria;
        }
    }

    function emptySearch(){
        let searchBox = document.getElementById("searchBox");
        if(searchBox){
            searchBox.value = "";
        }
    }

    useEffect(() => { function toggleToolTip(x, y) { setToolTip({ show: isDialogOpen, x: x, y: y }); }

    function triggerMenu(node) {        
        triggerHoverOut();

        if (!isDeleteDialogOpen && viewMode === 'viewing') {
            setCurrentNodeById(node.data.id);
            setIsDialogOpen(true);
            var bbox = document.getElementById(node.data.id).getBoundingClientRect();
            toggleToolTip(bbox.x - (node.data.tactic ? LAYOUT_MENU_OFFSET_WITHTACTIC : LAYOUT_MENU_OFFSET_WITHOUTTACTIC), bbox.y, true);
        }
    }

    if (data) {
        if (!dimensions) return;

        setFormattedTree(treeFormatter(data.getTreeById));
        const svg = select(svgRef.current);
        const root = hierarchy(formattedTree);

        root.x = currentZoomState.x;
        root.y = currentZoomState.y;

        var h = TREE_ITEM_HEIGHT;
        var w = (showTactics ? TREE_ITEM_WIDTH_SHOWTACTICS : TREE_ITEM_WIDTH_HIDETACTICS);

        if (currentZoomState.k < ZOOM_LEVEL_COLLAPSED) {
            h = TREE_ITEM_HEIGHT_COLLAPSED;
            w = TREE_ITEM_WIDTH_COLLAPSED;
        }

        const treeLayout = tree()
            .nodeSize([h, w])
            .separation(function (a, b) {
                return a.parent === b.parent ? 1 : 1.25;
            });
        
        treeLayout(root);
        addBlurFilter(svg);

        // Link
        if (currentZoomState) {
            const linkGenerator = linkHorizontal()
                .x(node => node.y + currentZoomState.x + LAYOUT_LINK_OFFSET_X)
                .y(node => node.x + currentZoomState.y + LAYOUT_LINK_OFFSET_Y); 

            renderPath(svg, root, linkGenerator, currentZoomState.k);

            createNodeHeader(svg, root, isSelected, isSearchResult, triggerHoverOver, triggerHoverOut);
            createNodeDescription(svg, root, isSelected, isSearchResult);
            createNodeTactic(svg, root, isSelected, isSearchResult);

            // Render the hamburger menu if it is in draft mode
            // if (status === 'draft') {
            //     createHamburgerMenu(svg, root, triggerMenu);
            // }

            if (currentZoomState.k < ZOOM_LEVEL_COLLAPSED) {
                hideDescriptionAndTacticsWhenZoom(svg);
            }
            else {
                svg.selectAll('.labelText').style('padding','7px').style('font-size','11px');
            }

            svg.selectAll('.dropdownHolder').raise();
            svg.selectAll('.deleteDialogHolder').raise();
            svg.selectAll('.search-area__wordCloud').raise();
            svg.selectAll('form').raise();
            svg.selectAll('.previewBar').raise();

            if (!isWordCloudInitialised) {
                // EDITED OUT FOR TESTING OF CHILD COMPONENT

                // WordCloud(document.getElementById('wordCloudHolder'), 
                // {
                //     list: wordCloudData.filter(word => word[1] >= WORDCLOUD_MINOCCURS), 
                //     color: function (word, weight) {
                //         var percentageOfMax = Math.round(weight / maxWordCloudCount * 100);
                //         return wordCloudColourScale(percentageOfMax);
                //     }, 
                //     shuffle: false,
                //     weightFactor: 2,
                //     minSize: 6,
                //     fontWeight: 'bold',
                //     wait: 25,
                //     hover: function(item) { 
                //         var searchBox = document.getElementById('searchBox');

                //         if (searchBox !== null && item !== undefined) {
                //             searchBox.value = item[0];
                //         }},
                //     click: function(item) { 
                //         var searchBox = document.getElementById('searchBox');

                //         if (searchBox !== null && item !== undefined) {
                //             searchBox.value = item[0];
                //         }

                //         setDefaultZoom();
                //         refetchTree();
                //         search();
                //     }
                // });
            }

            if (!isInitialised) {
                setCurrentNodeById(treeId);
                window.addEventListener('keydown', function(event) {handleKeyDown(event.key)});
                handleZoomOut();
                handleZoomOut();
                handleZoomOut();
                handleZoomOut();
                handleZoomOut();
                scroll(SCROLL_X_DEFAULT, SCROLL_Y_DEFAULT);
            }
        
            isInitialised = true;
        }

        removeDuplicateDOM();
        expandLabelCoverTactics('descriptionText', 'node', LAYOUT_HEADER_WIDTH_WITHOUTTACTIC);
        expandLabelCoverTactics('descriptionText', 'label', LAYOUT_HEADER_WIDTH_WITHOUTTACTIC);
        expandLabelCoverTactics('tacticsText', 'node', LAYOUT_HEADER_WIDTH_WITHTACTIC);
        expandLabelCoverTactics('tacticsText', 'label', LAYOUT_HEADER_WIDTH_WITHTACTIC);
        hideEmptyDescriptionTactics();

        svg.selectAll('.node').transition().duration('2000').ease(easeLinear).style('opacity', '1')
        svg.selectAll('.link').transition().delay('1000').duration('1000').ease(easeLinear).style('opacity', '1')
        svg.call(zoomBehavior);
        svg.on("dblclick.zoom", null);
        svg.on("click.zoom", null);
        transformWhenZoom(svg, currentZoomState);
    }}, [
        currentZoomState,
        dimensions,
        zoomBehavior,
        currentPreviewNode,
        toggleIsDialogOpen,
        toggleIsWordCloudOpen,
        formattedTree,
        isDeleteDialogOpen,
        data,
        isDialogOpen,
    ]);

    if (data) {
        return createHTML();
    } else if (error) {
        return (
            <div ref={wrapperRef}>
                <ErrorLayout isStandAlonePage={true} />
            </div>
        );
    } else {
        return (
            <div ref={wrapperRef}>
                <LoadingLayout isStandAlonePage={true} />
            </div>
        );
    }

    function createHTML() {
        return <div ref={wrapperRef} className='treeEditor'>

            {/* { !user && <Redirect to="/login" /> } */}

            <TreeNavbar name={ formattedTree.name } owner={diagramOwner } />
            <Tooltip />
            <ZoomToast 
                handleZoomIn={handleZoomIn}
                handleZoomOut={handleZoomOut}
            />

            <div className="treeEditor__content-wrapper">
                {/* { currentPreviewNode.id ? ( */}
                    {/* // PreviewBar handled here, this is where most of our work for sprint 1 will take place most likely  */}
                    <PreviewBar
                        rootNodeId={formattedTree.id}
                        nodeData={currentPreviewNode}

                        // These two were changed to alter the treeEditor "currentPreviewNode" state
                        // rather than instantiating new state in the children nodes
                        updateFormData={updateFormData}
                        setFormData={setFormData}

                        // Manages adding children and deleting nodes
                        deleteNode={deleteNodeOnClick}
                        addNode={addNodeOnClick}

                        // Toggle preview bar
                        togglePreview={togglePreview}
                        handleTogglePreview={handleTogglePreview}

                        toggleViewingMode={toggleViewingMode}
                        refreshView={refetchTree}
                        handleNodeAttributesUpdate={updateCurrentNode}
                        closeForm={closeForm}
                        chooseMode={viewMode}
                        changeViewMode={changeViewMode}
                        closePreview={resetPreviewBarAndDialogOpen}
                        getNodeById={getNodeByIdForCurrentTree}
                        setCurrentNodeById={setCurrentNodeByIdAndScroll}
                        triggerHoverOver={triggerHoverOver}
                        triggerHoverOut={triggerHoverOut}
                        
                        // These props handle the SearchArea when in 'viewing' mode
                        // If there is no SearchArea, there are issues in the code for some reason
                        search={search}
                        viewMode={viewMode}
                        LAYOUT_SEARCHPANE_WIDTH={LAYOUT_SEARCHPANE_WIDTH}
                        LAYOUT_SEARCHPANE_HEIGHT={LAYOUT_SEARCHPANE_HEIGHT}
                        LAYOUT_WORDCLOUD_WIDTH={LAYOUT_WORDCLOUD_WIDTH}
                        LAYOUT_WORDCLOUD_HEIGHT={LAYOUT_WORDCLOUD_HEIGHT}
                        isWordCloudOpen={isWordCloudOpen}
                        toggleIsWordCloudOpen={toggleIsWordCloudOpen}
                        toggleShowTactics={toggleShowTactics}
                        showTactics={showTactics}
                        resetSearch={resetSearch}
                        //MORE
                        maxWordCloudCount={maxWordCloudCount.current}
                        WORDCLOUD_MINOCCURS={WORDCLOUD_MINOCCURS}
                        wordCloudData={wordCloudData}
                        setDefaultZoom={setDefaultZoom}
                        refetchTree={refetchTree}
                        wordCloudColourScale={wordCloudColourScale}

                        // Fix word cloud state on delete, add, and change of node data
                        updateWordCloudData={updateWordCloudData}
                        />
                        
                {/* ) : null} */}


                {/* THIS IS THE WORDCLOUD - DO NOT UNCOMMENT UNLESS ASKED: Viweing purposes only */}


                {/* <form className="legendCluster">
                    <input type="search" 
                        placeholder="Search..." 
                        id='searchBox' 
                        onChange={search} 
                        title='Enter a search term to highlight the matching elements in the tree'
                        style={{ visibility: viewMode === 'viewing' ? 'visible' : 'hidden' }}></input>
                </form>

                
                <svg width={LAYOUT_SEARCHPANE_WIDTH} height={LAYOUT_SEARCHPANE_HEIGHT} className="legendCluster"> */}



                    {/* This is where the legend is currently rendered */}
                    {/* <foreignObject
                        x='8'
                        y='3'
                        height='50'
                        width='80'>
                        <button className='entityTypeButton tree' title={'Strategy and Tactics Trees (STTs) provide insight into how and why we do things the way we do. They are intended to be living diagrams that will be added to and modified continuously.\n\n- Drag the diagram to move around\n- Zoom in and out using your mouse wheel\n- Use your arrow keys to navigate between elements\n- Hover over an element to see its description\n- Click on an element to find out more about it'}>Tree</button>
                    </foreignObject>
                    <foreignObject
                        x='91'
                        y='3'
                        height='50'
                        width='80'>
                        <button className='entityTypeButton horizon' title='Horizons are periods of time, usually 3 to 5 years, during which the associated levers, injections and strategies are in effect'>Horizon</button>
                    </foreignObject>
                    <foreignObject
                        x='174'
                        y='3'
                        height='50'
                        width='80'>
                        <button className='entityTypeButton lever' title="These are our levers of growth. In the words of Archimedes - 'Give me a lever long enough and a fulcrum on which to place it, and I shall move the world.'">Lever</button>
                    </foreignObject>
                    <foreignObject
                        x='257'
                        y='3'
                        height='50'
                        width='80'>
                        <button className='entityTypeButton injection' title='Injections are new ideas or solutions that will bring about a set of desired effects'>Injection</button>
                    </foreignObject>
                    <foreignObject
                        x='340'
                        y='3'
                        height='50'
                        width='80'>
                        <button className='entityTypeButton strategy' title='A strategy is a plan of action designed to achieve a long-term or overall aim'>Strategy</button>
                    </foreignObject>
                    <foreignObject
                        x='423'
                        y='3'
                        height='50'
                        width='80'>
                        <button className='entityTypeButtonTactic tactic' title='Tactics are the specific actions or steps you undertake to accomplish your strategy'>Tactic</button>
                    </foreignObject> */}



                    {/* <foreignObject
                        x='440'
                        y='40'
                        height={LAYOUT_SEARCHPANE_HEIGHT}
                        width='50'>
                            <button onClick={toggleIsWordCloudOpen} 
                                    title={isWordCloudOpen ? 'Click here to hide the word cloud' : 'Click here to show the word cloud, which allows you to search the tree using the most common terms'}
                                    style={{ visibility: viewMode === 'viewing' ? 'visible' : 'hidden' }}>
                                <WordCloudIcon fill={ isWordCloudOpen ? '#51a7ff' : 'gray'}></WordCloudIcon>
                            </button>
                    </foreignObject>
                    <foreignObject
                        x='475'
                        y='43'
                        height={LAYOUT_SEARCHPANE_HEIGHT}
                        width='50'>
                            <button onClick={toggleShowTactics} 
                                    title={showTactics ? 'Click here to hide tactics for each element of the tree when zoomed in' : 'Click here to show tactics for each element of the tree when zoomed in'}
                                    style={{ visibility: viewMode === 'viewing' ? 'visible' : 'hidden' }}>
                                <ShowTacticsIcon fill={ showTactics ? '#51a7ff' : 'gray'}></ShowTacticsIcon>
                            </button>
                    </foreignObject>
                </svg>

                <canvas 
                    id='wordCloudHolder'
                    className='treeEditor-wordCloud' 
                    height={LAYOUT_WORDCLOUD_HEIGHT}
                    width={LAYOUT_WORDCLOUD_WIDTH}
                    onMouseOut={resetSearch}
                    style={{ visibility: isWordCloudOpen ? 'visible' : 'hidden' }}
                /> */}

                {/* THIS IS THE WORDCLOUD - DO NOT UNCOMMENT UNLESS ASKED */}
                <svg ref={svgRef} className='treeEditor-canvas'>
                    {/* Hamburger menu handled here */}
                    {/* <foreignObject
                        width={LAYOUT_DROPDOWN_WIDTH}
                        height={LAYOUT_DROPDOWN_HEIGHT}
                        x={toolTip.x}
                        y={toolTip.y}
                        className='dropdownHolder'
                        style={{ visibility: isDialogOpen ? 'visible' : 'hidden' }}
                    >
                        <Menu
                            togglePreviewBar={toggleIsPreviewBarOpen}
                            closeForm={toggleIsDialogOpen}
                            togglePreviewMode={setPreviewMode}
                            toggleDeleteDialog={toggleDeleteDialog} />
                    </foreignObject> */}
                    {/* <foreignObject
                        width={LAYOUT_DIALOG_WIDTH}
                        height={LAYOUT_DIALOG_HEIGHT}
                        className='deleteDialogHolder'
                        x={toolTip.x}
                        y={toolTip.y}
                        transform={`translate(${currentZoomState.x}, ${currentZoomState.y})scale(${currentZoomState.k})`}
                        style={{ visibility: isDeleteDialogOpen ? 'visible' : 'hidden' }}
                    >
                    </foreignObject> */}
                </svg>



                { isDeleteDialogOpen && <DeleteAlert
                    nodeData={currentPreviewNode}
                    setFormData={setFormData}
                    getNodeByIdForCurrentTree={getNodeByIdForCurrentTree}
                    toggleDeleteDialog={toggleDeleteDialog}
                    refreshView={refetch}
                    setCurrentNodeById={setCurrentNodeByIdAndScroll} 
                    updateWordCloudData={updateWordCloudData}/> }
            </div>
        </div>;
    }

    // Manages when the Add Child function occurs on nodes
    function addNodeOnClick(){
        toggleIsPreviewBarOpen();
        toggleIsDialogOpen();
        setPreviewMode("creating");
    }

    // Manages when the Delete function occurs on nodes
    function deleteNodeOnClick(){
        toggleIsDialogOpen();
        toggleDeleteDialog();
    }

    function createNodeTactic(svg, root, isSelected, isSearchResult) {
        renderTacticsNode(
            svg,
            root,
            node => node.y + currentZoomState.x + LAYOUT_TACTIC_OFFSET_X,
            node => node.x + currentZoomState.y + LAYOUT_TACTIC_OFFSET_Y,
            LAYOUT_TACTIC_WIDTH,
            LAYOUT_TACTIC_HEIGHT,
            currentZoomState.k,
            node => getNodeStrokeByEntityType(node.data.entityType),
            node => getNodeStrokeWidth(isSelected(node), isSearchResult(node)),
            node => node.data.tactic)
            .on('click', node => { 
                setCurrentNodeById(node.data.id); 
                setCurrentSearchCriteria(() => "");
                updateViewMode(isEditor ? "editing" : "viewing");
                setCurrentPreviewNode(node.data);
                setTogglePreview(() => true);
                // console.log(`${node.data.id} was clicked`);
            });

        renderTactics(
            svg,
            root,
            node => node.y + currentZoomState.x + LAYOUT_TACTIC_OFFSET_X,
            node => node.x + currentZoomState.y + LAYOUT_TACTIC_OFFSET_Y,
            LAYOUT_TACTIC_WIDTH,
            LAYOUT_TACTIC_HEIGHT,
            currentZoomState.k,
            node => getNodeStrokeByEntityType(node.data.entityType),
            node => getNodeStrokeWidth(isSelected(node), isSearchResult(node)),
            node => (showTactics ? node.data.tactic : ''))
            .on('click', node => { 
                setCurrentNodeById(node.data.id); 
                setCurrentSearchCriteria(() => "");
                updateViewMode(isEditor ? "editing" : "viewing");
                setCurrentPreviewNode(node.data);
                setTogglePreview(() => true);
                // console.log(`${node.data.id} was clicked`);
            });
    }

    function createNodeDescription(svg, root, isSelected, isSearchResult) {
        renderDescriptionNode(
            svg,
            root,
            node => node.y + currentZoomState.x + LAYOUT_DESCRIPTION_OFFSET_X,
            node => node.x + currentZoomState.y + LAYOUT_DESCRIPTION_OFFSET_Y,
            LAYOUT_DESCRIPTION_WIDTH,
            LAYOUT_DESCRIPTION_HEIGHT,
            node => getNodeStrokeByEntityType(node.data.entityType),
            node => getNodeStrokeWidth(isSelected(node), isSearchResult(node)),
            currentZoomState.k)
            .on('click', node => { 
                setCurrentNodeById(node.data.id); 
                setCurrentSearchCriteria(() => "");
                updateViewMode(isEditor ? "editing" : "viewing");
                setCurrentPreviewNode(node.data);
                setTogglePreview(() => true);
                // console.log(`${node.data.id} was clicked`);
            });

        renderDescription(
            svg,
            root,
            node => node.y + currentZoomState.x + LAYOUT_DESCRIPTION_OFFSET_X,
            node => node.x + currentZoomState.y + LAYOUT_DESCRIPTION_OFFSET_Y,
            LAYOUT_DESCRIPTION_WIDTH,
            LAYOUT_DESCRIPTION_HEIGHT,
            currentZoomState.k,
            node => getNodeStrokeByEntityType(node.data.entityType),
            node => getNodeStrokeWidth(isSelected(node), isSearchResult(node)),
            node => node.data.description ? node.data.description : ' ')
            .on('click', node => { 
                setCurrentNodeById(node.data.id); 
                setCurrentSearchCriteria(() => "");
                updateViewMode(isEditor ? "editing" : "viewing");
                setCurrentPreviewNode(node.data);
                setTogglePreview(() => true);
                // console.log(`${node.data.id} was clicked`);
            });
    }

    // This is where each node is rendered, this is where we can change the onclick functionality
    function createNodeHeader(svg, root, isSelected, isSearchResult, triggerHoverOver, triggerHoverOut) {
        renderNode(
            svg,
            root,
            node => node.data.id,
            node => node.y + currentZoomState.x + LAYOUT_HEADER_OFFSET_X,
            node => node.x + currentZoomState.y + LAYOUT_HEADER_OFFSET_Y,
            LAYOUT_HEADER_WIDTH,
            LAYOUT_HEADER_HEIGHT,
            node => getNodeColorByEntityType(isSelected(node), isSearchResult(node), node.data.entityType),
            node => getNodeStrokeByEntityType(node.data.entityType, isSelected(node), isSearchResult(node)),
            node => getNodeStrokeWidth(isSelected(node), isSearchResult(node)),
            currentZoomState.k,
            node => addWordCloudData(node),
            node => node.data.description)
            .on('click', node => { 
                setCurrentNodeById(node.data.id); 
                setCurrentSearchCriteria(() => "");
                setCurrentPreviewNode(node.data);
                updateViewMode(isEditor ? "editing" : "viewing");
                setTogglePreview(() => true);
            })
            .on('mouseover', node => { triggerHoverOver(node); })
            .on('mouseout', triggerHoverOut());

            //.append('title')
            //.text(node => (node.data.referenceId ? node.data.referenceId + '\n' + node.data.description : ''));

        renderLabel(
            svg,
            root,
            node => node.y + currentZoomState.x + LAYOUT_HEADER_OFFSET_X,
            node => node.x + currentZoomState.y + LAYOUT_HEADER_OFFSET_Y,
            LAYOUT_HEADER_WIDTH,
            LAYOUT_HEADER_HEIGHT,
            currentZoomState.k,
            node => (node.data.referenceId === 'null' ? '' : node.data.referenceId),
            node => " " + node.data.name,
            node => getNodeStrokeByEntityType(node.data.entityType),
            node => getNodeStrokeWidth(isSelected(node), isSearchResult(node)))
            .on('click', node => { 
                setCurrentNodeById(node.data.id); 
                setCurrentSearchCriteria(() => "");
                setCurrentPreviewNode(node.data);
                updateViewMode(isEditor ? "editing" : "viewing");
                setTogglePreview(() => true);
                // console.log(`${node.data.id} was clicked`);
            });
    }

    // Hamburger menu render and mouseover function  - DELETED
    // function createHamburgerMenu(svg, root, triggerMenu) {
    //     renderMenu1(svg, root,
    //         node => node.y + currentZoomState.x + (node.data.tactic && showTactics ? LAYOUT_HAMBURGER_OFFSET_X_WITHTACTIC : LAYOUT_HAMBURGER_OFFSET_X_WITHOUTTACTIC),
    //         node => node.x + currentZoomState.y + LAYOUT_HAMBURGER_1_OFFSET_Y,
    //         LAYOUT_HAMBURGER_WIDTH,
    //         LAYOUT_HAMBURGER_HEIGHT,
    //         currentZoomState.k)
    //         .on('mouseover', node => { triggerMenu(node); });

    //     renderMenu2(
    //         svg,
    //         root,
    //         node => node.y + currentZoomState.x + (node.data.tactic && showTactics ? LAYOUT_HAMBURGER_OFFSET_X_WITHTACTIC : LAYOUT_HAMBURGER_OFFSET_X_WITHOUTTACTIC),
    //         node => node.x + currentZoomState.y + LAYOUT_HAMBURGER_2_OFFSET_Y,
    //         LAYOUT_HAMBURGER_WIDTH,
    //         LAYOUT_HAMBURGER_HEIGHT,
    //         currentZoomState.k)
    //         .on('mouseover', node => { triggerMenu(node); });

    //     renderMenu3(
    //         svg,
    //         root,
    //         node => node.y + currentZoomState.x + (node.data.tactic && showTactics ? LAYOUT_HAMBURGER_OFFSET_X_WITHTACTIC : LAYOUT_HAMBURGER_OFFSET_X_WITHOUTTACTIC),
    //         node => node.x + currentZoomState.y + LAYOUT_HAMBURGER_3_OFFSET_Y,
    //         LAYOUT_HAMBURGER_WIDTH,
    //         LAYOUT_HAMBURGER_HEIGHT,
    //         currentZoomState.k)
    //         .on('mouseover', node => { triggerMenu(node); });
    // }

    function isSearchResult(node)
    {
       

        var nodeData = node.data;
        if (!nodeData) nodeData = node;

        if (searchCriteria === '') {
            return false;
        }

        let found = false;

        let fieldArr = ["referenceId", "name", "description", "tactic", "necessity", "logic", "if", "and", "then", "because", "sufficiency", "optionalityAndSequence"];

        fieldArr.forEach(field => {
            if(!nodeData[field]) return;
            if(nodeData[field].toLowerCase().includes(searchCriteria)) found = true;
        });

        // if(found){
        //     setCurrentSearchCriteria(() => null);
        //     setCurrentNodeById(nodeData.id);
        // }

        return found;

        // var entityType = nodeData.entityType + '';
        // var referenceId = nodeData.referenceId + '';
        // var name = nodeData.name + '';
        // var description = nodeData.description + '';
        // var tactic = nodeData.tactic + '';
        // var necessity = nodeData.necessity + '';
        // var logic = nodeData.logic + '';
        // var sufficiency = nodeData.sufficiency + '';
        // var optionalityAndSequence = nodeData.optionalityAndSequence + '';

        // if((entityType.toLowerCase() === searchCriteria ||
        // referenceId.toLowerCase() === searchCriteria ||
        // name.toLowerCase().includes(searchCriteria) ||
        // description.toLowerCase().includes(searchCriteria) ||
        // tactic.toLowerCase().includes(searchCriteria) ||
        // necessity.toLowerCase().includes(searchCriteria) ||
        // logic.toLowerCase().includes(searchCriteria) ||
        // sufficiency.toLowerCase().includes(searchCriteria) ||
        // optionalityAndSequence.toLowerCase().includes(searchCriteria))){
        //     setCurrentSearchCriteria(() => null);
        //     setCurrentNodeById(node.data.id);
        // }

        // return (entityType.toLowerCase() === searchCriteria ||
        //         referenceId.toLowerCase() === searchCriteria ||
        //         name.toLowerCase().includes(searchCriteria) ||
        //         description.toLowerCase().includes(searchCriteria) ||
        //         tactic.toLowerCase().includes(searchCriteria) ||
        //         necessity.toLowerCase().includes(searchCriteria) ||
        //         logic.toLowerCase().includes(searchCriteria) ||
        //         sufficiency.toLowerCase().includes(searchCriteria) ||
        //         optionalityAndSequence.toLowerCase().includes(searchCriteria));
    }

    function isSelected(node)
    {
        var nodeData = node.data;
        if (!nodeData) nodeData = node;

        if (currentPreviewNode === null) {
            return false;
        }

        return (nodeData.id === currentPreviewNode.id);
    }
}

export default TreeEditor;
