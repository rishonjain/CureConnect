import type { Metadata } from "next"
import MeetRoom from "../../meet-room"

export const metadata: Metadata = {
  title: "Meeting Room | CureConnect Meet",
  description: "Secure, high-quality video conferencing for healthcare professionals and patients.",
}

export default function MeetRoomPage({ params }: { params: { id: string } }) {
  return <MeetRoom roomId={params.id} />
}
