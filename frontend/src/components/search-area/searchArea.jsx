import React, { useEffect, useRef } from 'react';
import "./searchArea.scss";
import PropTypes from 'prop-types';

import { ReactComponent as WordCloudIcon } from '../../assets/icons/icon-wordcloud.svg';
import { ReactComponent as ShowTacticsIcon } from '../../assets/icons/icon-showtactics.svg';

import WordCloud from 'wordcloud';

const WORD_BACKGROUND_HEX = "#371ee1";
const WORD_BACKGROUND_RGB = "55, 30, 225";

export default function SearchArea(props) {

    const searchBox = useRef();
    const wordCloudHolder = useRef();

    useEffect(() => {
        if(!searchBox.current || !wordCloudHolder.current || props.wordCloudData.length === 0) return;

        // WordCloud(wordCloudHolder.current, 
        //     {
        //         list: props.wordCloudData.filter(word => word[1] >= props.WORDCLOUD_MINOCCURS),
        //         color: function (word, weight) {
        //             var percentageOfMax = Math.round(weight / props.maxWordCloudCount * 100);
        //             return props.wordCloudColourScale(percentageOfMax);
        //         },
        //         shuffle: false,
        //         weightFactor: 2,
        //         minSize: 6,
        //         fontWeight: 'bold',
        //         wait: 25,
        //         hover: function(item) { 
        //             // var searchBox = searchBox.current;
        
        //             if (searchBox !== null && item !== undefined) {
        //                 searchBox.current.value = item[0];
        //             }},
        //         click: function(item) { 
        //             // var searchBox = searchBox.current;
        
        //             if (searchBox !== null && item !== undefined) {
        //                 searchBox.current.value = item[0];
        //             }

        //             console.log("Hello");
        
        //             // props.setDefaultZoom();
        //             props.refetchTree();
        //             props.search();
        //         }
        //     });


    }, [searchBox, wordCloudHolder, props.wordCloudData]);

    // useEffect(() => {
    //     console.log(props.wordCloudData.filter(word => word[1] >= props.WORDCLOUD_MINOCCURS));
    // }, [props.wordCloudData]);

    // useEffect(() => {
    //     console.log(props.maxWordCloudCount);
    // }, [props.maxWordCloudCount]);


    // Fixes a rendering issue
    let wordCloudData = props.wordCloudData?.filter(word => word[1] >= props.WORDCLOUD_MINOCCURS);

    return (
        <>
            <form onSubmit={(e) => e.preventDefault()} className="search-area__form">
                <input 
                    type="search" 
                    className="search-area__search"
                    ref={searchBox}
                    placeholder="Search..." 
                    id='searchBox' 
                    onChange={props.search} 
                    title='Enter a search term to highlight the matching elements in the tree'
                    //    style={{ visibility: props.viewMode === 'viewing' ? 'visible' : 'hidden' }}
                    ></input>
                
                <button 
                    type="button"
                    className="search-area__btn search-area__btn-cloud"
                    onClick={props.toggleIsWordCloudOpen} 
                    title={props.isWordCloudOpen ? 'Click here to hide the word cloud' : 'Click here to show the word cloud, which allows you to search the tree using the most common terms'}
                    // style={{ visibility: props.viewMode === 'viewing' ? 'visible' : 'hidden' }}
                    >
                    <WordCloudIcon fill={ props.isWordCloudOpen ? '#51a7ff' : 'gray'}></WordCloudIcon>
                </button>

                <button 
                    type="button"
                    className="search-area__btn search-area__btn-tactics"
                    onClick={props.toggleShowTactics} 
                    title={props.showTactics ? 'Click here to hide tactics for each element of the tree when zoomed in' : 'Click here to show tactics for each element of the tree when zoomed in'}
                    // style={{ visibility: props.viewMode === 'viewing' ? 'visible' : 'hidden' }}
                    >
                    <ShowTacticsIcon fill={ props.showTactics ? '#51a7ff' : 'gray'}></ShowTacticsIcon>
                </button>
            </form>

            { wordCloudData?.length > 0 && props.isWordCloudOpen &&
                <div 
                    className="word-cloud"
                    onMouseOut={props.resetSearch}
                    id="wordCloudHolder">
                    { wordCloudData.map(word => {

                        let percent = word[1]/props.maxWordCloudCount * 100;
                        if(percent < 30) percent = 30;

                        return <div
                            key={`${word[0]}${word[1]}`}
                            className="word-cloud__word"
                            style={{ backgroundColor: `rgba(${WORD_BACKGROUND_RGB}, ${percent}%)` }}
                            onClick={() => {
                                searchBox.current.value = word[0];
                                props.refetchTree();
                                props.search();
                            }}
                        >{word[0]}</div>
                    })}
                </div>
            }

           {/* <canvas 
                id='wordCloudHolder'
                ref={wordCloudHolder}
                className='word-cloud' 
                height={props.LAYOUT_WORDCLOUD_HEIGHT}
                width={props.LAYOUT_WORDCLOUD_WIDTH}
                onMouseOut={props.resetSearch}
                style={{ display: props.isWordCloudOpen ? 'block' : 'none' }}/> */}
        </>
    );
}

SearchArea.propTypes = {
    search: PropTypes.func.isRequired,
    viewMode: PropTypes.string.isRequired,
    LAYOUT_SEARCHPANE_WIDTH: PropTypes.number.isRequired,
    LAYOUT_SEARCHPANE_HEIGHT: PropTypes.number.isRequired,
    LAYOUT_WORDCLOUD_HEIGHT: PropTypes.number.isRequired,
    LAYOUT_WORDCLOUD_HEIGHT: PropTypes.number.isRequired,
    isWordCloudOpen: PropTypes.bool.isRequired,
    toggleIsWordCloudOpen: PropTypes.func.isRequired,
    toggleShowTactics: PropTypes.func.isRequired,
    showTactics: PropTypes.bool.isRequired,
    resetSearch: PropTypes.func.isRequired,

    // More
    maxWordCloudCount: PropTypes.number.isRequired,
    WORDCLOUD_MINOCCURS: PropTypes.number.isRequired,
    wordCloudData: PropTypes.array.isRequired,
    setDefaultZoom: PropTypes.func.isRequired,
    refetchTree: PropTypes.func.isRequired,
    wordCloudColourScale: PropTypes.func.isRequired
}