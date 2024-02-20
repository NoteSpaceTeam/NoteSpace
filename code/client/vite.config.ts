import { defineConfig } from 'vite'
import {VitePWA} from "vite-plugin-pwa";
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
    publicDir: './public',
    plugins: [
        react(),
        VitePWA({
            mode: 'development',
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
                runtimeCaching : [{
                    urlPattern: ({url}) => {
                        return url.pathname.startsWith("/");
                    },
                    handler: "NetworkFirst" as const,
                    options:{
                        cacheName: "app-cache",
                        cacheableResponse : {
                            statuses: [0, 200]
                        }
                    }
                }]
            },
            injectRegister:'auto',
            registerType: 'autoUpdate',
            manifest:{
                name: 'NoteSpace',
                theme_color: '#ffffff',
                background_color: '#ffffff',
                scope: '.',
                start_url: '/',
                display: 'standalone',
                icons: [
                    {
                        src: '/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: "any maskable"
                    },
                    {
                        src: '/maskable-icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: "any maskable"
                    },
                ],
            },
            devOptions: {
                enabled: true,
            }
        }),
    ],
    resolve: {
        alias: {
            '@': Bun.fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})



