import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/toggle-mode";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import Link from "next/link";
import { Github } from "lucide-react";
import { Analytics } from "@vercel/analytics/next"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'BangerX',
  description: 'X search on steroids.',
  keywords: [
    'twitter search',
    'x search',
    'viral tweets',
    'twitter analytics',
    'find viral tweets',
    'twitter engagement',
    'x viral content',
    'twitter search tool',
    'social media discovery',
    'content research',
    'twitter marketing',
    'viral content finder',
  ],
  authors: [{ name: 'BangerX' }],
  creator: 'BangerX',
  publisher: 'BangerX',
  
  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://banger-x.vercel.app',
    siteName: 'BangerX',
    title: 'BangerX - Hunt Viral Tweets Without API Limits',
    description: 'Find viral tweets on X instantly. Discover bangers from any creator or topic. No API, no limits, completely free. 🔥',
    images: [
      {
        url: '/public/dark1.png',
        width: 1200,
        height: 630,
        alt: 'BangerX - Hunt Viral Tweets',
        type: 'image/png',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    site: '@eeshmidha1', 
    creator: '@eeshmidha1',
    title: 'BangerX - X search on steroids',
    description: 'Find viral tweets on X instantly. No API, no limits, completely free. 🔥',
    images: ['/public/dark1.png', '/public/dark2.png'],
  },

  // Additional Meta Tags
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },


  // Additional
  metadataBase: new URL('https://banger-x.vercel.app'),
  alternates: {
    canonical: 'https://banger-x.vercel.app',
  },

  // App-specific
  applicationName: 'BangerX',
  appleWebApp: {
    capable: true,
    title: 'BangerX',
    statusBarStyle: 'default',
  },

  // Category
  category: 'technology',
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
return (
  <html lang="en" suppressHydrationWarning>
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased bg-theme-bg dark:bg-theme-dark `}
    >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        <div className="flex justify-between mx-4 mt-4">
          <div className="p-2">
          <Link href={"https://github.com/eeshm/bangerx"} target="_blank">
          <Github className="size-6 stroke-[1.5px]"/>
          </Link>
          </div>
          <div>
          <AnimatedThemeToggler className=""/>
          </div>
        </div>  
        {children}
        <Analytics/>
      </ThemeProvider>
    </body>
  </html>
);
}
