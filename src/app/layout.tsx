import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionAuthProvider } from "@/components/session-auth";
import { Toaster, toast } from 'sonner'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClinicaPRO",
  description: "ClinicaPRO - Your Dental Care Partner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionAuthProvider>
          <Toaster duration={2500} position="top-right" richColors  />
          {children}
        </SessionAuthProvider>
      </body>
    </html>
  );
}
