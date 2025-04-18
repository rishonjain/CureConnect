"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Camera, CameraOff, Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"

export default function MeetJoinScreen() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [meetingCode, setMeetingCode] = useState("")
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [micEnabled, setMicEnabled] = useState(true)
  const [isJoining, setIsJoining] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Simulate camera preview
  useEffect(() => {
    if (videoRef.current) {
      if (cameraEnabled) {
        // In a real implementation, this would use getUserMedia
        // For demo, we'll use a placeholder
        videoRef.current.poster = "/placeholder.svg?height=480&width=640"
        videoRef.current.load()
      } else {
        videoRef.current.poster = ""
      }
    }
  }, [cameraEnabled])

  const handleCreateMeeting = () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to create a meeting",
        variant: "destructive",
      })
      return
    }

    setIsJoining(true)

    // Generate a random meeting code
    const generatedCode = Math.random().toString(36).substring(2, 8)

    // Simulate API call delay
    setTimeout(() => {
      router.push(
        `/meet/room/${generatedCode}?name=${encodeURIComponent(name)}&camera=${cameraEnabled}&mic=${micEnabled}`,
      )
    }, 1500)
  }

  const handleJoinMeeting = () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to join a meeting",
        variant: "destructive",
      })
      return
    }

    if (!meetingCode.trim()) {
      toast({
        title: "Meeting code required",
        description: "Please enter a meeting code to join",
        variant: "destructive",
      })
      return
    }

    setIsJoining(true)

    // Simulate API call delay
    setTimeout(() => {
      router.push(
        `/meet/room/${meetingCode}?name=${encodeURIComponent(name)}&camera=${cameraEnabled}&mic=${micEnabled}`,
      )
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-4 px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-semibold text-teal-600 dark:text-teal-500">CureConnect Meet</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col md:flex-row">
        {/* Left side - Camera preview */}
        <div className="w-full md:w-2/3 p-6 md:p-12 flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-video relative bg-gray-900 flex items-center justify-center">
                {cameraEnabled ? (
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    poster="/placeholder.svg?height=480&width=640"
                    autoPlay
                    playsInline
                    muted
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">{name ? name.charAt(0).toUpperCase() : "?"}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 flex justify-center space-x-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className={`rounded-full w-12 h-12 ${
                          micEnabled
                            ? "bg-white dark:bg-gray-800"
                            : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                        }`}
                        onClick={() => setMicEnabled(!micEnabled)}
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
                        className={`rounded-full w-12 h-12 ${
                          cameraEnabled
                            ? "bg-white dark:bg-gray-800"
                            : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                        }`}
                        onClick={() => setCameraEnabled(!cameraEnabled)}
                      >
                        {cameraEnabled ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{cameraEnabled ? "Turn off camera" : "Turn on camera"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
          <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium">Demo Mode Active</p>
            <p>This is a demonstration with preset responses. No actual API calls will be made.</p>
          </div>
        </div>

        {/* Right side - Join options */}
        <div className="w-full md:w-1/3 p-6 md:p-12 bg-white dark:bg-gray-800 md:border-l border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-2xl font-semibold mb-6">Video Consultation</h1>

            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Your Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full"
              />
            </div>

            <Tabs defaultValue="join" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="join">Join a meeting</TabsTrigger>
                <TabsTrigger value="new">New meeting</TabsTrigger>
              </TabsList>

              <TabsContent value="join" className="space-y-6">
                <div>
                  <label htmlFor="meetingCode" className="block text-sm font-medium mb-2">
                    Meeting Code
                  </label>
                  <div className="flex">
                    <Input
                      id="meetingCode"
                      value={meetingCode}
                      onChange={(e) => setMeetingCode(e.target.value)}
                      placeholder="Enter meeting code"
                      className="flex-1"
                    />
                  </div>
                </div>

                <Button
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                  onClick={handleJoinMeeting}
                  disabled={isJoining}
                >
                  {isJoining ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                      Joining...
                    </>
                  ) : (
                    "Join meeting"
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="new" className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm">Create a new meeting and share the code with others to join.</p>
                </div>

                <Button
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                  onClick={handleCreateMeeting}
                  disabled={isJoining}
                >
                  {isJoining ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                      Creating...
                    </>
                  ) : (
                    "Create new meeting"
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
