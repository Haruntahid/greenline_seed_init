import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const exportPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../src/data/local-storage-export.json',
);

const raw = JSON.parse(readFileSync(exportPath, 'utf8'));

function parse(key) {
  return JSON.parse(raw[key]);
}

export const CONTENT_SEED_VERSION = 'local-storage-2026-11-23';

export const localContent = {
  products: parse('greenline_seed_products_content'),
  gallery: parse('master_website_gallery_content'),
  stats: parse('master_website_stats_content'),
  heroCarousel: parse('master_website_hero_carousel'),
  portfolio: parse('master_website_portfolio_content'),
  aboutPage: parse('master_website_about_page_content'),
  about: parse('master_website_about_content'),
  youtube: parse('master_website_youtube_videos'),
};
