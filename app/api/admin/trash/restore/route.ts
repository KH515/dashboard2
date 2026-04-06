import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })

  const { type, id } = await request.json()

  const url = type === "user"
    ? `https://api.klafstore.com/api/users/trash/${id}/restore`
    : `https://api.klafstore.com/api/products/trash/${id}/restore`

  const res = await fetch(url, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${token}` },
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}