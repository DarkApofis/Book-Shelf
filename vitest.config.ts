import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Domain logic is pure — no DOM needed.
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/domain/**'],
    },
  },
});
