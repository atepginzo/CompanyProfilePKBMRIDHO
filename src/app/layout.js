import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteChrome from '@/components/public/SiteChrome';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: 'PKBM RIDHO - Pusat Kegiatan Belajar Masyarakat',
    template: '%s | PKBM RIDHO',
  },
  description: 'PKBM RIDHO adalah lembaga pendidikan nonformal resmi yang menyelenggarakan program kesetaraan Paket A, Paket B, dan Paket C. Pendidikan gratis dan berkualitas untuk semua.',
  keywords: ['PKBM', 'PKBM RIDHO', 'pendidikan nonformal', 'paket A', 'paket B', 'paket C', 'kesetaraan', 'pendidikan gratis', 'belajar', 'Bandung', 'Kecamatan Paseh'],
  authors: [{ name: 'PKBM RIDHO' }],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'PKBM RIDHO',
    title: 'PKBM RIDHO - Pusat Kegiatan Belajar Masyarakat',
    description: 'Pendidikan kesetaraan Paket A, B, dan C yang gratis dan berkualitas untuk semua.',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
