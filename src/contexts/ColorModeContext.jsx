import { createContext, useContext, useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material";

const ColorModeContext = createContext();

export function ColorModeProvider({ children }) {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
        components: {
          MuiTableRow: {
            styleOverrides: {
              head: {
                backgroundColor: mode === "dark" ? "rgb(38 47 55)" : "#edf4fb",
              },
            },
          },
          MuiInputBase: {
            styleOverrides: {
              root: {
                "&.Mui-disabled": {
                  backgroundColor: mode === "dark" ? "#2c2c2c" : "#f5f5f5",
                },
              },
            },
          },
          MuiCssBaseline: {
            styleOverrides:
              mode === "dark"
                ? {
                    "input:disabled, select:disabled, textarea:disabled": {
                      backgroundColor: "#1f2937", // Tailwind gray-800
                      cursor: "not-allowed",
                    },
                  }
                : {},
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export const useColorMode = () => useContext(ColorModeContext);
