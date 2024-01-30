import type {Config} from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter"],
                serif: ["source-serif-pro", ...defaultTheme.fontFamily.serif],
                mono: ["Inter"],
                display: ["Inter"],
                body: ["Inter"],
            },
        },
    },
}
