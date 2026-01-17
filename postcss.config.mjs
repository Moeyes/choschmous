const config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  // plugins: [animate],
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
