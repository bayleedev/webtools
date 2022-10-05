import React from 'react';
import { Link } from './Link';
import { AiFillHome } from 'react-icons/ai';
import { BsFillCalendarDateFill } from 'react-icons/bs';
import { GoTools } from 'react-icons/go';
import { MdPhotoLibrary } from 'react-icons/md';

import './Sidebar.css';

export interface SidebarProps {
}

export const Sidebar = (props: SidebarProps) => {
  return(
    <aside className="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3" id="sidenav-main">
      <div className="sidenav-header">
        <i className="fas fa-times p-3 cursor-pointer text-white opacity-5 position-absolute end-0 top-0 d-none d-xl-none" aria-hidden="true" id="iconSidenav"></i>
        <span className="navbar-brand m-0 text-white">
          <GoTools />
          <span className="ms-1 font-weight-bold text-white">Web Tools</span>
        </span>
      </div>
      <hr className="horizontal light mt-0 mb-2" />
      <div className="collapse navbar-collapse  w-auto " id="sidenav-collapse-main">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link
              to="/"
              activeClassName="active"
              className="nav-link text-white"
            >
              <AiFillHome />
              <span className="nav-link-text ms-1">Home</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/ics"
              activeClassName="active"
              className="nav-link text-white"
            >
              <BsFillCalendarDateFill />
              <span className="nav-link-text ms-1">ICS Convertor</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/png"
              activeClassName="active"
              className="nav-link text-white"
            >
              <MdPhotoLibrary />
              <span className="nav-link-text ms-1">PNG Tools</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  )
}
