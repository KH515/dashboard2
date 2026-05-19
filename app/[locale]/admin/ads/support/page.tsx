import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdsClient from '../AdsClient'

export const dynamic = 'force-dynamic'

async function getAds(token: string) {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/ads/all', {
      headers: { Authorization: 'Bearer ' + token }, cache: 'no-store'
    })
    const data = await res.json()
    return (data.ads || []).filter((a: any) => a.placement === 'support_banner')
  } catch { return [] }
}

export default async function AdsSupportPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('accessToken')?.value
  if (!token) redirect('/login')
  const ads = await getAds(token)
  return <AdsClient token={token} initialAds={ads} defaultPlacement="support_banner" title="إعلانات صفحة الدعم" />
}