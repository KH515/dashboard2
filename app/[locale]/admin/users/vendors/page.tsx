import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getTranslations, getLocale } from "next-intl/server"

export const dynamic = "force-dynamic"

async function getSellers(token: string) {
  try {
    const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/users/sellers-list", {
      headers: { "Authorization": `Bearer ${token}` },
      cache: "no-store"
    })
    const data = await res.json()
    return data.sellers || []
  } catch { return [] }
}

export default async function SellersPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  const locale = await getLocale()
  if (!token) redirect(`/${locale}/login`)

  const t = await getTranslations()
  const isAr = locale === "ar"
  const sellers = await getSellers(token)

  return (
    <div style={{ minHeight: "100vh", background:"#EEEEEE", color: "#111", fontFamily: "Cairo, system-ui, sans-serif", direction: isAr ? "rtl" : "ltr" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e5e5", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background:"#EEEEEE", zIndex: 10 }}>
        <Link href={`/${locale}/admin`} style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>
          {isAr ? "← رجوع" : "← Back"}
        </Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>{t("vendors_page.title")}</span>
        <span style={{ color: "#555", fontSize: "12px" }}>{sellers.length}</span>
      </div>

      <div style={{ padding: "16px", maxWidth: "600px", margin: "0 auto" }}>
        {sellers.length === 0 ? (
          <p style={{ color: "#555", textAlign: "center", padding: "40px 0" }}>{t("vendors_page.no_vendors")}</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {sellers.map((seller: any) => (
              <Link key={seller.id} href={`/${locale}/admin/customers/${seller.id}`} style={{ textDecoration: "none" }}>
                <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "14px", padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "16px" }}>
                      {seller.name?.charAt(0) || "?"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: "700", fontSize: "14px", margin: 0 }}>{seller.name}</p>
                      <p style={{ color: "#555", fontSize: "12px", margin: "2px 0 0" }}>{seller.email}</p>
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: seller.is_active ? "#16a34a" : "#dc2626" }}>
                      {seller.is_active ? t("common.active") : t("common.inactive")}
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                    {[
                      { label: t("vendors_page.products_count"), value: seller.products_count || 0 },
                      { label: t("orders_page.title"), value: seller.orders_count || 0 },
                      { label: t("vendors_page.total_earnings"), value: `${seller.total_earnings || 0} ${t("common.currency")}` },
                    ].map(stat => (
                      <div key={stat.label} style={{ background: "#f8f8f8", borderRadius: "10px", padding: "10px", textAlign: "center" }}>
                        <p style={{ fontWeight: "800", fontSize: "16px", margin: 0 }}>{stat.value}</p>
                        <p style={{ color: "#555", fontSize: "11px", margin: "4px 0 0" }}>{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}