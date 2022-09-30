import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { TopBar, Link } from './components/TopBar';
import { ContentBox } from './components/ContentBox';
import { UploadBox } from './components/UploadBox';
import './App.css';

interface GoogleCalendar {
  action: string
  startTime: string
  endTime: string
  details: string
  location: string
  text: string
}

/*
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:20220928T010000Z
DTEND:20220928T020000Z
SUMMARY:title
DESCRIPTION:description
LOCATION:location
END:VEVENT
END:VCALENDAR

VEVENT.*VEVENT
---
BEGIN:VCALENDAR
  PRODID:kordinator
  VERSION:2.0
  CALSCALE:GREGORIAN
  METHOD:REQUEST
  BEGIN:VEVENT
    BEGIN:VALARM
      TRIGGER:-P1D
      ACTION:DISPLAY
      DESCRIPTION:Reminder
    END:VALARM
    DTSTAMP:20220926T180701Z
    DTSTART:20221025T211500Z
    DTEND:20221025T213000Z
    SUMMARY:Wellness Clinic Appointment
    LOCATION:Kabuki Theater  121 Albright Way Los Gatos\, CA\, 95032\, Flu va
    ccine will be offered to people 3 years and older and Omicron Booster to
      people 12 years and older\n\nIMPORTANT REMINDERS for all Participants\n
    -    Complete and bring printed copy of consent form \n-    Bring CDC vaccine 
    card for booster dose COVID-19 vaccine \n-    Wear a short sleeve if possib
    le\n\nNew Bivalent Boosters will be available for eligible people 12 yea
    rs and older. However\, vaccine is not guaranteed due to limited supply
    DESCRIPTION:Wellness Clinic Appointment.\n\nLocation : Kabuki Theater  12
    1 Albright Way Los Gatos\, CA\, 95032\, Flu vaccine will be offered to p
    eople 3 years and older and Omicron Booster to people 12 years and older
    \n\nIMPORTANT REMINDERS for all Participants\n-    Complete and bring print
    ed copy of consent form \n-    Bring CDC vaccine card for booster dose COVI
    D-19 vaccine \n-    Wear a short sleeve if possible\n\nNew Bivalent Booster
    s will be available for eligible people 12 years and older. However\, va
    ccine is not guaranteed due to limited supply\n\nReschedule:  https://ko
    rdinator.mhealthcoach.net/vcl/704291252\n\n
    ORGANIZER;CN=Albertsons Patient Care:vknoreply@my-secure-message.com
    UID:VK_704291239
    SEQUENCE:184229937
    ATTENDEE;ROLE=REQ-PARTICIPANT:mailto:bschmeisser@netflix.com
    BEGIN:VALARM
      TRIGGER:-PT15M
      ACTION:DISPLAY
      DESCRIPTION:Reminder
    END:VALARM
  END:VEVENT
END:VCALENDAR
*/
function App() {
  const [googleInfo, setGoogleInfo] = useState<GoogleCalendar | false>(false);
  const onHandleFile = (fileContents: string) => {
    setGoogleInfo({
      action: 'TEMPLATE',
      startTime: PARSE['DTSTART'],
      endTime: 'str',
      details: 'str',
      location: 'str',
      text: 'str',
    })
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
            <UploadBox
              fileType={"text/calendar"}
              handleFile={onHandleFile}
            />
          </ContentBox>
          { googleInfo !== false && (
            <RenderGoogleLink info={googleInfo} />
          ) }
          <Footer />
        </div>
      </main>
    </>
  );
}

export default App;
