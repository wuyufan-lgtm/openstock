import Link from "next/link";
import { Globe, Instagram } from "lucide-react";
import Logo from "@/components/brand/Logo";

const SOCIAL = [
    { href: 'https://evanquinne.com', label: 'Evan & Quinne — evanquinne.com', icon: Globe },
    { href: 'https://www.instagram.com/wu__yufan/', label: 'Instagram — @wu__yufan', icon: Instagram },
    { href: 'https://www.threads.net/@wu__yufan', label: 'Threads — @wu__yufan', icon: ThreadsIcon },
] as const;

function ThreadsIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
            <path d="M18.263 11.097c-.03-3.486-1.92-5.586-5.111-5.586-2.13 0-3.922.963-4.863 2.499l2.062 1.438c.535-.843 1.272-1.543 2.628-1.543 1.528 0 2.318.85 2.544 2.431a15 15 0 0 0-2.236-.173c-4.125 0-6.068 1.867-6.068 4.336s1.943 3.99 4.804 3.99c3.139 0 5.013-2.115 5.781-4.735.798.361 1.348 1.204 1.348 2.47 0 3.387-3.907 5.232-7.22 5.232-4.885 0-8.077-3.207-8.077-8.424 0-6.392 4.223-10.487 9.9-10.487 3.808 0 5.69 1.671 6.97 3.914l2.108-1.475C21.44 2.078 18.331 0 13.663 0 6.227 0 1.168 5.277 1.168 12.934c0 7 4.953 11.066 10.856 11.066 4.878 0 9.809-2.846 9.809-7.716 0-2.545-1.46-4.231-3.569-5.187m-6.33 4.855c-1.077 0-2.026-.512-2.026-1.453 0-1.483 1.822-1.934 3.606-1.934.678 0 1.34.045 1.927.173-.422 1.927-1.671 3.215-3.508 3.214Z" />
        </svg>
    );
}

export default function SiteFooter() {
    return (
        <footer className="mt-24 border-t border-line bg-side">
            <div className="mx-auto max-w-[1200px] px-5">
                <div className="flex flex-col items-start gap-5 py-14">
                    <Link href="/" aria-label="Open home" className="w-fit rounded-[6px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 focus-visible:ring-offset-2 focus-visible:ring-offset-side">
                        <Logo className="gap-2" markClassName="size-7" wordClassName="text-[26px]" />
                    </Link>
                    <p className="text-[14px] leading-relaxed text-muted-foreground">An open-source market platform</p>
                    <ul className="flex items-center gap-1.5">
                        {SOCIAL.map(({ href, label, icon: Icon }) => (
                            <li key={label}>
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={label}
                                    className="icon-btn shadow-[inset_0_0_0_1px_var(--line)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 focus-visible:ring-offset-2 focus-visible:ring-offset-side"
                                >
                                    <Icon />
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 flex flex-col gap-2">
                        <p className="text-[26px] font-bold tracking-[-0.03em]">Evan &amp; Quinne</p>
                        <p className="text-[15px] text-muted-foreground">Befriending Time, Embracing Presence.</p>
                    </div>
                </div>

                <div className="border-t border-line py-6 pb-8 text-[13px] text-faint">
                    Evan&amp;Quinne © 2026 by Evan Wu is licensed under{' '}
                    <a
                        href="https://creativecommons.org/licenses/by-nc-nd/4.0/"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-[4px] text-muted-foreground transition-colors hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70"
                    >
                        CC BY-NC-ND 4.0
                    </a>{' '}
                    ·{' '}
                    <a href="mailto:evan@evanquinne.com" className="rounded-[4px] text-muted-foreground transition-colors hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70">
                        evan@evanquinne.com
                    </a>
                </div>
            </div>
        </footer>
    );
}
