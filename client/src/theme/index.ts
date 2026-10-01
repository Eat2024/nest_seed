"use client";

import { createTheme } from "@mui/material/styles";
import "@mui/x-date-pickers/themeAugmentation";

declare module "@mui/material/styles" {
  interface Palette {
    custom: {
      background: string;
      white10: string;
      white25: string;
      white50: string;
      white75: string;
      black10: string;
      black25: string;
      black50: string;
      black75: string;
    };
  }
  interface PaletteOptions {
    custom?: {
      background?: string;
      white10?: string;
      white25?: string;
      white50?: string;
      white75?: string;
      black10?: string;
      black25?: string;
      black50?: string;
      black75?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#1a1a1a",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a1a1a",
      secondary: "#666666",
    },
    custom: {
      background: "#F3F5F6",
      white10: "rgba(255, 255, 255, 0.10)",
      white25: "rgba(255, 255, 255, 0.25)",
      white50: "rgba(255, 255, 255, 0.50)",
      white75: "rgba(255, 255, 255, 0.75)",
      black10: "rgba(0, 0, 0, 0.10)",
      black25: "rgba(0, 0, 0, 0.25)",
      black50: "rgba(0, 0, 0, 0.50)",
      black75: "rgba(0, 0, 0, 0.75)",
    },
  },
  typography: {
    fontFamily: "var(--font-noto-sans-tc), Arial, sans-serif",
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  shape: {
    borderRadius: 4,
  },
  spacing: 4,
  components: {
    // iPad 等觸控裝置預設會判定為 coarse pointer，MUI X 因此切換成手機版
    // 全螢幕對話框（大時鐘轉盤／整頁月曆），與桌機的下拉式 popper 落差很大。
    // 強制 desktopModeMediaQuery 恆為真，讓所有裝置一律使用桌機版 UI。
    MuiDatePicker: {
      defaultProps: {
        desktopModeMediaQuery: "@media (min-width: 0px)",
      },
    },
    MuiTimePicker: {
      defaultProps: {
        desktopModeMediaQuery: "@media (min-width: 0px)",
      },
    },
    MuiDateTimePicker: {
      defaultProps: {
        desktopModeMediaQuery: "@media (min-width: 0px)",
      },
    },
  },
});

export default theme;
