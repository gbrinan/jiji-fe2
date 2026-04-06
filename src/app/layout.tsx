import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { AuthProvider } from "@/hooks/useAuth";
import "./globals.css";

const pretendard = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-pretendard",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JIJI - 여성 건강 관리",
  description: "여성 건강 관리 앱",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="min-h-dvh bg-gray-50 font-sans">
        <div className="mx-auto max-w-md min-h-dvh bg-white relative">
          <AuthProvider>
            {children}
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
