import React, { useState } from 'react';
import { BsFillCalendarDateFill } from 'react-icons/bs';

import { ContentBox } from '../components/ContentBox';
import { UploadBox } from '../components/UploadBox';
import { GoogleLink } from '../components/GoogleLink';
import { GoogleCalendarLink } from '../types';

export interface ICSToolProps {
}

export const ICSTool = (props: ICSToolProps) => {
  const [googleInfo, setGoogleInfo] = useState<GoogleCalendarLink | false>(false);
  const onHandleFile = (fileContents: any) => {
    setGoogleInfo(false)
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
