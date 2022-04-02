import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import { ReactComponent as ZoomIn } from '../../assets/icons/icon-zoom-in.svg';
import { ReactComponent as ZoomOut } from '../../assets/icons/icon-zoom-out.svg';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faColumns } from '@fortawesome/free-solid-svg-icons'

import './zoomToast.scss';

ZoomToast.propTypes = {
  handleZoomIn: PropTypes.func,
  handleZoomOut: PropTypes.func
}



export default function ZoomToast(props) {
  const [legend, setLegend] = useState(true)
  const history = useHistory();

  return (
    <div className="toast zoom-toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div className="toast-body zoom-toast-body">
        <button onClick={props.handleZoomOut} className="zoom-button" title="Zoom Out">
          <ZoomOut className="zoom-button-icon"/>
        </button>
        <button onClick={props.handleZoomIn} className="zoom-button" title="Zoom In">
          <ZoomIn className="zoom-button-icon"/>
        </button>
        <div className="vr"></div>
        { props.legend && <> 
          <button onClick={() => { props.setLegend(false); console.log("hello") }} title="Hide Legend" className="bottom-toast-legend shadow-none">
          <FontAwesomeIcon icon={faColumns} className="dropdown-icon" />
        </button>
        </>}

        { !props.legend && <> <button onClick={() => { props.setLegend(true);}} title="Show Legend" className="bottom-toast-legend-hidden shadow-none">
          <FontAwesomeIcon icon={faColumns} className="dropdown-icon" />
        </button> </>}
       
      </div>
    </div>
  );
}
