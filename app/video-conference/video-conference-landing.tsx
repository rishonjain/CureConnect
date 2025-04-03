"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Video, ArrowRight, Users, Shield, Clock, Search, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import Header from "../components/header"
import Footer from "../components/footer"
import { toast } from "sonner"

// Define doctor specialties
const specialties = [
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "Neurology",
  "Obstetrics & Gynecology",
  "Oncology",
  "Ophthalmology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Pulmonology",
  "Radiology",
  "Urology",
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
    availability: ["Mon", "Wed", "Fri"],
    nextAvailable: "Today, 3:30 PM",
    image: "/placeholder.svg?height=150&width=150",
    education: "Harvard Medical School",
    bio: "Dr. Johnson specializes in cardiovascular health and preventive cardiology. She has extensive experience treating heart conditions and helping patients manage heart disease risk factors.",
  },
  {
    id: "dr-michael-chen",
    name: "Dr. Michael Chen",
    specialty: "Neurology",
    experience: "12 years",
    rating: 4.8,
    reviews: 98,
    availability: ["Tue", "Thu", "Sat"],
    nextAvailable: "Tomorrow, 10:00 AM",
    image: "/placeholder.svg?height=150&width=150",
    education: "Johns Hopkins University",
    bio: "Dr. Chen is an expert in neurological disorders, with particular focus on headache management, stroke prevention, and neurodegenerative diseases.",
  },
  {
    id: "dr-amelia-patel",
    name: "Dr. Amelia Patel",
    specialty: "Dermatology",
    experience: "8 years",
    rating: 4.7,
    reviews: 156,
    availability: ["Mon", "Tue", "Thu", "Fri"],
    nextAvailable: "Today, 5:15 PM",
    image: "/placeholder.svg?height=150&width=150",
    education: "Stanford University",
    bio: "Dr. Patel specializes in medical and cosmetic dermatology, treating conditions like acne, eczema, and psoriasis, as well as performing skin cancer screenings.",
  },
  {
    id: "dr-james-wilson",
    name: "Dr. James Wilson",
    specialty: "Orthopedics",
    experience: "20 years",
    rating: 4.9,
    reviews: 203,
    availability: ["Wed", "Fri"],
    nextAvailable: "In 2 days, 1:00 PM",
    image: "/placeholder.svg?height=150&width=150",
    education: "Yale School of Medicine",
    bio: "Dr. Wilson is an orthopedic surgeon specializing in sports medicine, joint replacements, and rehabilitation of musculoskeletal injuries.",
  },
  {
    id: "dr-sophia-rodriguez",
    name: "Dr. Sophia Rodriguez",
    specialty: "Pediatrics",
    experience: "10 years",
    rating: 4.8,
    reviews: 175,
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    nextAvailable: "Today, 2:00 PM",
    image: "/placeholder.svg?height=150&width=150",
    education: "Columbia University",
    bio: "Dr. Rodriguez provides comprehensive pediatric care from newborns to adolescents, with special interest in childhood development and preventive healthcare.",
  },
  {
    id: "dr-robert-kim",
    name: "Dr. Robert Kim",
    specialty: "Radiology",
    experience: "14 years",
    rating: 4.7,
    reviews: 89,
    availability: ["Mon", "Wed", "Fri"],
    nextAvailable: "Tomorrow, 9:30 AM",
    image: "/placeholder.svg?height=150&width=150",
    education: "University of California, San Francisco",
    bio: "Dr. Kim specializes in diagnostic imaging, including X-rays, CT scans, MRIs, and ultrasounds to diagnose and monitor various medical conditions.",
  },
  {
    id: "dr-emily-taylor",
    name: "Dr. Emily Taylor",
    specialty: "Psychiatry",
    experience: "11 years",
    rating: 4.9,
    reviews: 132,
    availability: ["Tue", "Thu", "Sat"],
    nextAvailable: "Today, 4:45 PM",
    image: "/placeholder.svg?height=150&width=150",
    education: "Duke University",
    bio: "Dr. Taylor provides compassionate mental health care, specializing in anxiety, depression, PTSD, and other psychiatric conditions.",
  },
  {
    id: "dr-david-clark",
    name: "Dr. David Clark",
    specialty: "Gastroenterology",
    experience: "16 years",
    rating: 4.8,
    reviews: 114,
    availability: ["Mon", "Wed", "Fri"],
    nextAvailable: "In 3 days, 11:15 AM",
    image: "/placeholder.svg?height=150&width=150",
    education: "University of Pennsylvania",
    bio: "Dr. Clark specializes in digestive health, treating conditions like IBS, GERD, Crohn's disease, and performing endoscopic procedures.",
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
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState<(typeof doctors)[0] | null>(null)
  const [requestStep, setRequestStep] = useState(1)
  const [appointmentDate, setAppointmentDate] = useState("")
  const [appointmentTime, setAppointmentTime] = useState("")
  const [consultationReason, setConsultationReason] = useState("")

  const handleJoinMeeting = (e: React.FormEvent) => {
    e.preventDefault()
    if (meetingId && name) {
      router.push(
        `/video-conference/room/${meetingId}?name=${encodeURIComponent(name)}${password ? `&password=${encodeURIComponent(password)}` : ""}`,
      )
    }
  }

  const handleRequestConsultation = () => {
    // Generate a random meeting ID and password
    const newMeetingId = Math.random().toString(36).substring(2, 10)
    const meetingPassword = Math.random().toString(36).substring(2, 8)

    // In a real app, this would send the request to the backend and email the user
    toast({
      title: "Consultation Requested",
      description: `Your consultation with ${selectedDoctor?.name} has been scheduled. Meeting details have been sent to ${email}.`,
    })

    // Show confirmation dialog with meeting details
    alert(`
      Consultation requested successfully!
      
      Doctor: ${selectedDoctor?.name}
      Date: ${appointmentDate}
      Time: ${appointmentTime}
      
      Meeting ID: ${newMeetingId}
      Password: ${meetingPassword}
      
      These details have been sent to your email: ${email}
    `)

    // Reset form
    setSelectedDoctor(null)
    setRequestStep(1)
    setAppointmentDate("")
    setAppointmentTime("")
    setConsultationReason("")
    setEmail("")
    setMobile("")
  }

  const filteredDoctors = doctors.filter((doctor) => {
    // Filter by selected specialty if any
    if (selectedSpecialty && doctor.specialty !== selectedSpecialty) {
      return false
    }

    // Filter by search query if any
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        doctor.name.toLowerCase().includes(query) ||
        doctor.specialty.toLowerCase().includes(query) ||
        doctor.bio.toLowerCase().includes(query)
      )
    }

    return true
  })

  const renderDoctorSelection = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">
            Search doctors
          </Label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
              size={18}
            />
            <Input
              id="search"
              placeholder="Search by name or specialty"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="specialty" className="sr-only">
            Filter by specialty
          </Label>
          <select
            id="specialty"
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md"
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
      </div>

      {filteredDoctors.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No doctors found matching your criteria.</p>
          <Button
            variant="link"
            onClick={() => {
              setSearchQuery("")
              setSelectedSpecialty(null)
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
          {filteredDoctors.map((doctor) => (
            <Card
              key={doctor.id}
              className={`border hover:border-teal-500 transition-all cursor-pointer ${
                selectedDoctor?.id === doctor.id ? "ring-2 ring-teal-500 border-teal-500" : ""
              }`}
              onClick={() => setSelectedDoctor(doctor)}
            >
              <CardContent className="p-4">
                <div className="flex items-start">
                  <img
                    src={doctor.image || "/placeholder.svg"}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{doctor.name}</h3>
                      <Badge
                        variant="outline"
                        className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
                      >
                        {doctor.specialty}
                      </Badge>
                    </div>
                    <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        {doctor.rating}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{doctor.experience} exp.</span>
                      <span className="mx-2">•</span>
                      <span>{doctor.reviews} reviews</span>
                    </div>
                    <p className="text-sm mt-2 line-clamp-2">{doctor.bio}</p>
                    <div className="mt-2 text-sm">
                      <span className="text-teal-600 dark:text-teal-400 font-medium">Next available: </span>
                      <span>{doctor.nextAvailable}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={() => setRequestStep(2)} disabled={!selectedDoctor} className="bg-teal-600 hover:bg-teal-700">
          Continue
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  )

  const renderAppointmentDetails = () => (
    <div className="space-y-6">
      {selectedDoctor && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex items-center">
          <img
            src={selectedDoctor.image || "/placeholder.svg"}
            alt={selectedDoctor.name}
            className="w-16 h-16 rounded-full object-cover mr-4"
          />
          <div>
            <h3 className="font-semibold text-lg">{selectedDoctor.name}</h3>
            <p className="text-gray-600 dark:text-gray-400">{selectedDoctor.specialty}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Your Full Name</Label>
          <Input
            id="name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <p className="text-xs text-gray-500 dark:text-gray-400">Meeting details will be sent to this email</p>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Preferred Date</Label>
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
            <Label htmlFor="time">Preferred Time</Label>
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

        <div className="space-y-2">
          <Label htmlFor="reason">Reason for Consultation</Label>
          <textarea
            id="reason"
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md min-h-[100px]"
            placeholder="Briefly describe your symptoms or reason for the consultation"
            value={consultationReason}
            onChange={(e) => setConsultationReason(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setRequestStep(1)}>
          Back
        </Button>
        <Button
          onClick={handleRequestConsultation}
          disabled={!name || !email || !mobile || !appointmentDate || !appointmentTime || !consultationReason}
          className="bg-teal-600 hover:bg-teal-700"
        >
          Request Consultation
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              CureConnect <span className="text-teal-600 dark:text-teal-400">Video Consultations</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Connect with healthcare professionals through secure, high-quality video consultations from the comfort of
              your home.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl p-8 text-white h-full flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-3xl font-bold mb-4">Healthcare at your fingertips</h2>
                  <p className="text-teal-50 mb-6">
                    Our video consultation platform connects you with healthcare professionals instantly. No waiting
                    rooms, no travel time – just quality healthcare when you need it.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="flex items-start">
                      <div className="bg-white/20 p-2 rounded-full mr-3">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Expert Doctors</h3>
                        <p className="text-sm text-teal-50">Connect with specialists</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-white/20 p-2 rounded-full mr-3">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Secure & Private</h3>
                        <p className="text-sm text-teal-50">End-to-end encryption</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-white/20 p-2 rounded-full mr-3">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">24/7 Availability</h3>
                        <p className="text-sm text-teal-50">Care when you need it</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  <img
                    src="/placeholder.svg?height=200&width=400"
                    alt="Video consultation illustration"
                    className="rounded-lg w-full max-w-md mx-auto"
                  />
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="shadow-lg border-0">
                  <CardContent className="pt-6">
                    <Tabs defaultValue="join" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="join">Join Consultation</TabsTrigger>
                        <TabsTrigger value="request">Request Consultation</TabsTrigger>
                      </TabsList>

                      <TabsContent value="join">
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
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </form>
                      </TabsContent>

                      <TabsContent value="request">
                        {requestStep === 1 ? renderDoctorSelection() : renderAppointmentDetails()}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                <div className="mt-6 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-700 dark:text-blue-300 flex items-center">
                    <Video className="w-5 h-5 mr-2" />
                    How It Works
                  </h3>
                  <ol className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-300 pl-7 list-decimal">
                    <li>Choose a specialist and request a consultation</li>
                    <li>Receive confirmation with your consultation ID</li>
                    <li>Join at the scheduled time using the consultation ID</li>
                    <li>Connect with your healthcare provider via secure video</li>
                  </ol>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Medical Specialties</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {specialties.map((specialty) => (
                <Button
                  key={specialty}
                  variant="outline"
                  className={`h-auto py-3 justify-start ${
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="bg-teal-100 dark:bg-teal-900/50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Book appointments at times that work for you, including evenings and weekends.
                </p>
                <Link
                  href="/video-conference"
                  className="text-teal-600 dark:text-teal-400 font-medium inline-flex items-center"
                >
                  Learn more <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Specialist Access</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Connect with specialists across multiple disciplines without long referral waits.
                </p>
                <Link
                  href="/video-conference"
                  className="text-teal-600 dark:text-teal-400 font-medium inline-flex items-center"
                >
                  Learn more <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Consultations</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  All video consultations are encrypted and comply with healthcare privacy regulations.
                </p>
                <Link
                  href="/video-conference"
                  className="text-teal-600 dark:text-teal-400 font-medium inline-flex items-center"
                >
                  Learn more <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

