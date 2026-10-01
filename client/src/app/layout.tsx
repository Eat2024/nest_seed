import AuthProvider from "@/providers/AuthProvider";
import DialogProvider from "@/providers/DialogProvider";
import MuiProvider from "@/providers/MuiProvider";
import PermissionProvider from "@/providers/PermissionProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import SnackbarProvider from "@/providers/SnackbarProvider";
import "@/styles/globals.css";

import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";

const notoSansTC = Noto_Sans_TC({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans-tc",
});

export const metadata: Metadata = {
  title: "Nest Seed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant-TW" suppressHydrationWarning>
      <body className={notoSansTC.variable}>
        <MuiProvider>
          <SnackbarProvider>
            <DialogProvider>
              <ReactQueryProvider>
                <AuthProvider>
                  <PermissionProvider>{children}</PermissionProvider>
                </AuthProvider>
              </ReactQueryProvider>
            </DialogProvider>
          </SnackbarProvider>
        </MuiProvider>
      </body>
    </html>
  );
}
