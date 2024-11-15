import type { Metadata } from "next";

import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { JotaiProvider } from "@/components/providers/jotai-provider";
import { Modals } from "@/components/modals";
import { Toaster } from "@/components/ui/sonner";

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Slack",
  description: "Slack clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body className={inter.className}>
          <ConvexClientProvider>
            <JotaiProvider>
              <Toaster />
              <Modals />
              {children}
            </JotaiProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
