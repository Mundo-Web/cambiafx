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
    },
    build: {
        rollupOptions: {
            output: {
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name == "app-C6GHMxSp.css") return "app.css";
                    return assetInfo.name;
                },
                manualChunks: (id) => {
                    // React core y dependencies críticas
                    if (id.includes('node_modules/react') || 
                        id.includes('node_modules/react-dom') || 
                        id.includes('node_modules/@inertiajs')) {
                        return 'vendor-react';
                    }
                    
                    // Animaciones (framer-motion, motion)
                    if (id.includes('node_modules/framer-motion') || 
                        id.includes('node_modules/motion')) {
                        return 'vendor-motion';
                    }
                    
                    // UI Libraries (swiper, sweetalert2, tippy)
                    if (id.includes('node_modules/swiper') || 
                        id.includes('node_modules/sweetalert2') || 
                        id.includes('node_modules/tippy.js') ||
                        id.includes('node_modules/@tippyjs')) {
                        return 'vendor-ui';
                    }
                    
                    // Chart.js y dependencias de gráficos
                    if (id.includes('node_modules/chart.js')) {
                        return 'vendor-charts';
                    }
                    
                    // Google Maps
                    if (id.includes('node_modules/@react-google-maps')) {
                        return 'vendor-maps';
                    }
                    
                    // Utilidades (moment, jquery, etc.)
                    if (id.includes('node_modules/moment') || 
                        id.includes('node_modules/jquery')) {
                        return 'vendor-utils';
                    }
                    
                    // Icons
                    if (id.includes('node_modules/react-icons') ||
                        id.includes('node_modules/lucide-react')) {
                        return 'vendor-icons';
                    }
                    
                    // Resto de node_modules
                    if (id.includes('node_modules')) {
                        return 'vendor-other';
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
        sourcemap: false, // Disable sourcemaps in production for smaller bundles
        assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    },
    optimizeDeps: {
        include: ["translate"],
    },
});
