import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })

  const body = await request.json()
  const res = await fetch(`https://api.klafstore.com/api/products/${productId}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ is_active: body.is_active ? 1 : 0 }),
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}