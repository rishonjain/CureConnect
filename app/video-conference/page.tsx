import type { Metadata } from "next"
import VideoConferenceLanding from "./video-conference-landing"

export const metadata: Metadata = {
  title: "Video Consultations | CureConnect",
  description: "Connect with healthcare professionals through secure video consultations.",
}

export default function VideoConferencePage() {
  return <VideoConferenceLanding />
}

