import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: { initials: "text-lg", divider: "h-4", name: "text-[0.65rem] tracking-[0.2em]" },
  md: { initials: "text-2xl", divider: "h-5", name: "text-xs tracking-[0.22em]" },
  lg: { initials: "text-5xl sm:text-6xl", divider: "h-9 sm:h-11", name: "text-sm sm:text-base tracking-[0.28em]" },
} as const;

export function Logo({
  size = "sm",
  className,
}: {
  size?: keyof typeof sizeClasses;
  className?: string;
}) {
  const s = sizeClasses[size];

  return (
    <span className={cn("inline-flex items-center gap-2.5 font-heading select-none", className)}>
      <span className={cn("font-bold leading-none text-gold", s.initials)}>J.R.</span>
      <span className={cn("shrink-0 w-px bg-current/25", s.divider)} aria-hidden />
      <span className={cn("font-semibold uppercase leading-none text-foreground", s.name)}>
        Recruiting
      </span>
    </span>
  );
}
