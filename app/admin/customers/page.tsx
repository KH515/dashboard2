import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

async function getUsers(token: string) {
  try {
    const res = await fetch("https://api.klafstore.com/api/users", {
      headers: { "Authorization": `Bearer ${token}` },
      cache: "no-store"
    })
    const data = await res.json()
    return data.users || []
  } catch { return [] }
}

const tabs = [
  { label: "العملاء", role: "customer", href: "/admin/customers" },
  { label: "البائعون", role: "seller", href: "/admin/customers/sellers" },
  { label: "العمولة", role: "affiliate", href: "/admin/customers/affiliate" },
  { label: "الموظفون", role: "staff", href: "/admin/customers/staff" },
]

export default async function CustomersPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) redirect("/login")

  const allUsers = await getUsers(token)
  const customers = allUsers.filter((u: any) => u.role === "customer")

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" }}>

      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#000", zIndex: 10 }}>
        <Link href="/admin" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>← رجوع</Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>المستخدمون</span>
        <span style={{ color: "#555", fontSize: "12px" }}>{customers.length}</span>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", padding: "12px 16px", borderBottom: "1px solid #111", overflowX: "auto" }}>
        {tabs.map(tab => (
          <Link key={tab.href} href={tab.href} style={{ textDecoration: "none" }}>
            <div style={{ padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap", background: tab.role === "customer" ? "#fff" : "#111", color: tab.role === "customer" ? "#000" : "#555", border: "1px solid #222" }}>
              {tab.label}
            </div>
          </Link>
        ))}
      </div>

      {/* Cards */}
      <div style={{ padding: "16px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
        {customers.map((user: any) => (
          <Link key={user.id} href={`/admin/customers/${user.id}`} style={{ textDecoration: "none" }}>
            <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "14px", padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#1a1a1a", border: "1px solid #222", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "18px", flexShrink: 0 }}>
                {user.name?.charAt(0) || "؟"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: "700", fontSize: "14px", margin: 0, marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</p>
                <p style={{ color: "#555", fontSize: "12px", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
              </div>
              <svg width="16" height="16" fill="none" stroke="#333" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </div>
          </Link>
        ))}
        {customers.length === 0 && (
          <p style={{ color: "#555", textAlign: "center", padding: "40px", gridColumn: "1/-1" }}>لا يوجد عملاء</p>
        )}
      </div>
    </div>
  )
}