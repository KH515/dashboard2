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

const sectionLabel = { fontSize: "11px", fontWeight: "700", color: "#555", marginBottom: "10px", marginTop: "20px", letterSpacing: "0.5px" }
const subLabel = { fontSize: "11px", color: "#333", fontWeight: "700", marginBottom: "8px", marginTop: "14px", paddingRight: "4px" }

export default async function TrashPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) redirect("/login")

  const trash = await getTrash(token)
  const users = trash.users || []
  const products = trash.products || []

  const customers = users.filter((u: any) => u.role === "customer")
  const sellers = users.filter((u: any) => u.role === "seller")
  const affiliates = users.filter((u: any) => u.role === "affiliate")
  const staff = users.filter((u: any) => u.role === "manager" || u.role === "staff")
  const klafProducts = products.filter((p: any) => !p.seller_id)
  const sellerProducts = products.filter((p: any) => p.seller_id)

  const total = users.length + products.length

  const UserCard = ({ user }: { user: any }) => (
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

  const ProductCard = ({ product }: { product: any }) => (
    <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "12px 14px", display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
      <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#1a1a1a", overflow: "hidden", flexShrink: 0 }}>
        {product.image && <img src={product.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: "700", fontSize: "13px", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.name}</p>
        <p style={{ color: "#555", fontSize: "11px", margin: "2px 0 0" }}>{product.price} ر.س</p>
      </div>
      <RestoreButton type="product" id={product.id} />
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#000", zIndex: 10 }}>
        <Link href="/admin" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>← رجوع</Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>سلة المهملات</span>
        <span style={{ color: "#555", fontSize: "12px" }}>{total}</span>
      </div>

      <div style={{ padding: "16px", maxWidth: "600px", margin: "0 auto" }}>

        {/* المستخدمون */}
        {users.length > 0 && (
          <>
            <p style={sectionLabel}>المستخدمون ({users.length})</p>
            {customers.length > 0 && <><p style={subLabel}>العملاء</p>{customers.map((u: any) => <UserCard key={u.id} user={u} />)}</>}
            {sellers.length > 0 && <><p style={subLabel}>البائعون</p>{sellers.map((u: any) => <UserCard key={u.id} user={u} />)}</>}
            {affiliates.length > 0 && <><p style={subLabel}>العمولة</p>{affiliates.map((u: any) => <UserCard key={u.id} user={u} />)}</>}
            {staff.length > 0 && <><p style={subLabel}>الموظفون</p>{staff.map((u: any) => <UserCard key={u.id} user={u} />)}</>}
          </>
        )}

        {/* المنتجات */}
        {products.length > 0 && (
          <>
            <p style={{ ...sectionLabel, marginTop: "28px" }}>المنتجات ({products.length})</p>
            {klafProducts.length > 0 && <><p style={subLabel}>منتجات كلاف</p>{klafProducts.map((p: any) => <ProductCard key={p.id} product={p} />)}</>}
            {sellerProducts.length > 0 && <><p style={subLabel}>منتجات البائعين</p>{sellerProducts.map((p: any) => <ProductCard key={p.id} product={p} />)}</>}
          </>
        )}

        {total === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ color: "#333", fontSize: "32px", marginBottom: "12px" }}>—</p>
            <p style={{ color: "#555", fontSize: "14px" }}>السلة فارغة</p>
          </div>
        )}
      </div>
    </div>
  )
}