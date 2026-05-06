import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer";

const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "GreatestStore",
  description: "Sua loja de produtos premium",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={cn("h-full bg-(--fundo)) overflow-hidden", "antialiased", openSans.variable)}
    >
      <body className="min-h-full flex flex-col font-sans bg-(--fundo) overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto">
          {children}
          <Footer />
        </div>
      </body>
      
    </html>
  );
}
