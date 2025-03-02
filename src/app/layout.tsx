import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const customFont = localFont({
  src: [
    {
      path: "./fonts/zed-bold.ttf", 
      weight: "700", 
      style: "normal",
    },
    {
      path: "./fonts/zed-regular.ttf", 
      weight: "400", 
      style: "normal",
    },
  ],
  variable: "--font-custom", 
});

export const metadata: Metadata = {
  title: "BMI Calculator - Check Your Body Mass Index",
  description:
    "Calculate your BMI instantly with our easy-to-use Body Mass Index calculator.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${customFont.className} ${customFont.variable}`}>
        {children}
      </body>
    </html>
  );
}