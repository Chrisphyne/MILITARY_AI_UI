"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { SecurityBanner } from "./security-banner"
import { ClassificationWarningDialog } from "./classification-warning-dialog"
import { useSecurityContext } from "./security-context-provider"
import type { MilitaryProject } from "@/lib/api"

interface SecureWorkspaceProps {
  project: MilitaryProject | null
  children: React.ReactNode
}

export function SecureWorkspace({ project, children }: SecureWorkspaceProps) {
  const { isClassificationAcknowledged, acknowledgeClassification } = useSecurityContext()
  const [showWarning, setShowWarning] = useState(false)
  const [pendingAccess, setPendingAccess] = useState(false)

  const classification = project?.classification_level || "UNCLASSIFIED"
  const requiresWarning =
    (classification === "CONFIDENTIAL" || classification === "SECRET") && !isClassificationAcknowledged(classification)

  useEffect(() => {
    if (project && requiresWarning) {
      setShowWarning(true)
      setPendingAccess(true)
    } else {
      setPendingAccess(false)
    }
  }, [project, requiresWarning])

  const handleAcceptWarning = () => {
    if (classification === "CONFIDENTIAL" || classification === "SECRET") {
      acknowledgeClassification(classification)
    }
    setShowWarning(false)
    setPendingAccess(false)
  }

  const handleDeclineWarning = () => {
    setShowWarning(false)
    // In a real application, this would redirect to a safe page or log the access denial
    window.history.back()
  }

  return (
    <div className="h-full flex flex-col">
      {/* Security Banner */}
      <SecurityBanner classification={classification} />

      {/* Content */}
      <div className="flex-1 relative">
        {pendingAccess ? (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">Security Clearance Required</div>
              <div className="text-muted-foreground">Please acknowledge the security requirements to continue.</div>
            </div>
          </div>
        ) : (
          children
        )}
      </div>

      {/* Classification Warning Dialog */}
      {(classification === "CONFIDENTIAL" || classification === "SECRET") && (
        <ClassificationWarningDialog
          isOpen={showWarning}
          classification={classification}
          onAccept={handleAcceptWarning}
          onDecline={handleDeclineWarning}
        />
      )}
    </div>
  )
}
