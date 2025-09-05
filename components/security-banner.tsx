"use client"

import { AlertTriangle, Shield, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface SecurityBannerProps {
  classification: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET"
  className?: string
}

export function SecurityBanner({ classification, className }: SecurityBannerProps) {
  const getSecurityConfig = (level: string) => {
    switch (level) {
      case "SECRET":
        return {
          icon: Lock,
          bgColor: "bg-red-600",
          textColor: "text-white",
          message: "SECRET - AUTHORIZED PERSONNEL ONLY",
          description: "This information requires the highest level of protection",
        }
      case "CONFIDENTIAL":
        return {
          icon: Shield,
          bgColor: "bg-yellow-600",
          textColor: "text-white",
          message: "CONFIDENTIAL - RESTRICTED ACCESS",
          description: "Unauthorized disclosure could cause serious damage to national security",
        }
      case "UNCLASSIFIED":
        return {
          icon: AlertTriangle,
          bgColor: "bg-green-600",
          textColor: "text-white",
          message: "UNCLASSIFIED - FOR OFFICIAL USE ONLY",
          description: "This information is approved for general distribution",
        }
      default:
        return {
          icon: AlertTriangle,
          bgColor: "bg-gray-600",
          textColor: "text-white",
          message: "CLASSIFICATION UNKNOWN",
          description: "Classification level not determined",
        }
    }
  }

  const config = getSecurityConfig(classification)
  const Icon = config.icon

  return (
    <div className={cn("border-l-4 border-l-current", config.bgColor, config.textColor, className)}>
      <div className="flex items-center gap-3 px-4 py-3">
        <Icon className="h-5 w-5 flex-shrink-0" />
        <div className="flex-1">
          <div className="font-bold text-sm">{config.message}</div>
          <div className="text-xs opacity-90">{config.description}</div>
        </div>
      </div>
    </div>
  )
}
