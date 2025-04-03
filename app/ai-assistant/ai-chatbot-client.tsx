"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, ArrowLeft, FileText, X, Check, Image, FilePlus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"

// Sample initial messages
const initialMessages = [
  {
    role: "assistant",
    content: "Hello! I'm CureBot, your AI health assistant. How can I help you today?",
  },
  {
    role: "assistant",
    content:
      "I can answer questions about symptoms, medications, preventive care, and general health advice. You can also upload prescriptions for me to analyze. Please note that I'm not a replacement for professional medical care.",
  },
]

// Simulated Hugging Face API call for prescription analysis
const analyzePrescriptionWithHuggingFace = async (
  file: File,
  notes: string,
): Promise<{ success: boolean; analysis: string }> => {
  // In a real implementation, this would upload the file to a server
  // and call the Hugging Face API with the image data

  // Simulate API processing time
  await new Promise((resolve) => setTimeout(resolve, 3000 + Math.random() * 2000))

  // Generate a more dynamic response based on the file name and notes
  const fileName = file.name.toLowerCase()
  const fileType = file.type

  // Simulate occasional API failures
  if (Math.random() < 0.05) {
    throw new Error("API connection failed")
  }

  let medicationDetails = ""

  // Generate different responses based on file name patterns
  if (fileName.includes("antibiotic") || Math.random() < 0.3) {
    medicationDetails = `
I've analyzed your prescription using our medical vision model.

**Medications Identified:**
- Amoxicillin 500mg capsules
- Take 1 capsule every 8 hours for 10 days

**Important Information:**
- This is an antibiotic used to treat bacterial infections
- Complete the full course even if symptoms improve
- Take with or without food
- May cause side effects including diarrhea and nausea
- Avoid alcohol while taking this medication

**Refills:** 0 (no refills authorized)
`
  } else if (fileName.includes("blood") || fileName.includes("pressure") || Math.random() < 0.3) {
    medicationDetails = `
I've analyzed your prescription using our medical vision model.

**Medications Identified:**
- Lisinopril 10mg tablets
- Take 1 tablet daily in the morning

**Important Information:**
- This is an ACE inhibitor used to treat high blood pressure
- May cause dizziness, especially when standing up quickly
- Monitor your blood pressure regularly
- Avoid potassium supplements unless directed by your doctor
- Report any persistent dry cough to your healthcare provider

**Refills:** 3 (valid for 12 months)
`
  } else if (fileName.includes("diabetes") || Math.random() < 0.3) {
    medicationDetails = `
I've analyzed your prescription using our medical vision model.

**Medications Identified:**
- Metformin 1000mg tablets
- Take 1 tablet twice daily with meals

**Important Information:**
- This medication helps control blood sugar in type 2 diabetes
- Take with food to reduce stomach upset
- Monitor your blood sugar as directed by your doctor
- May cause vitamin B12 deficiency with long-term use
- Common side effects include digestive issues, typically improving over time

**Refills:** 5 (valid for 12 months)
`
  } else {
    // Generic response if no specific patterns match
    medicationDetails = `
I've analyzed your prescription using our medical vision model.

**Medications Identified:**
- ${Math.random() > 0.5 ? "Atorvastatin 20mg tablets" : "Sertraline 50mg tablets"}
- Take 1 tablet daily ${Math.random() > 0.5 ? "in the evening" : "in the morning"}

**Important Information:**
- ${
      Math.random() > 0.5
        ? "This medication helps lower cholesterol levels"
        : "This medication is used to treat depression and anxiety disorders"
    }
- ${
      Math.random() > 0.5
        ? "May cause muscle pain or weakness as side effects"
        : "May take several weeks to reach full effectiveness"
    }
- Follow up with your doctor in ${Math.floor(Math.random() * 3) + 1} months
- Store at room temperature away from moisture and heat

**Refills:** ${Math.floor(Math.random() * 5)} (valid for 12 months)
`
  }

  // Add personalized notes if the user provided any
  if (notes && notes.trim()) {
    medicationDetails += `\n**Regarding your notes:**\n`

    if (notes.toLowerCase().includes("side effect") || notes.toLowerCase().includes("reaction")) {
      medicationDetails +=
        "If you're experiencing side effects, please contact your healthcare provider. They can determine if this is a normal reaction or if your medication needs adjustment."
    } else if (notes.toLowerCase().includes("food") || notes.toLowerCase().includes("meal")) {
      medicationDetails +=
        "Regarding your question about food interactions, it's generally recommended to take this medication as prescribed in relation to meals. Some medications work better with food, while others should be taken on an empty stomach."
    } else if (notes.toLowerCase().includes("miss") || notes.toLowerCase().includes("forgot")) {
      medicationDetails +=
        "If you miss a dose, take it as soon as you remember. However, if it's almost time for your next dose, skip the missed dose and continue your regular schedule. Don't double up to make up for a missed dose."
    } else {
      medicationDetails +=
        "I recommend discussing your specific concerns about this prescription with your healthcare provider for personalized advice."
    }
  }

  return {
    success: true,
    analysis: medicationDetails,
  }
}

