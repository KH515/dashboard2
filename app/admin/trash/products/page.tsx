import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { RestoreButton } from "../actions"

export const dynamic = "force-dynamic"

async function getProducts(token: string) {
  try {
    const res = await fetch("https://api.klafstore.com/api/products/trash", {
      headers: { "Authorization": `Bearer ${token}` },
      cache: "no-store"
    })
    const data = await res.json()
    return data.products || []
  } catch { return [] }
}

export default async function TrashProductsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) redirect("/login")

  const products = await getProducts(token)
  const klafProducts = products.filter((p: any) => !p.seller_id)
  const sellerProducts = products.filter((p: any) => p.seller_id)

  const subLabel = { fontSize: "11px", color: "#444", fontWeight: "700", marginBottom: "8px", marginTop: "16px" }

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#000", zIndex: 10 }}>
        <Link href="/admin/trash" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>← رجوع</Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>المنتجات المحذوفة</span>
        <span style={{ color: "#555", fontSize: "12px" }}>{products.length}</span>
      </div>

      <div style={{ padding: "16px", maxWidth: "600px", margin: "0 auto" }}>
        {products.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ color: "#555", fontSize: "14px" }}>لا يوجد منتجات محذوفة</p>
          </div>
        )}

        {klafProducts.length > 0 && <>
          <p style={subLabel}>منتجات كلاف ({klafProducts.length})</p>
          {klafProducts.map((p: any) => <ProductCard key={p.id} product={p} />)}
        </>}

        {sellerProducts.length > 0 && <>
          <p style={subLabel}>منتجات البائعين ({sellerProducts.length})</p>
          {sellerProducts.map((p: any) => <ProductCard key={p.id} product={p} />)}
        </>}
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: any }) {
  return (
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
}