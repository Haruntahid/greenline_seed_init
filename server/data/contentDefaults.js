import { localContent } from './localContent.js';
import { contactMetaData, siteSettingsData } from './initialData.js';

const stamp = () => new Date().toISOString();

const firstSlide = localContent.heroCarousel.slides[0];

export const heroData = {
  _id: 'hero',
  eyebrow: firstSlide.eyebrow,
  title: firstSlide.title,
  highlightedTitle: firstSlide.highlightedTitle,
  description: firstSlide.description,
  imageUrl: firstSlide.imageUrl || '',
  imageAlt: firstSlide.imageAlt || '',
  primaryButton: firstSlide.primaryButton,
  secondaryButton: firstSlide.secondaryButton,
  tertiaryButton: firstSlide.tertiaryButton,
  updatedAt: stamp(),
};

export const heroCarouselData = {
  _id: 'hero_carousel',
  ...localContent.heroCarousel,
  updatedAt: stamp(),
};

export const aboutData = {
  _id: 'about',
  ...localContent.about,
  updatedAt: stamp(),
};

export const aboutPageData = {
  _id: 'about_page',
  ...localContent.aboutPage,
  updatedAt: stamp(),
};

export const statsMetaData = {
  _id: 'stats_meta',
  eyebrow: localContent.stats.eyebrow,
  title: localContent.stats.title,
  description: localContent.stats.description,
  featuredStatId: localContent.stats.featuredStatId,
  updatedAt: stamp(),
};

export const statsData = localContent.stats.stats.map((stat, index) => ({
  ...stat,
  order: index + 1,
}));

export const portfolioMetaData = {
  _id: 'portfolio_meta',
  eyebrow: localContent.portfolio.eyebrow,
  title: localContent.portfolio.title,
  description: localContent.portfolio.description,
  features: localContent.portfolio.features,
  closingCTA: localContent.portfolio.closingCTA,
  updatedAt: stamp(),
};

export const projectsData = localContent.portfolio.projects;

export const productsMetaData = {
  _id: 'products_meta',
  eyebrow: localContent.products.eyebrow,
  title: localContent.products.title,
  description: localContent.products.description,
  updatedAt: stamp(),
};

export const productCategoriesData = localContent.products.categories;

export const productsData = localContent.products.products;

export const galleryData = {
  _id: 'gallery',
  ...localContent.gallery,
  updatedAt: stamp(),
};

export const youtubeData = {
  _id: 'youtube',
  ...localContent.youtube,
  updatedAt: stamp(),
};

export { contactMetaData, siteSettingsData };
