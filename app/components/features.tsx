"use client"

import { motion } from "framer-motion"
import { Clock, UserPlus, Stethoscope } from "lucide-react"
import Image from "next/image"

const features = [
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Our medical professionals are available round the clock for your healthcare needs.",
    image: "/placeholder.svg?height=250&width=400",
  },
  {
    icon: UserPlus,
    title: "Easy Appointments",
    description: "Book your appointments online with just a few clicks.",
    image: "/placeholder.svg?height=250&width=400",
  },
  {
    icon: Stethoscope,
    title: "Expert Doctors",
    description: "Get treated by our team of experienced and skilled medical professionals.",
    image: "/placeholder.svg?height=250&width=400",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export default function Features() {
  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white"
        >
          Why Choose Us
        </motion.h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-lg p-6 transition-shadow hover:shadow-xl"
            >
              <Image
                src={feature.image || "/placeholder.svg"}
                alt={feature.title}
                width={400}
                height={250}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-16 h-16 bg-teal-100 dark:bg-teal-800 rounded-full flex items-center justify-center mb-4"
              >
                <feature.icon className="w-8 h-8 text-teal-600 dark:text-teal-300" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
