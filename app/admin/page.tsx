import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

async function getStats(token: string) {
  try {
    const [usersRes, ordersRes] = await Promise.all([
      fetch("https://api.klafstore.com/api/users", { headers: { "Authorization": `Bearer ${token}` }, cache: "no-store" }),
      fetch("https://api.klafstore.com/api/orders", { headers: { "Authorization": `Bearer ${token}` }, cache: "no-store" }),
    ])
    const users = await usersRes.json()
    const orders = await ordersRes.json()
    const allUsers = users.users || []
    return {
      customers: allUsers.filter((u: any) => u.role === "customer").length,
      sellers: allUsers.filter((u: any) => u.role === "seller").length,
      affiliates: allUsers.filter((u: any) => u.role === "affiliate").length,
      orders: (orders.orders || []).length,
    }
  } catch { return { customers: 0, sellers: 0, affiliates: 0, orders: 0 } }
}

const Icon = ({ d }: { d: string }) => (
  <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d={d} />
  </svg>
)

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
        <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "16px", padding: "20px", marginBottom: "24px" }}>
          <p style={{ fontWeight: "800", fontSize: "15px", margin: 0, marginBottom: "4px" }}>انضم لشبكة شركاء النجاح</p>
          <p style={{ color: "#555", fontSize: "13px", margin: 0 }}>شارك منتجاتنا واكسب عمولة على كل عملية بيع</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px", marginBottom: "28px" }}>
          {[
            { label: "العملاء", value: stats.customers, href: "/admin/customers" },
            { label: "البائعون", value: stats.sellers, href: "/admin/sellers" },
            { label: "العمولة", value: stats.affiliates, href: "/admin/affiliate" },
            { label: "الطلبات", value: stats.orders, href: "/admin/orders" },
          ].map(stat => (
            <Link key={stat.label} href={stat.href} style={{ textDecoration: "none" }}>
              <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "12px 8px", textAlign: "center" }}>
                <p style={{ fontSize: "22px", fontWeight: "800", margin: 0 }}>{stat.value}</p>
                <p style={{ color: "#555", fontSize: "11px", margin: "4px 0 0" }}>{stat.label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* الإدارة الرئيسية */}
        <p style={{ color: "#555", fontSize: "11px", marginBottom: "10px", fontWeight: "700" }}>الإدارة</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
          {[
            { href: "/admin/customers", label: "المستخدمون", desc: "عملاء، بائعون، عمولة، موظفون", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" },
            { href: "/admin/products", label: "المنتجات", desc: "كل المخزون والمنتجات", icon: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" },
            { href: "/admin/orders", label: "الطلبات", desc: "متابعة وإدارة الطلبات", icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" },
            { href: "/admin/stats", label: "الإحصائيات", desc: "تقارير وأرقام المنصة", icon: "M18 20V10 M12 20V4 M6 20v-6" },
          ].map(s => (
            <Link key={s.href} href={s.href} style={{ textDecoration: "none" }}>
              <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "14px", padding: "16px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div style={{ width: "36px", height: "36px", background: "#1a1a1a", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon d={s.icon} />
                </div>
                <div>
                  <p style={{ fontWeight: "700", fontSize: "14px", margin: 0, marginBottom: "2px" }}>{s.label}</p>
                  <p style={{ color: "#555", fontSize: "11px", margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* الأدوات */}
        <p style={{ color: "#555", fontSize: "11px", marginBottom: "10px", fontWeight: "700" }}>الأدوات</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
          {[
            { href: "/admin/ads", label: "الإعلانات", icon: "M19 9l-7 7-7-7" },
{ href: "/admin/categories", label: "التصنيفات", icon: "M4 6h16M4 12h16M4 18h7" },
{ href: "/admin/brands", label: "البراندات", icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" }, // ← أضف هنا
{ href: "/admin/team", label: "الفريق", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
{ href: "/admin/trash", label: "السلة", icon: "M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6" },
          ].map(s => (
            <Link key={s.href} href={s.href} style={{ textDecoration: "none" }}>
              <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "14px", padding: "16px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <Icon d={s.icon} />
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#fff", textAlign: "center" }}>{s.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}