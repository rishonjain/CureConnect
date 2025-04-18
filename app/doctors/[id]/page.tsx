import type { Metadata } from "next"
import DoctorProfile from "../doctor-profile"

export const metadata: Metadata = {
  title: "Doctor Profile | CureConnect",
  description: "View detailed information about our healthcare professionals.",
}

export default function DoctorProfilePage({ params }: { params: { id: string } }) {
  return <DoctorProfile doctorId={params.id} />
}
