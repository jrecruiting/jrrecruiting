import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/marketing/reveal";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { formatLongDate } from "@/lib/format-date";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Recruiting advice for parents and student-athletes: how the process actually works, what coaches look for, and how to get seen by the right programs.",
};

export default function BlogIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          Blog
        </span>
        <h1 className="mt-3 text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          Recruiting advice for parents and athletes
        </h1>
        <p className="mt-4 text-balance text-muted-foreground">
          Practical guidance on how the recruiting process actually works
          &mdash; written by people who&apos;ve helped athletes get found.
        </p>
      </div>

      <div className="mx-auto grid max-w-3xl gap-4">
        {BLOG_POSTS.map((post, i) => (
          <Reveal key={post.meta.slug} delay={Math.min(i, 6) * 0.05}>
            <Card className="border-border/60">
              <CardContent>
                <Link href={`/blog/${post.meta.slug}`} className="group flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gold">
                    <span>{post.meta.category}</span>
                    <span className="text-muted-foreground/60" aria-hidden>
                      &middot;
                    </span>
                    <span className="text-muted-foreground">
                      {formatLongDate(new Date(post.meta.publishedAt))}
                    </span>
                  </div>
                  <h2 className="font-heading text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-gold">
                    {post.meta.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">{post.meta.description}</p>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
                    Read more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal className="mx-auto mt-16 flex max-w-5xl flex-col items-center gap-4 rounded-2xl border border-border/60 bg-secondary/30 px-6 py-14 text-center">
        <h2 className="text-balance font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Ready to get your athlete in front of college coaches?
        </h2>
        <Button
          size="lg"
          className="bg-gold text-gold-foreground hover:bg-gold/90"
          nativeButton={false}
          render={<Link href="/sign-up">Get Started Now</Link>}
        />
      </Reveal>
    </div>
  );
}
