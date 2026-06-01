import type { CarouselProject } from '@/components/sections/ProjectCarousel';

/**
 * Design hub carousel — image paths matched to actual file content.
 * Some files under design-carousel/ are misnamed on disk; canonical
 * project assets in /images/projects/ are preferred when available.
 */
export const designCarouselProjects: CarouselProject[] = [
  { slug: 'zion-creative-artisans', title: 'ZION Creative Artisans', img: '/images/projects/zion-creative-artisans.webp' },
  { slug: 'dom-jose-beach-hotel', title: 'Dom José Beach Hotel', img: '/images/projects/design-carousel/dom-jose-carousel.png' },
  { slug: '100lixo', title: '100LIXO', img: '/images/projects/design-carousel/100lixo-carousel.png' },
  { slug: 'witfy', title: 'Witfy', img: '/images/projects/design-carousel/witfy-carousel.png' },
  { slug: 'albufeira-digital-nomads', title: 'Albufeira Digital Nomads', img: '/images/projects/design-carousel/albufeira-dn-carousel.png' },
  { slug: 'urlegfix', title: 'URLEGFIX', img: '/images/projects/urlegfix.png' },
  { slug: 'cesarius', title: 'Cesarius', img: '/images/projects/cesarius.jpg' },
  // misnamed file: urlegfix-carousel.jpg shows Jardim Aurora business cards
  { slug: 'jardim-aurora', title: 'Jardim Aurora', img: '/images/projects/design-carousel/urlegfix-carousel.jpg' },
  // misnamed file: rocket-booster-carousel.png shows Nature Soul Food mug
  { slug: 'nature-soul-food', title: 'Nature Soul Food', img: '/images/projects/design-carousel/rocket-booster-carousel.png' },
  { slug: 'rocket-booster', title: 'Rocket Booster', img: '/images/projects/rocket-booster.png' },
  { slug: 'pizza-lab', title: 'Pizza Lab', img: '/images/projects/design-carousel/pizza-lab-carousel.jpg' },
];
