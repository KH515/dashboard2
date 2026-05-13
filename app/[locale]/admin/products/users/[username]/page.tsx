import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

async function getProducts(token: string, username: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?limit=100`, {
      headers: { "Authorization": `Bearer ${token}` },
      cache: "no-store"
    })
    const data = await res.json()
    return data.products || []
  } catch { return [] }
}

export default async function UserProductsPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) redirect("/login")

  const products = await getProducts(token, username)

  return (
    <div style={{ minHeight: "100vh", background:"#EEEEEE", color: "#111", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e5e5", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background:"#EEEEEE", zIndex: 10 }}>
        <Link href="/admin/products" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>← رجوع</Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>منتجات @{username}</span>
        <Link href="/admin/products/new" style={{ fontSize: "12px", textDecoration: "none", background: "#fff", color: "#000", padding: "6px 14px", borderRadius: "8px", fontWeight: "700" }}>+ إضافة</Link>
      </div>

      <div style={{ padding: "16px", maxWidth: "700px", margin: "0 auto" }}>
        {products.length === 0 ? (
          <p style={{ color: "#555", textAlign: "center", padding: "40px 0" }}>لا يوجد منتجات</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "10px" }}>
            {products.map((product: any) => (
              <Link key={product.id} href={`/admin/products/${product.id}`} style={{ textDecoration: "none" }}>
                <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "14px", overflow: "hidden" }}>
                  <div style={{ height: "140px", background: "#f0f0f0", overflow: "hidden" }}>
                    {product.image && <img src={product.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  </div>
                  <div style={{ padding: "12px" }}>
                    <p style={{ fontWeight: "700", fontSize: "13px", margin: 0, marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.name}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "13px", fontWeight: "800" }}>{product.price} ر.س</span>
                      <span style={{ fontSize: "11px", color: "#555" }}>مخزون: {product.stock}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}