"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Eye, MessageSquare, FileText, Shield } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface AuditEvent {
  id: string
  type: "project_access" | "conversation_view" | "message_sent" | "classification_change"
  description: string
  classification: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET"
  timestamp: string
  user: string
}

export function AuditTrail() {
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([])

  useEffect(() => {
    // Mock audit events - in a real app, this would come from the API
    const mockEvents: AuditEvent[] = [
      {
        id: "1",
        type: "project_access",
        description: "Accessed Defense Budget Analysis 2024 project",
        classification: "CONFIDENTIAL",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        user: "Current User",
      },
      {
        id: "2",
        type: "conversation_view",
        description: "Opened Unit Readiness Assessment conversation",
        classification: "CONFIDENTIAL",
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        user: "Current User",
      },
      {
        id: "3",
        type: "message_sent",
        description: "Sent analysis query about personnel strength",
        classification: "CONFIDENTIAL",
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        user: "Current User",
      },
    ]
    setAuditEvents(mockEvents)
  }, [])

  const getEventIcon = (type: string) => {
    switch (type) {
      case "project_access":
        return Eye
      case "conversation_view":
        return MessageSquare
      case "message_sent":
        return MessageSquare
      case "classification_change":
        return Shield
      default:
        return FileText
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Audit Trail
        </CardTitle>
        <CardDescription>Recent security-related activities and access logs</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {auditEvents.map((event) => {
              const Icon = getEventIcon(event.type)
              return (
                <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <Icon className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-balance">{event.description}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {event.user}
                      </Badge>
                      <span
                        className={`classification-badge classification-${event.classification.toLowerCase()} text-xs`}
                      >
                        {event.classification}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
