import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { email, code, accessToken, expectedCode } = await request.json()

  if (!expectedCode || expectedCode !== code) {
    return NextResponse.json({ error: "الكود غير صحيح" }, { status: 400 })
  }

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