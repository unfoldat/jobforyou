import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages(프로젝트 사이트) 기준. 도메인을 연결하면 site/base만 바꾸면 된다.
export default defineConfig({
  site: 'https://unfoldat.github.io',
  base: '/jobforyou',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
