"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, ArrowLeft, Upload, FileText, X, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Sample initial messages
const initialMessages = [
  {
    role: "assistant",
    content: "Hello! I'm CureBot, your AI health assistant. How can I help you today?",
  },
  {
    role: "assistant",
    content:
      "I can answer questions about symptoms, medications, preventive care, and general health advice. Please note that I'm not a replacement for professional medical care.",
  },
]

// Fallback responses in case the API fails
const fallbackResponses = [
  "Based on the symptoms you've described, it could be a common cold or seasonal allergies. If symptoms persist for more than a week, I'd recommend consulting with your doctor.",
  "It's recommended to drink 8 glasses (about 2 liters) of water daily, but individual needs may vary based on activity level, climate, and overall health.",
  "Regular exercise, a balanced diet, adequate sleep, stress management, and regular check-ups are key components of preventive healthcare.",
  "The recommended daily caloric intake varies based on age, gender, weight, height, and activity level. For an average adult, it's typically between 1,600-2,400 calories for women and 2,000-3,000 for men.",
  "Symptoms of dehydration include thirst, dry mouth, dark urine, fatigue, dizziness, and confusion. If you're experiencing these, please increase your fluid intake.",
]

function AIChatbotComponent() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean | null>(null)

  // Check if API key is configured on component mount
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const response = await fetch("/api/huggingface/check-key")
        const data = await response.json()
        setApiKeyConfigured(data.configured)
      } catch (error) {
        console.error("Error checking API key:", error)
        setApiKeyConfigured(false)
      }
    }

    checkApiKey()
  }, [])

  const generateResponse = async (userMessage: string) => {
    try {
      // Filter out initial assistant messages for the API call
      const relevantHistory = messages.filter((msg, index) => !(index < 2 && msg.role === "assistant"))

      const response = await fetch("/api/huggingface", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history: relevantHistory,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from API")
      }

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error("Error generating response:", error)
      // Use fallback response if API fails
      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
    }
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
      // Generate response using Mistral-7B-Instruct
      const aiResponse = await generateResponse(userMessage)

      setMessages([...newMessages, { role: "assistant", content: aiResponse }])
    } catch (error) {
      console.error("Error in chat:", error)
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      })
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setUploadedFiles((prev) => [...prev, ...newFiles])

      // Notify the user about the upload
      toast({
        title: "Prescription uploaded",
        description: `${newFiles.length} file(s) uploaded successfully.`,
      })

      // Add a system message about the upload
      const fileNames = newFiles.map((file) => file.name).join(", ")
      const newMessages = [
        ...messages,
        {
          role: "user",
          content: `I've uploaded my prescription: ${fileNames}`,
        },
      ]
      setMessages(newMessages)

      // Generate AI response about the prescription
      setIsLoading(true)
      generateResponse(`The user has uploaded a prescription file named: ${fileNames}. Respond appropriately.`)
        .then((response) => {
          setMessages([
            ...newMessages,
            {
              role: "assistant",
              content: response,
            },
          ])
        })
        .catch((error) => {
          console.error("Error generating response for file upload:", error)
          setMessages([
            ...newMessages,
            {
              role: "assistant",
              content:
                "I've received your prescription upload. A healthcare professional will review this during your consultation. Is there anything specific about your medication you'd like to discuss?",
            },
          ])
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }

  // Add this function to remove a file
  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Add this function to trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

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
            CureBot Health Assistant
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto max-w-4xl p-4 flex flex-col">
        {apiKeyConfigured === false && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>API Key Not Configured</AlertTitle>
            <AlertDescription>
              The Hugging Face API key is not configured. Please add your API key to the environment variables as
              HUGGINGFACE_API_KEY.
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-4 flex-1 overflow-hidden flex flex-col">
          <div className="mb-4 p-4 bg-teal-50 dark:bg-teal-900/30 rounded-lg">
            <h2 className="text-lg font-semibold text-teal-700 dark:text-teal-300 mb-2">About CureBot</h2>
            <p className="text-gray-700 dark:text-gray-300">
              CureBot uses the Mistral-7B-Instruct-v0.2 model to provide general health information and guidance. While
              it can offer helpful insights, it's not a substitute for professional medical advice. Always consult with
              healthcare professionals for medical concerns.
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
                      <span className="font-semibold">{message.role === "assistant" ? "CureBot" : "You"}</span>
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
                      <span className="font-semibold">CureBot</span>
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
          <div>
            {/* Uploaded files display */}
            {uploadedFiles.length > 0 && (
              <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Uploaded prescriptions:</div>
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center bg-white dark:bg-gray-600 px-2 py-1 rounded text-sm">
                      <FileText className="w-3 h-3 mr-1 text-teal-600 dark:text-teal-400" />
                      <span className="truncate max-w-[150px]">{file.name}</span>
                      <button onClick={() => removeFile(index)} className="ml-1 text-gray-500 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input area with upload button */}
            <div className="flex items-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                multiple
              />
              <Button
                variant="outline"
                size="icon"
                className="mr-2 text-gray-500 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400"
                onClick={triggerFileUpload}
                title="Upload prescription"
              >
                <Upload className="w-4 h-4" />
              </Button>
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
        <p>Powered by CureConnect AI Technology. For emergencies, please call 911 or your local emergency number.</p>
      </footer>
    </div>
  )
}

export default AIChatbotComponent
