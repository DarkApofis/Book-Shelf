/** Seed shelf books. Stand-in for a persistence layer / Book API response. */
import type { Book } from '../domain/book/book.types';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'b1', title: 'The Overstory', author: 'Richard Powers', genre: 'Fiction',
    pages: 502, rating: 4.5, status: 'reading', page: 214, cover: '#4f7a6a', coverUrl: 'https://covers.openlibrary.org/b/id/8758252-M.jpg', sourceId: '/works/OL19074847W',
    started: 'Jun 14',
    sessions: [{ date: 'Jun 22', pages: 38 }, { date: 'Jun 20', pages: 52 }, { date: 'Jun 18', pages: 41 }],
  },
  {
    id: 'b2', title: 'Project Hail Mary', author: 'Andy Weir', genre: 'Sci-Fi',
    pages: 476, rating: 5, status: 'reading', page: 388, cover: '#45597e', coverUrl: 'https://covers.openlibrary.org/b/id/11200092-M.jpg', sourceId: '/works/OL21745884W',
    started: 'Jun 9',
    sessions: [{ date: 'Jun 22', pages: 46 }, { date: 'Jun 21', pages: 60 }, { date: 'Jun 19', pages: 72 }],
  },
  {
    id: 'b3', title: 'The Creative Act', author: 'Rick Rubin', genre: 'Nonfiction',
    pages: 432, rating: 4, status: 'reading', page: 96, cover: '#9a6849', coverUrl: 'https://covers.openlibrary.org/b/id/13316390-M.jpg', sourceId: '/works/OL27955361W',
    started: 'Jun 2',
    sessions: [{ date: 'Jun 15', pages: 24 }, { date: 'Jun 8', pages: 40 }, { date: 'Jun 5', pages: 32 }],
  },
  { id: 'b4', title: 'Tomorrow, and Tomorrow, and Tomorrow', author: 'Gabrielle Zevin', genre: 'Fiction', pages: 416, rating: 4.5, status: 'finished', page: 416, cover: '#5b4a66', coverUrl: 'https://covers.openlibrary.org/b/id/12859975-M.jpg', sourceId: '/works/OL26004554W' },
  { id: 'b5', title: 'Klara and the Sun', author: 'Kazuo Ishiguro', genre: 'Sci-Fi', pages: 320, rating: 4, status: 'finished', page: 320, cover: '#356a68', coverUrl: 'https://covers.openlibrary.org/b/id/10648686-M.jpg', sourceId: '/works/OL20883297W' },
  { id: 'b6', title: 'Educated', author: 'Tara Westover', genre: 'Memoir', pages: 352, rating: 5, status: 'finished', page: 352, cover: '#33444b', coverUrl: 'https://covers.openlibrary.org/b/id/8314077-M.jpg', sourceId: '/works/OL18139176W' },
  { id: 'b7', title: 'Pachinko', author: 'Min Jin Lee', genre: 'Fiction', pages: 496, rating: 5, status: 'finished', page: 496, cover: '#5a6a4d', coverUrl: 'https://covers.openlibrary.org/b/id/8044605-M.jpg', sourceId: '/works/OL17762217W' },
  { id: 'b8', title: 'A Gentleman in Moscow', author: 'Amor Towles', genre: 'Fiction', pages: 462, rating: 4.5, status: 'finished', page: 462, cover: '#9a6849', coverUrl: 'https://covers.openlibrary.org/b/id/11326818-M.jpg', sourceId: '/works/OL17797130W' },
  { id: 'b9', title: 'Circe', author: 'Madeline Miller', genre: 'Fantasy', pages: 393, rating: 4.5, status: 'finished', page: 393, cover: '#5b4a66', coverUrl: 'https://covers.openlibrary.org/b/id/8739376-M.jpg', sourceId: '/works/OL18012166W' },
  { id: 'b10', title: 'Babel', author: 'R.F. Kuang', genre: 'Fantasy', pages: 544, rating: 0, status: 'want', page: 0, cover: '#4f7a6a', coverUrl: 'https://covers.openlibrary.org/b/id/12468631-M.jpg', sourceId: '/works/OL26443093W' },
  { id: 'b11', title: 'Demon Copperhead', author: 'Barbara Kingsolver', genre: 'Fiction', pages: 560, rating: 0, status: 'want', page: 0, cover: '#356a68', coverUrl: 'https://covers.openlibrary.org/b/id/13141227-M.jpg', sourceId: '/works/OL27052926W' },
  { id: 'b12', title: 'Sea of Tranquility', author: 'Emily St. John Mandel', genre: 'Sci-Fi', pages: 272, rating: 0, status: 'want', page: 0, cover: '#2a2c33', coverUrl: 'https://covers.openlibrary.org/b/id/11465138-M.jpg', sourceId: '/works/OL24731706W' },
];
