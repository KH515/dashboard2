import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.klafstore.com'

async function getToken() {
  const cookieStore = await cookies()
  return cookieStore.get('accessToken')?.value || ''
}

export async function GET() {
  const token = await getToken()
  const res = await fetch(API + '/api/ads/all', { headers:{ Authorization:'Bearer ' + token }, cache:'no-store' })
  return NextResponse.json(await res.json(), { status: res.status })
}

export async function POST(req: Request) {
  const token = await getToken()
  const body = await req.json()
  const res = await fetch(API + '/api/ads', { method:'POST', headers:{ Authorization:'Bearer ' + token, 'Content-Type':'application/json' }, body:JSON.stringify(body) })
  return NextResponse.json(await res.json(), { status: res.status })
}