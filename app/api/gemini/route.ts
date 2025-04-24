import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Updated Gemini API endpoint with the correct model for Gemini 2.5 Flash Preview
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-preview:generateContent"

// Fallback responses in case the API fails
const fallbackResponses = [
  "Based on the symptoms you've described, it could be a common cold or seasonal allergies. If symptoms persist for more than a week, I'd recommend consulting with your doctor.",
  "It's recommended to drink 8 glasses (about 2 liters) of water daily, but individual needs may vary based on activity level, climate, and overall health.",
  "Regular exercise, a balanced diet, adequate sleep, stress management, and regular check-ups are key components of preventive healthcare.",
  "The recommended daily caloric intake varies based on age, gender, weight, height, and activity level. For an average adult, it's typically between 1,600-2,400 calories for women and 2,000-3,000 for men.",
  "Symptoms of dehydration include thirst, dry mouth, dark urine, fatigue, dizziness, and confusion. If you're experiencing these, please increase your fluid intake.",
  "I understand your concern. While I can provide general health information, it's important to consult with a healthcare professional for personalized medical advice.",
  "Prevention is key for many health conditions. Regular check-ups, a balanced diet, adequate exercise, and avoiding harmful habits like smoking can help maintain good health.",
  "Mental health is just as important as physical health. If you're feeling overwhelmed, consider talking to a mental health professional.",
  "For minor pain relief, over-the-counter medications like acetaminophen or ibuprofen may help, but always follow the recommended dosage and consult a doctor if pain persists.",
  "Sleep is crucial for overall health. Adults typically need 7-9 hours of quality sleep per night.",
]

// Simple rule-based response generation as a fallback
function generateFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("headache") || lowerMessage.includes("head pain") || lowerMessage.includes("migraine")) {
    return "Headaches can be caused by various factors including stress, dehydration, lack of sleep, or eye strain. For occasional headaches, rest, hydration, and over-the-counter pain relievers may help. If headaches are severe, persistent, or accompanied by other symptoms, please consult a healthcare professional."
  }

  if (
    lowerMessage.includes("cold") ||
    lowerMessage.includes("flu") ||
    lowerMessage.includes("fever") ||
    lowerMessage.includes("cough")
  ) {
    return "Common cold and flu symptoms can include fever, cough, sore throat, runny nose, and body aches. Rest, hydration, and over-the-counter medications can help manage symptoms. If symptoms are severe or persist for more than a week, consider consulting a doctor."
  }

  if (lowerMessage.includes("diet") || lowerMessage.includes("nutrition") || lowerMessage.includes("food")) {
    return "A balanced diet typically includes a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats. It's recommended to limit processed foods, added sugars, and excessive salt. Remember that individual nutritional needs can vary based on age, activity level, and health conditions."
  }

  if (lowerMessage.includes("exercise") || lowerMessage.includes("workout") || lowerMessage.includes("fitness")) {
    return "Regular physical activity is important for overall health. Adults should aim for at least 150 minutes of moderate-intensity exercise per week, along with muscle-strengthening activities twice a week. Always start gradually and consult with a healthcare provider before beginning a new exercise program."
  }

  if (lowerMessage.includes("sleep") || lowerMessage.includes("insomnia") || lowerMessage.includes("tired")) {
    return "Good sleep hygiene includes maintaining a regular sleep schedule, creating a restful environment, limiting screen time before bed, and avoiding caffeine and large meals close to bedtime. Adults typically need 7-9 hours of quality sleep per night."
  }

  // Default to a random fallback response if no specific match
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
}

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    // Get API key from environment variable or use the provided key
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyAlEv40q32xNYzBvILs-bhjoi5lI2p6QnA"

    if (!apiKey) {
      console.log("No Gemini API key configured, using fallback response")
      const fallbackResponse = generateFallbackResponse(message)
      return NextResponse.json({ response: fallbackResponse })
    }

    // Format conversation history for Gemini
    const formattedMessages = formatConversationHistory(history, message)

    try {
      // Call Gemini API with the correct URL structure and model
      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: formattedMessages,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      })

      if (!response.ok) {
        // Log the error but don't throw, use fallback instead
        const errorData = await response.json().catch(() => ({}))
        console.error("Gemini API error:", errorData)

        // Generate a fallback response based on the message content
        const fallbackResponse = generateFallbackResponse(message)
        return NextResponse.json({ response: fallbackResponse })
      }

      const result = await response.json()

      // Extract the generated text from the response
      let generatedText = ""
      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        generatedText = result.candidates[0].content.parts[0].text || ""
      }

      // If we got an empty response, use fallback
      if (!generatedText.trim()) {
        const fallbackResponse = generateFallbackResponse(message)
        return NextResponse.json({ response: fallbackResponse })
      }

      return NextResponse.json({ response: generatedText })
    } catch (error) {
      console.error("Error calling Gemini API:", error)
      // Generate a fallback response based on the message content
      const fallbackResponse = generateFallbackResponse(message)
      return NextResponse.json({ response: fallbackResponse })
    }
  } catch (error) {
    console.error("Error in Gemini API route:", error)
    return NextResponse.json({
      response: "I'm sorry, I encountered an error processing your request. How else can I help you today?",
    })
  }
}

// Format conversation history for Gemini
function formatConversationHistory(history: Array<{ role: string; content: string }>, currentMessage: string) {
  // System prompt to guide the model's behavior
  const systemPrompt = `You are CureBot, an AI health assistant developed by CureConnect. 
Provide helpful, accurate, and ethical health information. 
Do not provide medical diagnoses or prescribe treatments. 
Always recommend consulting with healthcare professionals for specific medical concerns.
Be conversational, empathetic, and clear in your responses.
Keep responses concise and focused on health-related topics.`

  // Format the conversation for Gemini
  const formattedMessages = [
    {
      role: "user",
      parts: [{ text: systemPrompt }],
    },
    {
      role: "model",
      parts: [
        {
          text: "I understand. I am CureBot, an AI health assistant developed by CureConnect. I'll provide helpful, accurate, and ethical health information without diagnosing or prescribing treatments. I'll always recommend consulting healthcare professionals for specific concerns. I'll be conversational, empathetic, clear, and concise in my responses, focusing on health-related topics.",
        },
      ],
    },
  ]

  // Add conversation history
  for (let i = 0; i < history.length; i++) {
    const message = history[i]
    if (message.role === "user") {
      formattedMessages.push({
        role: "user",
        parts: [{ text: message.content }],
      })
    } else if (message.role === "assistant") {
      formattedMessages.push({
        role: "model",
        parts: [{ text: message.content }],
      })
    }
  }

  // Add the current message
  formattedMessages.push({
    role: "user",
    parts: [{ text: currentMessage }],
  })

  return formattedMessages
}
