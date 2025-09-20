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
        console.log('✅ Copied manifest.json to dist folder');
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
        'hdhub4u-main-domain-instant-redirect-content-script': resolve(__dirname, 'src/content-scripts/hdhub4u-main-domain-instant-redirect-content-script.ts')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    },
    outDir: 'dist',
    sourcemap: false,
    minify: false, // Disable minification to prevent variable name conflicts
    target: 'es2020'
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});
