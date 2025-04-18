import type { Metadata } from "next"
import VideoConferenceRoom from "../../video-conference-room"

export const metadata: Metadata = {
  title: "Video Consultation Room | CureConnect",
  description: "Secure video consultation with healthcare professionals.",
}

export default function VideoConferenceRoomPage({ params }: { params: { id: string } }) {
  return <VideoConferenceRoom roomId={params.id} />
}
