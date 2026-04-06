import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function DELETE(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })

  const res = await fetch("https://api.klafstore.com/api/users/me", {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` },
  })

  const data = await res.json()
  if (!res.ok) return NextResponse.json(data, { status: res.status })

  // مسح الـ cookie
  const response = NextResponse.json({ success: true })
  response.cookies.set("accessToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  })

  return response
}