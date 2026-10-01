import { grey } from "@mui/material/colors";
import {
  DataGrid,
  DataGridProps,
  GridColDef,
  GridRowsProp,
} from "@mui/x-data-grid";

type Props = {
  columns: GridColDef[];
  rows: GridRowsProp;
} & Omit<DataGridProps, "columns" | "rows">;

const AppDataGrid = ({
  columns,
  rows,
  autoHeight = true,
  checkboxSelection = true,
  // 非受控表格的初始狀態入口（初始每頁筆數、排序、欄位顯示…），
  // 與內建的分頁預設淺合併，傳入 pagination 時以傳入值為準。
  // 注意：分頁走受控模式（有傳 paginationModel）時，
  // initialState.pagination 會被 DataGrid 忽略，初始值由受控 state 決定。
  initialState,
  pageSizeOptions = [5, 10, 20],
  ...rest
}: Props) => {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      autoHeight={autoHeight}
      checkboxSelection={checkboxSelection}
      {...rest}
      rowHeight={70}
      initialState={{
        pagination: { paginationModel: { pageSize: 5 } },
        ...initialState,
      }}
      pageSizeOptions={pageSizeOptions}
      localeText={{
        paginationDisplayedRows: ({ from, to, count }) =>
          `第 ${from} - ${to} 筆，共 ${count} 筆`,
        footerRowSelected: (count) => `已選 ${count} 筆`,
        paginationRowsPerPage: "每頁筆數：",
        noRowsLabel: "查無資料",
        checkboxSelectionHeaderName: "核取方塊",
        columnsManagementShowHideAllText: "顯示/隱藏所有",
        columnsManagementReset: "重置",
      }}
      disableRowSelectionOnClick
      sx={{
        width: "100%",
        minWidth: 0,
        flex: 1,
        border: 0,
        borderRadius: 0,
        backgroundColor: "#fff",
        "& .MuiDataGrid-columnHeaders": {},
        "& .MuiDataGrid-columnHeader": {},
        // 表頭樣式
        "& .MuiDataGrid-columnHeader.MuiDataGrid-withBorderColor": {
          backgroundColor: grey[200],
          borderRight: "1px solid",
          borderRightColor: "custom.black10",
          borderBottom: "0",
          outline: "none",
        },
        // 特定欄位標頭底色：column 定義帶 headerClassName: "highlightHeaderCell"
        // 即可套用，三層 class 疊加確保 specificity 蓋過上面的預設灰底
        "& .MuiDataGrid-columnHeader.MuiDataGrid-withBorderColor.highlightHeaderCell":
          {
            backgroundColor: "#DDEBF8",
          },
        // 取消表頭最後一欄框線
        "& .MuiDataGrid-columnHeader--last.MuiDataGrid-withBorderColor": {
          borderRight: "none",
        },
        // 隱藏表頭拖曳 bar 顏色
        "& .MuiDataGrid-columnSeparator": {
          color: "transparent",
        },
        // 表頭 Sort icon
        "& .MuiDataGrid-iconButtonContainer": {
          marginLeft: 1,
        },
        // 表格框線
        "& .MuiDataGrid-cell": {
          display: "flex",
          alignItems: "center",
          borderTop: "1px solid",
          borderTopColor: "custom.black10",
          borderRight: "1px solid",
          borderRightColor: "custom.black10",
          whiteSpace: "pre-line",
          lineHeight: 1.5,
        },
        // 取消表格最後一欄框線
        "& .MuiDataGrid-cell:last-child": {
          borderRight: "none",
        },
        // 表格最後一欄有可能會是預留的 .MuiDataGrid-cellEmpty，所以用 :last-child 的做法會篩選不出來，必須排除 .MuiDataGrid-cellEmpty 本身
        "& .MuiDataGrid-cell:not(.MuiDataGrid-cellEmpty):has(+ .MuiDataGrid-cellEmpty)":
          {
            borderRight: "none",
          },
        // 取消表格點擊的外框
        "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
          outline: 0,
        },
        // 特定列底色：搭配 getRowClassName 回傳 "highlightErrorRow" 套用
        "& .MuiDataGrid-row.highlightErrorRow": {
          backgroundColor: "#FFE5E6",
        },
        "& .MuiDataGrid-row.highlightErrorRow:hover": {
          backgroundColor: "#FFE5E6",
        },
        // 表底樣式
        "& .MuiDataGrid-footerContainer": {
          borderTop: "1px solid",
          borderTopColor: "custom.black10",
        },
        // 已選擇筆數
        "& .MuiDataGrid-selectedRowCount": {
          whiteSpace: "nowrap",
        },
        // 每頁顯示比數
        "& .MuiTablePagination-select": {
          margin: 0,
          marginRight: 4,
        },
        // 上/下一頁
        "& .MuiTablePagination-actions": {
          margin: 0,
          marginLeft: 4,
        },
      }}
    />
  );
};

export default AppDataGrid;
