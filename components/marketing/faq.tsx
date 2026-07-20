import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does J.R. Recruiting work?",
    answer:
      "Parents create a profile for their athlete (or our team can build one for you), including stats, measurables, and highlight video. Verified college coaches search and filter profiles by state, country, sport, gender, and grad year to find athletes that fit their program.",
  },
  {
    question: "Who can see my child's profile?",
    answer:
      "Only college coach accounts that have been manually reviewed and approved by our team can search and view full profiles. We don't publish direct contact information publicly.",
  },
  {
    question: "Can I add multiple kids to one account?",
    answer:
      "Yes. One parent account can manage profiles for as many siblings as you need, all from a single dashboard.",
  },
  {
    question: "How much does it cost to list an athlete?",
    answer:
      "Listing is a one-time fee starting at $800, with discounts for signing up earlier in your athlete's high school career and a monthly payment plan available. See our pricing page for the full breakdown.",
  },
  {
    question: "Will I know when a coach looks at my athlete's profile?",
    answer:
      "Yes. Parents see exactly when a college coach views their child's profile, in real time.",
  },
];

export function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          Questions
        </span>
        <h2 className="mt-3 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Frequently asked questions
        </h2>
      </div>
      <Accordion className="rounded-xl border border-border/60 bg-card/40 px-5">
        {faqs.map((faq, i) => (
          <AccordionItem key={faq.question} value={`item-${i}`}>
            <AccordionTrigger className="text-base">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
