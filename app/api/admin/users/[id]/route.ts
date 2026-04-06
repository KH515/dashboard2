import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })

  const res = await fetch(`https://api.klafstore.com/api/users/${params.id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` },
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}