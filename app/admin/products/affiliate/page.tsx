import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

async function getAffiliates(token: string) {
  try {
    const res = await fetch("https://api.klafstore.com/api/users", {
      headers: { "Authorization": `Bearer ${token}` },
      cache: "no-store"
    })
    const data = await res.json()
    return (data.users || []).filter((u: any) => u.role === "affiliate")
  } catch { return [] }
}

export default async function AffiliateProductsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) redirect("/login")

  const affiliates = await getAffiliates(token)

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#000", zIndex: 10 }}>
        <Link href="/admin/products" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>← رجوع</Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>منتجات العمولة</span>
        <span style={{ color: "#555", fontSize: "12px" }}>{affiliates.length}</span>
      </div>

      <div style={{ padding: "16px", maxWidth: "600px", margin: "0 auto" }}>
        {affiliates.length === 0 ? (
          <p style={{ color: "#555", textAlign: "center", padding: "40px 0" }}>لا يوجد شركاء عمولة</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {affiliates.map((a: any) => (
              <Link key={a.id} href={`/admin/products/affiliate/${a.username}`} style={{ textDecoration: "none" }}>
                <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "14px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "18px", flexShrink: 0 }}>
                    {a.name?.charAt(0) || "؟"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: "700", fontSize: "14px", margin: 0 }}>{a.name}</p>
                    <p style={{ color: "#555", fontSize: "12px", margin: "2px 0 0" }}>@{a.username}</p>
                  </div>
                  <svg width="16" height="16" fill="none" stroke="#333" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}