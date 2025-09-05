"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ClassificationBadge } from "./classification-badge"
import { ArrowLeft, Download, Share, Printer as Print } from "lucide-react"
import { format } from "date-fns"

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
  full_content: string
  recommendations: string[]
  sources: string[]
}

interface BriefingViewerProps {
  briefing: BriefingData
  onBack: () => void
  onDownload: () => void
}

export function BriefingViewer({ briefing, onBack, onDownload }: BriefingViewerProps) {
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

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-balance">{briefing.title}</h1>
              <p className="text-sm text-muted-foreground">
                Generated on {format(new Date(briefing.generated_at), "MMMM dd, yyyy 'at' HH:mm")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Print className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <ClassificationBadge level={briefing.classification_level} />
          <Badge className={`text-xs ${getThreatLevelColor(briefing.threat_level)}`}>
            Threat Level: {briefing.threat_level.toUpperCase()}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {briefing.type.toUpperCase()} BRIEFING
          </Badge>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 max-w-4xl mx-auto space-y-6">
          {/* Executive Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-pretty leading-relaxed">{briefing.summary}</p>
            </CardContent>
          </Card>

          {/* Key Points */}
          {briefing.key_points.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Key Intelligence Points</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {briefing.key_points.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="text-pretty leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Full Content */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-pretty leading-relaxed">{briefing.full_content}</div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {briefing.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {briefing.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary text-sm mt-1">▶</span>
                      <span className="text-pretty leading-relaxed">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Sources */}
          {briefing.sources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Intelligence Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {briefing.sources.map((source, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-xs mt-1">[{index + 1}]</span>
                      <span>{source}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
