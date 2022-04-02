import React from 'react';
import ReturnButton from '../return-button/returnButton';
import './tree-nav-bar.scss';
import { useUser, useUserAuth } from '../../services/AuthenticationContextProvider';

export default function TreeNavbar(props) {
  const userAuth = useUserAuth();

  const user = useUser();

  const handleLogout = () => {
      userAuth.logout();
  }
  
  return (
    <div className='tree-navbar'>
      <ReturnButton/>
      <div className="row float-left">
        <div className="col-12">
          <span className='tree-navbar__title'>{ props.name }</span>
        </div>
        <div className="col-12 tree-navbar__subtitle">
          Created by: {props.owner}
        </div>
      </div>
      <div className="tree-navbar__dropdown">
        <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Account &nbsp;
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <a className="dropdown-item" href="#">Profile</a>
          <a className="dropdown-item" href="#">Settings</a>
          <a onClick={() => handleLogout()} className="dropdown-item" href="#">Logout</a>
        </div>
      </div>
    </div>
  );
}
