import React from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { GoTools } from 'react-icons/go';
import { GiFairy } from 'react-icons/gi';

import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { TopBar, Link } from './components/TopBar';
import { ICSTool } from './pages/ICSTool';
import { Home } from './pages/Home';
import './App.css';

export interface AppProps {
}

export const App = (props: AppProps) => {
  return (
    <Router>
      <Sidebar />
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
        <TopBar
          title={
            <>
              <GoTools />{' '}
              <span>Open Source Web Tools</span>
            </>
          }
          breadcrumbs={[
            {
              label: <><GiFairy />{' '}<span>Baylee Dev</span></>,
              href: "https://baylee.dev"
            } as Link
          ]}
        />
        <div className="container-fluid py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ics" element={<ICSTool />} />
          </Routes>
          <Footer />
        </div>
      </main>
    </Router>
  );
}
