import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Users, Stethoscope } from "lucide-react"

const concepts = [
  {
    icon: Brain,
    title: "Predicting Health Risks",
    description:
      "Identify individuals at high risk of developing chronic diseases based on social determinants of health.",
  },
  {
    icon: Users,
    title: "Culturally Sensitive AI",
    description: "Ensure that AI algorithms are fair and unbiased across different populations.",
  },
  {
    icon: Stethoscope,
    title: "Improving Healthcare Access",
    description: "Utilize telemedicine and AI-powered diagnostics to bring healthcare services to remote communities.",
  },
]

export default function Concept() {
  return (
    <section id="concept" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Concept</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {concepts.map((concept, index) => (
            <Card key={index} className="bg-gray-50 border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <concept.icon className="w-12 h-12 mb-4 text-blue-600" />
                <CardTitle>{concept.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{concept.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
