"use client";

import Flex from "@/components/ui/Flex";
import { useSortable } from "@dnd-kit/react/sortable";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { IconButton, Typography } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";

type Props = {
  id: number;
  index: number;
  column: string;
  count: number;
  onDelete?: () => void;
  onNameChange?: (name: string) => void;
};

const DraggableRoleItem = ({ id, index, column, count, onDelete, onNameChange }: Props) => {
  const { ref, handleRef, isDragging } = useSortable({
    id,
    index,
    type: "item",
    accept: "item",
  });

  return (
    <Flex
      ref={ref}
      data-dragging={isDragging}
      sx={{
        alignItems: "center",
        gap: 2,
        py: 3,
        px: 2,
        borderBottom: "1px solid",
        borderBottomColor: "custom.black10",
      }}
    >
      {/* touchAction: "none" 的作用是告訴瀏覽器：這個元素上的觸控事件不要用來捲頁或縮放，交由 PointerSensor 自行處理，拖曳才能正常啟動。 */}
      <IconButton ref={handleRef} sx={{ touchAction: "none" }}>
        <DragHandleIcon />
      </IconButton>

      <OutlinedInput
        defaultValue={column}
        size="small"
        sx={{ width: "100%" }}
        onChange={(e) => onNameChange?.(e.target.value)}
      />

      <Flex sx={{ alignItems: "center", ml: "auto" }}>
        <Flex sx={{ justifyContent: "center", minWidth: 80 }}>
          <Typography>{count}</Typography>
        </Flex>
        <Flex sx={{ justifyContent: "center", minWidth: 80 }}>
          <IconButton onClick={onDelete}>
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default DraggableRoleItem;
