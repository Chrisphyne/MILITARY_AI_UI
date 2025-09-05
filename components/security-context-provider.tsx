"use client"

import type React from "react"

import { createContext, useContext, useState, useCallback } from "react"

interface SecurityContextType {
  acknowledgedClassifications: Set<string>
  acknowledgeClassification: (classification: "CONFIDENTIAL" | "SECRET") => void
  isClassificationAcknowledged: (classification: "CONFIDENTIAL" | "SECRET") => boolean
  clearAcknowledgments: () => void
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined)

export function SecurityContextProvider({ children }: { children: React.ReactNode }) {
  const [acknowledgedClassifications, setAcknowledgedClassifications] = useState<Set<string>>(new Set())

  const acknowledgeClassification = useCallback((classification: "CONFIDENTIAL" | "SECRET") => {
    setAcknowledgedClassifications((prev) => new Set([...prev, classification]))
  }, [])

  const isClassificationAcknowledged = useCallback(
    (classification: "CONFIDENTIAL" | "SECRET") => {
      return acknowledgedClassifications.has(classification)
    },
    [acknowledgedClassifications],
  )

  const clearAcknowledgments = useCallback(() => {
    setAcknowledgedClassifications(new Set())
  }, [])

  return (
    <SecurityContext.Provider
      value={{
        acknowledgedClassifications,
        acknowledgeClassification,
        isClassificationAcknowledged,
        clearAcknowledgments,
      }}
    >
      {children}
    </SecurityContext.Provider>
  )
}

export function useSecurityContext() {
  const context = useContext(SecurityContext)
  if (context === undefined) {
    throw new Error("useSecurityContext must be used within a SecurityContextProvider")
  }
  return context
}
