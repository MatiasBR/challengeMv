import type { Metadata } from "next";
import {Montserrat} from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '600', '700'] }); 


export const metadata: Metadata = {
  title: "ChallengeMv",
  description: "Generated by Create Next App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
