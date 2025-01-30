import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				shrikhand: "'Shrikhand', system-ui"
			}
		}
	},

	plugins: []
} satisfies Config;
