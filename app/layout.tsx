import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gnosis Beacon Chain Deposit",
  description: "Gnosis Beacon Chain Deposit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="bg-[url('../public/background.jpg')] bg-cover bg-center w-full h-full">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
