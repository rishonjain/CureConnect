import type { Metadata } from "next"
import Link from "next/link"
import { Video, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Header from "../components/header"
import Footer from "../components/footer"

export const metadata: Metadata = {
  title: "Your Consultations | CureConnect",
  description: "Access your scheduled video consultations with CureConnect.",
}

export default function ConsultationsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1 container mx-auto px-6 pt-24 pb-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Your Consultations</h1>

          <div className="grid gap-6">
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader className="bg-teal-50 dark:bg-teal-900/20">
                <CardTitle className="flex items-center">
                  <Video className="w-5 h-5 mr-2 text-teal-600" />
                  Upcoming Consultation
                </CardTitle>
                <CardDescription>Scheduled with Dr. Sarah Johnson</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Doctor</p>
                    <p className="font-medium">Dr. Sarah Johnson</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Cardiology</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date & Time</p>
                    <p className="font-medium">Today</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Current time</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Consultation ID</p>
                    <p className="font-medium font-mono">xyz</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Password: ****</p>
                  </div>
                </div>
                <Link href="/consultation/xyz">
                  <Button className="w-full md:w-auto bg-teal-600 hover:bg-teal-700">
                    Join Consultation
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">No Past Consultations</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Your past consultations will appear here after you complete your first video consultation.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
