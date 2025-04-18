"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Shield, Video, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Header from "../components/header"
import Footer from "../components/footer"
import { toast } from "@/components/ui/use-toast"

interface ConsultationDetails {
  id: string
  password: string
  doctorName: string
  speciality: string
}

export default function DirectConsultationAccess({ consultation }: { consultation: ConsultationDetails }) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })
  }

  const handleJoinConsultation = () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to join the consultation",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate loading
    setTimeout(() => {
      // Navigate to the video conference room with the predefined credentials
      router.push(
        `/video-conference/room/${consultation.id}?name=${encodeURIComponent(name)}&password=${encodeURIComponent(
          consultation.password,
        )}`,
      )
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1 container mx-auto px-6 pt-24 pb-8">
        <div className="max-w-3xl mx-auto">
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-teal-600 text-white">
              <CardTitle className="text-2xl flex items-center">
                <Video className="w-6 h-6 mr-2" />
                Your Scheduled Consultation
              </CardTitle>
              <CardDescription className="text-teal-100">
                Join your video consultation with {consultation.doctorName}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-lg text-teal-700 dark:text-teal-300 mb-3">Consultation Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <User className="w-5 h-5 text-teal-600 mt-0.5 mr-2" />
                      <div>
                        <p className="font-medium">{consultation.doctorName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{consultation.speciality}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 text-teal-600 mt-0.5 mr-2" />
                      <div>
                        <p className="font-medium">{formatDate(currentTime)}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{formatTime(currentTime)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Consultation ID</label>
                    <div className="flex">
                      <Input value={consultation.id} readOnly className="bg-gray-50 dark:bg-gray-800" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Password</label>
                    <div className="flex">
                      <Input
                        type="password"
                        value={consultation.password}
                        readOnly
                        className="bg-gray-50 dark:bg-gray-800"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      This password will be automatically applied when you join the consultation.
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={handleJoinConsultation}
                      disabled={isLoading || !name.trim()}
                      className="w-full bg-teal-600 hover:bg-teal-700"
                    >
                      {isLoading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                          Joining...
                        </>
                      ) : (
                        "Join Consultation Now"
                      )}
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-teal-600 mt-0.5 mr-2" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p className="font-medium text-gray-900 dark:text-gray-200">Secure Connection</p>
                      <p>
                        Your consultation is protected with end-to-end encryption. Only you and your healthcare provider
                        can access this session.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-sm text-gray-600 dark:text-gray-400">
            <p>
              Having trouble? Contact support at{" "}
              <a href="mailto:support@cureconnect.com" className="text-teal-600 dark:text-teal-400">
                support@cureconnect.com
              </a>{" "}
              or call <span className="font-medium text-gray-900 dark:text-gray-200">1-800-CURE-HELP</span>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
