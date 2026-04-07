"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("https://api.klafstore.com/api/products?limit=200")
      .then(r => r.json())
      .then(data => { setProducts(data.products || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#000", zIndex: 10 }}>
        <Link href="/admin" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>← رجوع</Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>المنتجات</span>
        <Link href="/admin/products/users/klaf/new" style={{ fontSize: "12px", textDecoration: "none", background: "#fff", color: "#000", padding: "6px 14px", borderRadius: "8px", fontWeight: "700" }}>+ إضافة</Link>
      </div>

      <div style={{ padding: "16px", maxWidth: "700px", margin: "0 auto" }}>
        {/* بحث */}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="ابحث عن منتج..."
          style={{ width: "100%", padding: "13px 16px", background: "#111", border: "1px solid #222", borderRadius: "12px", color: "white", fontSize: "14px", outline: "none", textAlign: "right", fontFamily: "Cairo, system-ui, sans-serif", boxSizing: "border-box", marginBottom: "16px" }}
        />

        {/* إحصائيات */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "20px" }}>
          {[
            { label: "الكل", count: products.length, filter: "" },
            { label: "كلاف", count: products.filter(p => !p.seller_id).length, filter: "klaf" },
            { label: "البائعون", count: products.filter(p => p.seller_id).length, filter: "sellers" },
          ].map(s => (
            <div key={s.label} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "12px", textAlign: "center" }}>
              <p style={{ fontWeight: "800", fontSize: "20px", margin: 0 }}>{s.count}</p>
              <p style={{ color: "#555", fontSize: "11px", margin: "4px 0 0" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* المنتجات */}
        {loading ? (
          <p style={{ color: "#555", textAlign: "center", padding: "40px 0" }}>جاري التحميل...</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: "#555", textAlign: "center", padding: "40px 0" }}>لا يوجد منتجات</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "10px" }}>
            {filtered.map((product: any) => (
              <div key={product.id} onClick={() => router.push(`/admin/products/${product.id}`)}
                style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "14px", overflow: "hidden", cursor: "pointer" }}>
                <div style={{ height: "120px", background: "#1a1a1a", overflow: "hidden" }}>
                  {product.image && <img src={product.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                </div>
                <div style={{ padding: "10px" }}>
                  <p style={{ fontWeight: "700", fontSize: "12px", margin: 0, marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.name}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", fontWeight: "800" }}>{product.price} ر.س</span>
                    <span style={{ fontSize: "10px", color: product.stock > 0 ? "#4ade80" : "#f87171" }}>{product.stock > 0 ? product.stock : "نفذ"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}