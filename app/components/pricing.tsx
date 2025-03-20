import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Basic",
    price: "$29",
    features: ["5 Projects", "10GB Storage", "Basic Support"],
  },
  {
    name: "Pro",
    price: "$59",
    features: ["Unlimited Projects", "100GB Storage", "Priority Support", "Advanced Analytics"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Unlimited Everything", "Dedicated Support", "Custom Integrations"],
  },
]

export default function Pricing() {
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-[#1E293B]">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Pricing Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className="bg-[#0F172A] p-8 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-semibold mb-4">{plan.name}</h3>
              <p className="text-4xl font-bold mb-6">{plan.price}</p>
              <ul className="mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center mb-2">
                    <Check className="w-5 h-5 mr-2 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant={index === 1 ? "default" : "outline"}>
                Choose Plan
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

