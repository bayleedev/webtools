import React from 'react';
import { AiFillGithub } from 'react-icons/ai';

export interface FooterProps {
}

export const Footer = (props: FooterProps) => {
  return (
    <footer className="footer py-4">
      <div className="container-fluid">
        <div className="row align-items-center justify-content-lg-between">
          <div className="col-lg-6 mb-lg-0 mb-4">
            <div className="copyright text-center text-sm text-muted text-lg-start">
              <a className="nav-link text-muted" href="https://github.com/bayleedev/webtools">
                <AiFillGithub />{' '}
                <span>Edit this page</span>
              </a>
            </div>
          </div>
          <div className="col-lg-6">
            <ul className="nav nav-footer justify-content-center justify-content-lg-end">
              <li className="nav-item">
                <a href="https://demos.creative-tim.com/material-dashboard/pages/dashboard " className="nav-link text-muted" rel="noreferrer" target="_blank">Material Dashboard Theme</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
