import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  const res = await fetch("https://api.klafstore.com/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  
  const data = await res.json()
  
  if (!res.ok) return NextResponse.json(data, { status: res.status })
  if (!["admin", "seller", "affiliate"].includes(data.user.role)) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 })
  }
  
  const response = NextResponse.json({ user: data.user })
  
  response.cookies.set("accessToken", data.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
    path: "/",
  })
  
  return response
}