"use client";

import { Alert, Snackbar } from "@mui/material";
import { createContext, ReactNode, useContext, useState } from "react";

type Severity = "success" | "error" | "warning" | "info";

type SnackbarMessage = {
  message: string;
  severity: Severity;
};

type SnackbarContextValue = {
  showSnackbar: (message: string, severity?: Severity) => void;
};

type Props = {
  children: ReactNode;
};

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

const SnackbarProvider = ({ children }: Props) => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<SnackbarMessage | null>(null);

  const showSnackbar = (message: string, severity: Severity = "info") => {
    setCurrent({ message, severity });
    setOpen(true);
  };

  const handleClose = (_: unknown, reason?: string) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={current?.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {current?.message}
        </Alert>
      </Snackbar>
      {children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbarContext = () => {
  const ctx = useContext(SnackbarContext);
  if (!ctx)
    throw new Error("useSnackbarContext must be used within SnackbarProvider");
  return ctx;
};

export default SnackbarProvider;
