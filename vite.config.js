import glob from "glob";
import laravel from "laravel-vite-plugin";
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    server: {
        watch: {
            ignored: ["!**/node_modules/your-package-name/**"],
        },
    },
    plugins: [
        laravel({
            input: [
                ...glob.sync("resources/js/*.jsx"),
                ...glob.sync("resources/js/Landings/*.jsx"),
                ...glob.sync("resources/js/Admin/*.jsx"),
                "resources/css/app.css",
            ],
            refresh: true,
        }),
        react(),
    ],
    // resolve: name => {
    //     const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
    //     return pages[`./Pages/${name}.jsx`]
    // },
    resolve: {
        alias: {
            "@Adminto": path.resolve(
                __dirname,
                "resources/js/Components/Adminto"
            ),
            "@Tailwind": path.resolve(
                __dirname,
                "resources/js/Components/Tailwind"
            ),
            "@Utils": path.resolve(__dirname, "resources/js/Utils"),
            "@Rest": path.resolve(__dirname, "resources/js/Actions"),
        },
        dedupe: ['react', 'react-dom', 'scheduler'], // Evitar duplicados de React
    },
    build: {
        target: 'esnext',
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.startsWith('\0') || id.includes('vite/')) {
                        return;
                    }
                    if (id.includes('node_modules')) {
                        // Aislar únicamente bibliotecas hoja pesadas e independientes
                        if (id.includes('xlsx')) {
                            return 'vendor-xlsx';
                        }
                        if (id.includes('chart.js') || id.includes('recharts')) {
                            return 'vendor-charts';
                        }
                        if (id.includes('tinymce') || id.includes('@tinymce')) {
                            return 'vendor-tinymce';
                        }
                        if (id.includes('swiper')) {
                            return 'vendor-swiper';
                        }
                        // Dejar que Rollup agrupe React, ReactDOM, Inertia y runtime
                        // de forma natural sin atrapar helpers ni crear dependencias circulares.
                    }
                },
            },
        },
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info', 'console.debug'],
                passes: 2,
            },
            mangle: {
                safari10: true,
            },
            format: {
                comments: false,
            },
        },
        cssCodeSplit: true,
        cssMinify: true,
        reportCompressedSize: false,
        chunkSizeWarningLimit: 1200,
        sourcemap: 'hidden', // Hidden sourcemaps para diagnóstico interno sin exponer código a usuarios públicos
        assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    },
    optimizeDeps: {
        include: ["translate"],
    },
});
