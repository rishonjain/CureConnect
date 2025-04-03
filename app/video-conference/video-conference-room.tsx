"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MessageSquare,
  Users,
  MoreVertical,
  Share,
  Settings,
  Shield,
  Copy,
  X,
  Maximize,
  Minimize,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

// Mock participant data
const mockParticipants = [
  { id: "1", name: "Dr. Sarah Johnson", isDoctor: true },
  { id: "2", name: "Patient", isDoctor: false },
]

// Additional participants that can join later
const additionalParticipants = [
  { id: "3", name: "Dr. Michael Chen", isDoctor: true },
  { id: "4", name: "Nurse Williams", isDoctor: false },
]

interface VideoConferenceRoomProps {
  roomId: string
}

export default function VideoConferenceRoom({ roomId }: VideoConferenceRoomProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userName = searchParams.get("name") || "Guest"
  const password = searchParams.get("password")

  const [micEnabled, setMicEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [participants, setParticipants] = useState(mockParticipants)
  const [chatOpen, setChatOpen] = useState(false)
  const [participantsOpen, setParticipantsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<{ sender: string; text: string; time: string }[]>([])
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)
  const [enteredPassword, setEnteredPassword] = useState("")
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(!password)
  const [isLoading, setIsLoading] = useState(true)

  const mainVideoRef = useRef<HTMLVideoElement>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)

  // Simulate video streams with static images
  useEffect(() => {
    // Simulate loading and connection time
    const timer = setTimeout(() => {
      setIsLoading(false)

      // If password is required, show prompt
      if (password && !isPasswordCorrect) {
        setShowPasswordPrompt(true)
      }

      // Set up mock video streams
      if (localVideoRef.current) {
        localVideoRef.current.poster = "/placeholder.svg?height=120&width=160"
      }

      if (mainVideoRef.current) {
        mainVideoRef.current.poster = "/placeholder.svg?height=720&width=1280"
      }

      // Simulate a message after 3 seconds
      setTimeout(() => {
        handleNewMessage("Dr. Sarah Johnson", "Hello! How are you feeling today?")
      }, 3000)

      // Simulate another participant joining after 5 seconds
      setTimeout(() => {
        if (Math.random() > 0.5) {
          const newParticipant = additionalParticipants[0]
          setParticipants((prev) => [...prev, newParticipant])
          handleNewMessage("System", `${newParticipant.name} has joined the consultation`)
        }
      }, 5000)
    }, 2000)

    return () => clearTimeout(timer)
  }, [password, isPasswordCorrect])

  const toggleMic = () => setMicEnabled(!micEnabled)
  const toggleVideo = () => setVideoEnabled(!videoEnabled)

  const endCall = () => {
    router.push("/video-conference")
  }

  const toggleChat = () => {
    setChatOpen(!chatOpen)
    if (participantsOpen) setParticipantsOpen(false)
  }

  const toggleParticipants = () => {
    setParticipantsOpen(!participantsOpen)
    if (chatOpen) setChatOpen(false)
  }

  const handleNewMessage = (sender: string, text: string) => {
    const now = new Date()
    const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`
    setMessages((prev) => [...prev, { sender, text, time }])
  }

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      handleNewMessage(userName, message)
      setMessage("")

      // Simulate doctor response after a short delay
      if (Math.random() > 0.3) {
        setTimeout(
          () => {
            const responses = [
              "I understand. Could you tell me more about your symptoms?",
              "Have you been taking the prescribed medication regularly?",
              "That's good to hear. Let's discuss your progress.",
              "I'll send a new prescription to your pharmacy. You should be able to pick it up today.",
              "Let's schedule a follow-up appointment in two weeks to check your progress.",
            ]
            const randomResponse = responses[Math.floor(Math.random() * responses.length)]
            handleNewMessage("Dr. Sarah Johnson", randomResponse)
          },
          1500 + Math.random() * 2000,
        )
      }
    }
  }

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  const copyMeetingId = () => {
    navigator.clipboard.writeText(roomId)
    toast({
      title: "Meeting ID copied",
      description: "The meeting ID has been copied to your clipboard.",
    })
  }

  const checkPassword = () => {
    if (enteredPassword === password) {
      setIsPasswordCorrect(true)
      setShowPasswordPrompt(false)
    } else {
      toast({
        title: "Incorrect password",
        description: "The password you entered is incorrect. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-teal-500 border-r-2 border-teal-500 border-b-2 border-transparent mb-4"></div>
          <h2 className="text-xl text-white font-medium">Connecting to your consultation...</h2>
          <p className="text-gray-400 mt-2">Setting up secure connection</p>
        </div>
      </div>
    )
  }

  if (showPasswordPrompt) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center mb-6">
            <Shield className="w-12 h-12 text-teal-500 mx-auto mb-4" />
            <h2 className="text-2xl text-white font-bold">Password Protected</h2>
            <p className="text-gray-400 mt-2">This consultation requires a password to join</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Enter Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && checkPassword()}
              />
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" className="w-1/2" onClick={() => router.push("/video-conference")}>
                Cancel
              </Button>
              <Button className="w-1/2 bg-teal-600 hover:bg-teal-700" onClick={checkPassword}>
                Join Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`h-screen w-screen overflow-hidden bg-gray-900 flex flex-col ${isFullScreen ? "fixed inset-0 z-50" : ""}`}
    >
      {/* Main content area */}
      <div className="flex-1 flex relative">
        {/* Main video */}
        <div className="flex-1 relative">
          <video
            ref={mainVideoRef}
            className="w-full h-full object-cover"
            poster="/placeholder.svg?height=720&width=1280"
            muted
            playsInline
          />

          {/* Participant name overlay */}
          <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-md text-sm">
            Dr. Sarah Johnson
          </div>

          {/* Local video (picture-in-picture) */}
          <div className="absolute bottom-4 right-4 w-40 h-30 rounded-lg overflow-hidden border-2 border-white shadow-lg">
            <video
              ref={localVideoRef}
              className={`w-full h-full object-cover ${videoEnabled ? "" : "hidden"}`}
              poster="/placeholder.svg?height=120&width=160"
              muted
              playsInline
            />
            {!videoEnabled && (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-xl font-bold text-white">
                  {userName.charAt(0)}
                </div>
              </div>
            )}
            <div className="absolute bottom-1 left-1 right-1 text-center bg-black/50 text-white text-xs py-0.5 rounded">
              {userName} (You)
            </div>
          </div>
        </div>

        {/* Side panel (chat or participants) */}
        <AnimatePresence>
          {(chatOpen || participantsOpen) && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gray-800 border-l border-gray-700 flex flex-col"
            >
              {/* Panel header */}
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-white font-medium flex items-center">
                  {chatOpen && (
                    <>
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Chat
                    </>
                  )}
                  {participantsOpen && (
                    <>
                      <Users className="w-5 h-5 mr-2" />
                      Participants ({participants.length})
                    </>
                  )}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => (chatOpen ? setChatOpen(false) : setParticipantsOpen(false))}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Panel content */}
              <div className="flex-1 overflow-y-auto p-4">
                {chatOpen && (
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex flex-col ${msg.sender === userName ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg px-3 py-2 ${
                            msg.sender === "System"
                              ? "bg-gray-700 text-gray-300"
                              : msg.sender === userName
                                ? "bg-teal-600 text-white"
                                : "bg-gray-700 text-white"
                          }`}
                        >
                          {msg.sender !== "System" && msg.sender !== userName && (
                            <div className="text-xs text-teal-300 font-medium mb-1">{msg.sender}</div>
                          )}
                          <p className="text-sm">{msg.text}</p>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">{msg.time}</span>
                      </div>
                    ))}
                    {messages.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No messages yet</p>
                        <p className="text-sm mt-1">Start the conversation!</p>
                      </div>
                    )}
                  </div>
                )}

                {participantsOpen && (
                  <div className="space-y-2">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center p-2 rounded-md hover:bg-gray-700">
                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mr-3 text-sm font-medium text-white">
                          {participant.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{participant.name}</p>
                          <p className="text-xs text-gray-400">
                            {participant.isDoctor ? "Healthcare Provider" : "Patient"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Chat input */}
              {chatOpen && (
                <div className="p-4 border-t border-gray-700">
                  <form onSubmit={sendMessage} className="flex">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-l-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <Button
                      type="submit"
                      className="rounded-l-none bg-teal-600 hover:bg-teal-700"
                      disabled={!message.trim()}
                    >
                      Send
                    </Button>
                  </form>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control bar */}
      <div className="h-20 bg-gray-800 border-t border-gray-700 flex items-center justify-between px-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={copyMeetingId} className="text-gray-300 hover:text-white">
            <Copy className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Copy ID: {roomId.substring(0, 6)}...</span>
            <span className="sm:hidden">Copy ID</span>
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleFullScreen}
                  className="text-gray-300 hover:text-white"
                >
                  {isFullScreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isFullScreen ? "Exit full screen" : "Enter full screen"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center space-x-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleMic}
                  className={`rounded-full w-12 h-12 ${micEnabled ? "bg-gray-700" : "bg-red-500 hover:bg-red-600"}`}
                >
                  {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{micEnabled ? "Mute microphone" : "Unmute microphone"}</p>
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
                  className={`rounded-full w-12 h-12 ${videoEnabled ? "bg-gray-700" : "bg-red-500 hover:bg-red-600"}`}
                >
                  {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{videoEnabled ? "Turn off camera" : "Turn on camera"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            variant="destructive"
            size="icon"
            onClick={endCall}
            className="rounded-full w-12 h-12 bg-red-600 hover:bg-red-700"
          >
            <PhoneOff className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleChat}
                  className={`w-10 h-10 ${chatOpen ? "bg-teal-600 text-white" : "text-gray-300 hover:text-white"}`}
                >
                  <MessageSquare className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Chat</p>
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
                  className={`w-10 h-10 ${participantsOpen ? "bg-teal-600 text-white" : "text-gray-300 hover:text-white"}`}
                >
                  <Users className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Participants</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="w-10 h-10 text-gray-300 hover:text-white">
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
              <DropdownMenuItem
                onClick={() =>
                  toast({
                    title: "Feature not available",
                    description: "Screen sharing is not available in this demo.",
                  })
                }
              >
                <Share className="w-4 h-4 mr-2" />
                Share screen
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowSettings(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Settings dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Consultation Settings</DialogTitle>
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
              <h3 className="text-sm font-medium">Connection</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm">Network Status</span>
                <span className="text-sm text-green-500 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  Excellent
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

