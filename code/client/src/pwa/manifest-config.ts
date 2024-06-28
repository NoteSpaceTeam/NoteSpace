import {ManifestOptions} from "vite-plugin-pwa";

const manifestConfig : Partial<ManifestOptions> = {
    name: 'NoteSpace',
    short_name: 'NoteSpace',
    description: 'A multiplatform note management and sharing app',
    theme_color: '#ffffff',
    icons: [
        {
            src: '/assets/icon.png',
            sizes: '192x192',
            type: 'image/png',
        },
        {
            src: '/assets/icon.png',
            sizes: '512x512',
            type: 'image/png',
        },
    ],
}

export default manifestConfig;