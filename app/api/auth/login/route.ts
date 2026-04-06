import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { email, code, accessToken } = await request.json()

  // تحقق من الكود في Upstash
  const kvRes = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/${email}`, {
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
  })

  const kvData = await kvRes.json()
  const storedCode = kvData.result

  if (!storedCode) return NextResponse.json({ error: "الكود غير موجود أو انتهت صلاحيته" }, { status: 400 })
  if (storedCode !== code) return NextResponse.json({ error: "الكود غير صحيح" }, { status: 400 })

  // احذف الكود
  await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/del/${email}`, {
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
  })

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