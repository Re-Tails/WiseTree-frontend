import React from 'react';
import PropTypes from 'prop-types';
import './loadingLayout.scss';

export default function LoadingLayout(props) {
    return <div className={props.isStandAlonePage ? 'loadingLayout' : 'loadingLayout page-content'}></div>;
}

LoadingLayout.propTypes = {
    isStandAlonePage: PropTypes.bool,
};
