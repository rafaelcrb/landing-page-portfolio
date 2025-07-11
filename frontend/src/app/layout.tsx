import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rafael Rodrigues - Portfolio",
  description: "Full-stack developer portfolio showcasing modern web applications",
  keywords: ["portfolio", "developer", "react", "nextjs", "typescript"],
  authors: [{ name: "Rafael Rodrigues" }],
  openGraph: {
    title: "Rafael Rodrigues - Portfolio",
    description: "Full-stack developer portfolio showcasing modern web applications",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

