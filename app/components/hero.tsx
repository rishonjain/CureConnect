"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
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

export default function Hero() {
  return (
    <section className="pt-32 pb-20 overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          className="flex flex-col md:flex-row items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-gray-900 dark:text-white"
            >
              Your Health, <br />
              <span className="text-teal-600 dark:text-teal-400">Our Priority</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Experience world-class healthcare with our team of expert doctors and state-of-the-art facilities.
            </motion.p>
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-teal-600 dark:bg-teal-500 text-white px-8 py-3 rounded-full font-semibold flex items-center"
            >
              Book an Appointment
              <ArrowRight className="ml-2" size={20} />
            </motion.button>
          </div>
          <motion.div variants={itemVariants} className="w-full md:w-1/2">
            <div className="relative">
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 bg-teal-200 dark:bg-teal-700 rounded-full"
              ></motion.div>
              <Image
                src="/placeholder.svg?height=500&width=500"
                alt="Doctor"
                width={500}
                height={500}
                className="relative z-10 rounded-full object-cover"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

