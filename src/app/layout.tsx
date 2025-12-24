import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import "./globals.css";

const poppins = Poppins({ weight: ['400', '500', '600', '700'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-commerce Admin',
  description: 'E-commerce Admin Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
      </head>
      <body className={poppins.className}>
        {/* We removed AdminLayout and SearchProvider from here! */}
        {children}
      </body>
    </html>
  );
}