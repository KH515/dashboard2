import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getTranslations, getLocale } from "next-intl/server"
import { AdsActions } from "./actions"

export const dynamic = "force-dynamic"

async function getAds(token: string) {
  try {
    const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/announcements/all", {
      headers: { "Authorization": `Bearer ${token}` },
      cache: "no-store"
    })
    const data = await res.json()
    return data.announcements || []
  } catch { return [] }
}

export default async function AdsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  const locale = await getLocale()
  if (!token) redirect(`/${locale}/login`)

  const t = await getTranslations()
  const isAr = locale === "ar"
  const ads = await getAds(token)

  const targetLabel = (target: string) => {
    if (target === "seller") return t("vendors_page.title")
    if (target === "affiliate") return isAr ? "العمولة" : "Affiliate"
    return isAr ? "الجميع" : "Everyone"
  }

  return (
    <div style={{ minHeight: "100vh", background:"#EEEEEE", color: "#111", fontFamily: "Cairo, system-ui, sans-serif", direction: isAr ? "rtl" : "ltr" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e5e5", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background:"#EEEEEE", zIndex: 10 }}>
        <Link href={`/${locale}/admin`} style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>
          {isAr ? "← رجوع" : "← Back"}
        </Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>{t("marketing_page.ads")}</span>
        <Link href={`/${locale}/admin/ads/new`} style={{ fontSize: "12px", textDecoration: "none", background: "#FF835E", color: "#fff", padding: "6px 14px", borderRadius: "8px", fontWeight: "700" }}>
          + {t("common.add")}
        </Link>
      </div>

      <div style={{ padding: "16px", maxWidth: "600px", margin: "0 auto" }}>
        {ads.length === 0 ? (
          <p style={{ color: "#555", textAlign: "center", padding: "40px 0" }}>
            {isAr ? "لا يوجد إعلانات" : "No ads"}
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {ads.map((ad: any) => (
              <div key={ad.id} style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "14px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: "700", fontSize: "14px", margin: 0, marginBottom: "4px" }}>{ad.title}</p>
                    {ad.body && <p style={{ color: "#555", fontSize: "13px", margin: 0 }}>{ad.body}</p>}
                  </div>
                  <span style={{ background: "#f0f0f0", border: "1px solid #e5e5e5", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", color: "#111", marginRight: "12px", marginLeft: "12px", flexShrink: 0 }}>
                    {targetLabel(ad.target)}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: ad.is_active ? "#16a34a" : "#dc2626" }}>
                    {ad.is_active ? t("common.active") : t("common.inactive")}
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