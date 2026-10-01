"use client";

import Flex from "@/components/ui/Flex";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Button,
  ButtonProps,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

type DialogAction = {
  label: string;
  onClick: () => void;
  variant?: ButtonProps["variant"];
  color?: ButtonProps["color"];
};

type DialogStatus = "warning" | "success" | "error";

type OpenDialogOptions = {
  title: string;
  content: ReactNode;
  status?: DialogStatus;
  actions?: DialogAction[];
};

type DialogContextValue = {
  openDialog: (options: OpenDialogOptions) => void;
  closeDialog: () => void;
};

const DialogContext = createContext<DialogContextValue | null>(null);

const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<OpenDialogOptions | null>(null);

  const openDialog = useCallback((opts: OpenDialogOptions) => {
    setOptions(opts);
    setOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <Dialog
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") closeDialog();
        }}
      >
        <Flex
          sx={{
            flexFlow: "column nowrap",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            pt: 6,
            minWidth: 300,
          }}
        >
          {options?.status === "error" && (
            <CancelIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
          )}
          {options?.status === "success" && (
            <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
          )}
          {options?.status === "warning" && (
            <WarningIcon color="warning" sx={{ fontSize: 64, mb: 2 }} />
          )}
          <DialogTitle sx={{ textAlign: "center", py: 0 }}>
            {options?.title}
          </DialogTitle>
          <DialogContent sx={{ color: grey[600] }}>
            {options?.content}
          </DialogContent>
        </Flex>

        {options?.actions && options.actions.length > 0 && (
          <Flex
            sx={{
              px: 6,
              pb: 6,
              flexFlow: "column nowrap",
              alignItems: "center",
              gap: 3,
            }}
          >
            {options.actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant ?? "contained"}
                color={action.color}
                onClick={action.onClick}
                fullWidth
              >
                {action.label}
              </Button>
            ))}
          </Flex>
        )}
      </Dialog>
    </DialogContext.Provider>
  );
};

export const useDialogContext = () => {
  const ctx = useContext(DialogContext);
  if (!ctx)
    throw new Error("useDialogContext must be used within DialogProvider");
  return ctx;
};

export default DialogProvider;
