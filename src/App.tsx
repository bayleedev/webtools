import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { TopBar, Link } from './components/TopBar';
import { ContentBox } from './components/ContentBox';
import { UploadBox } from './components/UploadBox';
import './App.css';

function App() {
  const onHandleFile = (fileContents: string) => {
    debugger
  }
  return (
    <>
      <Sidebar />
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
        <TopBar
          title="Open Source"
          breadcrumbs={[
            { label: "Baylee Dev", href: "https://baylee.dev" } as Link
          ]}
        />
        <div className="container-fluid py-4">
          <ContentBox widthLg={12} widthMd={12} title="ICS to Google Calendar">
            <UploadBox handleFile={onHandleFile} />
          </ContentBox>
          <Footer />
        </div>
      </main>
    </>
  );
}

export default App;
