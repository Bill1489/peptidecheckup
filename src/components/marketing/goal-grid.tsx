import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GOALS } from "@/data/goals";
import { compoundsForGoal } from "@/data/compounds";
import { SectionHeading } from "@/components/ui/card";
import { goalEntryHref } from "@/lib/funnel";
import { cn } from "@/lib/utils";
import { GoalIcon } from "./goal-icon";
import { pluralise } from "./copy";
import { Reveal, Stagger, StaggerItem } from "./reveal";
import { Section } from "./section";

export function GoalCard({ goalId, className }: { goalId: (typeof GOALS)[number]["id"]; className?: string }) {
  const goal = GOALS.find((g) => g.id === goalId);
  if (!goal) return null;
  // "Other" is a free-text goal; a compound count would be meaningless there.
  const count = goal.id === "other" ? 0 : compoundsForGoal(goal.id).length;
  return (
    <Link
      href={goalEntryHref(goal.id)}
      className={cn(
        "group flex h-full min-h-[11rem] flex-col rounded-2xl border border-line bg-white p-5 shadow-soft transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-ink/15 hover:shadow-lift",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-100">
          <GoalIcon icon={goal.icon} className="h-5 w-5" />
        </span>
        <ArrowUpRight
          className="h-4 w-4 text-muted-2 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
          aria-hidden
        />
      </div>
      <h3 className="mt-5 text-[1.02rem] font-medium leading-snug text-ink">{goal.label}</h3>
      <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">{goal.description}</p>
      {count > 0 && (
        <p className="mt-4 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-brand-700">
          {pluralise(count, "compound")} researched
        </p>
      )}
    </Link>
  );
}

export function GoalGrid() {
  return (
    <Section tone="paper" id="goals">
      <Reveal>
        <SectionHeading
          eyebrow="Start with your goal"
          title={`${GOALS.length} goals. Honest evidence for each.`}
          description="Every goal card shows how many compounds in the database have any human evidence for it. Where the answer is none, the report says so and points to what is worth discussing instead."
        />
      </Reveal>
      <Stagger className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:mt-16 lg:grid-cols-4" stagger={0.05}>
        {GOALS.map((goal) => (
          <StaggerItem key={goal.id} className="h-full">
            <GoalCard goalId={goal.id} />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
