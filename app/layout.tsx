import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Finova AI | AI Personal Finance",
  description: "Take control of your finances with AI-powered insights",
};

import { AuthProvider } from "@/components/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
