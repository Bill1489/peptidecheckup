import {
  Bandage,
  Dumbbell,
  Flame,
  Heart,
  Hourglass,
  MoreHorizontal,
  Moon,
  Scale,
  Scissors,
  Sparkles,
  Sun,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { GoalDef } from "@/data/goals";

const ICONS: Record<GoalDef["icon"], LucideIcon> = {
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
  MoreHorizontal,
};

/** Renders the lucide icon named in a goal definition. */
export function GoalIcon({ icon, className }: { icon: GoalDef["icon"]; className?: string }) {
  const Icon = ICONS[icon];
  return <Icon className={className} aria-hidden strokeWidth={1.75} />;
}
