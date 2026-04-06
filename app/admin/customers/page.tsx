import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

async function getCustomers(token: string) {
  try {
    const res = await fetch("https://api.klafstore.com/api/users", {
      headers: { "Authorization": `Bearer ${token}` },
      cache: "no-store"
    })
    const data = await res.json()
    return data.users || []
  } catch { return [] }
}

export default async function CustomersPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) redirect("/login")

  const customers = await getCustomers(token)

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" }}>
      
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#000", zIndex: 10 }}>
        <Link href="/admin" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>← رجوع</Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>العملاء</span>
        <span style={{ color: "#555", fontSize: "12px" }}>{customers.length}</span>
      </div>

      {/* Table */}
      <div style={{ padding: "16px", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #222" }}>
              <th style={{ padding: "12px", textAlign: "right", color: "#555", fontSize: "12px", fontWeight: "700" }}>الاسم</th>
              <th style={{ padding: "12px", textAlign: "right", color: "#555", fontSize: "12px", fontWeight: "700" }}>الإيميل</th>
              <th style={{ padding: "12px", textAlign: "right", color: "#555", fontSize: "12px", fontWeight: "700" }}>الدور</th>
              <th style={{ padding: "12px", textAlign: "right", color: "#555", fontSize: "12px", fontWeight: "700" }}>الإجراء</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((user: any) => (
              <tr key={user.id} style={{ borderBottom: "1px solid #111" }}>
                <td style={{ padding: "14px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "14px", flexShrink: 0 }}>
                      {user.name?.charAt(0) || "؟"}
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: "600" }}>{user.name}</span>
                  </div>
                </td>
                <td style={{ padding: "14px 12px", color: "#555", fontSize: "13px" }}>{user.email}</td>
                <td style={{ padding: "14px 12px" }}>
                  <span style={{ background: "#1a1a1a", border: "1px solid #222", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", color: "#fff" }}>
                    {user.role === "admin" ? "أدمن" : user.role === "seller" ? "بائع" : user.role === "affiliate" ? "عمولة" : "عميل"}
                  </span>
                </td>
                <td style={{ padding: "14px 12px" }}>
                  <Link href={`/admin/customers/${user.id}`} style={{ color: "#fff", fontSize: "12px", textDecoration: "none", border: "1px solid #222", padding: "5px 12px", borderRadius: "8px" }}>
                    عرض
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}