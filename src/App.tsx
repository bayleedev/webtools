import React from 'react';
import { Router, Route } from 'wouter';
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
    <>
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
          <Router base="/webtools">
            <Route path="/">
              <Home />
            </Route>
            <Route path="/ics">
              <ICSTool />
            </Route>
          </Router>
          <Footer />
        </div>
      </main>
    </>
  );
}
