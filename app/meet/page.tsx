import type { Metadata } from "next"
import MeetJoinScreen from "./meet-join-screen"

export const metadata: Metadata = {
  title: "CureConnect Meet | Video Conferencing",
  description: "Secure, high-quality video conferencing for healthcare professionals and patients.",
}

export default function MeetPage() {
  return <MeetJoinScreen />
}
