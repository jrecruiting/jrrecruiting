import Image from "next/image";
import { UserCircle } from "@phosphor-icons/react/dist/ssr";

const SIZES = {
  sm: { box: "h-14 w-14", icon: "h-6 w-6" },
  md: { box: "h-20 w-20", icon: "h-8 w-8" },
  lg: { box: "h-32 w-32 sm:h-40 sm:w-40", icon: "h-12 w-12" },
} as const;

export function PlayerPhoto({
  pathname,
  alt,
  size = "md",
  className,
}: {
  pathname?: string | null;
  alt: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const s = SIZES[size];
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-lg bg-muted ${s.box} ${className ?? ""}`}
    >
      {pathname ? (
        <Image
          src={`/api/blob/photo?pathname=${encodeURIComponent(pathname)}`}
          alt={alt}
          fill
          className="object-cover"
          unoptimized
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
          <UserCircle className={s.icon} weight="light" aria-hidden />
        </div>
      )}
    </div>
  );
}
