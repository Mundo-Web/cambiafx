/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.jsx",
        "./resources/**/*.vue",
    ],
    theme: {
        extend: {
            keyframes: {
                'fade-in-up': {
                    '0%': { opacity: 0, transform: 'translateY(32px)' },
                    '60%': { opacity: 0.7, transform: 'translateY(-8px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                'slide-down': {
                    '0%': { transform: 'translateY(-100%)', opacity: 0 },
                    '100%': { transform: 'translateY(0)', opacity: 1 },
                },
            },
            animation: {
                'fade-in-up': 'fade-in-up 1.1s cubic-bezier(0.22, 1, 0.36, 1) both',
                'slide-down': 'slide-down 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            },
            fontFamily: {
                title: ["GeneralSans", "sans-serif"],
                paragraph: ["Quicksand", "sans-serif"],

            },
            colors: {
                //azul: "#224483",
                negro: "#242424",

                /**CAMBIO Y GERENCIA */
                accent:"#1A1A1A",
                secondary:"#BBFF52",
                primary:"#F9F3E0",
                constrast:"#7E5AFB",
                "neutral-dark":"#0C0C0C",
                "neutral":"#ECE6FE",
                "neutral-light":"#222222",
                latte: "#FDF9F0",
                majorelle: "#6039F5",
                mindaro: "#E1FF8D",
            },
            // Puedes agregar personalizaciones aquí si es necesario
            lineClamp: {
                1: '1',
                2: '2',
                3: '3',
                4: '4',
            },
        },
    },
    plugins: [
        require("tailwindcss-animated"),
        function ({ addUtilities }) {
            const newUtilities = {
                ".scrollbar-hide": {
                    /* IE and Edge */
                    "-ms-overflow-style": "none",

                    /* Firefox */
                    "scrollbar-width": "none",

                    /* Safari and Chrome */
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                },
            };

            addUtilities(newUtilities);
        },
        // Otros plugins si los tienes
    ],
};
