import React from 'react';
import { useHistory } from 'react-router-dom';
//import { ReactComponent as ArrowIcon } from '../../assets/icons/icon-arrow-left.svg';

import './toolbar.scss';

export default function ToolBar() {
    const history = useHistory();
    const returnToPreviousPage = () => history.push('/dashboard');
    return (
        <div className='toolbar'>
            <span className='returnButton-text'>Delete Node</span>
            <span className='returnButton-text'>Add Node</span>
            <span className='returnButton-text'>Edit Node</span>
        </div>
    );
}
