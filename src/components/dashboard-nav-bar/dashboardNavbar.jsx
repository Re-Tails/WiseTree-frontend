import React, { useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faProfile, faUserCircle, faCaretDown, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { ReactComponent as TreeIcon } from '../../assets/icons/icon-tree.svg';
import { ReactComponent as CompanyIcon } from '../../assets/icons/logo-brand-full.svg';
import { useUser, useUserAuth } from '../../services/AuthenticationContextProvider';


import './dashboardNavbar.scss';


export default function DashboardNavBar() {

    // Get the user details from context provider
    const userAuth = useUserAuth();
    const user = useUser();

    const handleLogout = () => {
        userAuth.logout();
    }

    

    return (
        // <div>
            <nav className="navbar navbar-light bg-light">
                <a className="navbar-brand" href="#">
                    <CompanyIcon className="navbar-logo" />
                </a>
                <div className="push-right navbar-item">

                    <FontAwesomeIcon icon={faBell} className="icon" />
                    <div className="vr"></div>
                    <button className="btn-sm btn-primary ml-3" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{ borderRadius: "14px" }} > <FontAwesomeIcon icon={faUserCircle} className="icon-circle" /> My Account &nbsp;<FontAwesomeIcon icon={faCaretDown} /> </button>
                    <div className="dropdown-menu dropdown-wisetech" aria-labelledby="dropdownMenuButton">
                        <div className="profile">Signed in as: <br  /><b>{ user?.name }</b></div>
                        <div className="dropdown-divider"></div>
                        <div className="dropdown-item"> <FontAwesomeIcon icon={faCog} className="dropdown-icon" /> Settings</div>
                        <div className="dropdown-item" onClick={() => handleLogout()} > <FontAwesomeIcon icon={faSignOutAlt} className="dropdown-icon" /> Logout</div>
                    </div>
                </div>
            </nav>
        // </div>
    );
}
