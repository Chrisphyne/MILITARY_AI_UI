"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Loader2 } from "lucide-react"

interface ChatInputProps {
  onSendMessage: (message: string, classification: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET") => void
  isLoading: boolean
  defaultClassification?: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET"
  disabled?: boolean
}

export function ChatInput({
  onSendMessage,
  isLoading,
  defaultClassification = "UNCLASSIFIED",
  disabled,
}: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [classification, setClassification] = useState<"UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET">(
    defaultClassification,
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading || disabled) return

    onSendMessage(message.trim(), classification)
    setMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="border-t bg-background p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Classification:</span>
          <Select
            value={classification}
            onValueChange={(value: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET") => setClassification(value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UNCLASSIFIED">UNCLASSIFIED</SelectItem>
              <SelectItem value="CONFIDENTIAL">CONFIDENTIAL</SelectItem>
              <SelectItem value="SECRET">SECRET</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your military analysis query..."
            className="flex-1 min-h-[60px] max-h-[120px] resize-none"
            disabled={isLoading || disabled}
          />
          <Button type="submit" disabled={!message.trim() || isLoading || disabled} className="self-end">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">Press Enter to send, Shift+Enter for new line</div>
      </form>
    </div>
  )
}
