import { scheduleUrl } from './sessionize-app';

const getAnchor = (str: string): string => str.toLowerCase();

interface Link {
  to: string;
  id?: string;
  homeTo?: string;
  target?: string;
}

interface Links {
  home: Link;
  live: Link;
  schedule: Link;
  tickets: Link;
  venue: Link;
  sponsors: Link;
  keynoteSpeakers: Link;
  speakers: Link;
  team: Link;
  privacy: Link;
  conduct: Link;
}

const LINKS: Links = {
  // Pages and sections
  home: {
    to: '/',
  },

  live: {
    to: '/live',
  },
  schedule: {
    to: scheduleUrl,
  },

  tickets: {
    to: `/#${getAnchor('Tickets')}`,
    id: `/#${getAnchor('Tickets')}`,
    homeTo: '/',
  },
  venue: {
    to: `/#${getAnchor('Venue')}`,
    id: `/#${getAnchor('Venue')}`,
    homeTo: '/',
  },
  sponsors: {
    to: `/#${getAnchor('Sponsors')}`,
    id: `/#${getAnchor('Sponsors')}`,
    homeTo: '/',
  },
  keynoteSpeakers: {
    to: `/#${getAnchor('speakers')}`,
    id: `/#${getAnchor('speakers')}`,
    homeTo: '/',
  },
  speakers: {
    to: '/speakers',
  },

  // Footer
  team: {
    to: '/team',
  },
  privacy: {
    to: '/imprint-and-data-privacy',
    target: '_blank',
  },

  // Social
  conduct: {
    to: 'https://berlincodeofconduct.org/',
    target: '_blank',
  },
};

export default LINKS;
