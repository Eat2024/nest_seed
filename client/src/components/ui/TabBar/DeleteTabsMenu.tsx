"use client";

import { useDialogContext } from "@/providers/DialogProvider";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { MouseEvent, useState } from "react";
import Flex from "../Flex";
import { TabItem } from "./types";

type Props = {
  tabs: TabItem[];
  // 確認 dialog 後回傳勾選的 tab values，實際的刪除（API 呼叫）由使用端實作
  onConfirm?: (values: (number | string)[]) => void;
};

// 「刪除頁籤」按鈕＋選單：勾選（含全選）要刪除的頁籤，確定後跳確認 dialog
const DeleteTabsMenu = ({ tabs, onConfirm }: Props) => {
  const { openDialog, closeDialog } = useDialogContext();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selection, setSelection] = useState<(number | string)[]>([]);

  const allSelected = tabs.length > 0 && selection.length === tabs.length;

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // 關閉選單即重置勾選
  const handleClose = () => {
    setAnchorEl(null);
    setSelection([]);
  };

  const handleToggle = (tabValue: number | string) => {
    setSelection((prev) =>
      prev.includes(tabValue)
        ? prev.filter((selected) => selected !== tabValue)
        : [...prev, tabValue],
    );
  };

  const handleToggleAll = () => {
    setSelection(allSelected ? [] : tabs.map((tab) => tab.value));
  };

  // 按「確定」先跳確認 dialog 提醒刪除數量，dialog 再確認才真的刪除
  const handleConfirm = () => {
    openDialog({
      title: "刪除頁籤",
      content: `確定要刪除 ${selection.length} 個頁籤嗎？`,
      status: "warning",
      actions: [
        {
          label: "確定",
          onClick: () => {
            onConfirm?.(selection);
            closeDialog();
            handleClose();
          },
        },
        { label: "取消", variant: "outlined", onClick: closeDialog },
      ],
    });
  };

  return (
    <>
      <Tooltip title="刪除頁籤">
        <span>
          <IconButton onClick={handleOpen}>
            <DeleteOutlineOutlinedIcon sx={{ color: "text.primary" }} />
          </IconButton>
        </span>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={anchorEl !== null} onClose={handleClose}>
        <Typography sx={{ px: 4, pb: 2 }}>刪除頁籤</Typography>
        <Divider />
        <MenuItem onClick={handleToggleAll}>
          <Checkbox
            checked={allSelected}
            indeterminate={selection.length > 0 && !allSelected}
            sx={{ p: 0, mr: 2 }}
          />
          全選
        </MenuItem>
        <Divider />
        {/* 頁籤數量多時中間清單自行捲動，全選列與底部按鈕列固定 */}
        <Box sx={{ maxHeight: 320, overflowY: "auto" }}>
          {tabs.map((tab) => (
            <MenuItem key={tab.value} onClick={() => handleToggle(tab.value)}>
              <Checkbox
                checked={selection.includes(tab.value)}
                sx={{ p: 0, mr: 2 }}
              />
              {tab.label}
              {tab.suffix}
            </MenuItem>
          ))}
        </Box>
        <Divider />
        <Flex
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            px: 3,
            pt: 1,
          }}
        >
          {selection.length > 0 && (
            <Typography variant="body2">已選 {selection.length} 個</Typography>
          )}
          <Button
            variant="contained"
            size="small"
            disabled={selection.length === 0}
            onClick={handleConfirm}
            sx={{ ml: "auto" }}
          >
            確定
          </Button>
        </Flex>
      </Menu>
    </>
  );
};

export default DeleteTabsMenu;
