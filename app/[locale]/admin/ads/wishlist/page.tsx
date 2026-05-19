import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdsClient from '../AdsClient'

export const dynamic = 'force-dynamic'

async function getAds(token: string) {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/ads/all', {
      headers: { Authorization: 'Bearer ' + token },
      cache: 'no-store'
    })
    const data = await res.json()
    return (data.ads || []).filter((a: any) => a.placement === 'profile_wishlist')
  } catch { return [] }
}

export default async function AdsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('accessToken')?.value
  if (!token) redirect('/login')
  const ads = await getAds(token)
  return <AdsClient token={token} initialAds={ads} defaultPlacement="profile_wishlist" title="إعلانات المفضلة" />
}