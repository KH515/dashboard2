import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ProductActions } from "./actions"

export const dynamic = "force-dynamic"

async function getProduct(token: string, id: string) {
  try {
    const res = await fetch(`https://api.klafstore.com/api/products/${id}`, {
      headers: { "Authorization": `Bearer ${token}` },
      cache: "no-store"
    })
    return await res.json()
  } catch { return null }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) redirect("/login")

  const data = await getProduct(token, id)
  const product = data?.product
  if (!product) redirect("/admin/products")

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#000", zIndex: 10 }}>
        <Link href="/admin/products" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>← رجوع</Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>تفاصيل المنتج</span>
        <span />
      </div>

      <div style={{ maxWidth: "500px", margin: "0 auto", padding: "16px" }}>
        {product.image && (
          <div style={{ height: "200px", borderRadius: "16px", overflow: "hidden", marginBottom: "20px", background: "#111" }}>
            <img src={product.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "#111", borderRadius: "14px", overflow: "hidden", marginBottom: "20px" }}>
          {[
            { label: "الاسم", value: product.name },
            { label: "السعر", value: `${product.price} ر.س` },
            { label: "المخزون", value: product.stock },
            { label: "التصنيف", value: product.category || "—" },
            { label: "الحالة", value: product.is_active ? "نشط" : "معطّل" },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "14px 16px", background: "#0a0a0a", borderBottom: "1px solid #111" }}>
              <span style={{ color: "#555", fontSize: "13px" }}>{row.label}</span>
              <span style={{ fontSize: "13px", fontWeight: "600" }}>{row.value}</span>
            </div>
          ))}
        </div>

        <ProductActions productId={product.id} isActive={product.is_active} />
      </div>
    </div>
  )
}