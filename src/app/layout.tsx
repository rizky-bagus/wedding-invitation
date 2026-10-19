import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Undangan Pernikahan",
  description: "Generator undangan pernikahan digital",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
