import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OPSCOPE Platform",
  description: "Operacoes, almoxarifado e SST"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body>{children}</body>
    </html>
  );
}
