import React from 'react';
import { ReactComponent as ErrorIllustration } from '../../assets/icons/illustration-404.svg';
import PropTypes from 'prop-types';
import ReturnButton from '../return-button/returnButton';
import './errorLayout.scss';

export default function ErrorLayout(props) {
    return (
        <div className={props.isStandAlonePage ? 'errorLayout' : 'errorLayout page-content'}>
            {props.isStandAlonePage ? <ReturnButton /> : null}
            <ErrorIllustration className='errorLayout-illustration' />
            <p className='errorLayout-text'>It&apos;s somewhere out there, but not here</p>
        </div>
    );
}

ErrorLayout.propTypes = {
    isStandAlonePage: PropTypes.bool,
};
