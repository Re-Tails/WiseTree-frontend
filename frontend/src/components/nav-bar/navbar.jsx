import React, { useContext, useEffect, useState, useRef } from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faAngleRight, faSitemap, faBuilding, faHammer, faUserShield } from '@fortawesome/free-solid-svg-icons'
import { ReactComponent as TreeIcon } from '../../assets/icons/icon-tree.svg';
import { ReactComponent as ArrowIcon } from '../../assets/icons/icon-arrow-left.svg';
import './navbar.scss';
import { useUser, useUserAuth } from '../../services/AuthenticationContextProvider';

export default function NavBar(props) {
    // const { authenticationData, clearAuthenticationData } = useContext(AuthenticationContext);

    // useEffect(() => {}, [authenticationData]);

    const match = useRouteMatch();

    const userAuth = useUserAuth();

    const user = useUser();

    const handleLogout = () => {
        userAuth.logout();
    }


    const [active, setActive] = useState("company")
    const [dropdownActive, setDropdownActive] = useState(0)

    // Dropdown hover functionality
    const teamsRef = useRef();
    const moderatorRef = useRef();
    const adminRef = useRef();


    // const toggleDropdown = (e) => {
    //     if active == 
    // }
    return (
        <div className='sidebar'>
            {/* <div className='sidebar-user'>
                 <img src='https://placekitten.com/150/150' alt='cat' className='sidebar-user-avatar' />                <div className='sidebar-user-info'>
                    <p className='sidebar-user-info-name'> Scott Dowell</p>
                    <p className='sidebar-user-info-access'>SWD</p>
                </div>
            </div> */}
            <ul className="sidebar-nav">
                <NavLink to='/dashboard/company-diagrams' className="sidebar-link">
                    <li className={`sidebar-item mb-2 ${active == "company" ? "active" : ""}`} onClick={() => { setActive("company"); setDropdownActive(0) }}>
                        <span className="mr-2"><FontAwesomeIcon icon={faBuilding} /></span>Company Diagrams
                    </li>
                </NavLink>

                <NavLink to='/dashboard/my-teams' className="sidebar-link">
                    <li className={`sidebar-item mb-2 ${active == "teams" ? "active" : ""}`} onClick={() => { setActive("teams"); setDropdownActive(0) }}>
                        <span className="mr-2"><FontAwesomeIcon icon={faUsers} /></span>My Teams
                    </li>
                </NavLink>




                <li ref={teamsRef} className={`sidebar-item ${(dropdownActive == "1" || active == "teamsd") ? "sidebar-collapsed" : ""}`} onClick={() => setDropdownActive((current) => current == 1 ? 0 : 1)} data-toggle="collapse" href="#teamCollapse" role="button" aria-expanded="false" aria-controls="teamCollapse">
                    <span className="mr-2"><FontAwesomeIcon icon={faSitemap} /></span>Team Diagrams<span className={`menu-arrow ${(dropdownActive == 1 || active == "teamsd") ? "active-arrow" : ""}`}><FontAwesomeIcon icon={faAngleRight} /></span>
                </li>

                <div ref={teamsRef} className={`collapse mb-2 ${(teamsRef.current?.classList.contains("show") && active != "teamsd") ? teamsRef.current?.classList.remove("show") : "collapsing"}`} id="teamCollapse">
                    <ul className="nav sidebar-sub-menu">
                        <NavLink to='/dashboard/team-published' className="sidebar-link" onClick={() => { setActive("teamsd"); setDropdownActive(1) }}>
                            <li className="menu-item">Published Diagrams</li>
                        </NavLink>

                        <NavLink to='/dashboard/team-drafts' className="sidebar-link" onClick={() => { setActive("teamsd"); setDropdownActive(1) }}>
                            <li className="menu-item">Draft Diagrams</li>
                        </NavLink>

                    </ul>
                </div>



                {/* If user is moderator display this */}
                { user?.isModerator && user?.role !== 'admin' && <>
                <li ref={moderatorRef} className={`sidebar-item mt-2 ${(dropdownActive == "2" || active == "moderator") ? "sidebar-collapsed" : ""}`} onClick={() => setDropdownActive((current) => current == 2 ? 0 : 2)} data-toggle="collapse" href="#moderatorCollapse" role="button" aria-expanded="false" aria-controls="moderatorCollapse">
                    <span className="mr-2"><FontAwesomeIcon icon={faHammer} /></span>Moderation Tools<span className={`menu-arrow ${(dropdownActive == 2 || active == "moderator") ? "active-arrow" : ""}`}><FontAwesomeIcon icon={faAngleRight} /></span>

                </li>
                <div ref={moderatorRef} className={`collapse mb-2 ${(moderatorRef.current?.classList.contains("show") && active != "moderator") ? moderatorRef.current?.classList.remove("show") : "collapsing"}`} id="moderatorCollapse">
                    <ul className="nav sidebar-sub-menu">
                        <NavLink to='/dashboard/moderator/team-access' className="sidebar-link" onClick={() => { setActive("moderator"); setDropdownActive(2) }}>
                            <li className="menu-item">Team Access</li>
                        </NavLink>

                        <NavLink to='/dashboard/moderator/team-settings' className="sidebar-link" onClick={() => { setActive("moderator"); setDropdownActive(2) }}>
                            <li className="menu-item">Team Settings</li>
                        </NavLink>
                    </ul>
                </div></>}

                {/* If user is admin display this */}
                { user?.role === 'admin' && <>
                <li ref={adminRef} className={`sidebar-item mt-2 ${(dropdownActive == "3" || active == "admin") ? "sidebar-collapsed" : ""}`} onClick={() => setDropdownActive((current) => current == 3 ? 0 : 3)} data-toggle="collapse" href="#adminCollapse" role="button" aria-expanded="false" aria-controls="adminCollapse">
                    <span className="mr-2"><FontAwesomeIcon icon={faUserShield} /></span>Administration Tools<span className="menu-arrow" className={`menu-arrow ${(dropdownActive == 3 || active == "admin") ? "active-arrow" : ""}`}><FontAwesomeIcon icon={faAngleRight} /></span>
                </li>
                <div ref={adminRef} className={`collapse mb-2 ${(adminRef.current?.classList.contains("show") && active != "admin") ? adminRef.current?.classList.remove("show") : "collapsing"}`} id="adminCollapse">
                    <ul className="nav sidebar-sub-menu">
                        <NavLink to='/dashboard/admin/user-management' className="sidebar-link" onClick={() => { setActive("admin"); setDropdownActive(3) }}>
                            <li className="menu-item">Manage Users</li>
                        </NavLink>
                        <NavLink to='/dashboard/admin/team-management' className="sidebar-link" onClick={() => { setActive("admin"); setDropdownActive(3) }}>
                            <li className="menu-item">Manage Teams</li>
                        </NavLink>
                        <li className="menu-item">Settings</li>
                        <li className="menu-item">Security</li>
                    </ul>
                </div></>}
            </ul>




            {/* <NavLink to='/dashboard' exact={true} className='sidebar-item'>
                <TreeIcon fill='#fff' className='sidebar-item-icon' />
                <p className='sidebar-item-label'>Published</p>
            </NavLink>
            <NavLink to='/drafts' className='sidebar-item'>
                <TreeIcon fill='#fff' className='sidebar-item-icon' />
                <p className='sidebar-item-label'>Drafts</p>
            </NavLink>
            <div onClick={() => handleLogout()} className='sidebar-item logout-button'>
                <ArrowIcon fill='#fff' className='sidebar-item-icon' />
                <p className='sidebar-item-label logout-button'>Logout</p>
            </div> */}
        </div>
    );
}
