import Link from "next/link";
import { Bell, CandlestickChart, Command, FileText, Grid3x3, Languages, ListChecks, MailOpen, MessagesSquare } from "lucide-react";
import { MarketDial, MarketStatus } from "@/components/landing/MarketClock";
import WorldClock from "@/components/landing/WorldClock";
import ProductPreview from "@/components/landing/ProductPreview";
import SectionHead from "@/components/marketing/SectionHead";
import IconCard from "@/components/marketing/IconCard";

const FEATURES = [
    { icon: CandlestickChart, title: 'Charts that move', body: 'TradingView candles, technicals and financials for any listed company, full screen when you need room.' },
    { icon: Bell, title: 'Alerts by email', body: 'Set a target price, or follow the 20, 50, 100 or 200-day moving average. We check every five minutes and write when it crosses.' },
    { icon: MessagesSquare, title: 'Sentiment in one read', body: 'Buzz and bullishness from Reddit, X.com, news and Polymarket, side by side for each stock.' },
    { icon: Grid3x3, title: 'The whole market', body: 'Nine markets on one switch: US, India, Germany, Canada, Australia, Saudi Arabia, Poland, crypto and forex, each with index tiles, movers or a heatmap, and top stories.' },
    { icon: Command, title: 'Find anything with ⌘K', body: 'Search every exchange Finnhub covers and open a stock as a tab, like a browser.' },
    { icon: MailOpen, title: 'A Monday digest', body: 'A short, AI-written summary of the week’s news for the stocks you watch.' },
    { icon: ListChecks, title: 'Lists for every idea', body: 'Star up to 50 stocks, then group them into up to 10 named lists of 50, from any watchlist row or straight from search.' },
    { icon: Languages, title: 'In your language', body: 'The app, sign-in pages and emails in English, Polish and Arabic, with Arabic laid out right to left.' },
    { icon: FileText, title: 'Open stock pages', body: 'A chart and the latest SEC filings for every S&P 500 and Nasdaq-100 company, no account needed.' },
];

export default function LandingPage() {
    return (
        <>
            <section className="mx-auto max-w-[1200px] px-5 pt-14 md:pt-20">
                <MarketStatus />
                <h1 className="mt-6 text-[44px] font-bold leading-[1.02] tracking-[-0.05em] md:text-[68px]">
                    Markets, minus<br />the paywall.
                </h1>
                <div className="mt-8 flex flex-wrap items-center gap-2">
                    <Link href="/sign-up" className="btn btn-primary h-11 px-5 text-[15px]">Get started free</Link>
                </div>

                <div className="mt-12 grid items-stretch gap-3 lg:grid-cols-[minmax(0,1fr)_340px]">
                    <WorldClock />
                    <div className="hatch">
                        <div className="card flex h-full flex-col justify-center px-6 pb-6 pt-6">
                            <MarketDial />
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto mt-16 max-w-[1200px] px-5">
                <ProductPreview />
            </section>

            <section id="inside" className="mx-auto mt-28 max-w-[1200px] scroll-mt-24 px-5">
                <SectionHead kicker="What's inside" title="A terminal for people who aren't at a bank." sub="Everything you need to follow the market, in one place, without a subscription." />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map(({ icon, title, body }) => (
                        <IconCard key={title} icon={icon} title={title}>{body}</IconCard>
                    ))}
                </div>
            </section>
        </>
    );
}
