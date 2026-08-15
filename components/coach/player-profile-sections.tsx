"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ComponentType } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HighlightVideos } from "@/components/player/highlight-videos";
import { formatHeight } from "@/lib/player-data";
import type { MediaAsset } from "@prisma/client";
import {
  Ruler,
  NotePencil,
  Trophy,
  ChatsCircle,
  ChartBar,
  CalendarBlank,
  AddressBook,
} from "@phosphor-icons/react";

type SportWithBio = { id: string; bio: string | null; sport: { name: string } };
type SportWithOffers = {
  id: string;
  sport: { name: string };
  offers: { id: string; schoolName: string }[];
};
type SportWithSchoolInterests = {
  id: string;
  sport: { name: string };
  schoolInterests: { id: string; schoolName: string }[];
};
type SportWithStats = { id: string; sport: { name: string }; stats: unknown };

// Every card shares the same icon + label header so a coach can tell one
// section from another at a glance instead of reading identical "uppercase
// label" text on every card, plus a staggered fade-in matching the motion
// already used on Search and Home -- the profile page is the very next
// thing a coach sees after those, so the visual language should continue.
function ProfileSection({
  icon: Icon,
  label,
  index,
  gold = false,
  children,
}: {
  icon: ComponentType<{ className?: string; weight?: "duotone" }>;
  label: string;
  index: number;
  gold?: boolean;
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: reduceMotion ? 0 : Math.min(index, 8) * 0.05, ease: "easeOut" }}
    >
      <Card className={gold ? "border-gold/40 bg-gradient-to-b from-gold/5 to-card/60" : "border-border/60"}>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gold/10 text-gold">
              <Icon className="h-3.5 w-3.5" weight="duotone" />
            </span>
            <p className="text-xs font-bold uppercase tracking-wide">{label}</p>
          </div>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function PlayerProfileSections({
  heightIn,
  weightLb,
  gpa,
  showGeneralBio,
  generalBio,
  sportsWithBio,
  sportsWithOffers,
  sportsWithSchoolInterests,
  sortedSports,
  videos,
  schoolSchedule,
  instagramHandle,
  xHandle,
  cellPhone,
}: {
  heightIn: number | null;
  weightLb: number | null;
  gpa: string | null;
  showGeneralBio: boolean;
  generalBio: string | null;
  sportsWithBio: SportWithBio[];
  sportsWithOffers: SportWithOffers[];
  sportsWithSchoolInterests: SportWithSchoolInterests[];
  sortedSports: SportWithStats[];
  videos: MediaAsset[];
  schoolSchedule: { schoolName: string; scheduleUrl: string } | null;
  instagramHandle: string | null;
  xHandle: string | null;
  cellPhone: string | null;
}) {
  let cardIndex = 0;

  return (
    <>
      <ProfileSection icon={Ruler} label="Measurables" index={cardIndex++}>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Height</p>
            <p className="font-medium">{heightIn ? formatHeight(heightIn) : "—"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Weight</p>
            <p className="font-medium">{weightLb ? `${weightLb} lb` : "—"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">GPA</p>
            <p className="font-medium">{gpa ?? "—"}</p>
          </div>
        </div>
      </ProfileSection>

      {showGeneralBio && (
        <ProfileSection icon={NotePencil} label="Bio" index={cardIndex++}>
          <p className="whitespace-pre-wrap text-sm">{generalBio}</p>
        </ProfileSection>
      )}

      {sportsWithBio.map((s) => (
        <ProfileSection key={s.id} icon={NotePencil} label={`${s.sport.name} Bio`} index={cardIndex++}>
          <p className="whitespace-pre-wrap text-sm">{s.bio}</p>
        </ProfileSection>
      ))}

      {sportsWithOffers.length > 0 && (
        <ProfileSection icon={Trophy} label="Offers" index={cardIndex++} gold>
          {sportsWithOffers.map((s) => (
            <div key={s.id}>
              {sportsWithOffers.length > 1 && (
                <p className="text-xs font-medium text-muted-foreground">{s.sport.name}</p>
              )}
              <div className="mt-1 flex flex-wrap gap-1.5">
                {s.offers.map((offer) => (
                  <Badge key={offer.id} className="border-gold/40 bg-gold/10 font-semibold text-gold">
                    {offer.schoolName}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </ProfileSection>
      )}

      {sportsWithSchoolInterests.length > 0 && (
        <ProfileSection icon={ChatsCircle} label="Schools Currently in Contact" index={cardIndex++}>
          {sportsWithSchoolInterests.map((s) => (
            <div key={s.id}>
              {sportsWithSchoolInterests.length > 1 && (
                <p className="text-xs font-medium text-muted-foreground">{s.sport.name}</p>
              )}
              <div className="mt-1 flex flex-wrap gap-1.5">
                {s.schoolInterests.map((entry) => (
                  <Badge key={entry.id} variant="secondary">
                    {entry.schoolName}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            Schools that have reached out and started a conversation &mdash; not yet a formal offer.
          </p>
        </ProfileSection>
      )}

      {sortedSports.map((s) => {
        const stats = Array.isArray(s.stats) ? (s.stats as { label: string; value: string }[]) : [];
        if (stats.length === 0) return null;
        return (
          <ProfileSection key={s.id} icon={ChartBar} label={`${s.sport.name} Stats`} index={cardIndex++}>
            <div className="grid gap-3 sm:grid-cols-3">
              {stats.map((stat, i) => (
                <div key={i}>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                  <p className="font-medium">{stat.value}</p>
                </div>
              ))}
            </div>
          </ProfileSection>
        );
      })}

      <HighlightVideos videos={videos} />

      {schoolSchedule && (
        <ProfileSection icon={CalendarBlank} label="Football Schedule" index={cardIndex++}>
          <a
            href={schoolSchedule.scheduleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm text-gold hover:underline"
          >
            View {schoolSchedule.schoolName}&apos;s Schedule
          </a>
        </ProfileSection>
      )}

      {(instagramHandle || xHandle || cellPhone) && (
        <ProfileSection icon={AddressBook} label="Contact" index={cardIndex++}>
          <div className="grid gap-4 sm:grid-cols-3">
            {instagramHandle && (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Instagram</p>
                <p className="font-medium">@{instagramHandle}</p>
              </div>
            )}
            {xHandle && (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">X (Twitter)</p>
                <p className="font-medium">@{xHandle}</p>
              </div>
            )}
            {cellPhone && (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Cell</p>
                <p className="font-medium">{cellPhone}</p>
              </div>
            )}
          </div>
        </ProfileSection>
      )}
    </>
  );
}
