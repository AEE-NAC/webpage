/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      backgroundColor: {
        '#d8ae34ff': '#f2e288',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

