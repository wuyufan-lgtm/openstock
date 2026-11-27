'use client';

import { useEffect, useRef, useState } from "react";
import { geoCircle, geoEquirectangular, geoGraticule10, geoPath, type GeoPermissibleObjects, type GeoProjection } from "d3-geo";
import { feature } from "topojson-client";

const W = 1000;
const H = 500;

type City = { name: string; lon: number; lat: number; tz: string };
type Dot = { city: City; x: number; y: number };

const CITIES: City[] = [
    { name: 'Anchorage', lon: -149.90, lat: 61.22, tz: 'America/Anchorage' },
    { name: 'Vancouver', lon: -123.12, lat: 49.28, tz: 'America/Vancouver' },
    { name: 'San Francisco', lon: -122.42, lat: 37.77, tz: 'America/Los_Angeles' },
    { name: 'Los Angeles', lon: -118.24, lat: 34.05, tz: 'America/Los_Angeles' },
    { name: 'Denver', lon: -104.99, lat: 39.74, tz: 'America/Denver' },
    { name: 'Mexico City', lon: -99.13, lat: 19.43, tz: 'America/Mexico_City' },
    { name: 'Chicago', lon: -87.63, lat: 41.88, tz: 'America/Chicago' },
    { name: 'Bogotá', lon: -74.07, lat: 4.71, tz: 'America/Bogota' },
    { name: 'Toronto', lon: -79.38, lat: 43.65, tz: 'America/Toronto' },
    { name: 'New York', lon: -74.01, lat: 40.71, tz: 'America/New_York' },
    { name: 'Lima', lon: -77.04, lat: -12.05, tz: 'America/Lima' },
    { name: 'Santiago', lon: -70.67, lat: -33.45, tz: 'America/Santiago' },
    { name: 'São Paulo', lon: -46.63, lat: -23.55, tz: 'America/Sao_Paulo' },
    { name: 'Buenos Aires', lon: -58.38, lat: -34.60, tz: 'America/Argentina/Buenos_Aires' },
    { name: 'Reykjavik', lon: -21.90, lat: 64.15, tz: 'Atlantic/Reykjavik' },
    { name: 'Casablanca', lon: -7.62, lat: 33.57, tz: 'Africa/Casablanca' },
    { name: 'London', lon: -0.13, lat: 51.51, tz: 'Europe/London' },
    { name: 'Madrid', lon: -3.70, lat: 40.42, tz: 'Europe/Madrid' },
    { name: 'Paris', lon: 2.35, lat: 48.86, tz: 'Europe/Paris' },
    { name: 'Rome', lon: 12.50, lat: 41.90, tz: 'Europe/Rome' },
    { name: 'Berlin', lon: 13.40, lat: 52.52, tz: 'Europe/Berlin' },
    { name: 'Stockholm', lon: 18.07, lat: 59.33, tz: 'Europe/Stockholm' },
    { name: 'Lagos', lon: 3.38, lat: 6.52, tz: 'Africa/Lagos' },
    { name: 'Istanbul', lon: 28.98, lat: 41.01, tz: 'Europe/Istanbul' },
    { name: 'Moscow', lon: 37.62, lat: 55.76, tz: 'Europe/Moscow' },
    { name: 'Cairo', lon: 31.24, lat: 30.04, tz: 'Africa/Cairo' },
    { name: 'Tel Aviv', lon: 34.78, lat: 32.09, tz: 'Asia/Jerusalem' },
    { name: 'Nairobi', lon: 36.82, lat: -1.29, tz: 'Africa/Nairobi' },
    { name: 'Johannesburg', lon: 28.05, lat: -26.20, tz: 'Africa/Johannesburg' },
    { name: 'Riyadh', lon: 46.68, lat: 24.71, tz: 'Asia/Riyadh' },
    { name: 'Tehran', lon: 51.39, lat: 35.69, tz: 'Asia/Tehran' },
    { name: 'Dubai', lon: 55.27, lat: 25.20, tz: 'Asia/Dubai' },
    { name: 'Karachi', lon: 67.01, lat: 24.86, tz: 'Asia/Karachi' },
    { name: 'Mumbai', lon: 72.88, lat: 19.08, tz: 'Asia/Kolkata' },
    { name: 'Delhi', lon: 77.21, lat: 28.61, tz: 'Asia/Kolkata' },
    { name: 'Dhaka', lon: 90.41, lat: 23.81, tz: 'Asia/Dhaka' },
    { name: 'Bangkok', lon: 100.50, lat: 13.76, tz: 'Asia/Bangkok' },
    { name: 'Jakarta', lon: 106.85, lat: -6.21, tz: 'Asia/Jakarta' },
    { name: 'Singapore', lon: 103.85, lat: 1.29, tz: 'Asia/Singapore' },
    { name: 'Hong Kong', lon: 114.17, lat: 22.32, tz: 'Asia/Hong_Kong' },
    { name: 'Beijing', lon: 116.41, lat: 39.90, tz: 'Asia/Shanghai' },
    { name: 'Shanghai', lon: 121.47, lat: 31.23, tz: 'Asia/Shanghai' },
    { name: 'Manila', lon: 120.98, lat: 14.60, tz: 'Asia/Manila' },
    { name: 'Seoul', lon: 126.98, lat: 37.57, tz: 'Asia/Seoul' },
    { name: 'Tokyo', lon: 139.69, lat: 35.69, tz: 'Asia/Tokyo' },
    { name: 'Perth', lon: 115.86, lat: -31.95, tz: 'Australia/Perth' },
    { name: 'Melbourne', lon: 144.96, lat: -37.81, tz: 'Australia/Melbourne' },
    { name: 'Sydney', lon: 151.21, lat: -33.87, tz: 'Australia/Sydney' },
    { name: 'Auckland', lon: 174.76, lat: -36.85, tz: 'Pacific/Auckland' },
];

