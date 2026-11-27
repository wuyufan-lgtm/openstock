'use client';

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { MARKETS, MARKET_COOKIE, type Market, type MarketId } from "@/lib/markets";
import { cn } from "@/lib/utils";

// The four markets that sit in the bar permanently, in the user's chosen order. The rest
// collapse behind the + chip so the row stays short; the active market always shows.
const PINNED: MarketId[] = ['us', 'hk', 'jp', 'de'];

// Market chips for the dashboard. The choice is remembered in a cookie so the server renders it next time.
export default function MarketSwitcher({ active, openIds }: { active: MarketId; openIds: MarketId[] }) {
    const t = useTranslations('MarketSwitcher');
    const tm = useTranslations('Markets');
    const [expanded, setExpanded] = useState(false);
    const remember = (id: MarketId) => {
        document.cookie = `${MARKET_COOKIE}=${id}; path=/; max-age=31536000; samesite=lax`;
    };

    const pinned = PINNED.map((id) => MARKETS.find((m) => m.id === id)!).filter(Boolean) as Market[];
    // Overflow markets, hidden behind +; the active one must stay visible even when collapsed
    const overflow = MARKETS.filter((m) => !PINNED.includes(m.id) && (expanded || m.id === active));

    const chip = (m: Market) => {
        const selected = m.id === active;
        const open = openIds.includes(m.id);
        return (
            <Link
                key={m.id}
                href={`/dashboard?market=${m.id}`}
                onClick={() => remember(m.id)}
                aria-current={selected ? 'page' : undefined}
                className={cn(
                    'flex h-9 flex-none items-center gap-2 rounded-full px-3.5 text-[13.5px] font-semibold transition-[background-color,color,box-shadow] duration-150',
                    selected
                        ? 'bg-brand-soft text-brand-ink shadow-[inset_0_0_0_1px_var(--brand-ring)]'
                        : 'text-muted-foreground shadow-[inset_0_0_0_1px_var(--line)] hover:bg-hover hover:text-foreground',
                )}
            >
                <span className={cn('size-1.5 rounded-full', open ? 'bg-up' : 'bg-line-strong')} title={open ? t('openNow') : t('closedNow')} />
                {tm(`names.${m.id}`)}
            </Link>
        );
    };

    const hasOverflow = MARKETS.some((m) => !PINNED.includes(m.id));

    return (
        <nav aria-label={t('label')} className="flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
            {pinned.map(chip)}
            {overflow.map(chip)}
            {hasOverflow && (
                <button
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                    aria-expanded={expanded}
                    aria-label={expanded ? t('collapseMarkets') : t('moreMarkets')}
                    title={expanded ? t('collapseMarkets') : t('moreMarkets')}
                    className={cn(
                        'flex h-9 flex-none items-center gap-1.5 rounded-full px-3 text-[13.5px] font-semibold transition-[background-color,color,box-shadow] duration-150',
                        expanded
                            ? 'text-muted-foreground shadow-[inset_0_0_0_1px_var(--line)] hover:bg-hover hover:text-foreground'
                            : 'bg-brand-soft text-brand-ink shadow-[inset_0_0_0_1px_var(--brand-ring)] hover:bg-hover',
                    )}
                >
                    {expanded ? <Minus className="size-3.5" strokeWidth={2.5} /> : <Plus className="size-3.5" strokeWidth={2.5} />}
                </button>
            )}
        </nav>
    );
}
