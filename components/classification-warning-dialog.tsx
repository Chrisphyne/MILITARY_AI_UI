"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertTriangle, Shield, Lock } from "lucide-react"

interface ClassificationWarningDialogProps {
  isOpen: boolean
  classification: "CONFIDENTIAL" | "SECRET"
  onAccept: () => void
  onDecline: () => void
}

export function ClassificationWarningDialog({
  isOpen,
  classification,
  onAccept,
  onDecline,
}: ClassificationWarningDialogProps) {
  const [acknowledged, setAcknowledged] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(10)

  useEffect(() => {
    if (isOpen) {
      setAcknowledged(false)
      setTimeRemaining(10)

      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isOpen])

  const getWarningConfig = (level: string) => {
    switch (level) {
      case "SECRET":
        return {
          icon: Lock,
          color: "text-red-600",
          title: "SECRET CLASSIFICATION WARNING",
          description:
            "You are about to access SECRET classified information. This information requires the highest level of protection and is authorized only for personnel with appropriate security clearance and need-to-know.",
          warnings: [
            "Unauthorized disclosure is prohibited by law",
            "Information must be handled according to security protocols",
            "Access is logged and monitored for security purposes",
            "Report any suspected security violations immediately",
          ],
        }
      case "CONFIDENTIAL":
        return {
          icon: Shield,
          color: "text-yellow-600",
          title: "CONFIDENTIAL CLASSIFICATION WARNING",
          description:
            "You are about to access CONFIDENTIAL classified information. Unauthorized disclosure could cause serious damage to national security.",
          warnings: [
            "Access is restricted to authorized personnel only",
            "Information must be protected from unauthorized disclosure",
            "Follow all security protocols and procedures",
            "Report any security concerns to your supervisor",
          ],
        }
      default:
        return {
          icon: AlertTriangle,
          color: "text-gray-600",
          title: "CLASSIFICATION WARNING",
          description: "You are about to access classified information.",
          warnings: [],
        }
    }
  }

  const config = getWarningConfig(classification)
  const Icon = config.icon

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${config.color}`} />
            {config.title}
          </DialogTitle>
          <DialogDescription className="text-left">{config.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="bg-muted p-3 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Security Requirements:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {config.warnings.map((warning, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-xs mt-1">•</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="acknowledge"
              checked={acknowledged}
              onCheckedChange={(checked) => setAcknowledged(!!checked)}
            />
            <label htmlFor="acknowledge" className="text-sm">
              I acknowledge that I am authorized to access this classified information and will handle it according to
              security protocols.
            </label>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onDecline} className="w-full sm:w-auto bg-transparent">
            Decline Access
          </Button>
          <Button onClick={onAccept} disabled={!acknowledged || timeRemaining > 0} className="w-full sm:w-auto">
            {timeRemaining > 0 ? `Accept (${timeRemaining}s)` : "Accept & Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
