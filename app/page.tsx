import Header from "./components/header"
import Hero from "./components/hero"
import Features from "./components/features"
import Specialties from "./components/specialties"
import Appointment from "./components/appointment"
import Testimonials from "./components/testimonials"
import Footer from "./components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200">
      <Header />
      <main>
        <Hero />
        <Features />
        <Specialties />
        <Appointment />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}
