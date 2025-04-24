"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, ArrowLeft, Upload, FileText, X, Pill } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample initial messages
const initialMessages = [
  {
    role: "assistant",
    content:
      "Hello! I'm CureBot, your AI health assistant powered by Google's Gemini 2.5 Flash Preview. How can I help you today?",
  },
  {
    role: "assistant",
    content:
      "I can answer questions about symptoms, medications, preventive care, and general health advice. You can also upload prescription images for analysis. Please note that I'm not a replacement for professional medical care.",
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

// Common symptoms for the symptom checker
const commonSymptoms = [
  { id: "s_98", name: "Fever", common: true },
  { id: "s_21", name: "Headache", common: true },
  { id: "s_119", name: "Cough", common: true },
  { id: "s_156", name: "Sore throat", common: true },
  { id: "s_13", name: "Abdominal pain", common: true },
  { id: "s_8", name: "Nausea", common: true },
  { id: "s_44", name: "Fatigue", common: true },
  { id: "s_47", name: "Dizziness", common: true },
  { id: "s_102", name: "Shortness of breath", common: true },
  { id: "s_88", name: "Chest pain", common: true },
]

function AIChatbotComponent() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"chat" | "prescription">("chat")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [prescriptionText, setPrescriptionText] = useState<string>("")
  const [isProcessingPrescription, setIsProcessingPrescription] = useState(false)
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean | null>(null)
  const [selectedSymptoms, setSelectedSymptoms] = useState<any[]>([])
  const [diagnosisProgress, setDiagnosisProgress] = useState<number>(0)
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null)
  const [patientInfo, setPatientInfo] = useState({ age: 30, sex: "male" })
  const [currentQuestion, setCurrentQuestion] = useState<any>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Check if API keys are configured on component mount
  useEffect(() => {
    const checkApiKeys = async () => {
      try {
        const response = await fetch("/api/check-api-keys")
        const data = await response.json()
        setApiKeyConfigured(data.ocr)
      } catch (error) {
        console.error("Error checking API keys:", error)
        setApiKeyConfigured(false)
      }
    }

    checkApiKeys()
  }, [])

  const generateResponse = async (userMessage: string) => {
    try {
      // Filter out initial assistant messages for the API call
      const relevantHistory = messages.filter((msg, index) => !(index < 2 && msg.role === "assistant"))

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history: relevantHistory,
        }),
      })

      const data = await response.json()

      // The API will now always return a response, either from the model or a fallback
      return data.response || "I'm sorry, I couldn't generate a response. Please try again with a different question."
    } catch (error) {
      console.error("Error generating response:", error)
      // Use fallback response if API fails completely
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
      // Generate response using Gemini
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

      // Process the first file automatically
      if (newFiles.length > 0) {
        processPrescriptionImage(newFiles[0])
      }
    }
  }

  // Process prescription image with OCR
  const processPrescriptionImage = async (file: File) => {
    setIsProcessingPrescription(true)
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      // Add user message about uploading prescription
      const newMessages = [
        ...messages,
        {
          role: "user",
          content: `I've uploaded a prescription image: ${file.name}`,
        },
      ]
      setMessages(newMessages)

      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to process prescription image")
      }

      const data = await response.json()

      if (data.extractedText) {
        // Add AI response about the prescription
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content:
              data.aiResponse || `I've analyzed your prescription and found the following text: ${data.extractedText}`,
          },
        ])
      } else {
        toast({
          title: "OCR Processing Error",
          description: "Could not extract text from the image. Please try a clearer image.",
          variant: "destructive",
        })

        // Add error message to chat
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content:
              "I couldn't extract any text from that image. Please try uploading a clearer image or make sure the text is visible.",
          },
        ])
      }
    } catch (error) {
      console.error("Error processing prescription:", error)
      toast({
        title: "Error",
        description: "Failed to process prescription image. Please try again.",
        variant: "destructive",
      })

      // Add error message to chat
      setMessages([
        ...messages,
        {
          role: "user",
          content: `I've uploaded a prescription image: ${file.name}`,
        },
        {
          role: "assistant",
          content:
            "I'm sorry, I encountered an error while processing your prescription image. Please try again with a different image.",
        },
      ])
    } finally {
      setIsProcessingPrescription(false)
      setIsLoading(false)

      // Switch to chat tab to show the results
      setActiveTab("chat")
    }
  }

  // Remove a file
  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
    if (index === 0 && uploadedFiles.length === 1) {
      setPrescriptionText("")
    }
  }

  // Trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  // Handle symptom selection
  const toggleSymptom = (symptom: { id: string; name: string }) => {
    const exists = selectedSymptoms.some((s) => s.id === symptom.id)

    if (exists) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s.id !== symptom.id))
    } else {
      setSelectedSymptoms([
        ...selectedSymptoms,
        {
          id: symptom.id,
          name: symptom.name,
          choice_id: "present",
        },
      ])
    }
  }

  // Start diagnosis with Infermedica API
  const startDiagnosis = async () => {
    if (selectedSymptoms.length === 0) {
      toast({
        title: "No symptoms selected",
        description: "Please select at least one symptom to start the diagnosis.",
        variant: "destructive",
      })
      return
    }

    setDiagnosisProgress(10)
    setDiagnosisResult(null)

    try {
      const response = await fetch("/api/infermedica", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symptoms: selectedSymptoms,
          age: patientInfo.age,
          sex: patientInfo.sex,
          extras: { disable_groups: true },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get diagnosis")
      }

      const data = await response.json()
      setDiagnosisProgress(100)

      if (data.question) {
        setCurrentQuestion(data.question)
      } else {
        setDiagnosisResult(data)

        // Add the diagnosis to the chat
        if (data.conditions && data.conditions.length > 0) {
          const topCondition = data.conditions[0]
          const diagnosisMessage = `Based on the symptoms you've provided, the most likely condition is ${topCondition.name} (${Math.round(topCondition.probability * 100)}% probability). ${topCondition.probability > 0.6 ? "This seems quite likely, but" : "However,"} please consult with a healthcare professional for a proper diagnosis and treatment plan.`

          setMessages([
            ...messages,
            {
              role: "user",
              content: `I have the following symptoms: ${selectedSymptoms.map((s) => s.name).join(", ")}`,
            },
            { role: "assistant", content: diagnosisMessage },
          ])

          // Switch back to chat tab
          setActiveTab("chat")
        }
      }
    } catch (error) {
      console.error("Error getting diagnosis:", error)
      toast({
        title: "Error",
        description: "Failed to get diagnosis. Please try again.",
        variant: "destructive",
      })
      setDiagnosisProgress(0)
    }
  }

  // Answer the current question in the diagnosis flow
  const answerQuestion = async (answerId: string) => {
    if (!currentQuestion) return

    setDiagnosisProgress((prev) => Math.min(prev + 15, 90))

    try {
      // Add the answer to the evidence
      const updatedSymptoms = [...selectedSymptoms]
      updatedSymptoms.push({
        id: currentQuestion.items[0].id,
        name: currentQuestion.items[0].name,
        choice_id: answerId,
      })

      setSelectedSymptoms(updatedSymptoms)

      const response = await fetch("/api/infermedica", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symptoms: updatedSymptoms,
          age: patientInfo.age,
          sex: patientInfo.sex,
          extras: { disable_groups: true },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get diagnosis")
      }

      const data = await response.json()

      if (data.question) {
        setCurrentQuestion(data.question)
      } else {
        setDiagnosisProgress(100)
        setDiagnosisResult(data)
        setCurrentQuestion(null)

        // Add the diagnosis to the chat
        if (data.conditions && data.conditions.length > 0) {
          const topCondition = data.conditions[0]
          const diagnosisMessage = `Based on the symptoms you've provided, the most likely condition is ${topCondition.name} (${Math.round(topCondition.probability * 100)}% probability). ${topCondition.probability > 0.6 ? "This seems quite likely, but" : "However,"} please consult with a healthcare professional for a proper diagnosis and treatment plan.`

          setMessages([
            ...messages,
            {
              role: "user",
              content: `I have the following symptoms: ${updatedSymptoms.map((s) => s.name).join(", ")}`,
            },
            { role: "assistant", content: diagnosisMessage },
          ])

          // Switch back to chat tab
          setActiveTab("chat")
        }
      }
    } catch (error) {
      console.error("Error processing answer:", error)
      toast({
        title: "Error",
        description: "Failed to process your answer. Please try again.",
        variant: "destructive",
      })
    }
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-4 flex-1 overflow-hidden flex flex-col">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="prescription">Upload Prescription</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 flex flex-col">
              <div className="mb-4 p-4 bg-teal-50 dark:bg-teal-900/30 rounded-lg">
                <h2 className="text-lg font-semibold text-teal-700 dark:text-teal-300 mb-2">About CureBot</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  CureBot uses advanced AI to provide general health information and guidance. You can ask questions or
                  upload prescription images for analysis. While it can offer helpful insights, it's not a substitute
                  for professional medical advice. Always consult with healthcare professionals for medical concerns.
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
                        <div
                          key={index}
                          className="flex items-center bg-white dark:bg-gray-600 px-2 py-1 rounded text-sm"
                        >
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
                    disabled={isLoading || isProcessingPrescription}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your health question here..."
                    className="flex-1 mr-2"
                    disabled={isLoading || isProcessingPrescription}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={isLoading || isProcessingPrescription || input.trim() === ""}
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="prescription" className="flex-1 flex flex-col">
              <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-2 flex items-center">
                  <Pill className="w-5 h-5 mr-2" />
                  Prescription Analysis
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Upload a prescription image and CureBot will extract and analyze the text to provide information about
                  your medications.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm mb-4">
                  <h3 className="text-lg font-medium mb-4">Upload Prescription</h3>

                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center mb-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.pdf"
                    />
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="mb-2">Drag and drop your prescription image here</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Supports JPG, PNG, and PDF</p>
                    <Button onClick={triggerFileUpload} disabled={isProcessingPrescription}>
                      {isProcessingPrescription ? "Processing..." : "Select File"}
                    </Button>
                  </div>

                  {/* Uploaded files */}
                  {uploadedFiles.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Uploaded Files</h4>
                      <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-md"
                          >
                            <div className="flex items-center">
                              <FileText className="w-5 h-5 mr-2 text-teal-600 dark:text-teal-400" />
                              <span>{file.name}</span>
                            </div>
                            <div className="flex items-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => processPrescriptionImage(file)}
                                disabled={isProcessingPrescription}
                              >
                                {isProcessingPrescription ? "Processing..." : "Process"}
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong>Note:</strong> After uploading, your prescription will be analyzed and the results will
                      appear in the chat. You'll be automatically redirected to the chat tab to view the analysis.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
              "Analyze my prescription",
            ].map((topic, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800 hover:bg-teal-50 dark:hover:bg-teal-900/30"
                onClick={() => {
                  if (topic === "Analyze my prescription") {
                    setActiveTab("prescription")
                  } else {
                    setInput(topic)
                    setActiveTab("chat")
                  }
                }}
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
