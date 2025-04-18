"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Clock,
  Phone,
  Mail,
  Globe,
  Award,
  Languages,
  ThumbsUp,
  Video,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import Header from "../components/header"
import Footer from "../components/footer"
import { useRouter } from "next/navigation"

// Define mock doctors data (same as in doctors-list.tsx)
const doctorsData = [
  {
    id: "dr-sharma",
    name: "Dr. Vikram Sharma",
    specialty: "Cardiology",
    location: "Mumbai",
    hospital: "Lilavati Hospital",
    experience: "15 years",
    rating: 4.9,
    reviews: 127,
    education: "MBBS, MD (Cardiology), DM (Cardiology)",
    languages: ["English", "Hindi", "Marathi"],
    image: "/placeholder.svg?height=150&width=150",
    about:
      "Dr. Vikram Sharma is a renowned cardiologist with over 15 years of experience in treating various heart conditions. He specializes in interventional cardiology and has performed over 5,000 cardiac procedures. Dr. Sharma is known for his patient-centric approach and dedication to providing the highest quality of care.",
    services: [
      "Coronary Angiography",
      "Angioplasty",
      "Pacemaker Implantation",
      "Cardiac Rehabilitation",
      "Echocardiography",
      "Stress Testing",
      "Holter Monitoring",
    ],
    awards: [
      "Best Cardiologist Award, Indian Medical Association, 2019",
      "Healthcare Excellence Award, 2017",
      "Distinguished Service Award, Lilavati Hospital, 2015",
    ],
    address: "Lilavati Hospital, Bandra West, Mumbai, Maharashtra 400050",
    phone: "+91 98765 43210",
    email: "dr.sharma@cureconnect.com",
    website: "www.cureconnect.com/dr-sharma",
    consultationFee: "₹1,500",
    availability: [
      { day: "Monday", slots: ["10:00 AM - 1:00 PM", "5:00 PM - 8:00 PM"] },
      { day: "Tuesday", slots: ["10:00 AM - 1:00 PM"] },
      { day: "Wednesday", slots: ["5:00 PM - 8:00 PM"] },
      { day: "Thursday", slots: ["10:00 AM - 1:00 PM", "5:00 PM - 8:00 PM"] },
      { day: "Friday", slots: ["10:00 AM - 1:00 PM"] },
      { day: "Saturday", slots: ["10:00 AM - 2:00 PM"] },
    ],
    patientReviews: [
      {
        id: "review1",
        name: "Rahul Mehta",
        rating: 5,
        date: "2 months ago",
        comment:
          "Dr. Sharma is an excellent doctor. He took the time to explain my condition thoroughly and answered all my questions. The treatment he prescribed worked very well. Highly recommended!",
      },
      {
        id: "review2",
        name: "Priya Desai",
        rating: 4,
        date: "4 months ago",
        comment:
          "Very knowledgeable and professional. The wait time was a bit long, but the consultation was worth it. Dr. Sharma provided clear explanations and effective treatment.",
      },
      {
        id: "review3",
        name: "Amit Singh",
        rating: 5,
        date: "6 months ago",
        comment:
          "I've been seeing Dr. Sharma for my heart condition for the past 2 years. He is caring, attentive, and highly skilled. I feel much better under his care.",
      },
    ],
  },
  {
    id: "dr-patel",
    name: "Dr. Amelia Patel",
    specialty: "Dermatology",
    location: "Delhi",
    hospital: "Apollo Hospital",
    experience: "8 years",
    rating: 4.7,
    reviews: 156,
    education: "MBBS, MD (Dermatology)",
    languages: ["English", "Hindi", "Gujarati"],
    image: "/placeholder.svg?height=150&width=150",
    about:
      "Dr. Amelia Patel is a board-certified dermatologist specializing in both medical and cosmetic dermatology. With 8 years of experience, she has helped thousands of patients with skin conditions ranging from acne and eczema to more complex dermatological issues. Dr. Patel is passionate about patient education and preventive skincare.",
    services: [
      "Medical Dermatology",
      "Cosmetic Dermatology",
      "Skin Cancer Screening",
      "Acne Treatment",
      "Laser Therapy",
      "Chemical Peels",
      "Botox and Fillers",
    ],
    awards: [
      "Young Dermatologist Award, Indian Association of Dermatologists, 2020",
      "Research Excellence in Dermatology, 2018",
    ],
    address: "Apollo Hospital, Sarita Vihar, Delhi 110076",
    phone: "+91 98765 12345",
    email: "dr.patel@cureconnect.com",
    website: "www.cureconnect.com/dr-patel",
    consultationFee: "₹1,200",
    availability: [
      { day: "Monday", slots: ["9:00 AM - 1:00 PM"] },
      { day: "Tuesday", slots: ["9:00 AM - 1:00 PM", "2:00 PM - 5:00 PM"] },
      { day: "Wednesday", slots: ["9:00 AM - 1:00 PM"] },
      { day: "Thursday", slots: ["2:00 PM - 6:00 PM"] },
      { day: "Friday", slots: ["9:00 AM - 1:00 PM", "2:00 PM - 5:00 PM"] },
      { day: "Saturday", slots: ["10:00 AM - 2:00 PM"] },
    ],
    patientReviews: [
      {
        id: "review1",
        name: "Neha Sharma",
        rating: 5,
        date: "1 month ago",
        comment:
          "Dr. Patel is amazing! She helped clear my persistent acne when nothing else worked. Very thorough and knowledgeable.",
      },
      {
        id: "review2",
        name: "Raj Kumar",
        rating: 4,
        date: "3 months ago",
        comment:
          "Good experience overall. Dr. Patel is professional and explains things well. The treatment for my eczema has been effective.",
      },
      {
        id: "review3",
        name: "Sonia Gupta",
        rating: 5,
        date: "5 months ago",
        comment:
          "Excellent dermatologist! Dr. Patel diagnosed my rare skin condition correctly when two other doctors couldn't. Very grateful for her expertise.",
      },
    ],
  },
  // Add similar detailed data for other doctors
  // For brevity, I'm only including detailed data for two doctors
  // In a real application, you would have complete data for all doctors
]

