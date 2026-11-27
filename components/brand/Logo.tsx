import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
    className?: string;
    markClassName?: string;
    wordClassName?: string;
    showWord?: boolean;
    priority?: boolean;
};

// The mark is the green E with the arrow: one asset for the header, the footer, the sidebar and the auth pages,
// so a rebrand only ever happens in one file. The file is cropped tight, so sizes here are the drawn size.
export default function Logo({ className, markClassName, wordClassName, showWord = true, priority = false }: LogoProps) {
    return (
        <span className={cn('flex items-center gap-2.5', className)}>
            <Image
                src="/assets/images/estock-e.png"
                alt=""
                width={32}
                height={32}
                priority={priority}
                aria-hidden
                className={cn('size-6 shrink-0 object-contain', markClassName)}
            />
            {showWord && <span className={cn('text-[19px] font-bold tracking-tight text-foreground', wordClassName)}>Open</span>}
        </span>
    );
}
