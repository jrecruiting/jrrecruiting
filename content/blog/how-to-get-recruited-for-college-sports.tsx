import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog-posts";
import { P, H2, UL, LI, Callout } from "@/components/marketing/blog-prose";

export const meta: BlogPostMeta = {
  slug: "how-to-get-recruited-for-college-sports",
  title: "How to Get Recruited for College Sports: A Parent's Step-by-Step Guide",
  description:
    "A practical, no-fluff walkthrough of the college recruiting process for parents of high school athletes — what coaches actually look for and when to start.",
  publishedAt: "2026-06-28",
  category: "Recruiting 101",
};

export default function Post() {
  return (
    <>
      <P>
        If you&apos;re a parent just starting to look into college recruiting, the
        process can feel like it&apos;s designed to be confusing. Every sport has
        its own rules, every level of college competition has different
        expectations, and most of what you find online is either outdated or
        written for the top 1% of athletes. This guide is the version we wish
        more parents had when they started &mdash; the practical steps that
        actually move the needle, in the order that matters.
      </P>

      <H2>Start earlier than you think you need to</H2>
      <P>
        Coaches at every level &mdash; from small NAIA programs to Power
        Conference schools &mdash; build their rosters years in advance. That
        doesn&apos;t mean a freshman needs to have offers lined up, but it does
        mean visibility should start well before senior year. The earlier a
        coach knows an athlete exists, the more time they have to track
        development, check in on grades, and factor that player into future
        recruiting classes.
      </P>
      <P>
        A good rule of thumb: if your athlete is playing varsity or
        varsity-adjacent minutes, it&apos;s not too early to have a profile
        coaches can find.
      </P>

      <H2>Understand what coaches are actually evaluating</H2>
      <P>
        Talent gets a coach&apos;s attention, but it rarely closes the deal on
        its own. Between two athletes with similar ability, coaches
        consistently lean toward the one who is easier to recruit and easier
        to coach. In practice, that means:
      </P>
      <UL>
        <LI>
          <strong>Film that shows real game speed</strong> &mdash; not just
          highlight-reel plays, but full-game or extended clips that show
          consistency.
        </LI>
        <LI>
          <strong>Grades and test scores</strong> &mdash; academic eligibility
          is a hard filter at every level, and it&apos;s often the first thing
          a coach checks before spending time on film.
        </LI>
        <LI>
          <strong>Accurate measurables</strong> &mdash; height, weight, times,
          and stats that are honest. Inflated numbers get caught fast and
          cost trust that&apos;s hard to rebuild.
        </LI>
        <LI>
          <strong>Responsiveness</strong> &mdash; athletes and families who
          reply to coach outreach and stay engaged in the process stand out,
          simply because a lot of recruits don&apos;t.
        </LI>
      </UL>

      <H2>Make it easy for a coach to find and evaluate your athlete</H2>
      <P>
        College coaches search by position, grad year, location, and academic
        fit &mdash; often across dozens of prospects in a single sitting. If
        finding your athlete&apos;s information requires digging through old
        social media posts or a group text, most coaches will simply move on
        to the next name on their list. A searchable, verified profile with
        current stats, a bio, and video removes that friction entirely.
      </P>
      <Callout>
        This is exactly the gap J.R. Recruiting was built to close &mdash;
        one searchable profile coaches can filter to by state, sport,
        gender, and grad year, so the right coach actually sees the right
        athlete.{" "}
        <Link href="/sign-up" className="font-semibold text-gold hover:underline">
          See how it works
        </Link>
        .
      </Callout>

      <H2>Reach out directly &mdash; don&apos;t wait to be found</H2>
      <P>
        Even with a strong profile, most successful recruiting stories
        involve the athlete or family initiating contact at some point. A
        short, specific email to a coach or recruiting coordinator &mdash;
        including grad year, position, key stats, and a link to film &mdash;
        goes a long way. Generic mass emails get ignored; messages that show
        genuine interest in that specific program get read.
      </P>

      <H2>Track what actually happens</H2>
      <P>
        It&apos;s easy to lose track of who&apos;s been contacted, who has
        responded, and who&apos;s actually looked at a profile. Knowing when a
        coach views a profile is useful information &mdash; it tells you
        where interest is real versus where more outreach is needed, so you
        can spend your time where it counts instead of guessing.
      </P>

      <H2>The bottom line</H2>
      <P>
        Recruiting rewards athletes and families who are organized,
        responsive, and easy to find &mdash; not just the ones with the most
        talent. Start early, keep information accurate and current, and make
        sure the coaches who could offer your athlete a spot actually have a
        way to find them.
      </P>
    </>
  );
}
