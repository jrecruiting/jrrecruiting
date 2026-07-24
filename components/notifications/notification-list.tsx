"use client";

import { useTransition } from "react";
import { markNotificationRead, markAllNotificationsRead } from "@/actions/notifications";
import { Button } from "@/components/ui/button";
import { Bell, Eye, Star, CheckCircle, XCircle, ArrowsClockwise } from "@phosphor-icons/react";
import { formatDistanceToNow } from "date-fns";

type NotificationItem = {
  id: string;
  type: string;
  payload: unknown;
  readAt: Date | null;
  createdAt: Date;
};

const iconMap: Record<string, typeof Bell> = {
  PROFILE_VIEWED: Eye,
  PROFILE_UPDATED: Star,
  COACH_APPROVED: CheckCircle,
  COACH_REJECTED: XCircle,
  LISTING_PAID: CheckCircle,
  CLAIM_APPROVED: CheckCircle,
  CLAIM_REJECTED: XCircle,
  OFFER_APPROVED: CheckCircle,
  OFFER_REJECTED: XCircle,
};

function describe(type: string, payload: unknown): string {
  const p = (payload ?? {}) as { playerName?: string; schoolName?: string };
  switch (type) {
    case "PROFILE_VIEWED":
      return `A college coach viewed ${p.playerName ?? "your athlete"}'s profile.`;
    case "PROFILE_UPDATED":
      return `${p.playerName ?? "A player"}'s profile you starred was updated.`;
    case "COACH_APPROVED":
      return "Your coach account has been approved. You can now search player profiles.";
    case "COACH_REJECTED":
      return "Your coach account application was not approved.";
    case "LISTING_PAID":
      return `${p.playerName ?? "Your athlete"}'s listing payment was received.`;
    case "CLAIM_APPROVED":
      return `Your claim request for ${p.playerName ?? "a profile"} was approved.`;
    case "CLAIM_REJECTED":
      return `Your claim request for ${p.playerName ?? "a profile"} was declined.`;
    case "OFFER_APPROVED":
      return `The offer from ${p.schoolName ?? "a school"} for ${p.playerName ?? "your athlete"} was approved and is now live.`;
    case "OFFER_REJECTED":
      return `The offer from ${p.schoolName ?? "a school"} for ${p.playerName ?? "your athlete"} wasn't approved.`;
    default:
      return "You have a new notification.";
  }
}

export function NotificationList({ notifications }: { notifications: NotificationItem[] }) {
  const [isPending, startTransition] = useTransition();

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  return (
    <div className="flex flex-col gap-4">
      {unreadCount > 0 && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            className="border-border/60"
            disabled={isPending}
            onClick={() => startTransition(() => markAllNotificationsRead())}
          >
            Mark all as read
          </Button>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
          <ArrowsClockwise className="h-8 w-8" aria-hidden />
          <p>No notifications yet.</p>
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-border/60 rounded-lg border border-border/60">
          {notifications.map((n) => {
            const Icon = iconMap[n.type] ?? Bell;
            return (
              <li
                key={n.id}
                className={`flex items-start gap-3 px-4 py-3 ${!n.readAt ? "bg-gold/5" : ""}`}
              >
                <Icon
                  className={`mt-0.5 h-5 w-5 shrink-0 ${!n.readAt ? "text-gold" : "text-muted-foreground"}`}
                  weight={!n.readAt ? "fill" : "regular"}
                  aria-hidden
                />
                <div className="flex-1">
                  <p className="text-sm">{describe(n.type, n.payload)}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDistanceToNow(n.createdAt, { addSuffix: true })}
                  </p>
                </div>
                {!n.readAt && (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => startTransition(() => markNotificationRead(n.id))}
                    className="shrink-0 text-xs font-medium text-gold hover:underline"
                  >
                    Mark read
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
