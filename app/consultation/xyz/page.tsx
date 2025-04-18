import type { Metadata } from "next"
import DirectConsultationAccess from "../direct-consultation-access"

export const metadata: Metadata = {
  title: "Join Consultation | CureConnect",
  description: "Join your scheduled video consultation with CureConnect.",
}

export default function PredefinedConsultationPage() {
  // Hardcoded consultation details
  const consultationDetails = {
    id: "xyz",
    password: "1234",
    doctorName: "Dr. Sarah Johnson",
    speciality: "Cardiology",
  }

  return <DirectConsultationAccess consultation={consultationDetails} />
}
