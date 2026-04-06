import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { RestoreButton } from "./actions"

export const dynamic = "force-dynamic"

async function getTrash(token: string) {
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

  const trash = await getTrash(token)
  const users = trash.users || []
  const products = trash.products || []
  const total = users.length + products.length

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#000", zIndex: 10 }}>
        <Link href="/admin" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>← رجوع</Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>سلة المهملات</span>
        <span style={{ color: "#555", fontSize: "12px" }}>{total}</span>
      </div>

      <div style={{ padding: "16px", maxWidth: "600px", margin: "0 auto" }}>
        {users.length > 0 && (
          <>
            <p style={{ color: "#555", fontSize: "12px", fontWeight: "700", marginBottom: "12px", marginTop: "8px" }}>المستخدمون ({users.length})</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
              {users.map((user: any) => (
                <div key={user.id} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "14px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "16px", flexShrink: 0 }}>
                    {user.name?.charAt(0) || "؟"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: "700", fontSize: "14px", margin: 0 }}>{user.name}</p>
                    <p style={{ color: "#555", fontSize: "12px", margin: "2px 0 0" }}>{user.email}</p>
                  </div>
                  <RestoreButton type="user" id={user.id} />
                </div>
              ))}
            </div>
          </>
        )}

        {products.length > 0 && (
          <>
            <p style={{ color: "#555", fontSize: "12px", fontWeight: "700", marginBottom: "12px" }}>المنتجات ({products.length})</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {products.map((product: any) => (
                <div key={product.id} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "14px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#1a1a1a", overflow: "hidden", flexShrink: 0 }}>
                    {product.image && <img src={product.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: "700", fontSize: "14px", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.name}</p>
                    <p style={{ color: "#555", fontSize: "12px", margin: "2px 0 0" }}>{product.price} ر.س</p>
                  </div>
                  <RestoreButton type="product" id={product.id} />
                </div>
              ))}
            </div>
          </>
        )}

        {total === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: "48px", marginBottom: "12px" }}>🗑️</p>
            <p style={{ color: "#555", fontSize: "14px" }}>السلة فارغة</p>
          </div>
        )}
      </div>
    </div>
  )
}
