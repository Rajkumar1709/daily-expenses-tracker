/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Custom colors based on "Minimalist" and "Dark Mode" requirement
                dark: {
                    bg: '#121212',
                    surface: '#1E1E1E',
                    text: '#E0E0E0',
                },
                primary: '#4CAF50', // Green/Teal for Income
                danger: '#F44336', // Red/Orange for Expenditure
                info: '#2196F3', // Blue/Indigo for Savings
                warning: '#FFC107',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
