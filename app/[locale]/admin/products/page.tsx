"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"

export default function ProductsPage() {
  const t = useTranslations()
  const locale = useLocale()
  const isAr = locale === "ar"
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("/api/admin/products-list")
      .then(r => r.json())
      .then(data => { setProducts(data.products || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight: "100vh", background:"#EEEEEE", color: "#111", fontFamily: "Cairo, system-ui, sans-serif", direction: isAr ? "rtl" : "ltr" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e5e5", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background:"#EEEEEE", zIndex: 10 }}>
        <Link href={`/${locale}/admin`} style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>
          {isAr ? "← رجوع" : "← Back"}
        </Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>{t("products_list.title")}</span>
        <Link href={`/${locale}/admin/products/users/klaf/new`} style={{ fontSize: "12px", textDecoration: "none", background: "#FF835E", color: "#fff", padding: "6px 14px", borderRadius: "8px", fontWeight: "700" }}>
          + {t("common.add")}
        </Link>
      </div>
      <div style={{ padding: "16px", maxWidth: "700px", margin: "0 auto" }}>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder={t("products_list.search_placeholder")}
          style={{ width: "100%", padding: "13px 16px", background: "#fff", border: "1px solid #e5e5e5", borderRadius: "12px", color: "#111", fontSize: "14px", outline: "none", textAlign: isAr ? "right" : "left" as const, fontFamily: "Cairo, system-ui, sans-serif", boxSizing: "border-box", marginBottom: "16px" }} dir={isAr ? "rtl" : "ltr"} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "20px" }}>
          {[
            { label: t("common.all"), count: products.length },
            { label: isAr ? "كاف" : "Kaaf", count: products.filter(p => !p.seller_id).length },
            { label: t("vendors_page.title"), count: products.filter(p => p.seller_id).length },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "12px", padding: "12px", textAlign: "center" }}>
              <p style={{ fontWeight: "800", fontSize: "20px", margin: 0 }}>{s.count}</p>
              <p style={{ color: "#555", fontSize: "11px", margin: "4px 0 0" }}>{s.label}</p>
            </div>
          ))}
        </div>
        {loading ? (
          <p style={{ color: "#555", textAlign: "center", padding: "40px 0" }}>{t("common.loading")}</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: "#555", textAlign: "center", padding: "40px 0" }}>{t("products_list.no_products")}</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "10px" }}>
            {filtered.map((product: any) => {
              const inactive = product.is_active === 0 || product.is_active === false
              return (
                <div key={product.id} onClick={() => router.push(`/${locale}/admin/products/` + product.id)}
                  style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "14px", overflow: "hidden", cursor: "pointer", position: "relative", filter: inactive ? "grayscale(1)" : "none", opacity: inactive ? 0.6 : 1 }}>
                  {inactive && (
                    <div style={{ position: "absolute", top: "8px", [isAr ? "right" : "left" as any]: "8px", background:"#EEEEEE", border: "1px solid #ddd", color: "#555", padding: "2px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: "700", zIndex: 1 }}>
                      {t("products_list.inactive") || t("common.inactive")}
                    </div>
                  )}
                  <div style={{ height: "120px", background: "#f0f0f0", overflow: "hidden" }}>
                    {product.image && <img src={product.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  </div>
                  <div style={{ padding: "10px" }}>
                    <p style={{ fontWeight: "700", fontSize: "12px", margin: 0, marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.name}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", fontWeight: "800" }}>{product.price} {t("common.currency")}</span>
                      <span style={{ fontSize: "10px", fontWeight: "700", color: product.stock > 0 ? "#16a34a" : "#dc2626" }}>
                        {product.stock > 0 ? product.stock : t("products_list.out_of_stock")}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}