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
                ...glob.sync("resources/js/**/*.jsx"),
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
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        // 1. Librerías masivas de administración y exportación (aíslan +1.5 MB de la Home)
                        if (id.includes('xlsx')) {
                            return 'vendor-xlsx';
                        }
                        if (id.includes('jspdf')) {
                            return 'vendor-pdf';
                        }
                        if (id.includes('chart.js')) {
                            return 'vendor-charts';
                        }
                        if (id.includes('tinymce')) {
                            return 'vendor-tinymce';
                        }
                        if (id.includes('sweetalert2')) {
                            return 'vendor-sweetalert';
                        }
                        if (id.includes('@react-google-maps')) {
                            return 'vendor-maps';
                        }
                        if (id.includes('moment')) {
                            return 'vendor-moment';
                        }
                        if (id.includes('react-spring') || id.includes('@react-spring')) {
                            return 'vendor-spring';
                        }

                        // 2. Componentes UI y utilitarios
                        if (id.includes('framer-motion') || id.includes('/motion/')) {
                            return 'vendor-framer-motion';
                        }
                        if (id.includes('swiper')) {
                            return 'vendor-swiper';
                        }
                        if (id.includes('lucide-react') || id.includes('react-icons')) {
                            return 'vendor-icons';
                        }
                        if (id.includes('axios')) {
                            return 'vendor-axios';
                        }

                        // 3. Núcleo React + Inertia
                        if (id.includes('react') || id.includes('scheduler') || id.includes('@inertiajs')) {
                            return 'vendor-react';
                        }

                        return 'vendor-core';
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
        chunkSizeWarningLimit: 500,
        sourcemap: 'hidden', // Hidden sourcemaps para diagnóstico interno sin exponer código a usuarios públicos
        assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    },
    optimizeDeps: {
        include: ["translate"],
    },
});
