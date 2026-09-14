import { GOAL_MAP } from "@/data/goals";
import { SOURCE_LABELS } from "@/lib/assessment/types";
import type { Flag } from "../types";
import { type EngineContext, UNREGULATED_SOURCES, WEIGHT_GOALS } from "../context";
import { flagId, joinList } from "../labels";

/**
 * Flags derived from the person rather than from any single compound.
 * Most apply to everything considered (`compounds: []`). A few attach to
 * specific compounds when the answer is only relevant to some of them
 * (previous adverse experience, heavy alcohol with incretins, WADA status).
 */
export function globalRules(ctx: EngineContext): Flag[] {
  const { answers: a } = ctx;
  const flags: Flag[] = [];
  const considered = new Set(ctx.compounds.map((c) => c.slug));

  /* ---------------- Pregnancy ---------------- */
  if (a.pregnancy === "yes") {
    flags.push({
      id: flagId("global", "pregnancy"),
      severity: "high",
      source: "pregnancy",
      title: "Pregnancy, planning pregnancy or breastfeeding",
      detail:
        "Most compounds in our database have no safety data in pregnancy or breastfeeding, and several are contraindicated or not recommended. Compound-specific notes are listed with each compound. This needs to be discussed with your midwife, obstetrician or GP before anything else.",
      compounds: [],
    });
  }

  /* ---------------- Age ---------------- */
  if (a.age === undefined || a.age === null) {
    flags.push({
      id: flagId("global", "age", "missing"),
      severity: "info",
      source: "age",
      title: "Age not provided",
      detail:
        "Age affects dose sensitivity, the likelihood of other conditions and eligibility for several licensed medicines. Add it to improve this report.",
      compounds: [],
    });
  } else if (a.age >= 65) {
    flags.push({
      id: flagId("global", "age", "65"),
      severity: "info",
      source: "age",
      title: "Age 65 or over",
      detail:
        "Older adults are more sensitive to dose, dehydration and drug interactions, and are more likely to have other conditions or medicines that need to be considered together. Most trials in our database enrolled predominantly younger adults.",
      compounds: [],
    });
  }

  /* ---------------- Body-mass index ---------------- */
  const weightGoal = ctx.goal !== undefined && WEIGHT_GOALS.includes(ctx.goal);
  if (ctx.bmi !== undefined) {
    if (ctx.bmi < 18.5) {
      flags.push({
        id: flagId("global", "body", "bmi-low"),
        severity: "high",
        source: "body",
        title: "Body-mass index below 18.5",
        detail: `Your height and weight give a BMI of ${ctx.bmi}. In this range, appetite-reducing or weight-lowering compounds would need careful professional assessment first${
          weightGoal ? ", and the licensed weight-management criteria (BMI ≥ 30, or ≥ 27 with a weight-related condition) are not met" : ""
        }. This is a neutral measurement, not a judgement — it simply means the published evidence was gathered in a different population.`,
        compounds: [],
      });
    } else if (weightGoal && ctx.bmi < 27) {
      flags.push({
        id: flagId("global", "body", "bmi-threshold"),
        severity: "caution",
        source: "body",
        title:
          "Body-mass index below the licensed threshold for weight-management medicines (BMI ≥ 30, or ≥ 27 with a weight-related condition)",
        detail: `Your height and weight give a BMI of ${ctx.bmi}. The licences and trials behind weight-management medicines used BMI ≥ 30, or ≥ 27 with a weight-related condition, as entry criteria. This is not a judgement about your body — it means a clinician would need to consider whether that evidence applies to you.`,
        compounds: [],
      });
    }
  }

  /* ---------------- Expectations ---------------- */
  if (a.timeframe === "under_1_month") {
    flags.push({
      id: flagId("global", "expectation", "under-1-month"),
      severity: "caution",
      source: "expectation",
      title: "Expectation: less than one month",
      detail:
        "No compound in our database produced its studied effect within a month — the trials behind the evidence grades ran for months to years, often with a gradual dose escalation. A very short timeframe is also a safety signal: it tends to push people toward higher doses, faster escalation or unregulated supply.",
      compounds: [],
    });
  } else if (a.timeframe === "1_3_months" && weightGoal) {
    flags.push({
      id: flagId("global", "expectation", "1-3-months"),
      severity: "info",
      source: "expectation",
      title: "Expectation: 1–3 months",
      detail:
        "Weight-management trials measured their primary outcomes at 52–104 weeks, and the first 1–3 months are usually spent in dose escalation. A shorter timeframe may not show the studied effect.",
      compounds: [],
    });
  }

  /* ---------------- Symptoms ---------------- */
  const symptomDetails = a.symptomsDetails?.trim();
  if (a.severeSymptoms === "yes" || (a.currentSymptoms === "yes" && symptomDetails)) {
    flags.push({
      id: flagId("global", "symptoms", "severe"),
      severity: "high",
      source: "symptoms",
      title: "Current unexplained or severe symptoms — these need assessment before any new treatment",
      detail: `Starting any new compound while symptoms are unexplained can mask a diagnosis or confound its assessment.${
        symptomDetails ? ` You described: "${symptomDetails}".` : ""
      } These symptoms should be assessed by a healthcare professional first.`,
      compounds: [],
    });
  } else if (a.currentSymptoms === "yes") {
    flags.push({
      id: flagId("global", "symptoms", "current"),
      severity: "caution",
      source: "symptoms",
      title: "Current symptoms you are concerned about",
      detail:
        "You indicated current symptoms without describing them. Symptoms that concern you should be assessed before any new treatment is considered.",
      compounds: [],
    });
  }

  /* ---------------- Professional advice / investigation / interacting treatment ---------------- */
  if (a.advisedAgainst === "yes") {
    flags.push({
      id: flagId("global", "history", "advised-against"),
      severity: "high",
      source: "history",
      title: "A healthcare professional has advised against this type of treatment",
      detail:
        "That advice was given with knowledge of your situation that this report does not have, and takes precedence over anything here. If you want to revisit it, do so with that professional.",
      compounds: [],
    });
  }
  if (a.underInvestigation === "yes") {
    flags.push({
      id: flagId("global", "medical", "under-investigation"),
      severity: "high",
      source: "medical",
      title: "Currently under investigation for a relevant condition",
      detail:
        "Starting a new compound while a diagnosis is being worked out can mask symptoms or confound test results. The team investigating you needs to be part of any decision.",
      compounds: [],
    });
  }
  if (a.interactingTreatment === "yes") {
    flags.push({
      id: flagId("global", "medication", "interacting-treatment"),
      severity: "caution",
      source: "medication",
      title: "Receiving a treatment that could interact",
      detail:
        "You indicated you are receiving a treatment that could interact. The interaction checks in this report cover only the medicines you listed by name; anything else has not been assessed.",
      compounds: [],
    });
  }

  /* ---------------- Allergy & previous reactions ---------------- */
  if (a.seriousAllergy === "yes") {
    flags.push({
      id: flagId("global", "allergy", "serious"),
      severity: "caution",
      source: "allergy",
      title: "History of serious allergic reaction to a medicine",
      detail:
        "Peptide products — particularly unlicensed ones with unknown excipients — carry a risk of hypersensitivity reactions. A previous serious reaction warrants review by a clinician who knows your allergy history.",
      compounds: [],
    });
  }
  if (a.componentAllergy === "yes") {
    flags.push({
      id: flagId("global", "allergy", "component"),
      severity: "high",
      source: "allergy",
      title: "Known allergy to a component of a compound you're considering",
      detail:
        "A known allergy to the compound or one of its components is a contraindication in every product licence. This needs to be clarified with a clinician before anything else.",
      compounds: [],
    });
  }
  if (a.previousSeriousReaction === "yes") {
    flags.push({
      id: flagId("global", "history", "previous-serious-reaction"),
      severity: "high",
      source: "history",
      title: "Previous serious reaction to a similar treatment",
      detail:
        "A serious reaction to a related treatment is one of the strongest predictors of a further reaction. The details of that episode need to be reviewed by a clinician.",
      compounds: [],
    });
  }

  /* ---------------- Previous peptide use ---------------- */
  for (const use of a.previousUses) {
    const target = use.slug && considered.has(use.slug) ? [use.slug] : [];
    const name = use.name || use.slug || "a previous peptide";
    if (use.adverse === "severe" || use.stoppedDueToAdverse === "yes") {
      flags.push({
        id: flagId("history", "previous-use-severe", use.slug ?? use.id),
        severity: "high",
        source: "history",
        title:
          use.adverse === "severe"
            ? `Previous severe adverse effects with ${name}`
            : `Previously stopped ${name} because of adverse effects`,
        detail: `You reported ${
          use.adverse === "severe" ? "severe adverse effects" : "stopping because of adverse effects"
        } with ${name}${use.supervised === "no" ? ", used without supervision" : ""}. What happened, and whether it could recur with a related compound, needs professional review.`,
        compounds: target,
      });
    } else if (use.adverse === "moderate") {
      flags.push({
        id: flagId("history", "previous-use-moderate", use.slug ?? use.id),
        severity: "caution",
        source: "history",
        title: `Previous moderate adverse effects with ${name}`,
        detail: `You reported moderate adverse effects with ${name}. This is relevant context for any related compound and for how a clinician would approach dose and monitoring.`,
        compounds: target,
      });
    }
  }

  /* ---------------- Lifestyle ---------------- */
  if (a.alcohol === "heavy") {
    const incretins = ctx.compounds.filter((c) => c.family === "incretin").map((c) => c.slug);
    flags.push({
      id: flagId("global", "lifestyle", "alcohol"),
      severity: "caution",
      source: "lifestyle",
      title: "Alcohol intake above 14 drinks a week",
      detail:
        "Heavy alcohol intake raises the risk of pancreatitis and liver disease — both directly relevant to incretin-based medicines, which carry pancreatitis warnings — and complicates the assessment of nausea, dehydration and low blood sugar.",
      compounds: incretins,
    });
  }
  if (a.nicotine === "daily") {
    flags.push({
      id: flagId("global", "lifestyle", "nicotine"),
      severity: "info",
      source: "lifestyle",
      title: "Daily nicotine use",
      detail:
        "Nicotine affects cardiovascular risk, appetite and wound healing, and is relevant context for any discussion of metabolic or recovery-focused compounds.",
      compounds: [],
    });
  }
  if (a.recreational === "regular") {
    flags.push({
      id: flagId("global", "lifestyle", "recreational"),
      severity: "caution",
      source: "lifestyle",
      title: "Regular recreational substance use",
      detail:
        "Recreational substances can interact unpredictably with injected or unlicensed products and complicate the interpretation of side effects. A clinician needs to know about this to assess safely.",
      compounds: [],
    });
  }

  /* ---------------- Currently using an unregulated product ---------------- */
  if (a.currentlyTaking === "yes" && a.source && UNREGULATED_SOURCES.includes(a.source)) {
    flags.push({
      id: flagId("global", "source", "currently-unregulated"),
      severity: "caution",
      source: "source",
      title: "Currently using an unregulated product",
      detail: `You indicated you are already using one of these compounds, obtained from: ${SOURCE_LABELS[a.source].toLowerCase()}. Products from this channel are not quality-assured — identity, purity, sterility and dose cannot be verified. A clinician should know exactly what you are taking now.`,
      compounds: [],
    });
  }

  /* ---------------- Anti-doping ---------------- */
  if (ctx.goal === "athletic_performance") {
    for (const c of ctx.compounds) {
      if (!c.wadaProhibited) {
        // S0: any pharmacological substance with no current approval by a governmental
        // regulatory health authority for human therapeutic use is prohibited at all times.
        const approvedSomewhere = Object.values(c.regulatory).some((r) => r.status === "authorised");
        if (!approvedSomewhere) {
          flags.push({
            id: flagId("anti-doping-s0", c.slug),
            severity: "caution",
            source: "anti_doping",
            title: "Likely prohibited under WADA category S0 (non-approved substances)",
            detail: `${c.name} is not named on the Prohibited List, but it is not approved for human therapeutic use by any regulator in our database. The World Anti-Doping Code prohibits such substances at all times under category S0. Tested athletes should treat it as prohibited.`,
            compounds: [c.slug],
          });
        }
        continue;
      }
      flags.push({
        id: flagId("anti-doping", c.slug),
        severity: "caution",
        source: "anti_doping",
        title: "Prohibited under the WADA code — tested athletes risk sanction",
        detail:
          c.wadaProhibited === "in_competition"
            ? `${c.name} is prohibited in competition under the World Anti-Doping Code. Detection windows can be longer than the period of use.`
            : `${c.name} is prohibited at all times (in and out of competition) under the World Anti-Doping Code. Use carries the risk of sanction for any tested athlete, and unlicensed products may contain undeclared prohibited substances.`,
        compounds: [c.slug],
      });
    }
  }

  /* ---------------- Medicines that could not be assessed ---------------- */
  const unclassified = a.prescriptions
    .filter((p) => !p.classId || p.classId === "other")
    .map((p) => p.name.trim())
    .filter(Boolean);
  if (unclassified.length > 0) {
    flags.push({
      id: flagId("global", "medication", "unclassified"),
      severity: "info",
      source: "medication",
      title: `Unclassified medicine${unclassified.length > 1 ? "s" : ""}: ${joinList(
        Array.from(new Set(unclassified)),
      )} — interaction not assessed`,
      detail:
        "These medicines could not be matched to a class in our database, so no interaction check was possible. Take the full list to any clinician you speak to.",
      compounds: [],
    });
  }

  const supplements = a.supplements.map((s) => s.name.trim()).filter(Boolean);
  if (supplements.length > 0 || a.takesSupplements === "yes") {
    flags.push({
      id: flagId("global", "medication", "supplements"),
      severity: "info",
      source: "medication",
      title: "Supplements not assessed for interaction",
      detail:
        supplements.length > 0
          ? `You listed: ${joinList(Array.from(new Set(supplements)))}. Our database does not hold interaction data for supplements; mention them to any clinician you speak to.`
          : "Our database does not hold interaction data for supplements; mention any you take to a clinician.",
      compounds: [],
    });
  }

  const otcOther = a.otcOtherText?.trim();
  if (a.otc.includes("other") && otcOther) {
    flags.push({
      id: flagId("global", "medication", "otc-other"),
      severity: "info",
      source: "medication",
      title: `Other over-the-counter medicine not assessed: ${otcOther}`,
      detail: "This over-the-counter product could not be classified, so no interaction check was possible.",
      compounds: [],
    });
  }

  /* ---------------- Goal could not be mapped ---------------- */
  if (a.primaryGoal === "other") {
    flags.push({
      id: flagId("global", "information", "goal-other"),
      severity: "info",
      source: "information",
      title: `Goal "${ctx.goalLabel}" could not be mapped to a researched use`,
      detail: `Evidence in our database is organised by ${Object.values(GOAL_MAP)
        .filter((g) => g.id !== "other")
        .length.toString()} researched goals. Because your goal falls outside them, goal-specific evidence grades are not available and alignment is shown as partial.`,
      compounds: [],
    });
  }

  return flags;
}
