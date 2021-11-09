import React from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as ArrowIcon } from '../../assets/icons/icon-arrow-left.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { ReactComponent as TreeIcon } from '../../assets/icons/logo-brand-icon.svg';

import './returnButton.scss';

export default function ReturnButton() {
    const history = useHistory();
    
    return (
        <div>
            <span className="ml-3 mr-3 returnButton" onClick={() => history.goBack()}><FontAwesomeIcon icon={faArrowLeft} /></span>
            <div className="vr"></div>
            <TreeIcon className="tree-logo"/>

            {/* <span className='returnButton__text'>Return to Dashboard</span> */}
        </div>
    );
}
