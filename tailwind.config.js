/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				exo: ["Exo", "sans-serif"],
				anek: ["Anek Latin", "sans-serif"],
			},
			colors: {
				"oxford-blue": "#0F172A",
				"star-command-blue": "#0077B6",
				"pacific-blue": "#00B4D8",
				"middle-blue": "#90E0EF",
				"light-cyan": "#CAF0F8",
			},
			animation: {
				fadeIn: "fadeIn 1s ease-in-out 1",
			},
			keyframes: {
				fadeIn: {
					"0%": { opacity: 0 },
					"100%": { opacity: 1 },
				},
			},
		},
	},
	plugins: [],
};