const RAD = Math.PI / 180;

// Sub-solar point, good to a few arcminutes: enough for a day/night edge that looks right at any hour.
const sunPosition = (date: Date) => {
    const start = Date.UTC(date.getUTCFullYear(), 0, 0);
    const dayOfYear = Math.floor((date.getTime() - start) / 86_400_000);
    const declination = -23.44 * Math.cos(RAD * (360 / 365) * (dayOfYear + 10));
    const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
    const lon = ((12 - utcHours) * 15 + 540) % 360 - 180;
    return { lat: declination, lon };
};

const formatTime = (date: Date, timeZone: string, withSeconds = false) =>
    new Intl.DateTimeFormat('en-GB', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
        ...(withSeconds ? { second: '2-digit' as const } : {}),
    }).format(date);

// Ticks on the client only, so the server never renders a time that the browser would then disagree with.
function useClock(interval = 1000) {
    const [now, setNow] = useState<Date | null>(null);
    useEffect(() => {
        const tick = () => setNow(new Date());
        tick();
        const id = setInterval(tick, interval);
        return () => clearInterval(id);
    }, [interval]);
    return now;
}

function TooltipTime({ timeZone }: { timeZone: string }) {
    const now = useClock();
    return <span className="block text-[17px] font-bold leading-tight text-brand-ink">{now ? formatTime(now, timeZone) : '--:--'}</span>;
}

