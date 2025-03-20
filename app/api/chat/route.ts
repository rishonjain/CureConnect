import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Sample responses for demo purposes
const sampleResponses = [
  "Based on the symptoms you've described, it could be a common cold or seasonal allergies. If symptoms persist for more than a week, I'd recommend consulting with your doctor.",
  "It's recommended to drink 8 glasses (about 2 liters) of water daily, but individual needs may vary based on activity level, climate, and overall health.",
  "Regular exercise, a balanced diet, adequate sleep, stress management, and regular check-ups are key components of preventive healthcare.",
  "The recommended daily caloric intake varies based on age, gender, weight, height, and activity level. For an average adult, it's typically between 1,600-2,400 calories for women and 2,000-3,000 for men.",
  "Symptoms of dehydration include thirst, dry mouth, dark urine, fatigue, dizziness, and confusion. If you're experiencing these, please increase your fluid intake.",
]

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    // In a real implementation, you would call an AI API here
    // For demo purposes, we're just returning a random response
    const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)]

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      response: randomResponse,
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}

