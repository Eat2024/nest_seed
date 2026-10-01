import { Divider, DividerProps } from "@mui/material";

// 垂直分隔線，預設間距為工具列按鈕群的規格：上下 4px、左右 2px
// （my: 1 / mx: 0.5，theme spacing 基準 4px）。
// 其他情境（如內容區的分隔線）可透過 sx 覆寫。
const VerticalDivider = ({ sx, ...props }: DividerProps) => (
  <Divider
    flexItem
    orientation="vertical"
    sx={[{ my: 1, mx: 0.5 }, ...(Array.isArray(sx) ? sx : [sx])]}
    {...props}
  />
);

export default VerticalDivider;
