/** Seed Discover catalog. Stand-in for a search/recommendations API. */
import type { CatalogBook } from '../domain/book/book.types';

export const CATALOG: CatalogBook[] = [
  { id: 'c1', title: 'The Bee Sting', author: 'Paul Murray', genre: 'Fiction', pages: 656, cover: '#4f7a6a' },
  { id: 'c2', title: 'Trust', author: 'Hernan Diaz', genre: 'Fiction', pages: 416, cover: '#45597e', coverUrl: 'https://covers.openlibrary.org/b/id/12742248-M.jpg', sourceId: '/works/OL25916696W' },
  { id: 'c3', title: 'The Wager', author: 'David Grann', genre: 'History', pages: 352, cover: '#9a6849' },
  { id: 'c4', title: 'Chain-Gang All-Stars', author: 'Nana Kwame Adjei-Brenyah', genre: 'Sci-Fi', pages: 384, cover: '#356a68', coverUrl: 'https://covers.openlibrary.org/b/id/13334374-M.jpg', sourceId: '/works/OL27558010W' },
  { id: 'c5', title: 'Hamnet', author: "Maggie O'Farrell", genre: 'Fiction', pages: 384, cover: '#5a6a4d', coverUrl: 'https://covers.openlibrary.org/b/id/10306590-M.jpg', sourceId: '/works/OL20743965W' },
  { id: 'c6', title: 'North Woods', author: 'Daniel Mason', genre: 'Fiction', pages: 384, cover: '#2a2c33', coverUrl: 'https://covers.openlibrary.org/b/id/14421778-M.jpg', sourceId: '/works/OL34028309W' },
  { id: 'c7', title: 'Tom Lake', author: 'Ann Patchett', genre: 'Fiction', pages: 320, cover: '#5b4a66', coverUrl: 'https://covers.openlibrary.org/b/id/13454692-M.jpg', sourceId: '/works/OL31098954W' },
  { id: 'c8', title: 'The Maniac', author: 'Benjamín Labatut', genre: 'Nonfiction', pages: 368, cover: '#33444b', coverUrl: 'https://covers.openlibrary.org/b/id/14036185-M.jpg', sourceId: '/works/OL34388805W' },
];

/** Curated id sets the Discover view renders. */
export const RECOMMENDATION_IDS = ['c2', 'c5', 'c7', 'c6'];
export const TRENDING_IDS = ['c1', 'c4', 'c3', 'c8', 'c5'];
