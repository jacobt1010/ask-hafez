import type { Metadata } from "next";
import { Scheherazade_New, Crimson_Pro } from "next/font/google";
import "./globals.css";
import { CascadeProvider } from "@/components/CascadeTransition";

const scheherazadeNew = Scheherazade_New({
  variable: "--font-fa",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

const crimsonPro = Crimson_Pro({
  variable: "--font-en",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ask Hafez",
  description: "A fortune from Hafez, in the tradition of Fal-e Hafez.",
  icons: {
    icon: [
      { url: "/images/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${scheherazadeNew.variable} ${crimsonPro.variable}`}>
      <body>
        <CascadeProvider>{children}</CascadeProvider>
      </body>
    </html>
  );
}
