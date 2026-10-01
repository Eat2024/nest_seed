import Flex from "@/components/ui/Flex";
import { ReactNode } from "react";
import AppHeader from "./AppHeader";
import Sidebar from "./Sidebar";

type Props = {
  children: ReactNode;
};

const AppShell = ({ children }: Props) => {
  return (
    <Flex sx={{ minHeight: "100vh", height: "100vh" }}>
      <Sidebar />
      <Flex
        component="main"
        sx={{
          flexFlow: "column nowrap",
          flex: 1,
          minWidth: 0,
          bgcolor: "custom.background",
        }}
      >
        {/* AppHeader 黏在視窗上方 */}
        <AppHeader />
        {/* 頁面內容高度超過視窗自動捲動 */}
        <Flex sx={{ flexFlow: "column nowrap", flex: 1, overflow: "auto" }}>
          {children}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AppShell;
