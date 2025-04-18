import type { Metadata } from "next"
import DoctorsList from "./doctors-list"

export const metadata: Metadata = {
  title: "Our Doctors | CureConnect",
  description: "Meet our team of experienced healthcare professionals across India.",
}

export default function DoctorsPage() {
  return <DoctorsList />
}
