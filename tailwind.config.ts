import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
    theme: {
        extend: {
            container: {
                center: true,
                padding: '1rem'
            },
            fontFamily: {
                sans: ["Inter"],
                serif: ["source-serif-pro", ...defaultTheme.fontFamily.serif],
                mono: ["Inter"],
                display: ["Inter"],
                body: ["Inter"],
            },
            colors: {
                primary: {
                    DEFAULT: '#4f46e5',
                    dark: '#f9b537'
                },
                backdrop: {
                    DEFAULT: '#ffffff',
                    dark: '#333333'
                },
                body: {
                    DEFAULT: '#333333',
                    dark: '#f6f7ee'
                }
            },
        },

    },
}
