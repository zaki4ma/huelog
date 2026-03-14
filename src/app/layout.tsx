import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hue Log",
  description: "孤独を静かに共有する感情ログアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
