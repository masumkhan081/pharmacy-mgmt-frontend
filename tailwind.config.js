/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        0.125: "0.125rem",
        0.25: "0.25rem",
        0.31: "0.31rem",
        0.38: "0.38rem",
        0.5: "0.5rem",
        0.62: "0.62rem",
        0.68: "0.68rem",
        0.75: "0.75rem",
        0.9: "0.9rem",
        "1.0": "1rem",
        1.125: "1.125rem",
        1.25: "1.25rem",
        1.5: "1.5rem",
        1.75: "1.75rem",
        "2.0": "2rem",
        2.25: "2.25rem",
        2.5: "2.5rem",
        2.75: "2.75rem",
        2.63: "2.63rem",
        "3.0": "3.0rem",
        3.5: "3.5rem",
        3.94: "3.94rem",
        4.25: "4.25rem",
        "5.0": "5rem",
        5.75: "5.75rem",
        6.25: "6.25rem",
        7.2: "7.2rem",
        7.8: "7.80rem",
        8.3: "8.31rem",
        8.1: "8.12rem",
        9.12: "9.12rem",
        9.3: "9.375rem",
        10.0: "10.0rem",
        10.6: "10.6rem",
        "11.0": "11rem",
        12.5: "12.5rem",
        14.5: "14.5rem",
        "15.0": "15rem",
        16.5: "16.5rem",
        17.6: "17.6rem",
        19.8: "19.8rem",
        24.1: "24.1rem",
        "25.0": "25rem",
        29.0: "29rem",
        "30.0": "30rem",
        "35.0": "35rem",
        35.1: "35.1rem",
        36.1: "36.125rem",
        "37.0": "37.0rem",
        37.25: "37.25rem",
        41.25: "41.25rem",
        41.75: "41.75rem",
        "44.0": "44rem",
      },
      fontFamily: {
        rubik: ["Rubik Iso"],
        titan: ["Titan One"],
        averia: ["Averia Serif Libre"],
        inter: ["Inter"],
        agud: ["Agu Display", "serif"],
        anton: ['Anton', 'sans-serif'], // Add the Anton font family
        jersey: ['Jersey 15', 'serif'], // Add the Jersey 15 font family
      },
      letterSpacing: {
        "02": "0.2rem",
        "ls-045": "-0.045rem",
        "ls-065": "-0.065rem",
        "ls-09": "-0.09rem",
        "ls-1": "-1rem",
        "ls-025": "-0.025rem",
      },
      fontSize: {
        "0.75/1": ["0.75rem", "1rem"],
        "0.75/1.25": ["0.75rem", "1.25rem"],
        "0.9/1.25": ["0.9rem", "1.25rem"],
        "1/1": ["1rem", "1rem"],
        "1/1.25": ["1rem", "1.25rem"],
        "1.1/1.5": ["1.125rem", "1.5rem"],
        "1.125/1.75": ["1.125rem", "1.75rem"],
        "1/1.5": ["1rem", "1.5rem"],
        "1/2": ["1rem", "2rem"],
        "1.25/1.5": ["1.25rem", "1.5rem"],
        "1.25/1.75": ["1.25rem", "1.75rem"],
        "1.5/2": ["1.5rem", "2rem"],
        "1.5/1.5": ["1.5rem", "1.5rem"],
        "1.75/2.25": ["1.75rem", "2.25rem"],
        "2/2.5": ["2rem", "2.5rem"],
        "2.25/2.75": ["2.25rem", "2.75rem"],
        "3.25/3.5": ["3.25rem", "3.5rem"],
      },
      colors: {
        "pr/100": "#dcfce7",
        "br/300": "#0d9488",
        "br/600": "#0d9488",
        "teal-950": "#042f2e",
        pr: "#E2E8F0",
        "pr/300": "#6BCCCB",
        wh: "#FFFFFF",
        "pr/600": "#0D3D4B",
        "pr/100": "#CFF6EF",
        "pr/200": "#A2EEE7",
        "pr/400": "#3E949A",
        "pp/yellow": "#F2C852",
        "pp/border": "#124E58",
        "pp/text": "#124E58",
        "sl/600": "#475569",
        "sl/500": "#64748B",
        "sl/400": "#94A3B8",
        "sl/200": "#E2E8F0",
        "sl/50": "#F8FAFC",
        "sec/500": "#F2C852",
        "sec/400": "#F7DA7C",
        "sec/800": "#8C651A",
        "w/200": "#FECACA",
        "w/500": "#EF4444",
        "w/600": "#B91C1C",
        "w/700": "#B91C1C",
        "su/700": "#15803D",
        "su/600": "#16A34A",
        "su/300": "#86EFAC",
        "pp/neutral": "#E4E5E7",
        "pp/borderr": "#0003160D",
        "dot/warn": "#B91C1C",
        "dot/pending": "#8C651A",
        bkash: "#FFE9F3",
        sub: "#6D7175",
      },
    },
  },
  plugins: [],
}