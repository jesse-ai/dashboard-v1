import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
const colors = require('tailwindcss/colors')

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
                transparent: 'transparent',
                current: 'currentColor',
                black: colors.black,
                green: colors.teal,
                red: colors.red,
                white: colors.white,
                gray: colors.trueGray,
                indigo: colors.indigo,
                yellow: colors.amber,
                'cool-gray': colors.coolGray,
                pink: colors.pink,
                blue: colors.blue,
                purple: colors.purple,
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
