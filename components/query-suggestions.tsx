"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, DollarSign, MapPin, AlertTriangle, TrendingUp, FileText, Target, Zap } from "lucide-react"

interface QuerySuggestion {
  id: string
  title: string
  description: string
  query: string
  classification: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET"
  category: string
  icon: React.ReactNode
}

interface QuerySuggestionsProps {
  onSelectQuery: (query: string, classification: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET") => void
}

const querySuggestions: QuerySuggestion[] = [
  {
    id: "unit-readiness",
    title: "Unit Readiness Assessment",
    description: "Analyze current readiness levels across all military units",
    query:
      "Provide a comprehensive analysis of unit readiness levels across all branches of the Kenya Defence Forces, including personnel strength, equipment status, and training completion rates.",
    classification: "CONFIDENTIAL",
    category: "Operations",
    icon: <Shield className="h-4 w-4" />,
  },
  {
    id: "budget-analysis",
    title: "Defense Budget Analysis",
    description: "Review defense spending and budget allocation",
    query:
      "Analyze the current defense budget allocation, spending patterns, and identify areas for optimization or reallocation of resources.",
    classification: "UNCLASSIFIED",
    category: "Finance",
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    id: "personnel-overview",
    title: "Personnel Statistics",
    description: "Get overview of military personnel data",
    query:
      "Provide detailed statistics on military personnel including recruitment numbers, retention rates, demographic breakdown, and training status.",
    classification: "CONFIDENTIAL",
    category: "Personnel",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "threat-assessment",
    title: "Regional Threat Assessment",
    description: "Analyze current security threats in the region",
    query:
      "Conduct a comprehensive threat assessment for the East African region, including border security, terrorism risks, and regional stability factors.",
    classification: "SECRET",
    category: "Intelligence",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  {
    id: "equipment-status",
    title: "Equipment & Assets Status",
    description: "Review military equipment and asset conditions",
    query:
      "Provide a detailed report on the status of military equipment, vehicles, and assets including maintenance schedules, operational readiness, and replacement needs.",
    classification: "CONFIDENTIAL",
    category: "Logistics",
    icon: <Target className="h-4 w-4" />,
  },
  {
    id: "training-programs",
    title: "Training Program Effectiveness",
    description: "Evaluate military training programs and outcomes",
    query:
      "Analyze the effectiveness of current military training programs, completion rates, skill development outcomes, and recommendations for improvement.",
    classification: "UNCLASSIFIED",
    category: "Training",
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    id: "border-security",
    title: "Border Security Status",
    description: "Review border security operations and challenges",
    query:
      "Provide an assessment of border security operations, including patrol effectiveness, infrastructure status, and identified vulnerabilities along Kenya's borders.",
    classification: "SECRET",
    category: "Security",
    icon: <MapPin className="h-4 w-4" />,
  },
  {
    id: "intelligence-briefing",
    title: "Daily Intelligence Summary",
    description: "Get the latest intelligence briefing",
    query:
      "Provide today's intelligence briefing including security updates, threat assessments, and operational status reports.",
    classification: "SECRET",
    category: "Intelligence",
    icon: <FileText className="h-4 w-4" />,
  },
]

const categoryColors = {
  Operations: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Finance: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Personnel: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Intelligence: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Logistics: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  Training: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  Security: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
}

export function QuerySuggestions({ onSelectQuery }: QuerySuggestionsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">Suggested Military Analysis Queries</h3>
        <p className="text-sm text-muted-foreground text-pretty">
          Select a pre-built query to start your military analysis, or use these as inspiration for your own questions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {querySuggestions.map((suggestion) => (
          <Card key={suggestion.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {suggestion.icon}
                  <CardTitle className="text-sm font-medium text-foreground">{suggestion.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={categoryColors[suggestion.category as keyof typeof categoryColors]}
                  >
                    {suggestion.category}
                  </Badge>
                </div>
              </div>
              <CardDescription className="text-xs text-muted-foreground">{suggestion.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className={`classification-badge classification-${suggestion.classification.toLowerCase()}`}>
                  {suggestion.classification}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSelectQuery(suggestion.query, suggestion.classification)}
                  className="text-xs"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Use Query
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          All queries are processed according to their classification level and security protocols.
        </p>
      </div>
    </div>
  )
}
