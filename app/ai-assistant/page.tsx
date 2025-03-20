import type { Metadata } from "next"
import AIChatbotComponent from "./ai-chatbot-client"

export const metadata: Metadata = {
  title: "MediBot Health Assistant | MediCare",
  description: "Get instant health advice and information from our AI-powered MediBot assistant.",
}

export default function AIChatbotPage() {
  return <AIChatbotComponent />
}

