"use client";

import { ERROR_CODE_MAP } from "@/api/errorCodes";
import { useLoginOptionsQuery } from "@/api/queries";
import { devLogin, oauthStart } from "@/api/requests";
import Flex from "@/components/ui/Flex";
import { useAuthContext } from "@/providers/AuthProvider";
import { redirectToUri } from "@/utils/redirectTo";
import { Alert, Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

/** 統一登入失敗回登入頁時的預設提示（query 帶的是後端穩定錯誤碼，不帶原因細節）。 */
const OAUTH_ERROR_FALLBACK = "統一登入未完成，請重新登入";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUserData } = useAuthContext();

  // proxy 導向登入頁時帶原頁路徑；登入完成後回到該頁（不合法則進首頁）。
  const redirectTo = redirectToUri(searchParams.get("redirectTo"));
  const oauthErrorCode = searchParams.get("oauthError");
  const oauthErrorMessage = oauthErrorCode
    ? (ERROR_CODE_MAP[oauthErrorCode] ?? OAUTH_ERROR_FALLBACK)
    : null;

  // 入口依後端設定：統一登入未設定時（僅 DEVMOD 本機）不顯示；開發者登入只在 DEVMOD 開放時顯示。
  const { data: loginOptions } = useLoginOptionsQuery();
  const showOauth = loginOptions?.oauth ?? true;
  const showDevLogin = loginOptions?.devLogin ?? false;

  // 發起統一登入：後端建立登入交易並回授權網址，成功即整頁導向登入中心。
  // 一般失敗交給全域 MutationCache onError 顯示提示（見 ReactQueryProvider）
  const { mutate: oauthStartMutate, isPending: isOauthPending } = useMutation({
    mutationFn: oauthStart,
    onSuccess: ({ authorizationUrl }) => {
      window.location.assign(authorizationUrl);
    },
  });

  // 開發者登入（DEVMOD）：後端直接下發超級管理員 session，完成後回到原頁。
  const { mutate: devLoginMutate, isPending: isDevLoginPending } = useMutation({
    mutationFn: devLogin,
    onSuccess: (data) => {
      setUserData(data);
      router.push(redirectTo);
    },
  });

  return (
    <Flex sx={{ width: "100%", flexFlow: "column nowrap", alignItems: "center" }}>
      {oauthErrorMessage && (
        <Alert severity="warning" sx={{ width: "100%", mb: 4 }}>
          {oauthErrorMessage}
        </Alert>
      )}

      {showOauth && (
        <Button
          fullWidth
          variant="contained"
          type="button"
          loading={isOauthPending}
          onClick={() => oauthStartMutate({ redirectTo })}
          sx={{ mb: 4 }}
        >
          使用饗賓統一登入
        </Button>
      )}

      {showDevLogin && (
        <Button
          fullWidth
          variant="outlined"
          color="warning"
          type="button"
          loading={isDevLoginPending}
          onClick={() => devLoginMutate()}
          sx={{ mb: 4 }}
        >
          開發者登入（Super User）
        </Button>
      )}
    </Flex>
  );
};

// useSearchParams() 需要 Suspense 邊界（Next.js 要求）。
const LoginPage = () => (
  <Suspense fallback={null}>
    <LoginForm />
  </Suspense>
);

export default LoginPage;
