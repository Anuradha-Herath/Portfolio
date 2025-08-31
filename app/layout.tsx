import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anuradha Herath - Portfolio",
  description: "Personal portfolio website",
  icons: {
    icon: "/logo/Copilot_20250829_191045.png",
  },
  viewport: "width=device-width, initial-scale=1.0",
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
