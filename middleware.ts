import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("accessToken")?.value

  const publicPaths = ["/", "/login", "/seller/login", "/affiliate/login", "/unauthorized"]
  if (publicPaths.includes(pathname)) return NextResponse.next()

  if (!token) {
    if (pathname.startsWith("/seller")) return NextResponse.redirect(new URL("/seller/login", request.url))
    if (pathname.startsWith("/affiliate")) return NextResponse.redirect(new URL("/affiliate/login", request.url))
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
}