"use server"

// This file would contain server actions for the AI chatbot
// In a real implementation, you would call an AI API here

// Sample responses for demo purposes
const sampleResponses = [
  "Based on the symptoms you've described, it could be a common cold or seasonal allergies. If symptoms persist for more than a week, I'd recommend consulting with your doctor.",
  "It's recommended to drink 8 glasses (about 2 liters) of water daily, but individual needs may vary based on activity level, climate, and overall health.",
  "Regular exercise, a balanced diet, adequate sleep, stress management, and regular check-ups are key components of preventive healthcare.",
  "The recommended daily caloric intake varies based on age, gender, weight, height, and activity level. For an average adult, it's typically between 1,600-2,400 calories for women and 2,000-3,000 for men.",
  "Symptoms of dehydration include thirst, dry mouth, dark urine, fatigue, dizziness, and confusion. If you're experiencing these, please increase your fluid intake.",
]

export async function generateAIResponse(message: string) {
  // In a real implementation, you would call an AI API here
  // For demo purposes, we're just returning a random response

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)]
  return randomResponse
}
