import { defineConfig } from 'vite';

// GitHub Actions provides these; locally they are missing, so we show "build dev".
const sha = process.env.GITHUB_SHA ? process.env.GITHUB_SHA.slice(0, 7) : '';
const branch = process.env.GITHUB_REF_NAME || '';
const buildLabel = sha ? `build ${sha} (${branch})` : 'build dev';

export default defineConfig({
  base: '/stroller/',
  define: {
    __BUILD_LABEL__: JSON.stringify(buildLabel),
  },
});
