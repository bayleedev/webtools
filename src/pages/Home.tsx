import React from 'react';
import { GoTools } from 'react-icons/go';

import { ContentBox } from '../components/ContentBox';

export interface HomeProps {
}

export const Home = (props: HomeProps) => {
  return (
    <>
      <ContentBox
        widthLg={12}
        widthMd={12}
        title={
          <>
            <GoTools />{' '}
            <span>Open Source Web Tools</span>
          </>
        }
      >
        <p>
          I was tired of looking for web tools that didn't have last-minute
          registrations, payments or ads. So I made some!
        </p>
        <p>
          Proudly developed Open Source, Registration Free, and Ad free!
        </p>
        <p>
          These tools were only tested on the latest <i>Google Chrome</i>.
        </p>
      </ContentBox>
    </>
  );
}
