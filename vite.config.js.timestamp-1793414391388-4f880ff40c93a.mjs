// vite.config.js
import glob from "file:///C:/xampp/htdocs/projects/combiafx_respaldo/node_modules/glob/glob.js";
import laravel from "file:///C:/xampp/htdocs/projects/combiafx_respaldo/node_modules/laravel-vite-plugin/dist/index.js";
import path from "path";
import { defineConfig } from "file:///C:/xampp/htdocs/projects/combiafx_respaldo/node_modules/vite/dist/node/index.js";
import react from "file:///C:/xampp/htdocs/projects/combiafx_respaldo/node_modules/@vitejs/plugin-react/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\xampp\\htdocs\\projects\\combiafx_respaldo";
var vite_config_default = defineConfig({
  server: {
    watch: {
      ignored: ["!**/node_modules/your-package-name/**"]
    }
  },
  plugins: [
    laravel({
      input: [
        ...glob.sync("resources/js/**/*.jsx"),
        "resources/css/app.css"
      ],
      refresh: true
    }),
    react()
  ],
  // resolve: name => {
  //     const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
  //     return pages[`./Pages/${name}.jsx`]
  // },
  resolve: {
    alias: {
      "@Adminto": path.resolve(
        __vite_injected_original_dirname,
        "resources/js/Components/Adminto"
      ),
      "@Tailwind": path.resolve(
        __vite_injected_original_dirname,
        "resources/js/Components/Tailwind"
      ),
      "@Utils": path.resolve(__vite_injected_original_dirname, "resources/js/Utils"),
      "@Rest": path.resolve(__vite_injected_original_dirname, "resources/js/Actions")
    },
    dedupe: ["react", "react-dom", "scheduler"]
    // Evitar duplicados de React
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("framer-motion")) {
              return "vendor-framer-motion";
            }
            if (id.includes("swiper")) {
              return "vendor-swiper";
            }
            if (id.includes("lucide-react") || id.includes("react-icons")) {
              return "vendor-icons";
            }
            if (id.includes("axios")) {
              return "vendor-axios";
            }
            return "vendor";
          }
        }
      }
    },
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug"],
        passes: 2
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    },
    cssCodeSplit: true,
    cssMinify: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 500,
    sourcemap: "hidden",
    // Hidden sourcemaps para diagnóstico interno sin exponer código a usuarios públicos
    assetsInlineLimit: 4096
    // Inline assets smaller than 4kb
  },
  optimizeDeps: {
    include: ["translate"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFx4YW1wcFxcXFxodGRvY3NcXFxccHJvamVjdHNcXFxcY29tYmlhZnhfcmVzcGFsZG9cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXHhhbXBwXFxcXGh0ZG9jc1xcXFxwcm9qZWN0c1xcXFxjb21iaWFmeF9yZXNwYWxkb1xcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzoveGFtcHAvaHRkb2NzL3Byb2plY3RzL2NvbWJpYWZ4X3Jlc3BhbGRvL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IGdsb2IgZnJvbSBcImdsb2JcIjtcbmltcG9ydCBsYXJhdmVsIGZyb20gXCJsYXJhdmVsLXZpdGUtcGx1Z2luXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICBzZXJ2ZXI6IHtcbiAgICAgICAgd2F0Y2g6IHtcbiAgICAgICAgICAgIGlnbm9yZWQ6IFtcIiEqKi9ub2RlX21vZHVsZXMveW91ci1wYWNrYWdlLW5hbWUvKipcIl0sXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICAgIGxhcmF2ZWwoe1xuICAgICAgICAgICAgaW5wdXQ6IFtcbiAgICAgICAgICAgICAgICAuLi5nbG9iLnN5bmMoXCJyZXNvdXJjZXMvanMvKiovKi5qc3hcIiksXG4gICAgICAgICAgICAgICAgXCJyZXNvdXJjZXMvY3NzL2FwcC5jc3NcIixcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICByZWZyZXNoOiB0cnVlLFxuICAgICAgICB9KSxcbiAgICAgICAgcmVhY3QoKSxcbiAgICBdLFxuICAgIC8vIHJlc29sdmU6IG5hbWUgPT4ge1xuICAgIC8vICAgICBjb25zdCBwYWdlcyA9IGltcG9ydC5tZXRhLmdsb2IoJy4vUGFnZXMvKiovKi5qc3gnLCB7IGVhZ2VyOiB0cnVlIH0pXG4gICAgLy8gICAgIHJldHVybiBwYWdlc1tgLi9QYWdlcy8ke25hbWV9LmpzeGBdXG4gICAgLy8gfSxcbiAgICByZXNvbHZlOiB7XG4gICAgICAgIGFsaWFzOiB7XG4gICAgICAgICAgICBcIkBBZG1pbnRvXCI6IHBhdGgucmVzb2x2ZShcbiAgICAgICAgICAgICAgICBfX2Rpcm5hbWUsXG4gICAgICAgICAgICAgICAgXCJyZXNvdXJjZXMvanMvQ29tcG9uZW50cy9BZG1pbnRvXCJcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBcIkBUYWlsd2luZFwiOiBwYXRoLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgX19kaXJuYW1lLFxuICAgICAgICAgICAgICAgIFwicmVzb3VyY2VzL2pzL0NvbXBvbmVudHMvVGFpbHdpbmRcIlxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIFwiQFV0aWxzXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwicmVzb3VyY2VzL2pzL1V0aWxzXCIpLFxuICAgICAgICAgICAgXCJAUmVzdFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInJlc291cmNlcy9qcy9BY3Rpb25zXCIpLFxuICAgICAgICB9LFxuICAgICAgICBkZWR1cGU6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3NjaGVkdWxlciddLCAvLyBFdml0YXIgZHVwbGljYWRvcyBkZSBSZWFjdFxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICAgICAgbWFudWFsQ2h1bmtzKGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnZnJhbWVyLW1vdGlvbicpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3ItZnJhbWVyLW1vdGlvbic7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ3N3aXBlcicpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3Itc3dpcGVyJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbHVjaWRlLXJlYWN0JykgfHwgaWQuaW5jbHVkZXMoJ3JlYWN0LWljb25zJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ3ZlbmRvci1pY29ucyc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ2F4aW9zJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ3ZlbmRvci1heGlvcyc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ3ZlbmRvcic7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICAgICAgdGVyc2VyT3B0aW9uczoge1xuICAgICAgICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBwdXJlX2Z1bmNzOiBbJ2NvbnNvbGUubG9nJywgJ2NvbnNvbGUuaW5mbycsICdjb25zb2xlLmRlYnVnJ10sXG4gICAgICAgICAgICAgICAgcGFzc2VzOiAyLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1hbmdsZToge1xuICAgICAgICAgICAgICAgIHNhZmFyaTEwOiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZvcm1hdDoge1xuICAgICAgICAgICAgICAgIGNvbW1lbnRzOiBmYWxzZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcbiAgICAgICAgY3NzTWluaWZ5OiB0cnVlLFxuICAgICAgICByZXBvcnRDb21wcmVzc2VkU2l6ZTogZmFsc2UsXG4gICAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNTAwLFxuICAgICAgICBzb3VyY2VtYXA6ICdoaWRkZW4nLCAvLyBIaWRkZW4gc291cmNlbWFwcyBwYXJhIGRpYWduXHUwMEYzc3RpY28gaW50ZXJubyBzaW4gZXhwb25lciBjXHUwMEYzZGlnbyBhIHVzdWFyaW9zIHBcdTAwRkFibGljb3NcbiAgICAgICAgYXNzZXRzSW5saW5lTGltaXQ6IDQwOTYsIC8vIElubGluZSBhc3NldHMgc21hbGxlciB0aGFuIDRrYlxuICAgIH0sXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICAgIGluY2x1ZGU6IFtcInRyYW5zbGF0ZVwiXSxcbiAgICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTBULE9BQU8sVUFBVTtBQUMzVSxPQUFPLGFBQWE7QUFDcEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUpsQixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixRQUFRO0FBQUEsSUFDSixPQUFPO0FBQUEsTUFDSCxTQUFTLENBQUMsdUNBQXVDO0FBQUEsSUFDckQ7QUFBQSxFQUNKO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDTCxRQUFRO0FBQUEsTUFDSixPQUFPO0FBQUEsUUFDSCxHQUFHLEtBQUssS0FBSyx1QkFBdUI7QUFBQSxRQUNwQztBQUFBLE1BQ0o7QUFBQSxNQUNBLFNBQVM7QUFBQSxJQUNiLENBQUM7QUFBQSxJQUNELE1BQU07QUFBQSxFQUNWO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUtBLFNBQVM7QUFBQSxJQUNMLE9BQU87QUFBQSxNQUNILFlBQVksS0FBSztBQUFBLFFBQ2I7QUFBQSxRQUNBO0FBQUEsTUFDSjtBQUFBLE1BQ0EsYUFBYSxLQUFLO0FBQUEsUUFDZDtBQUFBLFFBQ0E7QUFBQSxNQUNKO0FBQUEsTUFDQSxVQUFVLEtBQUssUUFBUSxrQ0FBVyxvQkFBb0I7QUFBQSxNQUN0RCxTQUFTLEtBQUssUUFBUSxrQ0FBVyxzQkFBc0I7QUFBQSxJQUMzRDtBQUFBLElBQ0EsUUFBUSxDQUFDLFNBQVMsYUFBYSxXQUFXO0FBQUE7QUFBQSxFQUM5QztBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0gsZUFBZTtBQUFBLE1BQ1gsUUFBUTtBQUFBLFFBQ0osYUFBYSxJQUFJO0FBQ2IsY0FBSSxHQUFHLFNBQVMsY0FBYyxHQUFHO0FBQzdCLGdCQUFJLEdBQUcsU0FBUyxlQUFlLEdBQUc7QUFDOUIscUJBQU87QUFBQSxZQUNYO0FBQ0EsZ0JBQUksR0FBRyxTQUFTLFFBQVEsR0FBRztBQUN2QixxQkFBTztBQUFBLFlBQ1g7QUFDQSxnQkFBSSxHQUFHLFNBQVMsY0FBYyxLQUFLLEdBQUcsU0FBUyxhQUFhLEdBQUc7QUFDM0QscUJBQU87QUFBQSxZQUNYO0FBQ0EsZ0JBQUksR0FBRyxTQUFTLE9BQU8sR0FBRztBQUN0QixxQkFBTztBQUFBLFlBQ1g7QUFDQSxtQkFBTztBQUFBLFVBQ1g7QUFBQSxRQUNKO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxJQUNBLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNYLFVBQVU7QUFBQSxRQUNOLGNBQWM7QUFBQSxRQUNkLGVBQWU7QUFBQSxRQUNmLFlBQVksQ0FBQyxlQUFlLGdCQUFnQixlQUFlO0FBQUEsUUFDM0QsUUFBUTtBQUFBLE1BQ1o7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNKLFVBQVU7QUFBQSxNQUNkO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDSixVQUFVO0FBQUEsTUFDZDtBQUFBLElBQ0o7QUFBQSxJQUNBLGNBQWM7QUFBQSxJQUNkLFdBQVc7QUFBQSxJQUNYLHNCQUFzQjtBQUFBLElBQ3RCLHVCQUF1QjtBQUFBLElBQ3ZCLFdBQVc7QUFBQTtBQUFBLElBQ1gsbUJBQW1CO0FBQUE7QUFBQSxFQUN2QjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1YsU0FBUyxDQUFDLFdBQVc7QUFBQSxFQUN6QjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
