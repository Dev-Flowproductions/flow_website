/** One showcase card per service area on the home page (matches services hierarchy). */
export const HOME_PROJECT_SHOWCASE = [
  {
    key: 'martech',
    href: '/martech',
    image: '/images/martech.jpg',
    imageAlt: 'MarTech & AI',
  },
  {
    key: 'marketing',
    href: '/marketing',
    image: '/images/projects/ria-shopping.jpg',
    imageAlt: 'Marketing & Social Media',
  },
  {
    key: 'design',
    href: '/design',
    image: '/images/projects/zion-creative-artisans.webp',
    imageAlt: 'Design',
  },
  {
    key: 'animacao',
    href: '/animacao',
    image: '/images/projects/mia.webp',
    imageAlt: 'Animação',
  },
  {
    key: 'audiovisual',
    href: '/audiovisual',
    image: '/images/projects/pro-am-portugal-invitational.png',
    imageAlt: 'Audiovisual',
  },
] as const;

export const HOME_SERVICE_ORDER = [
  'martech',
  'marketing',
  'design',
  'animacao',
  'audiovisual',
] as const;
