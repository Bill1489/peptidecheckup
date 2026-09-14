import type { GoalId } from "./types";

export interface GoalDef {
  id: GoalId;
  label: string;
  /** Short label for chips / badges */
  short: string;
  description: string;
  /** lucide icon name (rendered by UI) */
  icon:
    | "Scale"
    | "Flame"
    | "Dumbbell"
    | "Zap"
    | "Bandage"
    | "Sparkles"
    | "Scissors"
    | "Heart"
    | "Moon"
    | "Sun"
    | "Hourglass"
    | "MoreHorizontal";
  /** Symptom / ad-funnel phrasing used on landing pages */
  funnelHeadline: string;
}

export const GOALS: GoalDef[] = [
  {
    id: "weight_management",
    label: "Weight management",
    short: "Weight",
    description: "Losing weight or maintaining a healthier weight over time.",
    icon: "Scale",
    funnelHeadline: "Struggling to shift the weight?",
  },
  {
    id: "fat_loss",
    label: "Fat loss / body composition",
    short: "Body composition",
    description: "Reducing body fat while preserving lean mass.",
    icon: "Flame",
    funnelHeadline: "Training hard but not seeing the change?",
  },
  {
    id: "muscle_recovery",
    label: "Muscle & recovery",
    short: "Muscle",
    description: "Building or maintaining muscle and recovering between sessions.",
    icon: "Dumbbell",
    funnelHeadline: "Recovery taking longer than it used to?",
  },
  {
    id: "athletic_performance",
    label: "Athletic performance",
    short: "Performance",
    description: "Improving endurance, strength or output — including anti-doping considerations.",
    icon: "Zap",
    funnelHeadline: "Chasing the next performance edge?",
  },
  {
    id: "injury_recovery",
    label: "Injury & recovery support",
    short: "Injury",
    description: "Supporting recovery from tendon, ligament, muscle or joint injury.",
    icon: "Bandage",
    funnelHeadline: "Nagging injury that won't heal?",
  },
  {
    id: "skin_cosmetic",
    label: "Skin & cosmetic",
    short: "Skin",
    description: "Skin quality, ageing, firmness and cosmetic goals.",
    icon: "Sparkles",
    funnelHeadline: "Want your skin to look how you feel?",
  },
  {
    id: "hair",
    label: "Hair",
    short: "Hair",
    description: "Hair thinning, shedding or growth.",
    icon: "Scissors",
    funnelHeadline: "Noticing more hair in the brush?",
  },
  {
    id: "sexual_health",
    label: "Sexual health",
    short: "Sexual health",
    description: "Libido, arousal and sexual function.",
    icon: "Heart",
    funnelHeadline: "Libido not what it was?",
  },
  {
    id: "sleep",
    label: "Sleep",
    short: "Sleep",
    description: "Falling asleep, staying asleep and sleep quality.",
    icon: "Moon",
    funnelHeadline: "Tired of waking up tired?",
  },
  {
    id: "general_wellbeing",
    label: "General wellbeing",
    short: "Wellbeing",
    description: "Energy, mood, focus and feeling well day to day.",
    icon: "Sun",
    funnelHeadline: "Feeling tired all the time?",
  },
  {
    id: "longevity",
    label: "Longevity",
    short: "Longevity",
    description: "Healthy ageing and long-term health span.",
    icon: "Hourglass",
    funnelHeadline: "Serious about ageing well?",
  },
  {
    id: "other",
    label: "Other",
    short: "Other",
    description: "Something else — tell us in your own words.",
    icon: "MoreHorizontal",
    funnelHeadline: "Have a different goal in mind?",
  },
];

export const GOAL_MAP: Record<GoalId, GoalDef> = Object.fromEntries(
  GOALS.map((g) => [g.id, g]),
) as Record<GoalId, GoalDef>;

export function getGoal(id: GoalId | undefined): GoalDef | undefined {
  return id ? GOAL_MAP[id] : undefined;
}
