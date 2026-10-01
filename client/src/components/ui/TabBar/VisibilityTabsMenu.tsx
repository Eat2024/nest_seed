"use client";

import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import {
  Badge,
  Box,
  Checkbox,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { MouseEvent, useState } from "react";
import { TabItem } from "./types";

type Props = {
  tabs: TabItem[];
  hiddenTabs: (number | string)[];
  // 勾選/取消勾選某個頁籤時觸發，顯示與否的計算由使用端（TabBar）處理
  onToggle: (tabValue: number | string) => void;
  // 全選/取消全選時觸發，回傳全選（顯示全部）或取消全選（隱藏全部）
  onToggleAll: (selectAll: boolean) => void;
};

// 「顯示頁籤」按鈕＋選單：勾選（含全選）控制各頁籤的顯示/隱藏
const VisibilityTabsMenu = ({
  tabs,
  hiddenTabs,
  onToggle,
  onToggleAll,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // hiddenTabs 可能殘留已經不存在於目前 tabs 的過期 id（例如 tab 對應的
  // 資料自然消失、但清理沒有涵蓋到這個情境），只算目前 tabs 裡真的被隱藏
  // 的數量，避免「沒有隱藏頁籤」卻顯示 Badge 數字
  const hiddenVisibleTabsCount = tabs.filter((tab) =>
    hiddenTabs.includes(tab.value),
  ).length;
  const allVisible = hiddenVisibleTabsCount === 0;

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="顯示頁籤">
        <span>
          <IconButton onClick={handleOpen}>
            {/* 隱藏頁籤數量：hiddenVisibleTabsCount 為 0 時 Badge 預設不顯示（showZero 預設 false）。 */}
            <Badge badgeContent={hiddenVisibleTabsCount} color="primary">
              <PlaylistAddCheckIcon sx={{ color: "text.primary" }} />
            </Badge>
          </IconButton>
        </span>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={anchorEl !== null} onClose={handleClose}>
        <Typography sx={{ px: 4, pb: 2 }}>顯示/關閉頁籤</Typography>
        <Divider />
        <MenuItem onClick={() => onToggleAll(!allVisible)}>
          <Checkbox
            checked={allVisible}
            indeterminate={!allVisible && hiddenVisibleTabsCount < tabs.length}
            sx={{ p: 0, mr: 2 }}
          />
          全選
        </MenuItem>
        <Divider />
        {/* 頁籤數量多時中間清單自行捲動，標題列與全選列固定 */}
        <Box sx={{ maxHeight: 320, overflowY: "auto" }}>
          {tabs.map((tab) => (
            <MenuItem key={tab.value} onClick={() => onToggle(tab.value)}>
              <Checkbox
                checked={!hiddenTabs.includes(tab.value)}
                sx={{ p: 0, mr: 2 }}
              />
              {tab.label}
            </MenuItem>
          ))}
        </Box>
      </Menu>
    </>
  );
};

export default VisibilityTabsMenu;
