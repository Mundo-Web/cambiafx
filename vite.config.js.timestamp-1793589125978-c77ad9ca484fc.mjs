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
        ...glob.sync("resources/js/*.jsx"),
        ...glob.sync("resources/js/Landings/*.jsx"),
        ...glob.sync("resources/js/Admin/*.jsx"),
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
            if (id.includes("xlsx")) {
              return "vendor-xlsx";
            }
            if (id.includes("jspdf")) {
              return "vendor-pdf";
            }
            if (id.includes("chart.js")) {
              return "vendor-charts";
            }
            if (id.includes("tinymce")) {
              return "vendor-tinymce";
            }
            if (id.includes("sweetalert2")) {
              return "vendor-sweetalert";
            }
            if (id.includes("@react-google-maps")) {
              return "vendor-maps";
            }
            if (id.includes("moment")) {
              return "vendor-moment";
            }
            if (id.includes("react-spring") || id.includes("@react-spring")) {
              return "vendor-spring";
            }
            if (id.includes("framer-motion") || id.includes("/motion/")) {
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
            if (id.includes("react") || id.includes("scheduler") || id.includes("@inertiajs")) {
              return "vendor-react";
            }
            return "vendor-core";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFx4YW1wcFxcXFxodGRvY3NcXFxccHJvamVjdHNcXFxcY29tYmlhZnhfcmVzcGFsZG9cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXHhhbXBwXFxcXGh0ZG9jc1xcXFxwcm9qZWN0c1xcXFxjb21iaWFmeF9yZXNwYWxkb1xcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzoveGFtcHAvaHRkb2NzL3Byb2plY3RzL2NvbWJpYWZ4X3Jlc3BhbGRvL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IGdsb2IgZnJvbSBcImdsb2JcIjtcbmltcG9ydCBsYXJhdmVsIGZyb20gXCJsYXJhdmVsLXZpdGUtcGx1Z2luXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICBzZXJ2ZXI6IHtcbiAgICAgICAgd2F0Y2g6IHtcbiAgICAgICAgICAgIGlnbm9yZWQ6IFtcIiEqKi9ub2RlX21vZHVsZXMveW91ci1wYWNrYWdlLW5hbWUvKipcIl0sXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICAgIGxhcmF2ZWwoe1xuICAgICAgICAgICAgaW5wdXQ6IFtcbiAgICAgICAgICAgICAgICAuLi5nbG9iLnN5bmMoXCJyZXNvdXJjZXMvanMvKi5qc3hcIiksXG4gICAgICAgICAgICAgICAgLi4uZ2xvYi5zeW5jKFwicmVzb3VyY2VzL2pzL0xhbmRpbmdzLyouanN4XCIpLFxuICAgICAgICAgICAgICAgIC4uLmdsb2Iuc3luYyhcInJlc291cmNlcy9qcy9BZG1pbi8qLmpzeFwiKSxcbiAgICAgICAgICAgICAgICBcInJlc291cmNlcy9jc3MvYXBwLmNzc1wiLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHJlZnJlc2g6IHRydWUsXG4gICAgICAgIH0pLFxuICAgICAgICByZWFjdCgpLFxuICAgIF0sXG4gICAgLy8gcmVzb2x2ZTogbmFtZSA9PiB7XG4gICAgLy8gICAgIGNvbnN0IHBhZ2VzID0gaW1wb3J0Lm1ldGEuZ2xvYignLi9QYWdlcy8qKi8qLmpzeCcsIHsgZWFnZXI6IHRydWUgfSlcbiAgICAvLyAgICAgcmV0dXJuIHBhZ2VzW2AuL1BhZ2VzLyR7bmFtZX0uanN4YF1cbiAgICAvLyB9LFxuICAgIHJlc29sdmU6IHtcbiAgICAgICAgYWxpYXM6IHtcbiAgICAgICAgICAgIFwiQEFkbWludG9cIjogcGF0aC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgIF9fZGlybmFtZSxcbiAgICAgICAgICAgICAgICBcInJlc291cmNlcy9qcy9Db21wb25lbnRzL0FkbWludG9cIlxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIFwiQFRhaWx3aW5kXCI6IHBhdGgucmVzb2x2ZShcbiAgICAgICAgICAgICAgICBfX2Rpcm5hbWUsXG4gICAgICAgICAgICAgICAgXCJyZXNvdXJjZXMvanMvQ29tcG9uZW50cy9UYWlsd2luZFwiXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgXCJAVXRpbHNcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJyZXNvdXJjZXMvanMvVXRpbHNcIiksXG4gICAgICAgICAgICBcIkBSZXN0XCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwicmVzb3VyY2VzL2pzL0FjdGlvbnNcIiksXG4gICAgICAgIH0sXG4gICAgICAgIGRlZHVwZTogWydyZWFjdCcsICdyZWFjdC1kb20nLCAnc2NoZWR1bGVyJ10sIC8vIEV2aXRhciBkdXBsaWNhZG9zIGRlIFJlYWN0XG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICAgICAgICBtYW51YWxDaHVua3MoaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gMS4gTGlicmVyXHUwMEVEYXMgbWFzaXZhcyBkZSBhZG1pbmlzdHJhY2lcdTAwRjNuIHkgZXhwb3J0YWNpXHUwMEYzbiAoYVx1MDBFRHNsYW4gKzEuNSBNQiBkZSBsYSBIb21lKVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCd4bHN4JykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ3ZlbmRvci14bHN4JztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnanNwZGYnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAndmVuZG9yLXBkZic7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ2NoYXJ0LmpzJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ3ZlbmRvci1jaGFydHMnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCd0aW55bWNlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ3ZlbmRvci10aW55bWNlJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnc3dlZXRhbGVydDInKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAndmVuZG9yLXN3ZWV0YWxlcnQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdAcmVhY3QtZ29vZ2xlLW1hcHMnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAndmVuZG9yLW1hcHMnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdtb21lbnQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAndmVuZG9yLW1vbWVudCc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ3JlYWN0LXNwcmluZycpIHx8IGlkLmluY2x1ZGVzKCdAcmVhY3Qtc3ByaW5nJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ3ZlbmRvci1zcHJpbmcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAyLiBDb21wb25lbnRlcyBVSSB5IHV0aWxpdGFyaW9zXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ2ZyYW1lci1tb3Rpb24nKSB8fCBpZC5pbmNsdWRlcygnL21vdGlvbi8nKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAndmVuZG9yLWZyYW1lci1tb3Rpb24nO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdzd2lwZXInKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAndmVuZG9yLXN3aXBlcic7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ2x1Y2lkZS1yZWFjdCcpIHx8IGlkLmluY2x1ZGVzKCdyZWFjdC1pY29ucycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3ItaWNvbnMnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdheGlvcycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3ItYXhpb3MnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAzLiBOXHUwMEZBY2xlbyBSZWFjdCArIEluZXJ0aWFcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygncmVhY3QnKSB8fCBpZC5pbmNsdWRlcygnc2NoZWR1bGVyJykgfHwgaWQuaW5jbHVkZXMoJ0BpbmVydGlhanMnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAndmVuZG9yLXJlYWN0JztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3ItY29yZSc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICAgICAgdGVyc2VyT3B0aW9uczoge1xuICAgICAgICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBwdXJlX2Z1bmNzOiBbJ2NvbnNvbGUubG9nJywgJ2NvbnNvbGUuaW5mbycsICdjb25zb2xlLmRlYnVnJ10sXG4gICAgICAgICAgICAgICAgcGFzc2VzOiAyLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1hbmdsZToge1xuICAgICAgICAgICAgICAgIHNhZmFyaTEwOiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZvcm1hdDoge1xuICAgICAgICAgICAgICAgIGNvbW1lbnRzOiBmYWxzZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcbiAgICAgICAgY3NzTWluaWZ5OiB0cnVlLFxuICAgICAgICByZXBvcnRDb21wcmVzc2VkU2l6ZTogZmFsc2UsXG4gICAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNTAwLFxuICAgICAgICBzb3VyY2VtYXA6ICdoaWRkZW4nLCAvLyBIaWRkZW4gc291cmNlbWFwcyBwYXJhIGRpYWduXHUwMEYzc3RpY28gaW50ZXJubyBzaW4gZXhwb25lciBjXHUwMEYzZGlnbyBhIHVzdWFyaW9zIHBcdTAwRkFibGljb3NcbiAgICAgICAgYXNzZXRzSW5saW5lTGltaXQ6IDQwOTYsIC8vIElubGluZSBhc3NldHMgc21hbGxlciB0aGFuIDRrYlxuICAgIH0sXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICAgIGluY2x1ZGU6IFtcInRyYW5zbGF0ZVwiXSxcbiAgICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTBULE9BQU8sVUFBVTtBQUMzVSxPQUFPLGFBQWE7QUFDcEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUpsQixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixRQUFRO0FBQUEsSUFDSixPQUFPO0FBQUEsTUFDSCxTQUFTLENBQUMsdUNBQXVDO0FBQUEsSUFDckQ7QUFBQSxFQUNKO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDTCxRQUFRO0FBQUEsTUFDSixPQUFP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
