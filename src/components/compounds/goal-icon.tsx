import {
  Bandage,
  Dumbbell,
  Ellipsis,
  Flame,
  Heart,
  Hourglass,
  Moon,
  Scale,
  Scissors,
  Sparkles,
  Sun,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { GoalDef } from "@/data/goals";

const GOAL_ICONS: Record<GoalDef["icon"], LucideIcon> = {
  Scale,
  Flame,
  Dumbbell,
  Zap,
  Bandage,
  Sparkles,
  Scissors,
  Heart,
  Moon,
  Sun,
  Hourglass,
  MoreHorizontal: Ellipsis,
};

/** Renders the lucide icon named in a GoalDef. Safe in server and client components. */
export function GoalIcon({ icon, className }: { icon: GoalDef["icon"]; className?: string }) {
  const Icon = GOAL_ICONS[icon];
  return <Icon className={className} aria-hidden />;
}
