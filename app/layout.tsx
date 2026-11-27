import type { Metadata } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import {Toaster} from "@/components/ui/sonner";
import OntoLaunchCard from "@/components/OntoLaunchCard";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { THEME_SCRIPT } from "@/lib/theme";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

// The Latin display face has no Arabic glyphs. Only Arabic pages use this one (see globals.css),
// so it isn't preloaded on the rest.
const arabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  preload: false,
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Open",
  description: "An open-source market platform. Track nine markets, keep watchlists, and explore detailed company insights — built openly, for everyone, forever free.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* Applies the saved theme before the first paint, so no palette ever flashes. */}
                <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
            </head>
            <body
                className={`${jakarta.variable} ${arabic.variable} ${plexMono.variable} font-sans antialiased`}
            >
                <ThemeProvider>
                    {children}
                    <Toaster/>
                    <OntoLaunchCard />
                </ThemeProvider>
                <Analytics />
            </body>
        </html>
    );
}
