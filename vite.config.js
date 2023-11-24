import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true,
        additionalData: "@import './src/style/variable.scss';"
      },
    },
  },
  //代理跨域
  server: {
    proxy: {
      "/api": {
        //获取数据的服务器地址设置
        target: "https://minimax.awayroadtrip.com",
        //需要代理跨域
        changeOrigin: true,
        //路径重写
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
