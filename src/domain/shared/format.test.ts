import { describe, it, expect } from 'vitest';
import {
  formatRating, formatThousands, parseDateLabel, statusLabel, toDateLabel, truncateTitle,
} from './format';

describe('formatThousands', () => {
  it('inserts separators', () => {
    expect(formatThousands(7184)).toBe('7,184');
    expect(formatThousands(17640)).toBe('17,640');
    expect(formatThousands(96)).toBe('96');
  });
});

describe('formatRating', () => {
  it('shows a star for positive ratings', () => {
    expect(formatRating(4.5)).toBe('★ 4.5');
  });
  it('shows a dash when unrated', () => {
    expect(formatRating(0)).toBe('—');
  });
});

describe('statusLabel', () => {
  it('maps each status to its label', () => {
    expect(statusLabel('reading')).toBe('Reading');
    expect(statusLabel('want')).toBe('Want to read');
    expect(statusLabel('finished')).toBe('Finished');
  });
});

describe('truncateTitle', () => {
  it('leaves short titles intact', () => {
    expect(truncateTitle('Circe')).toBe('Circe');
  });
  it('truncates long titles with an ellipsis', () => {
    const result = truncateTitle('Tomorrow, and Tomorrow, and Tomorrow');
    expect(result.endsWith('…')).toBe(true);
    expect(result.length).toBe(25); // 24 chars + ellipsis
  });
});

describe('date labels', () => {
  it('parses a label into the given year', () => {
    const d = parseDateLabel('Jun 14', 2026);
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(5);
    expect(d.getDate()).toBe(14);
  });
  it('round-trips through toDateLabel', () => {
    expect(toDateLabel(new Date(2026, 5, 23))).toBe('Jun 23');
  });
});