function AIChatbotComponent() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"camera" | "file">("file")
  const [prescriptionNotes, setPrescriptionNotes] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  // Sample responses for general health questions
  const sampleResponses = [
    "Based on the symptoms you've described, it could be a common cold or seasonal allergies. If symptoms persist for more than a week, I'd recommend consulting with your doctor.",
    "It's recommended to drink 8 glasses (about 2 liters) of water daily, but individual needs may vary based on activity level, climate, and overall health.",
    "Regular exercise, a balanced diet, adequate sleep, stress management, and regular check-ups are key components of preventive healthcare.",
    "The recommended daily caloric intake varies based on age, gender, weight, height, and activity level. For an average adult, it's typically between 1,600-2,400 calories for women and 2,000-3,000 for men.",
    "Symptoms of dehydration include thirst, dry mouth, dark urine, fatigue, dizziness, and confusion. If you're experiencing these, please increase your fluid intake.",
  ]

  const handleSend = () => {
    if (input.trim() === "") return

    // Add user message
    const newMessages = [...messages, { role: "user", content: input }]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    // Simulate API call with timeout
    setTimeout(() => {
      const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)]
      setMessages([...newMessages, { role: "assistant", content: randomResponse }])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
      setUploadError(null)
    }
  }

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
      setUploadError(null)
    }
  }

  const handleUploadClick = () => {
    if (activeTab === "file" && fileInputRef.current) {
      fileInputRef.current.click()
    } else if (activeTab === "camera" && cameraInputRef.current) {
      cameraInputRef.current.click()
    }
  }

  const handleUploadPrescription = async () => {
    if (!uploadedFile) return

    setUploadStatus("uploading")
    setUploadError(null)

    try {
      // Add message about the prescription upload
      const fileName = uploadedFile.name
      const userMessage = `I've uploaded my prescription: ${fileName}${prescriptionNotes ? ` (Notes: ${prescriptionNotes})` : ""}`
      const newMessages = [...messages, { role: "user", content: userMessage }]
      setMessages(newMessages)

      // Close dialog after starting the upload
      setUploadDialogOpen(false)
      setIsLoading(true)

      // Call the Hugging Face API (simulated)
      const result = await analyzePrescriptionWithHuggingFace(uploadedFile, prescriptionNotes)

      if (result.success) {
        // Add the AI response with the prescription analysis
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: result.analysis,
          },
        ])
      } else {
        throw new Error("Failed to analyze prescription")
      }
    } catch (error) {
      console.error("Error analyzing prescription:", error)
      setUploadError(error instanceof Error ? error.message : "Unknown error")

      // Add error message to chat
      setMessages([
        ...messages,
        {
          role: "user",
          content: `I tried to upload my prescription: ${uploadedFile.name}`,
        },
        {
          role: "assistant",
          content:
            "I'm sorry, I encountered an error while analyzing your prescription. This could be due to image quality or format issues. Please try uploading a clearer image or contact support if the problem persists.",
        },
      ])
    } finally {
      setIsLoading(false)
      setUploadStatus("idle")
      setUploadedFile(null)
      setPrescriptionNotes("")
    }
  }

  const clearUploadedFile = () => {
    setUploadedFile(null)
    setUploadError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (cameraInputRef.current) cameraInputRef.current.value = ""
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
            CureBot Health Assistant
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto max-w-4xl p-4 flex flex-col">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-4 flex-1 overflow-hidden flex flex-col">
          <div className="mb-4 p-4 bg-teal-50 dark:bg-teal-900/30 rounded-lg">
            <h2 className="text-lg font-semibold text-teal-700 dark:text-teal-300 mb-2">About CureBot</h2>
            <p className="text-gray-700 dark:text-gray-300">
              CureBot uses advanced AI to provide general health information and guidance. You can also upload
              prescriptions for analysis using our Hugging Face vision model. While it can offer helpful insights, it's
              not a substitute for professional medical advice. Always consult with healthcare professionals for medical
              concerns.
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
                    <div
                      className={
                        message.role === "user"
                          ? "text-white"
                          : "text-gray-800 dark:text-gray-200 prose prose-sm max-w-none"
                      }
                    >
                      {message.content.split("\n").map((line, i) => (
                        <p key={i} className="mb-1 last:mb-0">
                          {line}
                        </p>
                      ))}
                    </div>
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
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="mr-2 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800"
              onClick={() => setUploadDialogOpen(true)}
              title="Upload Prescription"
              disabled={isLoading}
            >
              <FileText className="w-5 h-5" />
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

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <h3 className="font-semibold text-lg mb-2 text-teal-700 dark:text-teal-300">Suggested Topics</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "Common cold symptoms",
              "Headache remedies",
              "Healthy diet tips",
              "Sleep improvement",
              "Stress management",
              "Upload prescription",
            ].map((topic, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800 hover:bg-teal-50 dark:hover:bg-teal-900/30"
                onClick={() => {
                  if (topic === "Upload prescription") {
                    setUploadDialogOpen(true)
                  } else {
                    setInput(topic)
                  }
                }}
                disabled={isLoading}
              >
                {topic === "Upload prescription" ? (
                  <>
                    <FileText className="w-4 h-4 mr-2" /> {topic}
                  </>
                ) : (
                  topic
                )}
              </Button>
            ))}
          </div>
        </div>
      </main>

      {/* Prescription Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onOpenChange={(open) => {
          if (!isLoading) setUploadDialogOpen(open)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Prescription</DialogTitle>
            <DialogDescription>
              Upload a photo or file of your prescription for analysis. Our Hugging Face AI model will analyze the
              prescription and provide information about your medications.
            </DialogDescription>
          </DialogHeader>

          <Tabs
            defaultValue="file"
            className="w-full"
            onValueChange={(value) => setActiveTab(value as "file" | "camera")}
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="file">Upload File</TabsTrigger>
              <TabsTrigger value="camera">Take Photo</TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="mt-0">
              <div className="flex flex-col items-center justify-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  className="hidden"
                />

                {!uploadedFile ? (
                  <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 w-full text-center cursor-pointer hover:border-teal-500 dark:hover:border-teal-500 transition-colors"
                    onClick={handleUploadClick}
                  >
                    <FilePlus className="w-10 h-10 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Supports: JPG, PNG, PDF (Max 10MB)</p>
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-teal-600 dark:text-teal-400" />
                        <span className="text-sm font-medium truncate max-w-[180px]">{uploadedFile.name}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={clearUploadedFile} className="h-8 w-8 p-0">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="mb-4">
                      <Label htmlFor="notes" className="text-sm font-medium mb-1 block">
                        Additional Notes (Optional)
                      </Label>
                      <textarea
                        id="notes"
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md min-h-[80px] text-sm"
                        placeholder="Add any notes about your prescription or questions you have"
                        value={prescriptionNotes}
                        onChange={(e) => setPrescriptionNotes(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="camera" className="mt-0">
              <div className="flex flex-col items-center justify-center">
                <input
                  type="file"
                  ref={cameraInputRef}
                  onChange={handleCameraCapture}
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                />

                {!uploadedFile ? (
                  <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 w-full text-center cursor-pointer hover:border-teal-500 dark:hover:border-teal-500 transition-colors"
                    onClick={handleUploadClick}
                  >
                    <Image className="w-10 h-10 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Click to take a photo of your prescription</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Make sure the text is clearly visible</p>
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4">
                      <div className="flex items-center">
                        <Image className="w-5 h-5 mr-2 text-teal-600 dark:text-teal-400" />
                        <span className="text-sm font-medium truncate max-w-[180px]">{uploadedFile.name}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={clearUploadedFile} className="h-8 w-8 p-0">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="mb-4">
                      <Label htmlFor="camera-notes" className="text-sm font-medium mb-1 block">
                        Additional Notes (Optional)
                      </Label>
                      <textarea
                        id="camera-notes"
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md min-h-[80px] text-sm"
                        placeholder="Add any notes about your prescription or questions you have"
                        value={prescriptionNotes}
                        onChange={(e) => setPrescriptionNotes(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {uploadError && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm mb-4">
              <div className="flex items-start">
                <X className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Error uploading prescription</p>
                  <p>{uploadError}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex items-center justify-between sm:justify-between">
            {uploadStatus === "uploading" && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-teal-500 border-t-transparent rounded-full"></div>
                Uploading to AI service...
              </div>
            )}

            {uploadStatus === "success" && (
              <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                <Check className="w-4 h-4 mr-2" />
                Upload successful!
              </div>
            )}

            {uploadStatus === "error" && (
              <div className="flex items-center text-sm text-red-600 dark:text-red-400">
                <X className="w-4 h-4 mr-2" />
                Upload failed. Please try again.
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setUploadDialogOpen(false)
                  setUploadedFile(null)
                  setUploadStatus("idle")
                  setPrescriptionNotes("")
                  setUploadError(null)
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUploadPrescription}
                disabled={!uploadedFile || uploadStatus === "uploading"}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {uploadStatus === "uploading" ? "Uploading..." : "Analyze with AI"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 p-4 text-center text-gray-600 dark:text-gray-400 text-sm">
        <p>Powered by CureConnect AI Technology. For emergencies, please call 911 or your local emergency number.</p>
      </footer>
    </div>
  )
}

export default AIChatbotComponent

