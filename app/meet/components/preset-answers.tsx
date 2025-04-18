"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface PresetAnswersProps {
  onSelectPreset: (preset: string) => void
}

export default function PresetAnswers({ onSelectPreset }: PresetAnswersProps) {
  const [expanded, setExpanded] = useState(false)

  const presetCategories = [
    {
      name: "Greetings",
      answers: ["Hello, how are you feeling today?", "Good to see you again", "Thank you for joining the consultation"],
    },
    {
      name: "Symptoms",
      answers: [
        "Could you describe your symptoms?",
        "When did these symptoms first appear?",
        "On a scale of 1-10, how would you rate your pain?",
        "Has anything made the symptoms better or worse?",
      ],
    },
    {
      name: "Medications",
      answers: [
        "Have you been taking your medications as prescribed?",
        "Any side effects from the medication?",
        "I'll send a new prescription to your pharmacy",
        "Continue with your current medication schedule",
      ],
    },
    {
      name: "Follow-up",
      answers: [
        "Let's schedule a follow-up appointment",
        "I'd like to see you again in two weeks",
        "Please contact me if symptoms worsen",
        "The nurse will call you with test results",
      ],
    },
  ]

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
      <button
        className="flex items-center justify-between w-full text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-2"
        onClick={() => setExpanded(!expanded)}
      >
        <span>Preset responses</span>
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {expanded && (
        <div className="space-y-2">
          {presetCategories.map((category, idx) => (
            <div key={idx} className="space-y-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{category.name}</p>
              <div className="flex flex-wrap gap-1">
                {category.answers.map((answer, answerIdx) => (
                  <button
                    key={answerIdx}
                    className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded px-2 py-1"
                    onClick={() => onSelectPreset(answer)}
                  >
                    {answer.length > 25 ? answer.substring(0, 22) + "..." : answer}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
