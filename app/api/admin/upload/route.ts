import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })

  const formData = await request.formData()
  const res = await fetch("https://api.klafstore.com/api/upload", {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
    body: formData,
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}