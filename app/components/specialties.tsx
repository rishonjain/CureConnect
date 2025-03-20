"use client"

import { motion } from "framer-motion"
import { Heart, Brain, Bone, Eye } from "lucide-react"

const specialties = [
  { name: "Cardiology", icon: Heart },
  { name: "Neurology", icon: Brain },
  { name: "Orthopedics", icon: Bone },
  { name: "Ophthalmology", icon: Eye },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
}

export default function Specialties() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Our Specialties
        </motion.h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {specialties.map((specialty, index) => (
            <motion.div key={index} variants={itemVariants} className="flex flex-col items-center">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mb-4"
              >
                <specialty.icon className="w-12 h-12 text-teal-600" />
              </motion.div>
              <h3 className="text-xl font-semibold text-center">{specialty.name}</h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

