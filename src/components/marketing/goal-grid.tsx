import Link from "next/link";
import { GOALS } from "@/data/goals";
import { productsForGoal } from "@/data/products";
import { index, pluralise } from "./copy";
import { IndexHead } from "./index-head";

/**
 * Twelve goals as a dense bordered grid. Each cell shows the live count of
 * products researched for that goal and links to the filtered shop; "Other"
 * hands off to the assessment, where the goal can be described in words.
 */
export function GoalGrid() {
  return (
    <section className="rule-b">
      <div className="container-x py-14 lg:py-20">
        <IndexHead
          index="03"
          label="Shop by goal"
          title="Start from the goal, not the molecule."
          description="Each cell shows how many products in the catalogue are researched for that goal. Which of them fit you is the assessment’s job, not the grid’s."
          action={{ href: "/shop", label: "All products" }}
        />
        <ul className="cell-grid mt-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {GOALS.map((g, i) => {
            const isOther = g.id === "other";
            const count = isOther ? 0 : productsForGoal(g.id).length;
            const href = isOther ? "/assessment/?goal=other" : `/shop/?goal=${g.id}`;
            return (
              <li key={g.id} className="flex">
                <Link href={href} className="hover-invert flex min-h-[8.5rem] flex-1 flex-col justify-between gap-4 p-4 sm:min-h-[10rem] sm:p-5">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="label-mono tnum">{index(i + 1)}</span>
                    <span className="label-mono text-right tnum">
                      {isOther ? "Assessment" : count > 0 ? pluralise(count, "product") : ""}
                    </span>
                  </span>
                  <span className="font-display text-balance text-[1.1rem] uppercase leading-[1.02] text-ink sm:text-[1.3rem]">
                    {g.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
