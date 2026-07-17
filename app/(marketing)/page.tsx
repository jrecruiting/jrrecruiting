import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MagnifyingGlass,
  Star,
  ShieldCheck,
  Bell,
} from "@phosphor-icons/react/dist/ssr";

const features = [
  {
    icon: MagnifyingGlass,
    title: "Powerful search",
    description:
      "Coaches filter by state, country, sport, gender, position, and grad year to find the right fit fast.",
  },
  {
    icon: Star,
    title: "Star & follow",
    description:
      "Coaches star players they're interested in and get notified the moment a profile updates.",
  },
  {
    icon: ShieldCheck,
    title: "Verified coaches",
    description:
      "Every coach account is reviewed before they can search, keeping player profiles safe.",
  },
  {
    icon: Bell,
    title: "Stay in the loop",
    description:
      "Parents see exactly when a college coach views their child's profile, in real time.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-28">
          <div className="flex flex-col justify-center gap-6">
            <span className="w-fit rounded-full bg-gold/20 px-3 py-1 text-sm font-medium text-gold">
              Built for student-athletes
            </span>
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Get your athlete discovered by college coaches
            </h1>
            <p className="max-w-md text-lg text-primary-foreground/80">
              JR Recruiting connects verified college coaches with searchable
              player profiles by state, country, and sport &mdash; so the right
              coach finds the right athlete.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="bg-gold text-gold-foreground hover:bg-gold/90"
                nativeButton={false}
                render={<Link href="/sign-up">List Your Athlete</Link>}
              />
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                nativeButton={false}
                render={<Link href="/sign-up?role=coach">I&apos;m a Coach</Link>}
              />
            </div>
          </div>
          <div className="hidden items-center justify-center md:flex">
            <div className="h-72 w-72 rounded-full bg-gold/10 blur-3xl" aria-hidden />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight">
            Everything recruiting needs, in one place
          </h2>
          <p className="mt-3 text-muted-foreground">
            From searchable profiles to real-time notifications, JR Recruiting
            keeps parents, players, and coaches connected.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border/60">
              <CardContent className="flex flex-col gap-3 pt-2">
                <feature.icon
                  className="h-8 w-8 text-primary"
                  weight="duotone"
                  aria-hidden
                />
                <h3 className="font-heading text-base font-semibold">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border/60 bg-secondary/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-16 text-center sm:px-6">
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to get your athlete in front of college coaches?
          </h2>
          <Button
            size="lg"
            className="bg-gold text-gold-foreground hover:bg-gold/90"
            nativeButton={false}
            render={<Link href="/sign-up">Create a Free Profile</Link>}
          />
        </div>
      </section>
    </>
  );
}
