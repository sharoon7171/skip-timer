import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { copyFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Plugin to copy manifest.json to dist folder
const copyManifestPlugin = () => {
  return {
    name: 'copy-manifest',
    writeBundle() {
      const manifestPath = resolve(__dirname, 'manifest.json');
      const distManifestPath = resolve(__dirname, 'dist/manifest.json');

      if (existsSync(manifestPath)) {
        copyFileSync(manifestPath, distManifestPath);
      }
    }
  };
};

export default defineConfig({
  plugins: [copyManifestPlugin()],
  build: {
    rollupOptions: {
      input: {
        'multiup-content-script': resolve(__dirname, 'src/content-scripts/multiup-content-script.ts'),
        'hubcdn-redirect-content-script': resolve(__dirname, 'src/content-scripts/hubcdn-redirect-content-script.ts'),
        'hdhub4u-timer-bypass-content-script': resolve(__dirname, 'src/content-scripts/hdhub4u-timer-bypass-content-script.ts'),
        'hdhublist-main-domain-content-script': resolve(__dirname, 'src/content-scripts/hdhublist-main-domain-content-script.ts'),
        'hdhub4u-main-domain-instant-redirect-content-script': resolve(__dirname, 'src/content-scripts/hdhub4u-main-domain-instant-redirect-content-script.ts'),
        'shrtfly-redirect-content-script': resolve(__dirname, 'src/content-scripts/shrtfly-redirect-content-script.ts')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    },
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser', // Enable minification with terser
    target: 'es2020',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true
      }
    }
  }
});
