"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClassificationBadge } from "./classification-badge"
import { Calendar, Download, Eye, RefreshCw } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"

interface BriefingData {
  id: string
  type: "daily" | "weekly"
  title: string
  summary: string
  classification_level: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET"
  generated_at: string
  status: "ready" | "generating" | "error"
  key_points: string[]
  threat_level: "low" | "medium" | "high" | "critical"
}

interface BriefingCardProps {
  briefing: BriefingData
  onView: (briefing: BriefingData) => void
  onDownload: (briefing: BriefingData) => void
  onRegenerate: (briefing: BriefingData) => void
}

export function BriefingCard({ briefing, onView, onDownload, onRegenerate }: BriefingCardProps) {
  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-600 text-white"
      case "high":
        return "bg-orange-600 text-white"
      case "medium":
        return "bg-yellow-600 text-white"
      case "low":
        return "bg-green-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800 border-green-200"
      case "generating":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-balance">{briefing.title}</CardTitle>
            <CardDescription className="mt-1 text-pretty">{briefing.summary}</CardDescription>
          </div>
          <Badge className={`text-xs ${getThreatLevelColor(briefing.threat_level)}`}>
            {briefing.threat_level.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <ClassificationBadge level={briefing.classification_level} />
          <Badge variant="outline" className={getStatusColor(briefing.status)}>
            {briefing.status === "generating" && <RefreshCw className="h-3 w-3 mr-1 animate-spin" />}
            {briefing.status.toUpperCase()}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            {format(new Date(briefing.generated_at), "MMM dd, yyyy")}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {formatDistanceToNow(new Date(briefing.generated_at), { addSuffix: true })}
          </Badge>
        </div>

        {briefing.key_points.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Key Points:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {briefing.key_points.slice(0, 3).map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-xs mt-1">•</span>
                  <span className="text-pretty">{point}</span>
                </li>
              ))}
              {briefing.key_points.length > 3 && (
                <li className="text-xs text-muted-foreground">+{briefing.key_points.length - 3} more points...</li>
              )}
            </ul>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button onClick={() => onView(briefing)} disabled={briefing.status !== "ready"} className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            View Briefing
          </Button>
          <Button
            variant="outline"
            onClick={() => onDownload(briefing)}
            disabled={briefing.status !== "ready"}
            className="flex-shrink-0"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => onRegenerate(briefing)}
            disabled={briefing.status === "generating"}
            className="flex-shrink-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
