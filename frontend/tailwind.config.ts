import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "tertiary-fixed": "#e9ddff",
        "inverse-on-surface": "#ebf1ff",
        "on-tertiary": "#ffffff",
        "secondary-fixed-dim": "#00ddd6",
        "on-secondary-fixed-variant": "#00504d",
        "tertiary-fixed-dim": "#d0bcff",
        "surface-container-high": "#dde9ff",
        "on-tertiary-container": "#b699ff",
        "on-primary-container": "#9da1ff",
        "secondary-fixed": "#29fcf3",
        "outline": "#777683",
        "primary-fixed-dim": "#c0c1ff",
        "on-tertiary-fixed-variant": "#5516be",
        "surface-bright": "#f8f9ff",
        "inverse-primary": "#c0c1ff",
        "on-tertiary-fixed": "#23005c",
        "on-error-container": "#93000a",
        "error": "#ba1a1a",
        "secondary-container": "#29fcf3",
        "tertiary-container": "#4c00b5",
        "tertiary": "#32007d",
        "on-surface": "#0d1c2f",
        "surface-container-highest": "#d5e3fd",
        "on-error": "#ffffff",
        "on-primary-fixed": "#04006d",
        "on-secondary-fixed": "#00201e",
        "on-primary-fixed-variant": "#373a9b",
        "on-secondary-container": "#00716d",
        "surface-container-lowest": "#ffffff",
        "surface-tint": "#4f54b4",
        "inverse-surface": "#233144",
        "surface-variant": "#d5e3fd",
        "outline-variant": "#c7c5d4",
        "on-secondary": "#ffffff",
        "on-primary": "#ffffff",
        "surface-container": "#e6eeff",
        "primary-container": "#2e3192",
        "on-surface-variant": "#464652",
        "surface-container-low": "#eff4ff",
        "secondary": "#006a66",
        "primary-fixed": "#e1e0ff",
        "on-background": "#0d1c2f",
        "surface-dim": "#ccdbf4",
        "background": "#f8f9ff",
        "primary": "#15157d",
        "surface": "#f8f9ff",
        "error-container": "#ffdad6",
        "success-container": "#bbf7d0", // Add success container mapped to green-100
        "success-on-container": "#15803d", // Add success mapped to green-700
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "xl": "40px",
        "container-max": "1440px",
        "lg": "24px",
        "xs": "4px",
        "md": "16px",
        "base": "4px",
        "gutter": "24px",
        "sm": "8px"
      },
      fontFamily: {
        "sans": ["Inter", "system-ui", "sans-serif"],
        "headline-md": ["Inter"],
        "body-sm": ["Inter"],
        "body-md": ["Inter"],
        "headline-lg": ["Inter"],
        "body-lg": ["Inter"],
        "label-md": ["Inter"],
        "display-lg": ["Inter"],
        "headline-lg-mobile": ["Inter"],
        "code": ["JetBrains Mono"]
      },
      fontSize: {
        "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
        "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
        "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
        "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
        "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
        "label-md": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600"}],
        "display-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "headline-lg-mobile": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
        "code": ["14px", {"lineHeight": "20px", "fontWeight": "400"}]
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
