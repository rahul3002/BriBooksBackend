/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#6366f1', // Indigo 500
                    hover: '#4f46e5', // Indigo 600
                },
                secondary: {
                    DEFAULT: '#ec4899', // Pink 500
                    hover: '#db2777', // Pink 600
                },
                accent: {
                    DEFAULT: '#10b981', // Emerald 500
                    hover: '#059669', // Emerald 600
                },
                background: '#f8fafc', // Slate 50
            },
            fontFamily: {
                sans: ['Signika', 'sans-serif'],
                display: ['"Chalkboard SE"', 'Comic Neue', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
