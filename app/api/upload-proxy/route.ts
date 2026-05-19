import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.klafstore.com'

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('accessToken')?.value || ''
  const body = await req.formData()
  const res = await fetch(API + '/api/upload', { method:'POST', headers:{ Authorization:'Bearer ' + token }, body })
  return NextResponse.json(await res.json(), { status: res.status })
}