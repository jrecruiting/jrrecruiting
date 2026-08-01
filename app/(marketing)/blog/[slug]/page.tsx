import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog-posts";
import { formatLongDate } from "@/lib/format-date";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: post.meta.title,
    description: post.meta.description,
    openGraph: {
      type: "article",
      title: post.meta.title,
      description: post.meta.description,
      publishedTime: post.meta.publishedAt,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const { meta, Content } = post;

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to blog
      </Link>

      <div className="mb-8 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gold">
          <span>{meta.category}</span>
          <span className="text-muted-foreground/60" aria-hidden>
            &middot;
          </span>
          <span className="text-muted-foreground">
            {formatLongDate(new Date(meta.publishedAt))}
          </span>
        </div>
        <h1 className="text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          {meta.title}
        </h1>
      </div>

      <article className="flex flex-col gap-4">
        <Content />
      </article>

      <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-secondary/30 px-6 py-14 text-center">
        <h2 className="text-balance font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Ready to get your athlete in front of college coaches?
        </h2>
        <Button
          size="lg"
          className="bg-gold text-gold-foreground hover:bg-gold/90"
          nativeButton={false}
          render={<Link href="/sign-up">Get Started Now</Link>}
        />
      </div>
    </div>
  );
}
