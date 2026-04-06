import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

async function getUser(token: string, id: string) {
  try {
    const res = await fetch(`https://api.klafstore.com/api/users/${id}`, {
      headers: { "Authorization": `Bearer ${token}` },
      cache: "no-store"
    })
    return await res.json()
  } catch { return null }
}

export default async function UserPage({ params }: { params: { id: string } }) {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) redirect("/login")

  const user = await getUser(token, params.id)
  if (!user) redirect("/admin/customers")

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#000", zIndex: 10 }}>
        <Link href="/admin/customers" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>← رجوع</Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>تفاصيل المستخدم</span>
        <span />
      </div>

      <div style={{ padding: "24px 16px", maxWidth: "500px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#1a1a1a", border: "1px solid #222", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "24px" }}>
            {user.name?.charAt(0) || "؟"}
          </div>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: "800", margin: 0 }}>{user.name}</h1>
            <p style={{ color: "#555", fontSize: "13px", margin: "4px 0 0" }}>{user.email}</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "#111", borderRadius: "14px", overflow: "hidden" }}>
          {[
            { label: "الدور", value: user.role },
            { label: "اليوزرنيم", value: user.username || "—" },
            { label: "تاريخ التسجيل", value: user.created_at ? new Date(user.created_at).toLocaleDateString("ar-SA") : "—" },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "14px 16px", background: "#0a0a0a", borderBottom: "1px solid #111" }}>
              <span style={{ color: "#555", fontSize: "13px" }}>{row.label}</span>
              <span style={{ fontSize: "13px", fontWeight: "600" }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}