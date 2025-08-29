import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anuradha Herath - Portfolio",
  description: "Personal portfolio website",
  icons: {
    icon: "/logo/Copilot_20250829_191045.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
