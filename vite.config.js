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
                // Code splitting para mejorar el rendimiento
                manualChunks: (id) => {
                    // Separar vendors en chunks más pequeños
                    if (id.includes('node_modules')) {
                        // React y librerías relacionadas
                        if (id.includes('react') || id.includes('react-dom')) {
                            return 'react-vendor';
                        }
                        // Framer Motion
                        if (id.includes('framer-motion')) {
                            return 'framer-vendor';
                        }
                        // Swiper
                        if (id.includes('swiper')) {
                            return 'swiper-vendor';
                        }
                        // Otras librerías grandes
                        if (id.includes('lucide-react') || id.includes('react-modal')) {
                            return 'ui-vendor';
                        }
                        // Todo lo demás de node_modules
                        return 'vendor';
                    }
                },
            },
        },
        // Optimizaciones adicionales
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true, // Eliminar console.log en producción
                drop_debugger: true,
            },
        },
        cssMinify: true,
        reportCompressedSize: false, // Desactivar para builds más rápidos
        chunkSizeWarningLimit: 1000,
    },
    optimizeDeps: {
        include: ["translate"],
    },
});
