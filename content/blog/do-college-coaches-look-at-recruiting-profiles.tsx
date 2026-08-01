import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog-posts";
import { P, H2, UL, LI, Callout } from "@/components/marketing/blog-prose";

export const meta: BlogPostMeta = {
  slug: "do-college-coaches-look-at-recruiting-profiles",
  title: "Do College Coaches Actually Look at Recruiting Profiles and Highlight Videos?",
  description:
    "A fair, honest answer to the question every skeptical parent asks before paying for a recruiting profile — plus how to tell if a profile is actually being seen.",
  publishedAt: "2026-07-10",
  category: "Recruiting 101",
};

export default function Post() {
  return (
    <>
      <P>
        It&apos;s a fair question, and one we&apos;d ask too: with so many
        recruiting services out there, do college coaches actually spend time
        on them? The honest answer is &mdash; it depends entirely on how the
        platform is built and who&apos;s using it. Here&apos;s what actually
        happens on the coach side, and what separates a profile that gets
        seen from one that just sits online.
      </P>

      <H2>Coaches search, they don&apos;t browse</H2>
      <P>
        College coaches aren&apos;t scrolling through recruiting sites for
        entertainment. Recruiting coordinators and assistant coaches use
        search tools with a specific job in mind: filling a specific need on
        the roster for a specific grad year. If a platform lets them filter
        by state, sport, position, gender, and grad year &mdash; the way a
        real search tool should &mdash; it becomes a fast way to find
        prospects that fit, and coaches use it accordingly. If a site is just
        a static directory with no filtering, it gets far less real use.
      </P>

      <H2>Verification matters more than most families realize</H2>
      <P>
        One reason some recruiting sites don&apos;t get real coach traffic:
        anyone can sign up and claim to be a coach, which makes the whole
        platform feel unreliable and unsafe &mdash; especially for a site
        with profiles of minors. When coach accounts are manually reviewed
        before they get search access, it does two things: it keeps families
        safer, and it means the coaches who are searching are actually who
        they say they are. That&apos;s worth asking about before trusting any
        platform with your athlete&apos;s information.
      </P>

      <H2>How to actually know if it&apos;s working</H2>
      <P>
        The best way to answer &ldquo;is anyone looking at this?&rdquo; isn&apos;t
        to guess &mdash; it&apos;s to see the data. A platform worth paying
        for should show you, in real time, when a coach views your
        athlete&apos;s profile. That single feature turns recruiting from a
        black box into something you can actually track.
      </P>
      <UL>
        <LI>
          If profile views are climbing after you share a profile link
          directly with a coach, that&apos;s a sign the coach is actually
          engaging.
        </LI>
        <LI>
          If a coach stars or follows a profile, that&apos;s a much stronger
          signal of real interest than a single view.
        </LI>
        <LI>
          If nothing is happening after weeks of a completed, accurate
          profile, that&apos;s useful information too &mdash; it might mean
          it&apos;s time to reach out to coaches directly instead of waiting
          to be found.
        </LI>
      </UL>

      <Callout>
        On J.R. Recruiting, every coach account is manually reviewed before
        they get search access, and parents can see exactly when a coach
        views or stars their athlete&apos;s profile &mdash; no guessing.{" "}
        <Link href="/how-it-works" className="font-semibold text-gold hover:underline">
          See how it works
        </Link>
        .
      </Callout>

      <H2>The real answer</H2>
      <P>
        Yes, coaches look at recruiting profiles &mdash; but only the ones
        that make their job easier: accurate information, real film,
        verified searchers on the other side, and a way to filter down to
        exactly who they&apos;re looking for. A profile alone isn&apos;t a
        strategy. A searchable profile a coach can actually find, paired with
        direct outreach, is what moves the process forward.
      </P>
    </>
  );
}
