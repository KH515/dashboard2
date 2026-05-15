import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })

  const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.klafstore.com"
  const res = await fetch(`${apiUrl}/api/staff/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store"
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}