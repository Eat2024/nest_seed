export interface TabItem {
  value: number | string;
  label: string;
  // label 後綴（如「（已完成/總數）」）：文字過長截斷時只截 label，後綴保持完整
  suffix?: string;
  disabled?: boolean;
}

// 編輯頁籤選單可編輯的子集：名稱與順序
export type EditTabItem = Pick<TabItem, "value" | "label">;
