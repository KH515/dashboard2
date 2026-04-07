import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

async function getSellers(token: string) {
  try {
    const res = await fetch("https://api.klafstore.com/api/users/sellers-list", {
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
  if (!token) redirect("/login")

  const sellers = await getSellers(token)

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#000", zIndex: 10 }}>
        <Link href="/admin" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>← رجوع</Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>البائعون</span>
        <span style={{ color: "#555", fontSize: "12px" }}>{sellers.length}</span>
      </div>

      <div style={{ padding: "16px", maxWidth: "600px", margin: "0 auto" }}>
        {sellers.length === 0 ? (
          <p style={{ color: "#555", textAlign: "center", padding: "40px 0" }}>لا يوجد بائعون</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {sellers.map((seller: any) => (
              <Link key={seller.id} href={`/admin/customers/${seller.id}`} style={{ textDecoration: "none" }}>
                <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "14px", padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "16px" }}>
                      {seller.name?.charAt(0) || "؟"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: "700", fontSize: "14px", margin: 0 }}>{seller.name}</p>
                      <p style={{ color: "#555", fontSize: "12px", margin: "2px 0 0" }}>{seller.email}</p>
                    </div>
                    <span style={{ fontSize: "11px", color: seller.is_active ? "#4ade80" : "#f87171" }}>
                      {seller.is_active ? "نشط" : "معطّل"}
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                    {[
                      { label: "المنتجات", value: seller.products_count || 0 },
                      { label: "الطلبات", value: seller.orders_count || 0 },
                      { label: "الأرباح", value: `${seller.total_earnings || 0} ر.س` },
                    ].map(stat => (
                      <div key={stat.label} style={{ background: "#0a0a0a", borderRadius: "10px", padding: "10px", textAlign: "center" }}>
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