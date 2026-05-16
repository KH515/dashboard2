import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://api.klafstore.com"}/api/coupons/" + id, { method: "DELETE", headers: { Authorization: "Bearer " + token } })
  return NextResponse.json(await res.json(), { status: res.status })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) return NextResponse.json({ error: `غير مصرح` }, { status: 401 })
  const body = await req.json()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://api.klafstore.com"}/api/coupons/" + id, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ` + token }, body: JSON.stringify(body) })
  return NextResponse.json(await res.json(), { status: res.status })
}
