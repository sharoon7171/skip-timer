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
        'service-worker': resolve(__dirname, 'src/background/service-worker.ts')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    },
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});
