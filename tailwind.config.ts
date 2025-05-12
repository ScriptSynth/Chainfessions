
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'press-start': ['"Press Start 2P"', 'cursive'],
				'vt323': ['"VT323"', 'monospace'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				terminal: {
					black: '#0c0c0c',
					darkgray: '#121212',
					green: '#00ff41',
					purple: '#9b87f5',
					cyan: '#1eaedb',
					darkpurple: '#1A1F2C',
					lightpurple: '#7E69AB',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				glitch: {
					'0%': { transform: 'translate(0)' },
					'20%': { transform: 'translate(-3px, 3px)' },
					'40%': { transform: 'translate(-3px, -3px)' },
					'60%': { transform: 'translate(3px, 3px)' },
					'80%': { transform: 'translate(3px, -3px)' },
					'100%': { transform: 'translate(0)' }
				},
				typing: {
					'from': { width: '0' },
					'to': { width: '100%' }
				},
				blink: {
					'from, to': { 'border-color': 'transparent' },
					'50%': { 'border-color': 'hsl(var(--primary))' }
				},
				flickerAnim: {
					'0%': { opacity: '0.2' },
					'5%': { opacity: '0.2' },
					'6%': { opacity: '0.8' },
					'11%': { opacity: '0.1' },
					'12%': { opacity: '0.8' },
					'17%': { opacity: '0.2' },
					'19%': { opacity: '0.2' },
					'20%': { opacity: '0.8' },
					'25%': { opacity: '0.2' },
					'30%': { opacity: '0.8' },
					'70%': { opacity: '0.7' },
					'72%': { opacity: '0.2' },
					'77%': { opacity: '0.9' },
					'100%': { opacity: '0.9' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'glitch': 'glitch 0.4s linear infinite',
				'typing': 'typing 3.5s steps(40, end), blink .75s step-end infinite',
				'flicker': 'flickerAnim 8s infinite alternate',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
