import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function PUT(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  const body = await request.json()
  const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.klafstore.com"
  const res = await fetch(`${apiUrl}/api/staff/me`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
    body: JSON.stringify(body),
    cache: "no-store"
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}