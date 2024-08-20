/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        verde: {
          principal: "hsl(var(--verde-principal))",
          escuro: "hsl(var(--verde-escuro))",
          maisClaro: "hsl(var(--verde-mais-claro))",
          maisEscuro: "hsl(var(--verde-mais-escuro))"
        },
        azul: {
          claro: "hsl(var(--azul-claro))",
          escuro: "hsl(var(--azul-escuro))"
        },
        roxo: {
          claro: "hsl(var(--roxo-claro))"
        },
        cinza: {
          claro: "hsl(var(--cinza-claro))",
          maisClaro: "hsl(var(--cinza-mais-claro))"
        },
        vermelho: {
          claro: "hsl(var(--vermelho-claro))",
          escuro: "hsl(var(--vermelho-escuro))",
          maisClaro: "hsl(var(--vermelho-mais-claro))",
          maisClaroSec: "hsl(var(--vermelho-mais-claro-secondary))"
        },
        amarelo: {
          claro: "hsl(var(--amarelo-claro))",
          maisClaro: "hsl(var(--amarelo-mais-claro))",
          escuro: "hsl(var(--amarelo-escuro))"
        },
        bordaPreta: "#111"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      },
      fontSize: {
        lg: "var(--font-size-lg)",
        md: "var(--font-size-md)",
        sm: "var(--font-size-sm)"
      },
      fontWeight: {
        regular: "var(--font-weight-regular)",
        medium: "var(--font-weight-medium)",
        bold: "var(--font-weight-bold)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};
