"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, MapPin, Star, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "../components/header"
import Footer from "../components/footer"

// Define doctor specialties
const specialties = [
  "All Specialties",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Radiology",
  "Gastroenterology",
  "Ophthalmology",
  "Endocrinology",
  "Oncology",
  "Gynecology",
]

// Define Indian cities
const cities = [
  "All Locations",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Kochi",
  "Chandigarh",
]

// Define mock doctors data
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
  },
  {
    id: "dr-gupta",
    name: "Dr. Rajesh Gupta",
    specialty: "Neurology",
    location: "Bangalore",
    hospital: "Manipal Hospital",
    experience: "12 years",
    rating: 4.8,
    reviews: 98,
    education: "MBBS, MD (Neurology), DM (Neurology)",
    languages: ["English", "Hindi", "Kannada"],
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    id: "dr-reddy",
    name: "Dr. Priya Reddy",
    specialty: "Pediatrics",
    location: "Hyderabad",
    hospital: "Rainbow Children's Hospital",
    experience: "10 years",
    rating: 4.9,
    reviews: 203,
    education: "MBBS, MD (Pediatrics)",
    languages: ["English", "Hindi", "Telugu"],
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    id: "dr-singh",
    name: "Dr. Manpreet Singh",
    specialty: "Orthopedics",
    location: "Chandigarh",
    hospital: "PGIMER",
    experience: "20 years",
    rating: 4.8,
    reviews: 175,
    education: "MBBS, MS (Orthopedics)",
    languages: ["English", "Hindi", "Punjabi"],
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    id: "dr-kumar",
    name: "Dr. Ananya Kumar",
    specialty: "Gynecology",
    location: "Chennai",
    hospital: "Apollo Women's Hospital",
    experience: "14 years",
    rating: 4.7,
    reviews: 142,
    education: "MBBS, MD (Obstetrics & Gynecology)",
    languages: ["English", "Hindi", "Tamil"],
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    id: "dr-chatterjee",
    name: "Dr. Sanjay Chatterjee",
    specialty: "Psychiatry",
    location: "Kolkata",
    hospital: "NIMHANS",
    experience: "18 years",
    rating: 4.6,
    reviews: 89,
    education: "MBBS, MD (Psychiatry)",
    languages: ["English", "Hindi", "Bengali"],
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    id: "dr-nair",
    name: "Dr. Meera Nair",
    specialty: "Endocrinology",
    location: "Kochi",
    hospital: "Amrita Institute of Medical Sciences",
    experience: "9 years",
    rating: 4.8,
    reviews: 112,
    education: "MBBS, MD (Internal Medicine), DM (Endocrinology)",
    languages: ["English", "Hindi", "Malayalam"],
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    id: "dr-joshi",
    name: "Dr. Aditya Joshi",
    specialty: "Gastroenterology",
    location: "Pune",
    hospital: "Ruby Hall Clinic",
    experience: "11 years",
    rating: 4.7,
    reviews: 134,
    education: "MBBS, MD (Internal Medicine), DM (Gastroenterology)",
    languages: ["English", "Hindi", "Marathi"],
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    id: "dr-agarwal",
    name: "Dr. Sunita Agarwal",
    specialty: "Ophthalmology",
    location: "Jaipur",
    hospital: "Agarwal Eye Hospital",
    experience: "16 years",
    rating: 4.9,
    reviews: 187,
    education: "MBBS, MS (Ophthalmology)",
    languages: ["English", "Hindi", "Rajasthani"],
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    id: "dr-mehta",
    name: "Dr. Vivek Mehta",
    specialty: "Oncology",
    location: "Ahmedabad",
    hospital: "HCG Cancer Centre",
    experience: "13 years",
    rating: 4.8,
    reviews: 156,
    education: "MBBS, MD (Radiation Oncology), DM (Medical Oncology)",
    languages: ["English", "Hindi", "Gujarati"],
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    id: "dr-verma",
    name: "Dr. Ritu Verma",
    specialty: "Radiology",
    location: "Lucknow",
    hospital: "SGPGI",
    experience: "10 years",
    rating: 4.6,
    reviews: 98,
    education: "MBBS, MD (Radiology)",
    languages: ["English", "Hindi"],
    image: "/placeholder.svg?height=150&width=150",
  },
]

export default function DoctorsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [sortBy, setSortBy] = useState("rating")
  const [showFilters, setShowFilters] = useState(false)

  // Filter and sort doctors
  const filteredDoctors = doctorsData
    .filter((doctor) => {
      // Search filter
      if (
        searchTerm &&
        !doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !doctor.location.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }

      // Specialty filter
      if (selectedSpecialty !== "All Specialties" && doctor.specialty !== selectedSpecialty) {
        return false
      }

      // Location filter
      if (selectedLocation !== "All Locations" && doctor.location !== selectedLocation) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      // Sort by selected criteria
      if (sortBy === "rating") {
        return b.rating - a.rating
      } else if (sortBy === "experience") {
        return Number.parseInt(b.experience) - Number.parseInt(a.experience)
      } else if (sortBy === "reviews") {
        return b.reviews - a.reviews
      }
      return 0
    })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Doctors</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Meet our team of experienced healthcare professionals across India. Find the right specialist for your
              needs.
            </p>
          </div>

          {/* Search and filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search by name, specialty, or location"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="md:hidden" onClick={() => setShowFilters(!showFilters)}>
                  <Filter size={18} className="mr-2" />
                  Filters
                </Button>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="experience">Most Experienced</SelectItem>
                    <SelectItem value="reviews">Most Reviews</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className={`${showFilters ? "block" : "hidden md:flex"} flex-col md:flex-row gap-4`}>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Specialty</label>
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {filteredDoctors.length} {filteredDoctors.length === 1 ? "doctor" : "doctors"}
            </p>
          </div>

          {/* Doctors grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Link key={doctor.id} href={`/doctors/${doctor.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="mr-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                          <Image
                            src={doctor.image || "/placeholder.svg"}
                            alt={doctor.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{doctor.name}</h3>
                        <p className="text-teal-600 dark:text-teal-400">{doctor.specialty}</p>
                        <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <MapPin size={14} className="mr-1" />
                          <span>{doctor.location}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <div className="flex items-center">
                            <Star size={14} className="text-yellow-500 mr-1" fill="currentColor" />
                            <span className="font-medium">{doctor.rating}</span>
                          </div>
                          <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{doctor.reviews} reviews</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 font-normal">
                            {doctor.experience} exp
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{doctor.hospital}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* No results */}
          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No doctors found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filter criteria to find more doctors.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedSpecialty("All Specialties")
                  setSelectedLocation("All Locations")
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
