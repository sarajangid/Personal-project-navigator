import type { Metadata } from "next";
import { Bitter} from "next/font/google";
import "./globals.css";

const bitter = Bitter({
  subsets: ['latin'],
  weight: ['400', '700'], // pick weights you want
  style: ['normal', 'italic'],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={bitter.className}>
        {children}
      </body>
    </html>
  );
}
