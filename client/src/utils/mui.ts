import { TextFieldProps } from "@mui/material";

// 「真正唯讀」欄位（值由系統帶入、使用者完全不能編輯）用的 TextField slotProps：
// 擋輸入並以灰底提示不可編輯。
// 注意：接上 Calculator 的數字欄位雖然也是 readOnly（見 useCalculatorField），
// 但它們可透過計算機編輯，不適用這組樣式。
export const readOnlyFieldSlotProps: TextFieldProps["slotProps"] = {
  input: { readOnly: true, sx: { bgcolor: "grey.100" } },
};
