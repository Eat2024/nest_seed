"use client";

import { EmployeeOption } from "@/api/types";
import BottomActionBar from "@/components/ui/BottomActionBar";
import Flex from "@/components/ui/Flex";
import { readOnlyFieldSlotProps } from "@/utils/mui";
import {
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

export type AccountFormValues = {
  empId: string;
  name: string;
  division: string;
  enabled: boolean;
  roleId: number | null;
  remark: string;
};

const defaultFormValues: AccountFormValues = {
  empId: "",
  name: "",
  division: "",
  enabled: true,
  roleId: null,
  remark: "",
};

type RoleOption = { id: number; roleName: string };

type Props = {
  defaultValues?: Partial<AccountFormValues>;
  roleOptions?: RoleOption[];
  employeeOptions?: EmployeeOption[];
  onEmpIdSearch?: (query: string) => void;
  onSave?: (data: AccountFormValues) => void;
  onCancel?: () => void;
  isPending?: boolean;
};

const AccountForm = ({
  defaultValues,
  roleOptions = [],
  employeeOptions,
  onEmpIdSearch,
  onSave,
  onCancel,
  isPending = false,
}: Props) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AccountFormValues>({
    defaultValues: { ...defaultFormValues, ...defaultValues },
  });

  return (
    <>
      <Box sx={{ flex: 1, bgcolor: "common.white", px: 4, py: 4 }}>
        <Flex sx={{ alignItems: "flex-start" }}>
          <Flex sx={{ flexFlow: "column nowrap", gap: 4, width: 280 }}>
            <Controller
              name="empId"
              control={control}
              render={({ field: { onChange, value } }) =>
                employeeOptions ? (
                  <Autocomplete
                    freeSolo
                    options={employeeOptions}
                    getOptionLabel={(o) =>
                      typeof o === "string" ? o : `${o.empId}　${o.name}`
                    }
                    inputValue={value}
                    onInputChange={(_, newValue, reason) => {
                      if (reason === "input") {
                        onChange(newValue);
                        onEmpIdSearch?.(newValue);
                      }
                    }}
                    onChange={(_, newValue) => {
                      if (newValue && typeof newValue !== "string") {
                        onChange(newValue.empId);
                        setValue("name", newValue.name);
                        setValue("division", newValue.departmentName);
                      } else if (!newValue) {
                        onChange("");
                        setValue("name", "");
                        setValue("division", "");
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="員工編號"
                        placeholder="輸入 5~8 碼員編搜尋"
                        size="small"
                      />
                    )}
                  />
                ) : (
                  <TextField
                    value={value}
                    onChange={onChange}
                    label="員工編號"
                    size="small"
                    slotProps={readOnlyFieldSlotProps}
                    fullWidth
                  />
                )
              }
            />

            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? ""}
                  label="姓名"
                  size="small"
                  slotProps={readOnlyFieldSlotProps}
                  fullWidth
                />
              )}
            />

            <Flex sx={{ gap: 2, alignItems: "center" }}>
              <Controller
                name="division"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="事業部"
                    placeholder="系統自動帶入"
                    slotProps={readOnlyFieldSlotProps}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Flex>

            <Controller
              name="roleId"
              control={control}
              rules={{ required: "請選擇角色" }}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  options={roleOptions}
                  value={roleOptions.find((o) => o.id === value) ?? null}
                  onChange={(_, newValue) => onChange(newValue?.id ?? null)}
                  getOptionLabel={(o) => o.roleName}
                  isOptionEqualToValue={(o, v) => o.id === v.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="角色"
                      placeholder="選擇角色，單選"
                      size="small"
                      error={!!errors.roleId}
                      helperText={errors.roleId?.message}
                    />
                  )}
                />
              )}
            />

            <TextField
              {...register("remark")}
              label="備註"
              placeholder="輸入備註"
              size="small"
            />
          </Flex>

          <Controller
            name="enabled"
            control={control}
            render={({ field: { value, onChange } }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                  />
                }
                label="啟用"
                sx={{ whiteSpace: "nowrap", ml: 3 }}
              />
            )}
          />
        </Flex>
      </Box>

      <BottomActionBar>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          取消
        </Button>
        <Button
          variant="contained"
          loading={isPending}
          onClick={handleSubmit((data) => onSave?.(data))}
        >
          儲存
        </Button>
      </BottomActionBar>
    </>
  );
};

export default AccountForm;
