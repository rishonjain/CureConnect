"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MessageSquare,
  Users,
  MoreVertical,
  Settings,
  PresentationIcon as PresentationScreen,
  LayoutGrid,
  Hand,
  RepeatIcon as Record,
  Info,
  Copy,
  Maximize,
  Minimize,
  Pin,
  PinOff,
  MoreHorizontal,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import PresetAnswers from "./components/preset-answers"

// Mock participant data
const mockParticipants = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    isHost: true,
    isSpeaking: false,
    hasVideo: true,
    hasMic: true,
    isScreenSharing: false,
    isPinned: false,
  },
  {
    id: "2",
    name: "You",
    isHost: false,
    isSpeaking: false,
    hasVideo: true,
    hasMic: true,
    isScreenSharing: false,
    isPinned: false,
  },
]

// Mock chat messages
const initialChatMessages = [
  { id: "1", sender: "Dr. Sarah Johnson", content: "Hello! How are you feeling today?", time: "10:01 AM" },
]

interface MeetRoomProps {
  roomId: string
}

export default function MeetRoom({ roomId }: MeetRoomProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userName = searchParams.get("name") || "Guest"
  const initialCamera = searchParams.get("camera") === "true"
  const initialMic = searchParams.get("mic") === "true"

  const [micEnabled, setMicEnabled] = useState(initialMic)
  const [videoEnabled, setVideoEnabled] = useState(initialCamera)
  const [participants, setParticipants] = useState(mockParticipants)
  const [chatOpen, setChatOpen] = useState(false)
  const [participantsOpen, setParticipantsOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [chatMessages, setChatMessages] = useState(initialChatMessages)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [layout, setLayout] = useState<"grid" | "spotlight">("grid")
  const [isRaiseHand, setIsRaiseHand] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [pinnedParticipant, setPinnedParticipant] = useState<string | null>(null)
  const [showMobileControls, setShowMobileControls] = useState(true)

  const mainContainerRef = useRef<HTMLDivElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll chat to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  // Hide mobile controls after 3 seconds of inactivity
  useEffect(() => {
    if (showMobileControls) {
      const timer = setTimeout(() => {
        setShowMobileControls(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showMobileControls])

  // Toggle fullscreen
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      mainContainerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullScreen(true)
    } else {
      document.exitFullscreen()
      setIsFullScreen(false)
    }
  }

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const toggleMic = () => setMicEnabled(!micEnabled)
  const toggleVideo = () => setVideoEnabled(!videoEnabled)

  const endCall = () => {
    router.push("/meet")
  }

  const toggleChat = () => {
    setChatOpen(!chatOpen)
    if (chatOpen) {
      setParticipantsOpen(false)
      setInfoOpen(false)
    } else {
      setTimeout(() => {
        chatInputRef.current?.focus()
      }, 100)
    }
  }

  const toggleParticipants = () => {
    setParticipantsOpen(!participantsOpen)
    if (participantsOpen) {
      setChatOpen(false)
      setInfoOpen(false)
    }
  }

  const toggleInfo = () => {
    setInfoOpen(!infoOpen)
    if (infoOpen) {
      setChatOpen(false)
      setParticipantsOpen(false)
    }
  }

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      const now = new Date()
      const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

      setChatMessages([...chatMessages, { id: Date.now().toString(), sender: "You", content: message, time }])
      setMessage("")

      // Use preset answers instead of API calls
      setTimeout(
        () => {
          // Preset responses based on message content
          let response = ""
          const lowerCaseMessage = message.toLowerCase()

          if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
            response = "Hello! How can I help you today?"
          } else if (lowerCaseMessage.includes("pain") || lowerCaseMessage.includes("hurt")) {
            response =
              "I understand you're experiencing pain. Could you describe where it's located and how severe it is on a scale of 1-10?"
          } else if (lowerCaseMessage.includes("medication") || lowerCaseMessage.includes("medicine")) {
            response = "Have you been taking your prescribed medications regularly? Any side effects you've noticed?"
          } else if (lowerCaseMessage.includes("appointment") || lowerCaseMessage.includes("schedule")) {
            response = "I can schedule a follow-up appointment for you. Would next week work for your schedule?"
          } else if (lowerCaseMessage.includes("thank")) {
            response = "You're welcome! Is there anything else I can help you with today?"
          } else if (lowerCaseMessage.includes("symptom")) {
            response = "When did these symptoms first appear? Have they gotten better or worse since then?"
          } else if (lowerCaseMessage.includes("test") || lowerCaseMessage.includes("result")) {
            response =
              "I've reviewed your test results. Everything looks normal, but I'd like to discuss a few details."
          } else if (lowerCaseMessage.includes("prescription") || lowerCaseMessage.includes("refill")) {
            response =
              "I'll send a prescription refill to your pharmacy today. You should be able to pick it up tomorrow."
          } else {
            // Default responses if no keywords match
            const defaultResponses = [
              "I understand. Could you tell me more about that?",
              "That's important information. How long has this been happening?",
              "I see. Have you noticed any other changes recently?",
              "Thank you for sharing that. Let's discuss what steps we should take next.",
              "I'd like to follow up on that at our next appointment. In the meantime, please continue with your current treatment plan.",
            ]
            response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
          }

          const responseTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          setChatMessages((prev) => [
            ...prev,
            { id: Date.now().toString(), sender: "Dr. Sarah Johnson", content: response, time: responseTime },
          ])
        },
        1000 + Math.random() * 1000,
      ) // Random delay between 1-2 seconds for realistic typing simulation
    }
  }

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing)

    if (!isScreenSharing) {
      // Simulate screen sharing
      const updatedParticipants = participants.map((p) =>
        p.name === "You" ? { ...p, isScreenSharing: true } : { ...p, isScreenSharing: false },
      )
      setParticipants(updatedParticipants)
      setLayout("spotlight")
      setPinnedParticipant("2") // Pin yourself when screen sharing

      toast({
        title: "Screen sharing started",
        description: "You are now sharing your screen with all participants",
      })
    } else {
      // Stop screen sharing
      const updatedParticipants = participants.map((p) => ({ ...p, isScreenSharing: false }))
      setParticipants(updatedParticipants)
      setPinnedParticipant(null)
      setLayout("grid")

      toast({
        title: "Screen sharing stopped",
        description: "You have stopped sharing your screen",
      })
    }
  }

  const toggleRaiseHand = () => {
    setIsRaiseHand(!isRaiseHand)

    if (!isRaiseHand) {
      // Notify others that you raised your hand
      const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      setChatMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: "System", content: "You raised your hand", time: now },
      ])
    } else {
      // Notify others that you lowered your hand
      const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      setChatMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: "System", content: "You lowered your hand", time: now },
      ])
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)

    if (!isRecording) {
      // Start recording
      const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      setChatMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: "System", content: "Recording started", time: now },
      ])

      toast({
        title: "Recording started",
        description: "This meeting is now being recorded",
      })
    } else {
      // Stop recording
      const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      setChatMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: "System", content: "Recording stopped", time: now },
      ])

      toast({
        title: "Recording stopped",
        description: "The recording has been saved",
      })
    }
  }

  const togglePinParticipant = (participantId: string) => {
    if (pinnedParticipant === participantId) {
      setPinnedParticipant(null)
      setLayout("grid")
    } else {
      setPinnedParticipant(participantId)
      setLayout("spotlight")
    }
  }

  const copyMeetingInfo = () => {
    const meetingInfo = `CureConnect Meet\nMeeting code: ${roomId}\nJoin link: ${window.location.origin}/meet/room/${roomId}`
    navigator.clipboard.writeText(meetingInfo)

    toast({
      title: "Meeting info copied",
      description: "Meeting details have been copied to clipboard",
    })
  }

  const addParticipant = () => {
    // In a real app, this would open a dialog to invite people
    // For demo, we'll simulate adding a random participant
    const names = ["Alex Thompson", "Maria Garcia", "John Smith", "Emma Wilson"]
    const randomName = names[Math.floor(Math.random() * names.length)]

    const newParticipant = {
      id: Date.now().toString(),
      name: randomName,
      isHost: false,
      isSpeaking: false,
      hasVideo: Math.random() > 0.3,
      hasMic: true,
      isScreenSharing: false,
      isPinned: false,
    }

    setParticipants([...participants, newParticipant])

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    setChatMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: "System", content: `${randomName} joined the meeting`, time: now },
    ])
  }

  // Render participant video
  const renderParticipant = (participant: (typeof participants)[0], size: "large" | "small" = "large") => {
    const isYou = participant.name === "You"
    const isPinned = pinnedParticipant === participant.id
    const isSharing = participant.isScreenSharing

    return (
      <div
        className={`relative rounded-lg overflow-hidden ${
          size === "large" ? "aspect-video" : "aspect-video"
        } ${isPinned ? "border-2 border-teal-500" : ""}`}
      >
        {participant.hasVideo && !isSharing ? (
          <div className="w-full h-full bg-gray-900">
            <img
              src={`/placeholder.svg?height=${size === "large" ? 720 : 240}&width=${size === "large" ? 1280 : 320}`}
              alt={participant.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : isSharing ? (
          <div className="w-full h-full bg-white flex items-center justify-center">
            <div className="text-center">
              <PresentationScreen className="w-12 h-12 mx-auto mb-2 text-gray-600" />
              <p className="text-gray-800 font-medium">{participant.name}'s screen</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <div
              className={`${size === "large" ? "w-24 h-24" : "w-12 h-12"} rounded-full bg-gray-700 flex items-center justify-center`}
            >
              <span className={`${size === "large" ? "text-4xl" : "text-xl"} font-bold text-white`}>
                {participant.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Participant info overlay */}
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
          <div className="bg-black/60 text-white px-2 py-1 rounded-md text-sm flex items-center">
            {participant.isSpeaking && <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>}
            <span>
              {participant.name}
              {isYou ? " (You)" : ""}
            </span>
            {participant.isHost && <span className="ml-1 text-xs">(Host)</span>}
          </div>

          <div className="flex space-x-1">
            {!participant.hasMic && (
              <div className="bg-red-500/80 p-1 rounded-full">
                <MicOff className="w-3 h-3 text-white" />
              </div>
            )}

            {isRaiseHand && isYou && (
              <div className="bg-yellow-500/80 p-1 rounded-full">
                <Hand className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Pin/unpin button */}
        {size === "large" && (
          <button
            className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity"
            onClick={() => togglePinParticipant(participant.id)}
          >
            {isPinned ? <PinOff className="w-4 h-4 text-white" /> : <Pin className="w-4 h-4 text-white" />}
          </button>
        )}
      </div>
    )
  }

  return (
    <div
      ref={mainContainerRef}
      className="h-screen w-screen overflow-hidden bg-gray-100 dark:bg-gray-900 flex flex-col"
      onClick={() => setShowMobileControls(true)}
    >
      {/* Main content area */}
      <div className="flex-1 flex relative">
        {/* Main video grid */}
        <div className="flex-1 p-4 overflow-hidden">
          {layout === "grid" ? (
            <div
              className={`grid gap-4 h-full ${
                participants.length <= 1
                  ? "grid-cols-1"
                  : participants.length <= 4
                    ? "grid-cols-2"
                    : participants.length <= 9
                      ? "grid-cols-3"
                      : "grid-cols-4"
              }`}
            >
              {participants.map((participant) => (
                <div key={participant.id}>{renderParticipant(participant, "large")}</div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Spotlight view */}
              <div className="flex-1 mb-4">
                {renderParticipant(
                  participants.find((p) => p.id === pinnedParticipant) ||
                    participants.find((p) => p.isScreenSharing) ||
                    participants[0],
                  "large",
                )}
              </div>

              {/* Thumbnails */}
              <div className="h-24 flex space-x-4 overflow-x-auto pb-2">
                {participants
                  .filter((p) => p.id !== pinnedParticipant && !p.isScreenSharing)
                  .map((participant) => (
                    <div key={participant.id} className="w-32 flex-shrink-0">
                      {renderParticipant(participant, "small")}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Side panel (chat, participants, or info) */}
        {(chatOpen || participantsOpen || infoOpen) && (
          <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
            {/* Panel header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <Tabs defaultValue={chatOpen ? "chat" : participantsOpen ? "people" : "info"} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger
                    value="chat"
                    onClick={() => {
                      setChatOpen(true)
                      setParticipantsOpen(false)
                      setInfoOpen(false)
                    }}
                  >
                    Chat
                  </TabsTrigger>
                  <TabsTrigger
                    value="people"
                    onClick={() => {
                      setParticipantsOpen(true)
                      setChatOpen(false)
                      setInfoOpen(false)
                    }}
                  >
                    People
                  </TabsTrigger>
                  <TabsTrigger
                    value="info"
                    onClick={() => {
                      setInfoOpen(true)
                      setChatOpen(false)
                      setParticipantsOpen(false)
                    }}
                  >
                    Info
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="h-[calc(100vh-8rem)] flex flex-col">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        <strong>Demo Mode:</strong> This chat uses preset responses instead of API calls. Try asking
                        about symptoms, medications, or appointments.
                      </p>
                    </div>
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === "You" ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg px-3 py-2 ${
                            msg.sender === "System"
                              ? "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                              : msg.sender === "You"
                                ? "bg-teal-600 text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {msg.sender !== "System" && msg.sender !== "You" && (
                            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">
                              {msg.sender}
                            </div>
                          )}
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">{msg.time}</span>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                    <PresetAnswers
                      onSelectPreset={(preset) => {
                        setMessage(preset)
                        chatInputRef.current?.focus()
                      }}
                    />
                  </div>

                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <form onSubmit={sendMessage} className="flex">
                      <Input
                        ref={chatInputRef}
                        type="text"
                        placeholder="Send a message to everyone"
                        className="flex-1 mr-2"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <Button type="submit" disabled={!message.trim()}>
                        Send
                      </Button>
                    </form>
                  </div>
                </TabsContent>

                <TabsContent value="people" className="h-[calc(100vh-8rem)] flex flex-col">
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">In this meeting ({participants.length})</h3>
                      <Button variant="outline" size="sm" onClick={addParticipant}>
                        <UserPlus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {participants.map((participant) => (
                        <div
                          key={participant.id}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-3">
                              <span className="font-medium text-gray-800 dark:text-gray-200">
                                {participant.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">
                                {participant.name}
                                {participant.name === "You" ? " (You)" : ""}
                              </p>
                              {participant.isHost && <p className="text-xs text-gray-500">Meeting host</p>}
                            </div>
                          </div>

                          <div className="flex items-center space-x-1">
                            {!participant.hasMic && <MicOff className="w-4 h-4 text-gray-500" />}
                            {!participant.hasVideo && <VideoOff className="w-4 h-4 text-gray-500" />}
                            {participant.isScreenSharing && <PresentationScreen className="w-4 h-4 text-teal-500" />}

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => togglePinParticipant(participant.id)}>
                                  {pinnedParticipant === participant.id ? "Unpin" : "Pin"}
                                </DropdownMenuItem>
                                {participant.name !== "You" && <DropdownMenuItem>Mute</DropdownMenuItem>}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="info" className="p-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Meeting details</h3>
                      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Meeting code</span>
                          <Button variant="ghost" size="sm" className="h-6 p-0" onClick={copyMeetingInfo}>
                            <Copy className="w-3.5 h-3.5 mr-1" />
                            <span className="text-xs">Copy</span>
                          </Button>
                        </div>
                        <p className="font-mono text-sm">{roomId}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Join info</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Share this meeting code with others you want to join the meeting
                      </p>
                      <div className="flex">
                        <Input
                          value={`${window.location.origin}/meet/room/${roomId}`}
                          readOnly
                          className="flex-1 text-xs"
                        />
                        <Button variant="outline" size="sm" className="ml-2" onClick={copyMeetingInfo}>
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>

      {/* Control bar */}
      <div
        className={`bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ${
          showMobileControls ? "translate-y-0" : "translate-y-full md:translate-y-0"
        }`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">
                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>

              <div className="h-6 border-l border-gray-300 dark:border-gray-600 mx-2 hidden md:block"></div>

              <div className="text-sm font-medium hidden md:block">{roomId}</div>
            </div>

            <div className="flex items-center justify-center space-x-2 md:space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleMic}
                      className={`rounded-full w-10 h-10 md:w-12 md:h-12 ${
                        micEnabled
                          ? "bg-white dark:bg-gray-800"
                          : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                      }`}
                    >
                      {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{micEnabled ? "Turn off microphone" : "Turn on microphone"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleVideo}
                      className={`rounded-full w-10 h-10 md:w-12 md:h-12 ${
                        videoEnabled
                          ? "bg-white dark:bg-gray-800"
                          : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                      }`}
                    >
                      {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{videoEnabled ? "Turn off camera" : "Turn on camera"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleScreenShare}
                      className={`rounded-full w-10 h-10 md:w-12 md:h-12 ${
                        isScreenSharing ? "bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-400" : ""
                      }`}
                    >
                      <PresentationScreen className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isScreenSharing ? "Stop presenting" : "Present now"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={endCall}
                      className="rounded-full w-10 h-10 md:w-12 md:h-12 bg-red-600 hover:bg-red-700"
                    >
                      <PhoneOff className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Leave meeting</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="hidden md:block h-10 border-l border-gray-300 dark:border-gray-600 mx-2"></div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleRaiseHand}
                      className={`rounded-full w-10 h-10 md:w-12 md:h-12 ${
                        isRaiseHand ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400" : ""
                      } hidden md:flex`}
                    >
                      <Hand className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isRaiseHand ? "Lower hand" : "Raise hand"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleChat}
                      className={`rounded-full w-10 h-10 md:w-12 md:h-12 ${
                        chatOpen ? "bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-400" : ""
                      }`}
                    >
                      <MessageSquare className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Chat with everyone</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleParticipants}
                      className={`rounded-full w-10 h-10 md:w-12 md:h-12 ${
                        participantsOpen ? "bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-400" : ""
                      }`}
                    >
                      <Users className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Show everyone</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenu>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full w-10 h-10 md:w-12 md:h-12">
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>More options</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={toggleInfo}>
                    <Info className="w-4 h-4 mr-2" />
                    Meeting details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleFullScreen}>
                    {isFullScreen ? (
                      <>
                        <Minimize className="w-4 h-4 mr-2" />
                        Exit full screen
                      </>
                    ) : (
                      <>
                        <Maximize className="w-4 h-4 mr-2" />
                        Full screen
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLayout(layout === "grid" ? "spotlight" : "grid")}>
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    Change layout
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleRecording} className="relative">
                    <Record className="w-4 h-4 mr-2" />
                    {isRecording ? "Stop recording" : "Start recording"}
                    {isRecording && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowSettings(true)}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="hidden md:block">
              <Button variant="ghost" size="sm" onClick={toggleInfo}>
                <Info className="w-4 h-4 mr-2" />
                Meeting details
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Meeting Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Audio Settings</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm">Microphone</span>
                <select className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm">
                  <option>Default Microphone</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Speaker</span>
                <select className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm">
                  <option>Default Speaker</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Video Settings</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm">Camera</span>
                <select className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm">
                  <option>Default Camera</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Video Quality</span>
                <select className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm">
                  <option>High Definition (HD)</option>
                  <option>Standard Definition (SD)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Meeting</h3>
              <div className="flex items-center">
                <input type="checkbox" id="muteOnEntry" className="mr-2" />
                <label htmlFor="muteOnEntry" className="text-sm">
                  Mute participants when they join
                </label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="autoRecord" className="mr-2" />
                <label htmlFor="autoRecord" className="text-sm">
                  Automatically record meetings
                </label>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
