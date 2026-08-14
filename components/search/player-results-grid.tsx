"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { QuickStarButton } from "@/components/coach/quick-star-button";
import { PlayerPhoto } from "@/components/player/player-photo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircleNotch } from "@phosphor-icons/react";
import { useSearchTransition } from "@/components/search/search-transition-context";

export type PlayerCardData = {
  id: string;
  displayName: string;
  sportLine: string;
  photoUrl: string | null;
  starred: boolean;
  offerCount: number;
  playerTypeLabel: string;
  genderLocationLine: string;
  measurables: string | null;
};

export function ResultsPendingIndicator() {
  const { isPending } = useSearchTransition();
  if (!isPending) return null;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <CircleNotch className="h-3.5 w-3.5 animate-spin" aria-hidden />
      Updating…
    </span>
  );
}

export function PlayerResultsGrid({
  players,
  isVerified,
}: {
  players: PlayerCardData[];
  isVerified: boolean;
}) {
  const { isPending } = useSearchTransition();
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={`grid gap-4 transition-opacity duration-200 sm:grid-cols-2 xl:grid-cols-3 ${
        isPending ? "pointer-events-none opacity-50" : "opacity-100"
      }`}
    >
      {players.map((player, i) => (
        <motion.div
          key={player.id}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: reduceMotion ? 0 : Math.min(i, 11) * 0.04,
            ease: "easeOut",
          }}
        >
          <Card className="h-full border-border/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-lg hover:shadow-black/20">
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <PlayerPhoto
                    pathname={isVerified ? player.photoUrl : null}
                    alt={player.displayName}
                    size="sm"
                  />
                  <div>
                    <Link
                      href={`/players/${player.id}`}
                      className="font-heading text-base font-semibold hover:text-gold"
                    >
                      {player.displayName}
                    </Link>
                    <p className="text-xs text-muted-foreground">{player.sportLine}</p>
                  </div>
                </div>
                <QuickStarButton
                  playerId={player.id}
                  initialStarred={player.starred}
                  className="-mr-2 -mt-2 shrink-0"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {isVerified && player.offerCount > 0 && (
                  <Badge className="bg-gold font-semibold text-gold-foreground">
                    {player.offerCount} Offer{player.offerCount === 1 ? "" : "s"}
                  </Badge>
                )}
                <Badge variant="secondary">{player.playerTypeLabel}</Badge>
              </div>
              <p className="text-xs text-foreground/85">{player.genderLocationLine}</p>
              {player.measurables && (
                <p className="text-[0.7rem] text-muted-foreground/70">{player.measurables}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
