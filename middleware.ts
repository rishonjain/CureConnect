import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Redirect /services to /ai-assistant
  if (path === "/services") {
    return NextResponse.redirect(new URL("/ai-assistant", request.url))
  }

  // Continue with the request if no redirect is needed
  return NextResponse.next()
}

export const config = {
  matcher: ["/services"],
}
