/** Seed Year-in-Review figures per reader scenario. Stand-in for an analytics API. */
import type { YirDataStore } from '../domain/yir/yir.types';

export const YIR_DATA: YirDataStore = {
  you: {
    books: 21, pages: 7184, avgRating: '4.3',
    monthly: [1, 2, 1, 3, 2, 1, 2, 3, 1, 2, 2, 1],
    genres: [['Fiction', 9], ['Sci-Fi', 5], ['Nonfiction', 3], ['Fantasy', 2], ['Memoir', 1], ['History', 1]],
    ratingDist: [['5', 9], ['4', 8], ['3', 3], ['2', 1], ['1', 0]],
    fave: { title: 'Pachinko', author: 'Min Jin Lee', cover: '#5a6a4d', note: "Couldn't put it down — you read the last 200 pages in a single sitting." },
    longest: ['The Covenant of Water', 736], shortest: ['Sea of Tranquility', 272],
    streak: 47, authors: 19, topAuthor: 'K. Ishiguro', topAuthorN: 2,
    headline: 'A year of big, generous novels — and a few that rearranged how you see things.',
    pagesNote: "That's about 23 pages every single day of the year.",
  },
  light: {
    books: 3, pages: 1064, avgRating: '4.7',
    monthly: [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
    genres: [['Fiction', 2], ['Memoir', 1]],
    ratingDist: [['5', 2], ['4', 1], ['3', 0], ['2', 0], ['1', 0]],
    fave: { title: 'Tomorrow, and Tomorrow…', author: 'Gabrielle Zevin', cover: '#5b4a66', note: 'The one that pulled you back into reading. Worth a hundred half-finished ones.' },
    longest: ['Tomorrow, and Tomorrow…', 416], shortest: ['The Midnight Library', 304],
    streak: 9, authors: 3, topAuthor: 'G. Zevin', topAuthorN: 1,
    headline: 'A small, deliberate year — and every single book counted.',
    pagesNote: 'Three books, three worlds you stayed up too late for.',
  },
  avid: {
    books: 52, pages: 17640, avgRating: '4.1',
    monthly: [4, 3, 5, 4, 6, 3, 5, 4, 5, 4, 5, 4],
    genres: [['Fiction', 18], ['Sci-Fi', 12], ['Fantasy', 8], ['Nonfiction', 6], ['History', 4], ['Memoir', 4]],
    ratingDist: [['5', 20], ['4', 21], ['3', 9], ['2', 2], ['1', 0]],
    fave: { title: 'The Covenant of Water', author: 'Abraham Verghese', cover: '#33444b', note: '736 pages — and you closed it wishing there were 736 more.' },
    longest: ['The Covenant of Water', 736], shortest: ['Bluets', 96],
    streak: 211, authors: 44, topAuthor: 'A. Patchett', topAuthorN: 3,
    headline: 'Basically a book a week, every week, all year long.',
    pagesNote: 'Roughly a full novel finished every single week.',
  },
};
