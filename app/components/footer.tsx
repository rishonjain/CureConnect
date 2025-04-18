import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-teal-600 dark:bg-teal-800 text-white relative">
      <div className="absolute top-0 left-0 w-full overflow-hidden">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-16"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-current text-white dark:text-gray-900"
          ></path>
        </svg>
      </div>
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">CureConnect</h3>
            <p className="mb-4">Providing quality healthcare for a better tomorrow.</p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-teal-200 transition-colors">
                <Facebook />
              </Link>
              <Link href="#" className="hover:text-teal-200 transition-colors">
                <Twitter />
              </Link>
              <Link href="#" className="hover:text-teal-200 transition-colors">
                <Instagram />
              </Link>
              <Link href="#" className="hover:text-teal-200 transition-colors">
                <Linkedin />
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-teal-200 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-teal-200 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-teal-200 transition-colors">
                  Doctors
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-teal-200 transition-colors">
                  Appointments
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-teal-200 transition-colors">
                  Cardiology
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-teal-200 transition-colors">
                  Neurology
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-teal-200 transition-colors">
                  Orthopedics
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-teal-200 transition-colors">
                  Ophthalmology
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <p>123 Medical Center Dr.</p>
            <p>Healthville, HV 12345</p>
            <p>Phone: (123) 456-7890</p>
            <p>Email: info@medicare.com</p>
          </div>
        </div>
      </div>
      <div className="bg-teal-700 dark:bg-teal-900 py-4">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 CureConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
