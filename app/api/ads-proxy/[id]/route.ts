import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.klafstore.com"

async function getToken() {
  const cookieStore = await cookies()
  return cookieStore.get("accessToken")?.value || ""
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const token = await getToken()
  const body = await req.json()
  const res = await fetch(`${API}/api/ads/${params.id}`, { method:"PUT", headers:{ Authorization:`Bearer ${token}`, "Content-Type":"application/json" }, body:JSON.stringify(body) })
  return NextResponse.json(await res.json(), { status: res.status })
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const token = await getToken()
  const res = await fetch(`${API}/api/ads/${params.id}`, { method:"DELETE", headers:{ Authorization:`Bearer ${token}` } })
  return NextResponse.json(await res.json(), { status: res.status })
}