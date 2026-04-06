import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

async function getTrashCounts(token: string) {
  try {
    const [usersRes, productsRes] = await Promise.all([
      fetch("https://api.klafstore.com/api/users/trash", {
        headers: { "Authorization": `Bearer ${token}` },
        cache: "no-store"
      }),
      fetch("https://api.klafstore.com/api/products/trash", {
        headers: { "Authorization": `Bearer ${token}` },
        cache: "no-store"
      }),
    ])
    const users = await usersRes.json()
    const products = await productsRes.json()
    return { users: users.users || [], products: products.products || [] }
  } catch { return { users: [], products: [] } }
}

export default async function TrashPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) redirect("/login")

  const trash = await getTrashCounts(token)
  const users = trash.users || []
  const products = trash.products || []

  const sections = [
    { href: "/admin/trash/users", label: "المستخدمون", count: users.length },
    { href: "/admin/trash/products", label: "المنتجات", count: products.length },
  ]

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#000", zIndex: 10 }}>
        <Link href="/admin" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>← رجوع</Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>سلة المهملات</span>
        <span style={{ color: "#555", fontSize: "12px" }}>{users.length + products.length}</span>
      </div>

      <div style={{ padding: "24px 16px", maxWidth: "500px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {sections.map(section => (
            <Link key={section.href} href={section.href} style={{ textDecoration: "none" }}>
              <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "16px", padding: "20px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "24px", fontWeight: "800", color: "#fff" }}>{section.count}</span>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#555" }}>{section.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}