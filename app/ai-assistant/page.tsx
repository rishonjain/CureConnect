import type { Metadata } from "next"
import AIChatbotComponent from "./ai-chatbot-client"

export const metadata: Metadata = {
  title: "CureBot Health Assistant | CureConnect",
  description: "Get instant health advice and information from our AI-powered CureBot assistant.",
}

export default function AIChatbotPage() {
  return <AIChatbotComponent />
}
