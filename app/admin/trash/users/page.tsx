import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { RestoreButton } from "../actions"

export const dynamic = "force-dynamic"

async function getUsers(token: string) {
  try {
    const res = await fetch("https://api.klafstore.com/api/users/trash", {
      headers: { "Authorization": `Bearer ${token}` },
      cache: "no-store"
    })
    const data = await res.json()
    return data.users || []
  } catch { return [] }
}

const subLabel = { fontSize: "11px", color: "#444", fontWeight: "700", marginBottom: "8px", marginTop: "16px" }

export default async function TrashUsersPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) redirect("/login")

  const users = await getUsers(token)
  const customers = users.filter((u: any) => u.role === "customer")
  const sellers = users.filter((u: any) => u.role === "seller")
  const affiliates = users.filter((u: any) => u.role === "affiliate")
  const staff = users.filter((u: any) => u.role === "manager" || u.role === "staff")

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#000", zIndex: 10 }}>
        <Link href="/admin/trash" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>← رجوع</Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>المستخدمون المحذوفون</span>
        <span style={{ color: "#555", fontSize: "12px" }}>{users.length}</span>
      </div>

      <div style={{ padding: "16px", maxWidth: "600px", margin: "0 auto" }}>
        {users.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ color: "#555", fontSize: "14px" }}>لا يوجد مستخدمون محذوفون</p>
          </div>
        )}

        {customers.length > 0 && <>
          <p style={subLabel}>العملاء ({customers.length})</p>
          {customers.map((u: any) => <UserCard key={u.id} user={u} />)}
        </>}

        {sellers.length > 0 && <>
          <p style={subLabel}>البائعون ({sellers.length})</p>
          {sellers.map((u: any) => <UserCard key={u.id} user={u} />)}
        </>}

        {affiliates.length > 0 && <>
          <p style={subLabel}>العمولة ({affiliates.length})</p>
          {affiliates.map((u: any) => <UserCard key={u.id} user={u} />)}
        </>}

        {staff.length > 0 && <>
          <p style={subLabel}>الموظفون ({staff.length})</p>
          {staff.map((u: any) => <UserCard key={u.id} user={u} />)}
        </>}
      </div>
    </div>
  )
}

function UserCard({ user }: { user: any }) {
  return (
    <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "12px 14px", display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
      <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "14px", flexShrink: 0 }}>
        {user.name?.charAt(0) || "؟"}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: "700", fontSize: "13px", margin: 0 }}>{user.name}</p>
        <p style={{ color: "#555", fontSize: "11px", margin: "2px 0 0" }}>{user.email}</p>
      </div>
      <RestoreButton type="user" id={user.id} />
    </div>
  )
}