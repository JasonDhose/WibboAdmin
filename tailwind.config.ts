import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'

export default {
    mode: 'jit',
    content: ['./src/components/**/*.{js,vue,ts}', './src/layouts/**/*.vue', './src/pages/**/*.vue', './src/app.vue', './src/error.vue', './src/plugins/**/*.{js,ts}', './nuxt.config.{js,ts}'],
    darkMode: 'class',
    theme: {
        container: {
            center: true,
        },
        screens: {
            sm: '576px',
            md: '768px',
            lg: '992px',
            xl: '1200px',
            '2xl': '1400px',
        },
    },
    daisyui: {
        themes: [
            {
                mytheme: {
                    primary: '#111827',
                    secondary: '#374151',
                    accent: '#00ffff',
                    neutral: '#4b5563',
                    'base-100': '#1d232a',
                    info: '#1e3a8a',
                    success: '#166534',
                    warning: '#a16207',
                    error: '#b91c1c',
                },
            },
        ],
    },
    plugins: [daisyui],
} satisfies Config
