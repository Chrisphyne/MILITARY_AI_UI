import { cn } from "@/lib/utils"

interface ClassificationBadgeProps {
  level: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET"
  className?: string
}

export function ClassificationBadge({ level, className }: ClassificationBadgeProps) {
  const getClassificationStyles = (level: string) => {
    switch (level) {
      case "UNCLASSIFIED":
        return "classification-unclassified"
      case "CONFIDENTIAL":
        return "classification-confidential"
      case "SECRET":
        return "classification-secret"
      default:
        return "classification-unclassified"
    }
  }

  return <span className={cn("classification-badge", getClassificationStyles(level), className)}>{level}</span>
}
