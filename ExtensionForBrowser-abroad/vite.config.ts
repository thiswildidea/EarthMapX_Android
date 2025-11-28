import { defineConfig ,loadEnv as ttloadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'

import { resolve, join } from 'path'
import { existsSync, mkdirSync, readdirSync, copyFileSync } from 'fs'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({mode, command })=>{
  const env = ttloadEnv(mode, process.cwd())
 return  {
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    // 开发环境下不需要复制静态资源，构建时会自动处理
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json',
          dest: '.'
        },
        {
          src: 'node_modules/@arcgis/core/assets/**/*',
          dest: 'assets'
        }
      ]
    }),
    // copyArcGISAssets()
  ],
  resolve: {
    alias: {
      '/@': resolve(__dirname, './src/')
    }
  },
  build: {
    outDir: 'dist',
    // target: ['es2020', 'edge88', 'firefox78', 'chrome87'],
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        format: 'es',
        entryFileNames: 'chunks/[name]-[hash].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'index.html') {
            return '[name][extname]'
          }
          return 'chunks/[name]-[hash].[ext]'
        }
      }
    },
    emptyOutDir: true
  },
  // esbuild: {
  //   target: 'es2020'
  // },
  // 开发服务器配置
  server: {
    // port: 5173,
    port: env.VITE_PORT,
    open: true,
    // hmr: {
    //   protocol: 'ws',
    //   host: 'localhost'
    // },
    // 配置代理以处理API请求
    proxy: {
      '/earthquake': {
        target: 'https://earthquake.usgs.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/earthquake/, '')
      },			
      '/api': {
        target: 'http://127.0.0.1:8080',
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/'),
      }
    },
  },
  base: './',
  publicDir: 'public'
}
})

function copyArcGISAssets() {
  return {
    name: 'copy-arcgis-assets',
    buildStart() {
      const sourceDir = resolve(__dirname, 'node_modules/@arcgis/core/assets');
      const targetDir = resolve(__dirname, 'dist/assets');
      
      if (!existsSync(sourceDir)) {
        console.warn('ArcGIS assets directory not found:', sourceDir);
        return;
      }

      function copyRecursive(src: string, dest: string) {
        if (!existsSync(dest)) {
          mkdirSync(dest, { recursive: true });
        }

        const entries = readdirSync(src, { withFileTypes: true });

        for (const entry of entries) {
          const srcPath = join(src, entry.name);
          const destPath = join(dest, entry.name);

          if (entry.isDirectory()) {
            copyRecursive(srcPath, destPath);
          } else {
            copyFileSync(srcPath, destPath);
          }
        }
      }

      copyRecursive(sourceDir, targetDir);
      console.log('ArcGIS assets copied to dist/assets');
    },
    // 构建完成后也复制一次，确保文件存在
    writeBundle() {
      const sourceDir = resolve(__dirname, 'node_modules/@arcgis/core/assets');
      const targetDir = resolve(__dirname, 'dist/assets');
      
      if (!existsSync(sourceDir)) {
        return;
      }

      function copyRecursive(src: string, dest: string) {
        if (!existsSync(dest)) {
          mkdirSync(dest, { recursive: true });
        }

        const entries = readdirSync(src, { withFileTypes: true });

        for (const entry of entries) {
          const srcPath = join(src, entry.name);
          const destPath = join(dest, entry.name);

          if (entry.isDirectory()) {
            copyRecursive(srcPath, destPath);
          } else {
            copyFileSync(srcPath, destPath);
          }
        }
      }

      copyRecursive(sourceDir, targetDir);
    }
  };
}
