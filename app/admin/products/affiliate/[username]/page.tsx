import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

async function getAffiliateProducts(token: string, username: string) {
  try {
    const res = await fetch(`https://api.klafstore.com/api/affiliate/products/${username}`, {
      headers: { "Authorization": `Bearer ${token}` },
      cache: "no-store"
    })
    return await res.json()
  } catch { return { products: [] } }
}

export default async function AffiliateUserProductsPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) redirect("/login")

  const data = await getAffiliateProducts(token, username)
  const products = data.products || []

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#000", zIndex: 10 }}>
        <Link href="/admin/products/affiliate" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>← رجوع</Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>منتجات @{username}</span>
        <span style={{ color: "#555", fontSize: "12px" }}>{products.length}</span>
      </div>

      <div style={{ padding: "16px", maxWidth: "700px", margin: "0 auto" }}>
        {products.length === 0 ? (
          <p style={{ color: "#555", textAlign: "center", padding: "40px 0" }}>لا يوجد منتجات</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "10px" }}>
            {products.map((product: any) => (
              <Link key={product.id} href={`/admin/products/${product.id}`} style={{ textDecoration: "none" }}>
                <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "14px", overflow: "hidden" }}>
                  <div style={{ height: "140px", background: "#1a1a1a", overflow: "hidden" }}>
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