import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UK Wind Forecast Monitoring",
  description: "Compare actual vs forecasted wind power generation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
