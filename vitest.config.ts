import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
    coverage: {
      provider: 'v8',
      include: ['src/lib/**/*.ts', 'src/components/**/*.tsx'],
      exclude: ['src/lib/i18n/en.ts', 'src/lib/i18n/zhTW.ts', 'src/lib/i18n/zhCN.ts', 'src/lib/i18n/types.ts', 'src/lib/types.ts', 'src/lib/index.ts'],
    },
  },
});