function LocalClock() {
    const now = useClock();
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    const place = (zone.split('/')[1] ?? zone).replace(/_/g, ' ');
    return (
        <div className="pointer-events-none absolute bottom-3 left-4 text-foreground drop-shadow-[0_2px_10px_oklch(0_0_0/0.7)]">
            <p className="mono text-[30px] font-bold leading-none tracking-[-0.03em]">{now ? formatTime(now, zone, true) : '--:--:--'}</p>
            <p className="mt-1.5 text-[12px] font-semibold">{place}</p>
            <p className="text-[11px] text-muted-foreground">
                {now ? new Intl.DateTimeFormat('en-GB', { timeZone: zone, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(now) : '—'}
            </p>
        </div>
    );
}

export default function WorldClock() {
    const projection = useRef<GeoProjection | null>(null);
    const [land, setLand] = useState<string[] | null>(null);
    const [graticule, setGraticule] = useState('');
    const [dots, setDots] = useState<Dot[]>([]);
    const [night, setNight] = useState({ core: '', soft: '' });
    const [hovered, setHovered] = useState<Dot | null>(null);

    // Real coastlines: 110m world-atlas in public/data, drawn once, then never recomputed.
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const topology = await fetch('/data/countries-110m.json').then((r) => r.json());
                if (cancelled) return;
                const proj = geoEquirectangular().fitSize([W, H], { type: 'Sphere' });
                const path = geoPath(proj);
                const collection = feature(topology, topology.objects.countries) as unknown as { features: GeoPermissibleObjects[] };
                projection.current = proj;
                setLand(collection.features.map((shape) => path(shape) ?? '').filter(Boolean));
                setGraticule(path(geoGraticule10()) ?? '');
                setDots(
                    CITIES.map((city) => {
                        const point = proj([city.lon, city.lat]) ?? [0, 0];
                        return { city, x: point[0], y: point[1] };
                    }),
                );
            } catch {
                // No data (offline, blocked): the card keeps its empty frame rather than throwing.
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    // The night side is the antipode of the sun; redrawn once a minute, which is imperceptible at this size.
    useEffect(() => {
        const proj = projection.current;
        if (!proj || dots.length === 0) return;
        const path = geoPath(proj);
        const update = () => {
            const sun = sunPosition(new Date());
            const anti: [number, number] = [((sun.lon + 180 + 540) % 360) - 180, -sun.lat];
            setNight({
                core: path(geoCircle().center(anti).radius(90)()) ?? '',
                soft: path(geoCircle().center(anti).radius(91.6)()) ?? '',
            });
        };
        update();
        const id = setInterval(update, 60_000);
        return () => clearInterval(id);
    }, [dots]);

    return (
        <div className="hatch h-full">
            <div className="card flex h-full flex-col overflow-hidden">
                <div className="flex items-baseline justify-between gap-3 px-5 pb-3 pt-4">
                    <h2 className="text-[15px] font-bold tracking-[-0.02em]">World clock</h2>
                    <span className="kicker">Hover a city</span>
                </div>
                <div className="relative aspect-[2/1] w-full overflow-hidden bg-canvas shadow-[inset_0_0_0_1px_var(--line)]">
                    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="World map with the live day and night side" className="absolute inset-0 size-full">
                        <rect width={W} height={H} fill="var(--page)" />
                        {graticule && <path d={graticule} fill="none" stroke="var(--line)" strokeWidth={0.7} />}
                        {land?.map((shape, i) => (
                            <path key={i} d={shape} fill="var(--line-strong)" stroke="var(--line)" strokeWidth={0.4} />
                        ))}
                        {night.soft && <path d={night.soft} fill="oklch(0 0 0)" fillOpacity={0.3} />}
                        {night.core && <path d={night.core} fill="oklch(0 0 0)" fillOpacity={0.62} />}
                        {dots.map((dot) => {
                            const active = hovered?.city.name === dot.city.name;
                            return (
                                <g key={dot.city.name} onMouseEnter={() => setHovered(dot)} onMouseLeave={() => setHovered(null)}>
                                    <circle cx={dot.x} cy={dot.y} r={11} fill="transparent" />
                                    <circle
                                        cx={dot.x}
                                        cy={dot.y}
                                        r={active ? 5 : 3.4}
                                        fill={active ? 'var(--brand)' : 'oklch(0.95 0.006 95)'}
                                        fillOpacity={active ? 1 : 0.72}
                                        stroke="var(--page)"
                                        strokeWidth={active ? 1.5 : 0.8}
                                        className="transition-[r,fill] duration-150"
                                    />
                                </g>
                            );
                        })}
                    </svg>

                    {hovered && (
                        <div
                            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-[9px] bg-card px-2.5 py-1.5 text-center shadow-[0_10px_30px_oklch(0_0_0/0.6),inset_0_0_0_1px_var(--line-strong)]"
                            style={{ left: `${(hovered.x / W) * 100}%`, top: `${(hovered.y / H) * 100}%` }}
                        >
                            <span className="block text-[11px] font-bold text-muted-foreground">{hovered.city.name}</span>
                            <TooltipTime timeZone={hovered.city.tz} />
                        </div>
                    )}

                    <LocalClock />
                </div>
                <p className="px-5 py-3 text-[12px] text-faint">Daylight follows the sun in real time. Night is shaded.</p>
            </div>
        </div>
    );
}
