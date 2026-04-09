import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })

  const body = await request.json()
  const res = await fetch(`https://api.klafstore.com/api/brands/${username}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}