'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { BookOpen, Code2, Heart, Info, LayoutDashboard, LifeBuoy, LogOut, Search, Star } from "lucide-react";
import { openSearch } from "@/components/SearchCommand";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Logo from "@/components/brand/Logo";
import { signOut } from "@/lib/actions/auth.actions";
import { cn } from "@/lib/utils";

type SidebarProps = {
    user: User;
    watchlist: { symbol: string; company: string }[];
};

const RESOURCES = [
    { href: '/help', label: 'help', icon: LifeBuoy },
    { href: '/api-docs', label: 'apiDocs', icon: Code2 },
    { href: '/about', label: 'about', icon: Info },
    { href: '/terms', label: 'terms', icon: BookOpen },
] as const;

const Sidebar = ({ user, watchlist }: SidebarProps) => {
    const t = useTranslations('Sidebar');
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push('/sign-in');
    };

    return (
        <aside className="sidebar">
            <Link href="/dashboard" className="flex min-h-9 items-center px-2 pt-1 pb-2" aria-label={t('homeAria')}>
                <Logo priority />
            </Link>

            <button type="button" onClick={openSearch} className="side-cta">
                <Search className="size-4" strokeWidth={2.5} />
                <span className="flex-1 text-start">{t('searchStocks')}</span>
                <kbd className="kbd bg-on-brand/10">⌘K</kbd>
            </button>

            <nav className="flex flex-col gap-0.5">
                <Link href="/dashboard" className={cn('side-item', pathname === '/dashboard' && 'is-active')}>
                    <LayoutDashboard /> {t('overview')}
                </Link>
                <Link href="/watchlist" className={cn('side-item', pathname === '/watchlist' && 'is-active')}>
                    <Star /> <span className="flex-1">{t('watchlist')}</span>
                    <span className="num text-xs text-faint">{watchlist.length}</span>
                </Link>
            </nav>

            <div className="flex min-h-0 flex-col gap-1">
                <p className="side-label shrink-0">{t('watching')}</p>
                {watchlist.length === 0 ? (
                    <p className="px-2.5 text-[12.5px] text-faint">{t('watchingEmpty')}</p>
                ) : (
                    <ul className="scrollbar-hide-default flex min-h-0 flex-col gap-0.5 overflow-y-auto">
                        {watchlist.map(({ symbol, company }) => (
                            <li key={symbol}>
                                <Link
                                    href={`/stocks/${symbol}`}
                                    title={company}
                                    className={cn('side-item h-8 font-medium', pathname === `/stocks/${symbol}` && 'is-active')}
                                >
                                    <span className="mono min-w-14 max-w-24 shrink-0 truncate text-[12.5px] font-semibold text-foreground">{symbol}</span>
                                    {company !== symbol && <span dir="auto" className="truncate text-[12.5px] text-faint">{company}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="mt-auto flex flex-col gap-0.5">
                {RESOURCES.map(({ href, label, icon: Icon }) => (
                    <Link key={href} href={href} className={cn('side-item h-8', pathname === href && 'is-active')}>
                        <Icon /> {t(`resources.${label}`)}
                    </Link>
                ))}
                <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-donate-popup'))}
                    className="side-item h-8 text-start"
                >
                    <Heart /> {t('support')}
                </button>
                <LanguageSwitcher />
            </div>

            <div className="flex items-center gap-2.5 border-t border-line pt-3 px-1">
                <Link href="/profile" className={cn('-m-1 flex min-w-0 flex-1 items-center gap-2.5 rounded-[10px] p-1 transition-colors hover:bg-white/5', pathname === '/profile' && 'bg-white/5')}>
                    <span className="grid size-8 flex-none place-items-center rounded-full bg-brand-soft text-[13px] font-bold text-brand-ink">
                        {user.name?.[0]?.toUpperCase() ?? '?'}
                    </span>
                    <span className="min-w-0 flex-1">
                        <span dir="auto" className="block truncate text-[13px] font-semibold text-foreground rtl:text-right">{user.name}</span>
                        <span dir="auto" className="block truncate text-[12px] text-faint rtl:text-right">{user.email}</span>
                    </span>
                </Link>
                <button type="button" onClick={handleSignOut} className="icon-btn" title={t('signOut')} aria-label={t('signOut')}>
                    <LogOut />
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
