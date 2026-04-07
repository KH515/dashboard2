import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })

  const res = await fetch("https://api.klafstore.com/api/products?limit=200&include_inactive=1", {
    headers: { "Authorization": `Bearer ${token}` },
    cache: "no-store"
  })
  const data = await res.json()
  return NextResponse.json(data)
}