interface DoctorProfileProps {
  doctorId: string
}

export default function DoctorProfile({ doctorId }: DoctorProfileProps) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  // Find the doctor by ID
  const doctor = doctorsData.find((doc) => doc.id === doctorId)

  // If doctor not found, show error
  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Doctor Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The doctor you are looking for does not exist or has been removed.
            </p>
            <Button onClick={() => router.push("/doctors")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Doctors
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Generate available dates (next 7 days)
  const generateDates = () => {
    const dates = []
    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      // Check if doctor is available on this day
      const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" })
      const availability = doctor.availability?.find((a) => a.day === dayOfWeek)

      if (availability) {
        dates.push({
          date: date,
          day: dayOfWeek,
          formattedDate: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          available: true,
          slots: availability.slots,
        })
      } else {
        dates.push({
          date: date,
          day: dayOfWeek,
          formattedDate: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          available: false,
          slots: [],
        })
      }
    }

    return dates
  }

  const availableDates = generateDates()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="max-w-7xl mx-auto">
          {/* Back button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/doctors")}
              className="text-gray-600 dark:text-gray-400"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Doctors
            </Button>
          </div>

          {/* Doctor profile header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4 mb-6 md:mb-0 flex justify-center">
                <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={doctor.image || "/placeholder.svg"}
                    alt={doctor.name}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="md:w-3/4 md:pl-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{doctor.name}</h1>
                    <p className="text-teal-600 dark:text-teal-400 text-lg">{doctor.specialty}</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center">
                    <div className="bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-full flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                      <span className="font-medium">{doctor.rating}</span>
                      <span className="mx-1 text-gray-400">•</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{doctor.reviews} reviews</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{doctor.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Award className="h-4 w-4 mr-2" />
                    <span>{doctor.experience} experience</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Languages className="h-4 w-4 mr-2" />
                    <span>{doctor.languages.join(", ")}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Globe className="h-4 w-4 mr-2" />
                    <span>{doctor.hospital}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Appointment
                  </Button>
                  <Button variant="outline">
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </Button>
                  <Link href="/meet">
                    <Button variant="outline">
                      <Video className="mr-2 h-4 w-4" />
                      Video Consultation
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Doctor details tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>
                <TabsContent value="about" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">About {doctor.name}</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">{doctor.about}</p>

                  <h3 className="text-lg font-semibold mb-3">Education</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">{doctor.education}</p>

                  {doctor.awards && doctor.awards.length > 0 && (
                    <>
                      <h3 className="text-lg font-semibold mb-3">Awards & Recognition</h3>
                      <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 mb-6">
                        {doctor.awards.map((award, index) => (
                          <li key={index} className="mb-1">
                            {award}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="services" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Services Offered</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {doctor.services?.map((service, index) => (
                      <div key={index} className="flex items-start">
                        <ThumbsUp className="h-5 w-5 text-teal-500 mr-2 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{service}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Patient Reviews</h2>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 mr-1" fill="currentColor" />
                      <span className="font-medium text-lg">{doctor.rating}</span>
                      <span className="mx-1 text-gray-400">•</span>
                      <span className="text-gray-600 dark:text-gray-400">{doctor.reviews} reviews</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {doctor.patientReviews?.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                        <div className="flex justify-between mb-2">
                          <div className="font-medium">{review.name}</div>
                          <div className="text-sm text-gray-500">{review.date}</div>
                        </div>
                        <div className="flex items-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "text-yellow-500" : "text-gray-300 dark:text-gray-600"}`}
                              fill={i < review.rating ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="location" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Location & Contact</h2>

                  <div className="mb-6">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 mb-4 flex items-center justify-center">
                      <MapPin className="h-12 w-12 text-gray-400" />
                      <span className="ml-2 text-gray-500 dark:text-gray-400">Map view</span>
                    </div>

                    <h3 className="font-medium mb-2">Address</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{doctor.address}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium mb-2">Contact</h3>
                        <div className="flex items-center text-gray-700 dark:text-gray-300 mb-2">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>{doctor.phone}</span>
                        </div>
                        <div className="flex items-center text-gray-700 dark:text-gray-300 mb-2">
                          <Mail className="h-4 w-4 mr-2" />
                          <span>{doctor.email}</span>
                        </div>
                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                          <Globe className="h-4 w-4 mr-2" />
                          <span>{doctor.website}</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Consultation Fee</h3>
                        <p className="text-gray-700 dark:text-gray-300">{doctor.consultationFee} per session</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Appointment booking sidebar */}
            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Book an Appointment</h2>

                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2">Select Date</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {availableDates.map((dateObj, index) => (
                        <Button
                          key={index}
                          variant={selectedDate === dateObj.formattedDate ? "default" : "outline"}
                          className={`flex flex-col h-auto py-2 ${!dateObj.available ? "opacity-50 cursor-not-allowed" : ""}`}
                          onClick={() => dateObj.available && setSelectedDate(dateObj.formattedDate)}
                          disabled={!dateObj.available}
                        >
                          <span className="text-xs">{dateObj.day.substring(0, 3)}</span>
                          <span className="text-lg font-semibold">{dateObj.formattedDate.split(" ")[1]}</span>
                          <span className="text-xs">{dateObj.formattedDate.split(" ")[0]}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {selectedDate && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-2">Select Time</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {availableDates
                          .find((d) => d.formattedDate === selectedDate)
                          ?.slots.flatMap((slot) => slot.split(", "))
                          .map((time, index) => (
                            <Button
                              key={index}
                              variant={selectedTime === time ? "default" : "outline"}
                              className="flex items-center justify-center"
                              onClick={() => setSelectedTime(time)}
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{time}</span>
                            </Button>
                          ))}
                      </div>
                    </div>
                  )}

                  <Button className="w-full bg-teal-600 hover:bg-teal-700" disabled={!selectedDate || !selectedTime}>
                    Confirm Appointment
                  </Button>

                  <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    <p>* You can cancel your appointment 24 hours before the scheduled time.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
