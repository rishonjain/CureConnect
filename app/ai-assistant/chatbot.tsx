"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"

// Types
type Message = {
  role: "user" | "assistant"
  content: string
}

// Sample initial messages
const initialMessages: Message[] = [
  {
    role: "assistant",
    content: "Hello! I'm MediBot, your AI health assistant. How can I help you today?",
  },
  {
    role: "assistant",
    content:
      "I can answer questions about symptoms, medications, preventive care, and general health advice. Please note that I'm not a replacement for professional medical care.",
  },
]

export default function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Sample responses for demo purposes
  const sampleResponses = [
    "Based on the symptoms you've described, it could be a common cold or seasonal allergies. If symptoms persist for more than a week, I'd recommend consulting with your doctor.",
    "It's recommended to drink 8 glasses (about 2 liters) of water daily, but individual needs may vary based on activity level, climate, and overall health.",
    "Regular exercise, a balanced diet, adequate sleep, stress management, and regular check-ups are key components of preventive healthcare.",
    "The recommended daily caloric intake varies based on age, gender, weight, height, and activity level. For an average adult, it's typically between 1,600-2,400 calories for women and 2,000-3,000 for men.",
    "Symptoms of dehydration include thirst, dry mouth, dark urine, fatigue, dizziness, and confusion. If you're experiencing these, please increase your fluid intake.",
  ]

  // In a real implementation, this would be a server action
  async function generateResponse(userMessage: string) {
    // This simulates a server action that would call an AI API
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)]
        resolve(randomResponse)
      }, 1500)
    })
  }

  const handleSend = async () => {
    if (input.trim() === "") return

    // Add user message
    const userMessage = input.trim()
    const newMessages = [...messages, { role: "user", content: userMessage }]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      // In a real implementation, this would call a server action
      const response = await generateResponse(userMessage)

      setMessages([...newMessages, { role: "assistant", content: response }])
    } catch (error) {
      console.error("Error generating response:", error)
      setMessages([
        ...newMessages,
        { role: "assistant", content: "I'm sorry, I encountered an error. Please try again later." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-teal-600 dark:bg-teal-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <Link href="/" className="flex items-center mr-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-xl font-bold flex items-center">
            <Bot className="w-6 h-6 mr-2" />
            MediBot Health Assistant
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto max-w-4xl p-4 flex flex-col">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-4 flex-1 overflow-hidden flex flex-col">
          <div className="mb-4 p-4 bg-teal-50 dark:bg-teal-900/30 rounded-lg">
            <h2 className="text-lg font-semibold text-teal-700 dark:text-teal-300 mb-2">About MediBot</h2>
            <p className="text-gray-700 dark:text-gray-300">
              MediBot uses advanced AI to provide general health information and guidance. While it can offer helpful
              insights, it's not a substitute for professional medical advice. Always consult with healthcare
              professionals for medical concerns.
            </p>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-teal-600 text-white rounded-tr-none"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none"
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      {message.role === "assistant" ? (
                        <Bot className="w-4 h-4 mr-2 text-teal-600 dark:text-teal-400" />
                      ) : (
                        <User className="w-4 h-4 mr-2" />
                      )}
                      <span className="font-semibold">{message.role === "assistant" ? "MediBot" : "You"}</span>
                    </div>
                    <p className={message.role === "user" ? "text-white" : "text-gray-800 dark:text-gray-200"}>
                      {message.content}
                    </p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 rounded-tl-none">
                    <div className="flex items-center">
                      <Bot className="w-4 h-4 mr-2 text-teal-600 dark:text-teal-400" />
                      <span className="font-semibold">MediBot</span>
                    </div>
                    <div className="flex space-x-1 mt-2">
                      <div
                        className="w-2 h-2 rounded-full bg-teal-600 dark:bg-teal-400 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-teal-600 dark:bg-teal-400 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-teal-600 dark:bg-teal-400 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="flex items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your health question here..."
              className="flex-1 mr-2"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || input.trim() === ""}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <h3 className="font-semibold text-lg mb-2 text-teal-700 dark:text-teal-300">Suggested Topics</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "Common cold symptoms",
              "Headache remedies",
              "Healthy diet tips",
              "Sleep improvement",
              "Stress management",
            ].map((topic, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800 hover:bg-teal-50 dark:hover:bg-teal-900/30"
                onClick={() => setInput(topic)}
              >
                {topic}
              </Button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 p-4 text-center text-gray-600 dark:text-gray-400 text-sm">
        <p>Powered by MediCare AI Technology. For emergencies, please call 911 or your local emergency number.</p>
      </footer>
    </div>
  )
}

