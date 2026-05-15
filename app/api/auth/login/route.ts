import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL

  const res = await fetch(`${apiUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  const text = await res.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    return NextResponse.json({ error: "تعذر الاتصال بالسيرفر" }, { status: 500 })
  }
  
  if (!res.ok) return NextResponse.json(data || { error: "خطأ في المصادقة" }, { status: res.status })
  if (!["admin", "seller", "affiliate"].includes(data.user?.role)) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 })
  }

  return NextResponse.json({ 
    success: true, 
    email: data.user.email,
    accessToken: data.accessToken,
    user: data.user
  })
}