"use client";

import { SIDEBAR_OPEN_STORAGE_KEY, SIDEBAR_SPACING_CLOSED, SIDEBAR_WIDTH_OPEN } from "@/components/layouts/sidebarConstants";
import Flex from "@/components/ui/Flex";
import { useSessionStorageState } from "@/hooks/useSessionStorageState";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
const BottomActionBar = ({ children }: Props) => {
  // 讀取跟 Sidebar 同一把 key，展開/收合狀態會即時同步，
  // 讓固定在視窗底部的這個 bar 能扣除側邊選單目前實際佔用的寬度，避免蓋到側邊選單。
  const [sidebarOpen] = useSessionStorageState(SIDEBAR_OPEN_STORAGE_KEY, true);

  return (
    <Flex
      sx={{
        position: "fixed",
        left: (theme) =>
          sidebarOpen ? `${SIDEBAR_WIDTH_OPEN}px` : theme.spacing(SIDEBAR_SPACING_CLOSED),
        bottom: 0,
        width: (theme) =>
          `calc(100% - ${sidebarOpen ? `${SIDEBAR_WIDTH_OPEN}px` : theme.spacing(SIDEBAR_SPACING_CLOSED)})`,
        backgroundColor: "common.white",
        boxShadow: 3,
        justifyContent: "flex-end",
        alignItems: "center",
        px: 6,
        py: 4,
        gap: 4,
        zIndex: (theme) => theme.zIndex.appBar,
        // 與 Sidebar 的 width transition 對齊，展開/收合時視覺上同步滑動
        transition: (theme) =>
          theme.transitions.create(["left", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: sidebarOpen
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
          }),
      }}
    >
      {children}
    </Flex>
  );
};

export default BottomActionBar;
