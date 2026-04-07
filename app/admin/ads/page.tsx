import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { AdsActions } from "./actions"

export const dynamic = "force-dynamic"

async function getAds(token: string) {
  try {
    const res = await fetch("https://api.klafstore.com/api/announcements/all", {
      headers: { "Authorization": `Bearer ${token}` },
      cache: "no-store"
    })
    const data = await res.json()
    return data.announcements || []
  } catch { return [] }
}

const targetLabel = (target: string) => {
  if (target === "seller") return "البائعون"
  if (target === "affiliate") return "العمولة"
  return "الجميع"
}

export default async function AdsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) redirect("/login")

  const ads = await getAds(token)

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#000", zIndex: 10 }}>
        <Link href="/admin" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>← رجوع</Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>الإعلانات</span>
        <Link href="/admin/ads/new" style={{ fontSize: "12px", textDecoration: "none", background: "#fff", color: "#000", padding: "6px 14px", borderRadius: "8px", fontWeight: "700" }}>+ إضافة</Link>
      </div>

      <div style={{ padding: "16px", maxWidth: "600px", margin: "0 auto" }}>
        {ads.length === 0 ? (
          <p style={{ color: "#555", textAlign: "center", padding: "40px 0" }}>لا يوجد إعلانات</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {ads.map((ad: any) => (
              <div key={ad.id} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "14px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: "700", fontSize: "14px", margin: 0, marginBottom: "4px" }}>{ad.title}</p>
                    {ad.body && <p style={{ color: "#555", fontSize: "13px", margin: 0 }}>{ad.body}</p>}
                  </div>
                  <span style={{ background: "#1a1a1a", border: "1px solid #222", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", color: "#fff", marginRight: "12px", flexShrink: 0 }}>
                    {targetLabel(ad.target)}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                  <span style={{ fontSize: "11px", color: ad.is_active ? "#4ade80" : "#f87171" }}>
                    {ad.is_active ? "نشط" : "معطّل"}
                  </span>
                  <AdsActions adId={ad.id} isActive={ad.is_active} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}