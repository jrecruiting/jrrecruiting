"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { PlayerPhoto } from "@/components/player/player-photo";
import { Trophy, ChatsCircle, UserPlus, ArrowsClockwise } from "@phosphor-icons/react";

export type FeedItemData = {
  key: string;
  at: string;
  type: "player" | "offer" | "interest";
  playerId: string;
  playerName: string;
  photoUrl: string | null;
  schoolName?: string;
};

const TYPE_ICON = { player: UserPlus, offer: Trophy, interest: ChatsCircle } as const;

function feedItemText(item: FeedItemData) {
  switch (item.type) {
    case "player":
      return "joined J.R. Recruiting";
    case "offer":
      return (
        <>
          added a new offer from <span className="font-semibold">{item.schoolName}</span>
        </>
      );
    case "interest":
      return (
        <>
          is now in contact with <span className="font-semibold">{item.schoolName}</span>
        </>
      );
  }
}

export function HomeContent({
  announcement,
  isVerified,
  feed,
}: {
  announcement: { title: string; body: string } | null;
  isVerified: boolean;
  feed: FeedItemData[];
}) {
  const reduceMotion = useReducedMotion();

  return (
    <>
      {announcement && (
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Card className="border-gold/40 bg-gradient-to-b from-gold/5 to-card/60">
            <CardContent className="flex flex-col gap-2">
              <span className="inline-flex w-fit items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gold">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
                Pinned by J.R. Recruiting
              </span>
              <h2 className="font-heading text-lg font-bold">{announcement.title}</h2>
              <p className="whitespace-pre-wrap text-sm text-foreground/90">{announcement.body}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {isVerified && (
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Recent activity
          </h2>
          {feed.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border/60 py-12 text-center text-muted-foreground">
              <ArrowsClockwise className="h-6 w-6" aria-hidden />
              <p className="text-sm">Nothing new to show yet.</p>
            </div>
          ) : (
            <Card className="border-border/60">
              <CardContent className="flex flex-col divide-y divide-border/60 p-0">
                {feed.map((item, i) => {
                  const Icon = TYPE_ICON[item.type];
                  return (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: reduceMotion ? 0 : Math.min(i, 8) * 0.05,
                        ease: "easeOut",
                      }}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <div className="relative shrink-0">
                        <PlayerPhoto pathname={item.photoUrl} alt={item.playerName} size="sm" />
                        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-gold text-gold-foreground">
                          <Icon className="h-3 w-3" weight="bold" aria-hidden />
                        </span>
                      </div>
                      <div>
                        <p className="text-sm">
                          <Link
                            href={`/players/${item.playerId}`}
                            className="font-semibold hover:text-gold"
                          >
                            {item.playerName}
                          </Link>{" "}
                          {feedItemText(item)}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(item.at), { addSuffix: true })}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </>
  );
}
