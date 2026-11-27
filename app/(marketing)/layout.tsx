import Link from "next/link";
import SiteFooter from "@/components/marketing/SiteFooter";
import Logo from "@/components/brand/Logo";

const NAV = [
    { href: '/#inside', label: 'Product' },
    { href: 'https://evanquinne.com', label: 'Index' },
    { href: 'https://report.evanquinne.com', label: 'Performance' },
] as const;

// No session read here: it made every public page (and every <Link> prefetch of one) a function call.
// The header always shows the signed-out buttons; /sign-in and /sign-up send a signed-in visitor to /dashboard.
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-dvh bg-page">
            <header className="sticky top-0 z-40 border-b border-transparent bg-page/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-3 px-4 sm:gap-6 sm:px-5">
                    <Link href="/" aria-label="Open home" className="shrink-0 rounded-[6px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70">
                        <Logo priority />
                    </Link>
                    {/* Not at md: the links plus the buttons are ~700px wide, past a 768px tablet */}
                    <nav className="hidden items-center gap-1 lg:flex">
                        {NAV.map(({ href, label }) => {
                            const external = href.startsWith('http');
                            return external ? (
                                <a key={href} href={href} target="_blank" rel="noreferrer" className="side-item h-8 font-semibold">{label}</a>
                            ) : (
                                <Link key={href} href={href} className="side-item h-8 font-semibold">{label}</Link>
                            );
                        })}
                    </nav>
                    <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
                        <Link href="/sign-in" className="btn h-9 px-2 text-muted-foreground hover:text-foreground sm:px-3">Sign in</Link>
                        <Link href="/sign-up" className="btn btn-primary h-9 px-3 sm:px-[14px]">Get started</Link>
                    </div>
                </div>
            </header>

            <main>{children}</main>

            <SiteFooter />
        </div>
    );
}
