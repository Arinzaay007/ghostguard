import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GhostGuard",
  description: "Security layer for developers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}