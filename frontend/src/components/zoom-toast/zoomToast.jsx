import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import { ReactComponent as ZoomIn } from '../../assets/icons/icon-zoom-in.svg';
import { ReactComponent as ZoomOut } from '../../assets/icons/icon-zoom-out.svg';

import './zoomToast.scss';

ZoomToast.propTypes = {
  handleZoomIn: PropTypes.func,
  handleZoomOut: PropTypes.func
}

export default function ZoomToast(props) {
  const history = useHistory();

  return (
    <div className="toast zoom-toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div className="toast-body zoom-toast-body">
        <button onClick={props.handleZoomOut} className="zoom-button">
          <ZoomOut className="zoom-button-icon"/>
        </button>
        <button onClick={props.handleZoomIn} className="zoom-button">
          <ZoomIn className="zoom-button-icon"/>
        </button>
      </div>
    </div>
  );
}
