"use client";

import { DragDropProvider, DragEndEvent } from "@dnd-kit/react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Divider,
  IconButton,
  OutlinedInput,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import { MouseEvent, useState } from "react";
import Flex from "../Flex";
import { EditTabItem, TabItem } from "./types";

type Props = {
  tabs: TabItem[];
  // 按「確定」回傳編輯後的名稱與順序，實際的更新（API 呼叫）由使用端實作
  onConfirm?: (items: EditTabItem[]) => void;
};

// 編輯頁籤選單的單列：拖曳把手＋名稱輸入框。
// useSortable 是 per-item hook，須拆成獨立元件
const DraggableTabEditItem = ({
  item,
  index,
  onLabelChange,
}: {
  item: EditTabItem;
  index: number;
  onLabelChange: (label: string) => void;
}) => {
  const { ref, handleRef, isDragging } = useSortable({
    id: item.value,
    index,
    type: "item",
    accept: "item",
  });

  return (
    <Flex
      ref={ref}
      data-dragging={isDragging}
      sx={{ alignItems: "center", gap: 1, px: 2, py: 1 }}
    >
      {/* touchAction: "none"：把手上的觸控事件不用來捲頁，交由拖曳處理 */}
      <IconButton size="small" ref={handleRef} sx={{ touchAction: "none" }}>
        <DragHandleIcon />
      </IconButton>
      <OutlinedInput
        value={item.label}
        size="small"
        sx={{ width: 240 }}
        onChange={(e) => onLabelChange(e.target.value)}
      />
    </Flex>
  );
};

// 「編輯頁籤」按鈕＋選單：改名（輸入框）＋拖曳把手排序，確定後回傳結果。
// 用 Popover 而非 Menu：Menu 內建鍵盤 typeahead 會攔截輸入框的打字
const EditTabsMenu = ({ tabs, onConfirm }: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  // 開啟時從 tabs 拍一份名稱＋順序的快照供編輯，按「確定」前的改動不影響外部
  const [editItems, setEditItems] = useState<EditTabItem[]>([]);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setEditItems(tabs.map(({ value, label }) => ({ value, label })));
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setEditItems([]);
  };

  const handleLabelChange = (tabValue: number | string, label: string) => {
    setEditItems((prev) =>
      prev.map((item) => (item.value === tabValue ? { ...item, label } : item)),
    );
  };

  // 拖曳結束後依落點重排（與角色排序頁相同的 dnd-kit 模式）
  const handleDragEnd = (event: DragEndEvent) => {
    // 拖曳中途取消（如按下 Escape）則不更新排序
    if (event.canceled) return;

    const { source } = event.operation;

    // 確認拖曳來源是 sortable item，才能取得 initialIndex / index
    if (!isSortable(source)) return;

    // initialIndex：拖曳開始時的原始位置；index：計算出的最終落點
    const { initialIndex, index } = source;

    if (initialIndex === index) return;

    setEditItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(initialIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
  };

  const handleConfirm = () => {
    onConfirm?.(editItems);
    handleClose();
  };

  return (
    <>
      <Tooltip title="編輯頁籤">
        <span>
          <IconButton onClick={handleOpen}>
            <EditIcon sx={{ color: "text.primary" }} />
          </IconButton>
        </span>
      </Tooltip>
      <Popover
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Typography sx={{ px: 4, pt: 3, pb: 2 }}>編輯頁籤</Typography>
        <Divider />
        <DragDropProvider onDragEnd={handleDragEnd}>
          {/* 頁籤數量多時中間清單自行捲動，標題與底部按鈕列固定 */}
          <Box sx={{ py: 1, maxHeight: 320, overflowY: "auto" }}>
            {editItems.map((item, index) => (
              <DraggableTabEditItem
                key={item.value}
                item={item}
                index={index}
                onLabelChange={(label) => handleLabelChange(item.value, label)}
              />
            ))}
          </Box>
        </DragDropProvider>
        <Divider />
        <Flex sx={{ justifyContent: "flex-end", px: 3, py: 2 }}>
          <Button
            variant="contained"
            size="small"
            disabled={editItems.some((item) => item.label.trim() === "")}
            onClick={handleConfirm}
          >
            確定
          </Button>
        </Flex>
      </Popover>
    </>
  );
};

export default EditTabsMenu;
