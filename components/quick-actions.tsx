"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Users,
  DollarSign,
  Truck,
  Target,
  AlertTriangle,
  BarChart3,
  MapPin,
  Clock,
  TrendingUp,
} from "lucide-react"

interface QuickAction {
  id: string
  title: string
  description: string
  query: string
  icon: React.ComponentType<{ className?: string }>
  classification: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET"
  category: "readiness" | "budget" | "personnel" | "intelligence" | "operations"
}

interface QuickActionsProps {
  onActionSelect: (query: string, classification: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET") => void
}

export function QuickActions({ onActionSelect }: QuickActionsProps) {
  const quickActions: QuickAction[] = [
    {
      id: "unit-readiness",
      title: "Unit Readiness Assessment",
      description: "Analyze current operational readiness levels across all military units",
      query:
        "Provide a comprehensive analysis of current military unit readiness levels, including personnel strength, equipment status, and operational capabilities.",
      icon: Shield,
      classification: "CONFIDENTIAL",
      category: "readiness",
    },
    {
      id: "budget-analysis",
      title: "Defense Budget Analysis",
      description: "Review defense spending allocation and budget efficiency",
      query:
        "Analyze the current defense budget allocation, spending patterns, and identify areas for optimization or concern.",
      icon: DollarSign,
      classification: "CONFIDENTIAL",
      category: "budget",
    },
    {
      id: "personnel-strength",
      title: "Personnel Strength Report",
      description: "Current military personnel numbers and deployment status",
      query:
        "Generate a report on current military personnel strength, deployment status, and staffing levels across all branches.",
      icon: Users,
      classification: "CONFIDENTIAL",
      category: "personnel",
    },
    {
      id: "equipment-status",
      title: "Equipment & Logistics Status",
      description: "Military equipment readiness and supply chain analysis",
      query:
        "Provide an overview of military equipment status, maintenance schedules, and logistics supply chain efficiency.",
      icon: Truck,
      classification: "UNCLASSIFIED",
      category: "operations",
    },
    {
      id: "threat-assessment",
      title: "Threat Assessment",
      description: "Current security threats and risk analysis",
      query:
        "Conduct a comprehensive threat assessment including current security risks, potential threats, and recommended countermeasures.",
      icon: AlertTriangle,
      classification: "SECRET",
      category: "intelligence",
    },
    {
      id: "operational-metrics",
      title: "Operational Metrics Dashboard",
      description: "Key performance indicators and operational statistics",
      query:
        "Display key operational metrics, performance indicators, and statistical analysis of military operations efficiency.",
      icon: BarChart3,
      classification: "CONFIDENTIAL",
      category: "operations",
    },
    {
      id: "deployment-status",
      title: "Deployment Status Overview",
      description: "Current military deployments and positioning",
      query: "Provide an overview of current military deployments, troop positioning, and strategic asset allocation.",
      icon: MapPin,
      classification: "SECRET",
      category: "operations",
    },
    {
      id: "training-schedule",
      title: "Training & Exercises Schedule",
      description: "Upcoming training programs and military exercises",
      query: "Show upcoming military training programs, joint exercises, and readiness training schedules.",
      icon: Target,
      classification: "UNCLASSIFIED",
      category: "readiness",
    },
    {
      id: "maintenance-schedule",
      title: "Maintenance Schedule Review",
      description: "Equipment maintenance timelines and priorities",
      query:
        "Review current equipment maintenance schedules, priorities, and identify any critical maintenance requirements.",
      icon: Clock,
      classification: "UNCLASSIFIED",
      category: "operations",
    },
    {
      id: "performance-trends",
      title: "Performance Trends Analysis",
      description: "Historical performance data and trend analysis",
      query:
        "Analyze historical performance trends, identify patterns, and provide insights on military effectiveness over time.",
      icon: TrendingUp,
      classification: "CONFIDENTIAL",
      category: "readiness",
    },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "readiness":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "budget":
        return "bg-green-100 text-green-800 border-green-200"
      case "personnel":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "intelligence":
        return "bg-red-100 text-red-800 border-red-200"
      case "operations":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const groupedActions = quickActions.reduce(
    (acc, action) => {
      if (!acc[action.category]) {
        acc[action.category] = []
      }
      acc[action.category].push(action)
      return acc
    },
    {} as Record<string, QuickAction[]>,
  )

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
        <p className="text-sm text-muted-foreground text-pretty">
          Select a pre-configured analysis to get started quickly with common military intelligence queries.
        </p>
      </div>

      {Object.entries(groupedActions).map(([category, actions]) => (
        <div key={category}>
          <h4 className="text-md font-medium mb-3 capitalize flex items-center gap-2">
            {category.replace("-", " ")}
            <Badge variant="outline" className={getCategoryColor(category)}>
              {actions.length}
            </Badge>
          </h4>
          <div className="grid gap-3 md:grid-cols-2">
            {actions.map((action) => {
              const Icon = action.icon
              return (
                <Card key={action.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-medium text-balance">{action.title}</CardTitle>
                        <CardDescription className="text-sm text-pretty">{action.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span
                        className={`classification-badge classification-${action.classification.toLowerCase()} text-xs`}
                      >
                        {action.classification}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => onActionSelect(action.query, action.classification)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Execute
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
