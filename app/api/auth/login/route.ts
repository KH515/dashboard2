import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.klafstore.com"

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
  
  console.log("STATUS:", res.status, "DATA:", JSON.stringify(data)); if (!res.ok) return NextResponse.json(data || { error: "خطأ في المصادقة" }, { status: res.status })
  if (!["admin", "seller", "affiliate"].includes(data.user?.role)) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 })
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString()
  
  try {
    await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/set/${encodeURIComponent(data.user.email)}/${code}/ex/300`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
    })

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "noreply@klafstore.com",
        to: data.user.email,
        subject: "كود تسجيل الدخول",
        html: `<div dir="rtl" style="font-family:Cairo,sans-serif;padding:40px;background:#000;color:#fff;border-radius:16px"><h2>كود تسجيل الدخول</h2><div style="background:#111;border-radius:12px;padding:24px;text-align:center;margin:24px 0"><span style="font-size:40px;font-weight:800;letter-spacing:12px;color:#FF835E">${code}</span></div><p style="color:#555;font-size:13px">صالح لمدة 5 دقائق فقط</p></div>`
      })
    })
  } catch {
    return NextResponse.json({ error: "فشل إرسال الإيميل" }, { status: 500 })
  }

  return NextResponse.json({ 
    success: true, 
    email: data.user.email,
    accessToken: data.accessToken,
    user: data.user
  })
}