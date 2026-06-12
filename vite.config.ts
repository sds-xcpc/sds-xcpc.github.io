import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isUserOrOrgPage = repository.endsWith('.github.io');
const pagesBase = process.env.PAGES_BASE ?? (repository && !isUserOrOrgPage ? `/${repository}/` : '/');

export default defineConfig({
  plugins: [react()],
  base: pagesBase,
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
