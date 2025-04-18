"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar } from "lucide-react"

const stepVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
}

export default function Appointment() {
  const [step, setStep] = useState(1)

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <section className="py-20 bg-teal-50">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Book an Appointment
        </motion.h2>
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  i <= step ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
                animate={{ scale: i === step ? 1.2 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {i}
              </motion.div>
            ))}
          </div>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-semibold mb-4">Select a Department</h3>
                {/* Add department selection here */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextStep}
                  className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4"
                >
                  Next
                </motion.button>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-semibold mb-4">Choose a Date and Time</h3>
                <div className="flex items-center mb-4">
                  <Calendar className="w-6 h-6 text-teal-600 mr-2" />
                  <input type="date" className="border rounded px-2 py-1" />
                </div>
                {/* Add time selection here */}
                <div className="flex justify-between mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={prevStep}
                    className="bg-gray-200 text-gray-600 px-6 py-2 rounded-full"
                  >
                    Previous
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextStep}
                    className="bg-teal-600 text-white px-6 py-2 rounded-full"
                  >
                    Next
                  </motion.button>
                </div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-semibold mb-4">Your Information</h3>
                {/* Add patient information form here */}
                <div className="flex justify-between mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={prevStep}
                    className="bg-gray-200 text-gray-600 px-6 py-2 rounded-full"
                  >
                    Previous
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-teal-600 text-white px-6 py-2 rounded-full"
                  >
                    Confirm Booking
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
