import React from 'react';

import Live from '../components/pages/live/live';
import Layout from '../components/shared/layout';
import SEO from '../components/shared/seo';
import SEO_DATA from '../constants/seo-data';

const LivePage = () => (
    <Layout>
      <header className="text-center safe-paddings pb-4">

        <h1>CNDA 2025 - Live</h1>
        <p>Everything you need to know at the event.</p>
      </header>
      <Live />
    </Layout>
  )
;

export default LivePage;

// eslint-disable-next-line react/prop-types
export const Head = ({ location: { pathname } }) => <SEO {...SEO_DATA.live} pathname={pathname} />;
