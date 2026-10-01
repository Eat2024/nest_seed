"use client";

import theme from "@/theme";
import { CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { zhTW } from "@mui/x-date-pickers/locales";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import "dayjs/locale/zh-tw";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const MuiProvider = ({ children }: Props) => {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale="zh-tw"
          localeText={
            zhTW.components.MuiLocalizationProvider.defaultProps.localeText
          }
        >
          {children}
        </LocalizationProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export default MuiProvider;
