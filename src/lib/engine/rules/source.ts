import type { SourceAssessment } from "../types";
import { type EngineContext, REGULATED_SOURCES, suppliedByStore } from "../context";
import {
  SOURCE_LEVEL_LABELS,
  SOURCE_POINTS,
  SOURCE_SKIPPED_POINT,
  STORE_SOURCE_DESCRIPTION,
  STORE_SOURCE_POINTS,
} from "../labels";

/**
 * Product / source considerations. Supply risk is assessed independently of
 * the compound: the same molecule from a licensed pharmacy and from an
 * anonymous vendor are not the same product.
 *
 * The quiz no longer asks where the product would come from — it
 * is run from the store, so an undefined `source` means the store's own
 * batch-tested, certificate-backed pens. That route is assessed as lower
 * supply risk, with the compounds' own source considerations kept alongside.
 */
export function sourceRules(ctx: EngineContext): SourceAssessment {
  const { answers: a } = ctx;
  const compoundPoints = dedupe(ctx.compounds.flatMap((c) => c.sourceConsiderations)).slice(0, 6);

  if (suppliedByStore(a)) {
    if (ctx.isSkipped("source")) {
      return {
        level: "moderate",
        headline: SOURCE_LEVEL_LABELS.moderate,
        points: [SOURCE_SKIPPED_POINT, ...compoundPoints],
      };
    }
    return {
      level: "lower",
      headline: SOURCE_LEVEL_LABELS.lower,
      description: STORE_SOURCE_DESCRIPTION,
      points: dedupe([...STORE_SOURCE_POINTS, ...compoundPoints]),
    };
  }

  /* Legacy answers that did describe a source (older saved assessments). */
  let level: SourceAssessment["level"] = "moderate";
  if (a.source && REGULATED_SOURCES.includes(a.source) && a.prescribed === "yes" && a.qualityDocs === "yes") {
    level = "lower";
  } else if (
    a.source === "research_supplier" ||
    a.source === "friend" ||
    a.qualityDocs === "no" ||
    a.authorisedKnown === "no"
  ) {
    level = "higher";
  }

  const points: string[] = [];
  if (a.source) {
    points.push(
      a.source === "other" && a.sourceOtherText?.trim()
        ? `Other source ("${a.sourceOtherText.trim()}") — the supply route could not be assessed from your description.`
        : SOURCE_POINTS[a.source],
    );
  }
  if (a.prescribed === "yes") {
    points.push("Prescribed by a clinician — this allows monitoring and legitimate supply.");
  } else if (a.prescribed === "no") {
    points.push(
      "Not prescribed — for prescription-only medicines this places the product outside the regulated supply chain, with no prescriber monitoring its use.",
    );
  }
  if (a.authorisedKnown === "no") {
    points.push("You indicated the product is not authorised for use in your country.");
  } else if (a.authorisedKnown === "unsure") {
    points.push(
      "You are unsure whether the product is authorised in your country — the regulatory section of this report shows the status held in our database.",
    );
  }
  if (a.qualityDocs === "yes") {
    points.push("Independent quality documentation is available — ask a clinician or pharmacist to review it with you.");
  } else if (a.qualityDocs === "no") {
    points.push(
      "No independent quality documentation (certificate of analysis, batch testing) — identity, purity and dose cannot be verified.",
    );
  } else if (a.qualityDocs === "unsure") {
    points.push(
      "Unsure about quality documentation — a batch-specific, third-party certificate of analysis is the minimum a supplier should be able to provide.",
    );
  }

  return {
    level,
    headline: SOURCE_LEVEL_LABELS[level],
    points: dedupe([...points, ...compoundPoints]),
  };
}

function dedupe(items: string[]): string[] {
  return Array.from(new Set(items.map((s) => s.trim()).filter(Boolean)));
}
