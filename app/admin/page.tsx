import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

const sections = [
  { href: "/admin/customers", label: "المستخدمون", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" },
  { href: "/admin/sellers", label: "البائعون", icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" },
  { href: "/admin/products", label: "المنتجات", icon: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" },
  { href: "/admin/orders", label: "الطلبات", icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" },
  { href: "/admin/stats", label: "الإحصائيات", icon: "M18 20V10 M12 20V4 M6 20v-6" },
  { href: "/admin/categories", label: "التصنيفات", icon: "M4 6h16M4 12h16M4 18h7" },
  { href: "/admin/ads", label: "الإعلانات", icon: "M19 9l-7 7-7-7" },
  { href: "/admin/affiliate", label: "العمولات", icon: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" },
  { href: "/admin/team", label: "الفريق", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" },
  { href: "/admin/trash", label: "السلة", icon: "M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" },
]

async function getStats(token: string) {
  try {
    const [usersRes, productsRes, ordersRes] = await Promise.all([
      fetch("https://api.klafstore.com/api/users", { headers: { "Authorization": `Bearer ${token}` }, cache: "no-store" }),
      fetch("https://api.klafstore.com/api/products?limit=1", { headers: { "Authorization": `Bearer ${token}` }, cache: "no-store" }),
      fetch("https://api.klafstore.com/api/orders", { headers: { "Authorization": `Bearer ${token}` }, cache: "no-store" }),
    ])
    const users = await usersRes.json()
    const orders = await ordersRes.json()
    return {
      users: (users.users || []).length,
      orders: (orders.orders || []).length,
    }
  } catch { return { users: 0, orders: 0 } }
}

export default async function AdminPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) redirect("/login")

  const stats = await getStats(token)
  const now = new Date().toLocaleDateString("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" }}>

      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#000", zIndex: 10 }}>
        <img src="https://cdn.klafstore.com/logo.png.png" alt="كلاف ستور" style={{ height: "32px" }} />
        <form action="/api/auth/logout" method="POST">
          <button style={{ background: "transparent", border: "1px solid #222", color: "#555", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontFamily: "Cairo, system-ui, sans-serif" }}>
            خروج
          </button>
        </form>
      </div>

      <div style={{ padding: "20px 16px", maxWidth: "700px", margin: "0 auto" }}>

        {/* Greeting */}
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "800", margin: 0, marginBottom: "4px" }}>مرحباً بك في لوحة التحكم</h1>
          <p style={{ color: "#555", fontSize: "12px", margin: 0 }}>{now}</p>
        </div>

        {/* Ad Banner */}
        <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "16px", padding: "20px", marginBottom: "20px", textAlign: "center" }}>
          <p style={{ fontWeight: "800", fontSize: "16px", margin: 0, marginBottom: "6px" }}>انضم لشبكة شركاء النجاح</p>
          <p style={{ color: "#555", fontSize: "13px", margin: 0 }}>شارك منتجاتنا واكسب عمولة على كل عملية بيع</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
          {[
            { label: "المستخدمون", value: stats.users },
            { label: "الطلبات", value: stats.orders },
          ].map(stat => (
            <div key={stat.label} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "14px", padding: "16px", textAlign: "center" }}>
              <p style={{ fontSize: "28px", fontWeight: "800", margin: 0 }}>{stat.value}</p>
              <p style={{ color: "#555", fontSize: "12px", margin: "4px 0 0" }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Grid */}
        <p style={{ color: "#555", fontSize: "12px", marginBottom: "12px", fontWeight: "700" }}>الأقسام</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          {sections.map((section) => (
            <Link key={section.href} href={section.href} style={{ textDecoration: "none" }}>
              <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "16px", padding: "20px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d={section.icon} />
                </svg>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#fff", textAlign: "center" }}>{section.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}