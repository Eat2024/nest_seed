"use client";

import CloseIcon from "@mui/icons-material/Close";
import { Box, ButtonBase } from "@mui/material";
import { TabItem } from "./types";

type Props = {
  tab: TabItem;
  tabAlign: "left" | "center";
  // 提供時顯示「x」關閉鈕，點擊即觸發（不會連動切換 tab）
  onClose?: () => void;
};

// Tab 的 label 內容：名稱（過長截斷）＋suffix＋「x」關閉鈕
const TabLabel = ({ tab, tabAlign, onClose }: Props) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      // 靠左時 label 撐滿 Tab 寬度，文字與「x」分列兩端
      ...(tabAlign === "left" && {
        width: "100%",
        justifyContent: "space-between",
      }),
    }}
  >
    {/* 文字超過 Tab 寬度上限（MUI 預設 360px）時截斷出「…」：
        只截 label 本體、suffix（如完成數）保持完整，
        title 讓滑鼠停留可看完整名稱 */}
    <Box
      title={`${tab.label}${tab.suffix ?? ""}`}
      sx={{ display: "flex", alignItems: "center", minWidth: 0 }}
    >
      <Box
        component="span"
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {tab.label}
      </Box>
      {tab.suffix && (
        <Box component="span" sx={{ flexShrink: 0 }}>
          {tab.suffix}
        </Box>
      )}
    </Box>
    {onClose && (
      <ButtonBase
        component="span"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        sx={{
          flexShrink: 0,
          borderRadius: "50%",
          p: 0.5,
          color: "common.white",
          bgcolor: "custom.black50",
          ".Mui-selected &": {
            bgcolor: "primary.main",
          },
        }}
      >
        <CloseIcon sx={{ fontSize: 14 }} />
      </ButtonBase>
    )}
  </Box>
);

export default TabLabel;
