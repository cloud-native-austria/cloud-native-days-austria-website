import LINKS from './links';

interface MenuItem {
  text: string;
  to: string;
  id?: string;
  homeTo?: string;
  target?: string;
}

interface Menus {
  header: MenuItem[];
  footer: MenuItem[];
}

const MENUS: Menus = {
  header: [
    // { text: 'Live', ...LINKS.live },
    // { text: 'Tickets', ...LINKS.tickets },
    // { text: 'Schedule', ...LINKS.schedule },
    { text: 'Speakers', ...LINKS.speakers },
    { text: 'Venue', ...LINKS.venue },
    { text: 'Sponsors', ...LINKS.sponsors },
  ],
  footer: [
    { text: 'Code of Conduct', ...LINKS.conduct },
    { text: 'Team', ...LINKS.team },
    { text: 'Impressum & Data Privacy', ...LINKS.privacy },
  ],
};

export default MENUS;
