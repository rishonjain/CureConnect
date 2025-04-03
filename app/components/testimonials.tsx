"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    name: "John Doe",
    role: "Patient",
    content: "The care I received was exceptional. The doctors were knowledgeable and compassionate.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Jane Smith",
    role: "Patient",
    content: "I was impressed by the state-of-the-art facilities and the friendly staff. Highly recommended!",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Mike Johnson",
    role: "Patient",
    content: "The quick response and efficient treatment I received saved my life. I'm forever grateful.",
    image: "/placeholder.svg?height=100&width=100",
  },
]

const testimonialVariants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }
  },
}

export default function Testimonials() {
  const [[page, direction], setPage] = useState([0, 0])

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection])
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white"
        >
          What Our Patients Say
        </motion.h2>
        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={testimonialVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center"
            >
              <Image
                src={testimonials[page % testimonials.length].image || "/placeholder.svg"}
                alt={testimonials[page % testimonials.length].name}
                width={100}
                height={100}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <p className="text-xl mb-4 text-gray-800 dark:text-gray-200">
                {testimonials[page % testimonials.length].content}
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {testimonials[page % testimonials.length].name}
              </p>
              <p className="text-gray-600 dark:text-gray-400">{testimonials[page % testimonials.length].role}</p>
            </motion.div>
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(-1)}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-full bg-white dark:bg-gray-800 rounded-full p-2 shadow-md"
          >
            <ChevronLeft className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(1)}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-full bg-white dark:bg-gray-800 rounded-full p-2 shadow-md"
          >
            <ChevronRight className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          </motion.button>
        </div>
      </div>
    </section>
  )
}

