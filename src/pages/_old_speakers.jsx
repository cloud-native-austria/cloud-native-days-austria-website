/* eslint-disable react/prop-types */
import React from 'react';
import Layout from 'components/shared/layout';
import SEO from 'components/shared/seo';
import SEO_DATA from 'constants/seo-data';
import Speakers from 'components/pages/speakers/speakers';

const SpeakersPage = () => (
  <Layout>
    <Speakers />
  </Layout>
);

export default SpeakersPage;

export const Head = ({ location: { pathname } }) => (
  <SEO {...SEO_DATA.speakers} pathname={pathname} />
);
