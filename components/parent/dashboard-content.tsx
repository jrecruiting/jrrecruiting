"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayerPhoto } from "@/components/player/player-photo";
import { Plus, Eye } from "@phosphor-icons/react";

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  ACTIVE: "default",
  DRAFT: "secondary",
  PENDING_PAYMENT: "outline",
  INACTIVE: "outline",
  EXPIRED: "destructive",
};

const statusLabel: Record<string, string> = {
  ACTIVE: "Live",
  DRAFT: "Draft — payment needed",
  PENDING_PAYMENT: "Payment processing",
  INACTIVE: "Inactive",
  EXPIRED: "Expired",
};

export type DashboardPlayer = {
  id: string;
  firstName: string;
  lastName: string;
  primaryPhotoUrl: string | null;
  gradYear: number | null;
  listingStatus: string;
  sportNames: string[];
  profileViewCount: number;
  starCount: number;
  editPending: boolean;
};

// Same dependency-free rAF count-up already proven on the coach home
// dashboard -- see components/coach/home-content.tsx for why this beats
// Motion's imperative animate() for a simple numeric tween.
function AnimatedCount({ value, reduceMotion }: { value: number; reduceMotion: boolean }) {
  const [display, setDisplay] = useState(reduceMotion ? value : 0);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    const duration = 800;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current);
    };
  }, [value, reduceMotion]);

  return <span className="tabular-nums">{display}</span>;
}

export function DashboardContent({
  players,
  totalViews,
  viewsThisWeek,
}: {
  players: DashboardPlayer[];
  totalViews: number;
  viewsThisWeek: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-heading text-2xl font-bold tracking-tight">My Athletes</h1>
          {players.length > 0 ? (
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="font-heading text-3xl font-bold tabular-nums">
                <AnimatedCount value={totalViews} reduceMotion={Boolean(reduceMotion)} />
              </span>
              <span className="text-sm text-muted-foreground">
                total coach view{totalViews === 1 ? "" : "s"} across {players.length} athlete
                {players.length === 1 ? "" : "s"}
              </span>
              {viewsThisWeek > 0 && (
                <span className="rounded-full bg-gold/10 px-2 py-0.5 text-xs font-bold text-gold">
                  +{viewsThisWeek} this week
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Manage your children&apos;s recruiting profiles.
            </p>
          )}
        </div>
        <Button
          className="shrink-0 bg-gold text-gold-foreground hover:bg-gold/90"
          nativeButton={false}
          render={<Link href="/dashboard/players/new" />}
        >
          <Plus className="h-4 w-4" weight="bold" aria-hidden />
          Add Athlete
        </Button>
      </div>

      {players.length === 0 ? (
        <Card className="border-dashed border-border/60 bg-card/40">
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="max-w-sm text-muted-foreground">
              Once your athlete&apos;s profile is live, we start reaching out to
              coaches directly &mdash; plus a searchable listing they can find
              on their own. Add your first athlete to get started.
            </p>
            <Button
              className="bg-gold text-gold-foreground hover:bg-gold/90"
              nativeButton={false}
              render={<Link href="/dashboard/players/new">Add Your First Athlete</Link>}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {players.map((player, i) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: reduceMotion ? 0 : Math.min(i, 8) * 0.05,
                ease: "easeOut",
              }}
            >
              <Card className="h-full border-border/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-lg hover:shadow-black/20">
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <PlayerPhoto
                        pathname={player.primaryPhotoUrl}
                        alt={`${player.firstName} ${player.lastName}`}
                        size="sm"
                      />
                      <div>
                        <Link
                          href={`/dashboard/players/${player.id}/edit`}
                          className="font-heading text-lg font-semibold hover:text-gold"
                        >
                          {player.firstName} {player.lastName}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {player.sportNames.join(", ") || "No sport set"}
                          {player.gradYear != null ? ` · Class of ${player.gradYear}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={statusVariant[player.listingStatus] ?? "outline"}>
                        {statusLabel[player.listingStatus] ?? player.listingStatus}
                      </Badge>
                      {player.editPending && (
                        <Badge variant="outline" className="border-gold/60 text-gold">
                          Edit pending review
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" aria-hidden />
                      {player.profileViewCount} coach view{player.profileViewCount === 1 ? "" : "s"}
                    </span>
                    <span>
                      {player.starCount} star{player.starCount === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border/60"
                      nativeButton={false}
                      render={<Link href={`/dashboard/players/${player.id}/edit`}>Edit</Link>}
                    />
                    {player.listingStatus === "DRAFT" && (
                      <Button
                        size="sm"
                        className="bg-gold text-gold-foreground hover:bg-gold/90"
                        nativeButton={false}
                        render={
                          <Link href={`/dashboard/players/${player.id}/payment`}>
                            Complete Listing
                          </Link>
                        }
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
