import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "מרכז תלמידים",
  description: "נהל את התלמידים שלך ותקשר איתם בקלות",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased" style={{ fontFamily: "'Heebo', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
