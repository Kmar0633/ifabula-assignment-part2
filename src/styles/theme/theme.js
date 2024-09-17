import { extendTheme, theme as base } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    primary: {
      50: "#e3f2fd",  // lightest blue
      100: "#bbdefb",
      200: "#90caf9",
      300: "#64b5f6",
      400: "#42a5f5",
      500: "#2196f3",  // primary blue
      600: "#1e88e5",
      700: "#1976d2",
      800: "#1565c0",
      900: "#0d47a1",  // darkest blue
    },
  },
  fonts: {
    heading: `Poppins, ${base.fonts.heading}`,
    body: `Poppins, ${base.fonts.body}`,
  },
  styles: {
    global: {
      body: {
        bg: "#FFFFFF",
        color: "#232323",
      },
    },
  },
  components: {
    Checkbox: {
      baseStyle: {
        label: {
          pointerEvents: "none",
        },
      },
    },
    Radio: {
      baseStyle: {
        label: {
          pointerEvents: "none",
        },
      },
    },
  },
  fontWeights: {
    extraThin: 100,
    thin: 200,
    extraLight: 300,
    light: 400,
    normal: 500,
    medium: 600,
    bold: 700,
    extraBold: 800,
  },
});

export default theme;
