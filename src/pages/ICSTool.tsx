import React, { useState } from 'react';
import { BsFillCalendarDateFill } from 'react-icons/bs';
import ical from 'ical-chrome'

import { ContentBox } from '../components/ContentBox';
import { UploadBox } from '../components/UploadBox';
import { GoogleLink } from '../components/GoogleLink';
import { GoogleCalendarLink } from '../types';

export interface ICSToolProps {
}

export const ICSTool = (props: ICSToolProps) => {
  const [googleInfo, setGoogleInfo] = useState<GoogleCalendarLink | false>(false);
  const calendar = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
CLASS:PUBLIC
DESCRIPTION:Foobar\nDate and Time - Sep 30\\, 2022 12:00 AM to 12:00 AM\nVenue - 1111 Winchester Blvd\\, Portland OR\\, 97232\nfoobaz\nSUMMARY: meow\nLOCATION: rawr\n
DTSTART:20220930T070000Z
DTEND:20220930T070000Z
LOCATION:1111 Winchester Blvd, Portland OR, 97232
SUMMARY;LANGUAGE=en-us:Foobar
END:VEVENT
END:VCALENDAR`
  const foo = ical.parseICS(calendar)
  console.log(foo)
  const onHandleFile = (fileContents: any) => {
    setGoogleInfo(false)
    console.log(fileContents)
    debugger
  }
  return (
    <>
      <ContentBox
        widthLg={12}
        widthMd={12}
        title={
          <>
            <BsFillCalendarDateFill />{' '}
            <span>ICS to Google Calendar</span>
          </>
        }
      >
        <p>
          Have you signed up for an event only for the "Add to Calendar" link to
          download an ICS file, when you really wanted a <span>Google
          Calendar</span> link?
        </p>
        <p>
          Upload the ICS file below, and we'll craft an "Add to Calendar" link
          based on the file that adds the event to your <span>Google Calendar</span>
        </p>
        <UploadBox
          allowedFileType={"text/calendar"}
          handleUpload={onHandleFile}
        />
      </ContentBox>
      { googleInfo !== false && (
        <GoogleLink link={googleInfo} />
      ) }
    </>
  );
}
