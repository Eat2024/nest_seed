"use client";

import { useSessionStorageState } from "@/hooks/useSessionStorageState";
import MuiDrawer from "@mui/material/Drawer";
import { CSSObject, styled, Theme } from "@mui/material/styles";
import DrawerHeader from "./DrawerHeader";
import {
  SIDEBAR_OPEN_STORAGE_KEY,
  SIDEBAR_SPACING_CLOSED,
  SIDEBAR_WIDTH_OPEN,
} from "./sidebarConstants";
import SidebarMiniNavigation from "./SidebarMiniNavigation";
import SidebarNavigation from "./SidebarNavigation";

const openedMixin = (theme: Theme): CSSObject => ({
  width: SIDEBAR_WIDTH_OPEN,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
});

const closedMixin = (theme: Theme): CSSObject => ({
  width: theme.spacing(SIDEBAR_SPACING_CLOSED),
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: SIDEBAR_WIDTH_OPEN,
  flexShrink: 0,
  overflow: "hidden",
  backgroundColor: "#202229",
  "& .MuiDrawer-paper": {
    position: "relative",
    width: "100%",
    backgroundColor: "#202229",
    borderRight: 0,
    overflowX: "hidden",
    scrollbarWidth: "none", // Firefox
    "&::-webkit-scrollbar": {
      display: "none", // Chrome、Edge、Safari
    },
  },
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
      },
    },
  ],
}));

const Sidebar = () => {
  const [open, setOpen] = useSessionStorageState(SIDEBAR_OPEN_STORAGE_KEY, true);

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader open={open} onToggle={() => setOpen((prev) => !prev)} />

      {open ? (
        // 展開後的側選單（下拉選單模式）
        <SidebarNavigation />
      ) : (
        // 收合後的側選單（Icon 模式）
        <SidebarMiniNavigation />
      )}
    </Drawer>
  );
};

export default Sidebar;
