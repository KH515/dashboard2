import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { email, code, accessToken } = await request.json()

  // تحقق من الكود في KV
  const kvRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/96b5233402eaf3c380a3e89cf7fa5723/storage/kv/namespaces/741298b490c9481ead5a7551f39a17c6/values/${email}`, {
    headers: {
      "Authorization": `Bearer ${process.env.CF_API_TOKEN}`,
    },
  })

  if (!kvRes.ok) return NextResponse.json({ error: "الكود غير موجود أو انتهت صلاحيته" }, { status: 400 })

  const storedCode = await kvRes.text()
  if (storedCode !== code) return NextResponse.json({ error: "الكود غير صحيح" }, { status: 400 })

  // احذف الكود من KV
  await fetch(`https://api.cloudflare.com/client/v4/accounts/96b5233402eaf3c380a3e89cf7fa5723/storage/kv/namespaces/741298b490c9481ead5a7551f39a17c6/values/${email}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${process.env.CF_API_TOKEN}`,
    },
  })

  // حفظ الـ cookie
  const response = NextResponse.json({ success: true })
  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
    path: "/",
  })

  return response
}