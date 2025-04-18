"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Video, Calendar, Clock, Shield, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import Header from "../components/header"
import Footer from "../components/footer"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// Define doctor specialties
const specialties = [
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Radiology",
  "Gastroenterology",
]

// Define mock doctors data
const doctors = [
  {
    id: "dr-sarah-johnson",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    experience: "15 years",
    rating: 4.9,
    reviews: 127,
    nextAvailable: "Today, 3:30 PM",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "dr-michael-chen",
    name: "Dr. Michael Chen",
    specialty: "Neurology",
    experience: "12 years",
    rating: 4.8,
    reviews: 98,
    nextAvailable: "Tomorrow, 10:00 AM",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "dr-amelia-patel",
    name: "Dr. Amelia Patel",
    specialty: "Dermatology",
    experience: "8 years",
    rating: 4.7,
    reviews: 156,
    nextAvailable: "Today, 5:15 PM",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "dr-james-wilson",
    name: "Dr. James Wilson",
    specialty: "Orthopedics",
    experience: "20 years",
    rating: 4.9,
    reviews: 203,
    nextAvailable: "In 2 days, 1:00 PM",
    image: "/placeholder.svg?height=80&width=80",
  },
]

export default function VideoConferenceLanding() {
  const router = useRouter()
  const [meetingId, setMeetingId] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [mobile, setMobile] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null)
  const [selectedDoctor, setSelectedDoctor] = useState<(typeof doctors)[0] | null>(null)
  const [appointmentDate, setAppointmentDate] = useState("")
  const [appointmentTime, setAppointmentTime] = useState("")
  const [consultationReason, setConsultationReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmationDetails, setConfirmationDetails] = useState<{
    consultationId: string
    password: string
    doctorName: string
    date: string
    time: string
  } | null>(null)

  const handleJoinMeeting = (e: React.FormEvent) => {
    e.preventDefault()
    if (meetingId && name) {
      router.push(
        `/video-conference/room/${meetingId}?name=${encodeURIComponent(name)}${password ? `&password=${encodeURIComponent(password)}` : ""}`,
      )
    }
  }

  const handleRequestConsultation = () => {
    if (!selectedDoctor) return

    setIsLoading(true)

    // Simulate API delay
    setTimeout(() => {
      // Generate a random meeting ID and password
      const consultationId = Math.random().toString(36).substring(2, 10)
      const password = Math.random().toString(36).substring(2, 8)

      // Set confirmation details to show in dialog
      setConfirmationDetails({
        consultationId,
        password,
        doctorName: selectedDoctor.name,
        date: appointmentDate,
        time: appointmentTime,
      })

      // Show confirmation dialog
      setShowConfirmation(true)

      toast({
        title: "Consultation Requested",
        description: `Your consultation with ${selectedDoctor.name} has been scheduled. Meeting details have been sent to ${email}.`,
      })

      // Reset form
      resetForm()
      setIsLoading(false)
    }, 1500) // Simulate network delay
  }

  // This function simulates sending an email (for demonstration purposes only)
  const simulateEmailSending = () => {
    console.log(`
      ===== SIMULATED EMAIL =====
      To: ${email}
      Subject: Your CureConnect Video Consultation Details
      
      Dear ${name},
      
      Your video consultation with ${selectedDoctor?.name} has been scheduled.
      
      Consultation Details:
      - Doctor: ${selectedDoctor?.name} (${selectedDoctor?.specialty})
      - Date: ${appointmentDate}
      - Time: ${appointmentTime}
      
      Meeting Access Information:
      - Consultation ID: ${confirmationDetails?.consultationId}
      - Password: ${confirmationDetails?.password}
      
      Please join the consultation 5 minutes before the scheduled time.
      
      Best regards,
      The CureConnect Team
      ========================
    `)
  }

  // Simulate sending email when confirmation dialog is shown
  if (showConfirmation && confirmationDetails) {
    simulateEmailSending()
  }

  const resetForm = () => {
    setSelectedDoctor(null)
    setAppointmentDate("")
    setAppointmentTime("")
    setConsultationReason("")
    setEmail("")
    setMobile("")
    setName("")
  }

  const filteredDoctors = doctors.filter((doctor) => {
    // Filter by selected specialty if any
    if (selectedSpecialty && doctor.specialty !== selectedSpecialty) {
      return false
    }
    return true
  })

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Header />

      <main className="flex-1 container mx-auto px-6 pt-16 pb-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            CureConnect <span className="text-teal-600 dark:text-teal-400">Video Consultations</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-3">
            Connect with healthcare professionals through secure video consultations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <Card className="border-0 shadow-md overflow-hidden">
            <CardContent className="p-0">
              <Tabs defaultValue="join" className="w-full">
                <TabsList className="grid w-full grid-cols-2 rounded-none">
                  <TabsTrigger value="join" className="rounded-none py-3">
                    Join Consultation
                  </TabsTrigger>
                  <TabsTrigger value="request" className="rounded-none py-3">
                    Request Consultation
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="join" className="p-6">
                  <form onSubmit={handleJoinMeeting} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="joinName">Your Name</Label>
                      <Input
                        id="joinName"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="meetingId">Consultation ID</Label>
                      <Input
                        id="meetingId"
                        placeholder="Enter consultation ID"
                        value={meetingId}
                        onChange={(e) => setMeetingId(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password (if required)</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
                      Join Consultation
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="request" className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="specialty">Select Specialty</Label>
                        <select
                          id="specialty"
                          className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md"
                          value={selectedSpecialty || ""}
                          onChange={(e) => setSelectedSpecialty(e.target.value || null)}
                        >
                          <option value="">All Specialties</option>
                          {specialties.map((specialty) => (
                            <option key={specialty} value={specialty}>
                              {specialty}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label>Select Doctor</Label>
                        <div className="grid grid-cols-1 gap-3 mt-1 max-h-[200px] overflow-y-auto pr-1">
                          {filteredDoctors.map((doctor) => (
                            <div
                              key={doctor.id}
                              className={`flex items-center p-3 border rounded-md cursor-pointer ${
                                selectedDoctor?.id === doctor.id
                                  ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                                  : "border-gray-200 dark:border-gray-700 hover:border-teal-300"
                              }`}
                              onClick={() => setSelectedDoctor(doctor)}
                            >
                              <img
                                src={doctor.image || "/placeholder.svg"}
                                alt={doctor.name}
                                className="w-12 h-12 rounded-full object-cover mr-3"
                              />
                              <div className="flex-1">
                                <h3 className="font-medium">{doctor.name}</h3>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <span>{doctor.specialty}</span>
                                  <span className="mx-2">•</span>
                                  <span>{doctor.experience}</span>
                                </div>
                              </div>
                              <div className="text-right text-sm">
                                <div className="flex items-center justify-end text-yellow-500">
                                  <span>★</span>
                                  <span className="ml-1">{doctor.rating}</span>
                                </div>
                                <div className="text-gray-500 dark:text-gray-400">{doctor.nextAvailable}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {selectedDoctor && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="date">Date</Label>
                              <Input
                                id="date"
                                type="date"
                                value={appointmentDate}
                                onChange={(e) => setAppointmentDate(e.target.value)}
                                min={new Date().toISOString().split("T")[0]}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="time">Time</Label>
                              <select
                                id="time"
                                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md"
                                value={appointmentTime}
                                onChange={(e) => setAppointmentTime(e.target.value)}
                                required
                              >
                                <option value="">Select a time</option>
                                <option value="9:00 AM">9:00 AM</option>
                                <option value="10:00 AM">10:00 AM</option>
                                <option value="11:00 AM">11:00 AM</option>
                                <option value="1:00 PM">1:00 PM</option>
                                <option value="2:00 PM">2:00 PM</option>
                                <option value="3:00 PM">3:00 PM</option>
                                <option value="4:00 PM">4:00 PM</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Your Name</Label>
                              <Input
                                id="name"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email Address</Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="mobile">Mobile Number</Label>
                            <Input
                              id="mobile"
                              type="tel"
                              placeholder="(123) 456-7890"
                              value={mobile}
                              onChange={(e) => setMobile(e.target.value)}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="reason">Reason for Consultation</Label>
                            <textarea
                              id="reason"
                              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md min-h-[80px]"
                              placeholder="Briefly describe your symptoms or reason for the consultation"
                              value={consultationReason}
                              onChange={(e) => setConsultationReason(e.target.value)}
                              required
                            />
                          </div>

                          <Button
                            onClick={handleRequestConsultation}
                            disabled={
                              isLoading ||
                              !name ||
                              !email ||
                              !mobile ||
                              !appointmentDate ||
                              !appointmentTime ||
                              !consultationReason
                            }
                            className="w-full bg-teal-600 hover:bg-teal-700"
                          >
                            {isLoading ? (
                              <>
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                                Processing...
                              </>
                            ) : (
                              "Request Consultation"
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className="border-0 shadow-md bg-teal-600 text-white">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Healthcare at your fingertips</h2>
                <p className="mb-6">
                  Our video consultation platform connects you with healthcare professionals instantly. No waiting
                  rooms, no travel time – just quality healthcare when you need it.
                </p>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-white/20 p-3 rounded-full mb-2">
                      <Video className="w-5 h-5" />
                    </div>
                    <h3 className="font-medium text-sm">Expert Doctors</h3>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-white/20 p-3 rounded-full mb-2">
                      <Shield className="w-5 h-5" />
                    </div>
                    <h3 className="font-medium text-sm">Secure & Private</h3>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-white/20 p-3 rounded-full mb-2">
                      <Clock className="w-5 h-5" />
                    </div>
                    <h3 className="font-medium text-sm">24/7 Availability</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-teal-600" />
                  How It Works
                </h3>
                <ol className="space-y-3 list-decimal pl-5">
                  <li className="text-gray-700 dark:text-gray-300">Choose a specialist and request a consultation</li>
                  <li className="text-gray-700 dark:text-gray-300">Receive confirmation with your consultation ID</li>
                  <li className="text-gray-700 dark:text-gray-300">
                    Join at the scheduled time using the consultation ID
                  </li>
                  <li className="text-gray-700 dark:text-gray-300">
                    Connect with your healthcare provider via secure video
                  </li>
                </ol>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              {specialties.slice(0, 6).map((specialty) => (
                <Button
                  key={specialty}
                  variant="outline"
                  className={`justify-start h-auto py-2 ${
                    selectedSpecialty === specialty
                      ? "bg-teal-50 dark:bg-teal-900/30 border-teal-500 text-teal-700 dark:text-teal-300"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedSpecialty(specialty)
                    const tabsList = document.querySelector('[value="request"]') as HTMLButtonElement
                    if (tabsList) tabsList.click()
                  }}
                >
                  {specialty}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Consultation Requested Successfully</DialogTitle>
            <DialogDescription>
              Your consultation has been scheduled. A confirmation email has been sent to {email}.
            </DialogDescription>
          </DialogHeader>

          {confirmationDetails && (
            <div className="space-y-4 py-4">
              <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-teal-700 dark:text-teal-300 mb-2">Consultation Details</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Doctor:</span>
                    <span className="font-medium">{confirmationDetails.doctorName}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Date:</span>
                    <span className="font-medium">{confirmationDetails.date}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Time:</span>
                    <span className="font-medium">{confirmationDetails.time}</span>
                  </li>
                </ul>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Meeting Access Information</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Consultation ID:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 p-0"
                        onClick={() => {
                          navigator.clipboard.writeText(confirmationDetails.consultationId)
                          toast({
                            title: "Copied to clipboard",
                            description: "Consultation ID has been copied to clipboard",
                          })
                        }}
                      >
                        <Copy className="w-3.5 h-3.5 mr-1" />
                        <span className="text-xs">Copy</span>
                      </Button>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 py-1 px-2 rounded font-mono text-sm">
                      {confirmationDetails.consultationId}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Password:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 p-0"
                        onClick={() => {
                          navigator.clipboard.writeText(confirmationDetails.password)
                          toast({
                            title: "Copied to clipboard",
                            description: "Password has been copied to clipboard",
                          })
                        }}
                      >
                        <Copy className="w-3.5 h-3.5 mr-1" />
                        <span className="text-xs">Copy</span>
                      </Button>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 py-1 px-2 rounded font-mono text-sm">
                      {confirmationDetails.password}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={() => setShowConfirmation(false)} className="bg-teal-600 hover:bg-teal-700">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
