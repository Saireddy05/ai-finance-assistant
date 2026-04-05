import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Finova AI | AI Personal Finance",
  description: "Take control of your finances with AI-powered insights",
};

import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "sonner";

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
          <Toaster 
            theme="dark" 
            position="top-center" 
            expand={false} 
            richColors 
            closeButton
            offset={20}
            gap={12}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
