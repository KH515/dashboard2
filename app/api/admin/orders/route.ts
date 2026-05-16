import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders", {
    headers: { "Authorization": `Bearer ${token}` },
    cache: "no-store",
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
