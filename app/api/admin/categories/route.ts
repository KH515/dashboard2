import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories", { headers: { Authorization: "Bearer " + token }, cache: "no-store" })
  return NextResponse.json(await res.json(), { status: res.status })
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  const body = await req.json()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + token }, body: JSON.stringify(body) })
  return NextResponse.json(await res.json(), { status: res.status })
}
