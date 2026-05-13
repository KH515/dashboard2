"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"

export default function EditProductPage() {
  const t = useTranslations()
  const locale = useLocale()
  const isAr = locale === "ar"
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    name: "",
    name_en: "",
    description: "",
    description_en: "",
    price: "",
    stock: "",
    category: "",
    sale_price: "",
    is_active: true,
  })

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/products/${id}?locale=sa-ar`).then(r => r.json()),
      fetch(`/api/admin/products/${id}?locale=sa-en`).then(r => r.json()),
    ]).then(([dAr, dEn]) => {
      const p = dAr.product || {}
      const pEn = dEn.product || {}
      setForm({
        name: p.name || "",
        name_en: pEn.name_en || pEn.name || "",
        description: p.description || "",
        description_en: pEn.description_en || pEn.description || "",
        price: p.price || "",
        stock: p.stock || "",
        category: p.category || "",
        sale_price: p.sale_price || "",
        is_active: p.is_active === 1,
      })
      setFetching(false)
    }).catch(() => setFetching(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price as string),
          stock: parseInt(form.stock as string),
          sale_price: form.sale_price ? parseFloat(form.sale_price as string) : null,
          is_active: form.is_active ? 1 : 0,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || t("common.error")); setLoading(false); return }
      router.push(`/${locale}/admin/products/${id}`)
    } catch {
      setError(t("common.error"))
      setLoading(false)
    }
  }

  const inp = {
    width: "100%", padding: "13px 16px", background: "#fff", border: "1px solid #e5e5e5",
    borderRadius: "12px", color: "#111", fontSize: "14px", outline: "none",
    fontFamily: "Cairo, system-ui, sans-serif", boxSizing: "border-box" as const,
  }

  if (fetching) return (
    <div style={{ minHeight: "100vh", background:"#EEEEEE", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#555", fontFamily: "Cairo, system-ui, sans-serif" }}>{t("common.loading")}</p>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background:"#EEEEEE", color: "#111", fontFamily: "Cairo, system-ui, sans-serif", direction: isAr ? "rtl" : "ltr" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e5e5", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background:"#EEEEEE", zIndex: 10 }}>
        <Link href={`/${locale}/admin/products/${id}`} style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>
          {isAr ? "← رجوع" : "← Back"}
        </Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>{t("products_page.edit_product")}</span>
        <span />
      </div>

      <div style={{ padding: "24px 16px", maxWidth: "500px", margin: "0 auto" }}>
        <form onSubmit={handleSubmit}>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>
              {isAr ? "الاسم (عربي) *" : "Name (Arabic) *"}
            </label>
            <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{...inp, textAlign:"right" as const}} dir="rtl" />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>
              {isAr ? "الاسم (إنجليزي)" : "Name (English)"}
            </label>
            <input type="text" value={form.name_en} onChange={e => setForm({...form, name_en: e.target.value})} style={inp} dir="ltr" placeholder="Product name in English" />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>
              {isAr ? "الوصف (عربي)" : "Description (Arabic)"}
            </label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              rows={3} style={{ ...inp, resize: "vertical" as const, textAlign:"right" as const }} dir="rtl" />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>
              {isAr ? "الوصف (إنجليزي)" : "Description (English)"}
            </label>
            <textarea value={form.description_en} onChange={e => setForm({...form, description_en: e.target.value})}
              rows={3} style={{ ...inp, resize: "vertical" as const }} dir="ltr" placeholder="Description in English" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>{t("products_page.price")} *</label>
              <input type="number" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} style={inp} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>{t("products_page.stock")} *</label>
              <input type="number" required value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} style={inp} />
            </div>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>{t("products_page.sale_price")}</label>
            <input type="number" value={form.sale_price} onChange={e => setForm({...form, sale_price: e.target.value})} style={inp} />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>{t("products_page.category")}</label>
            <input type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inp} />
          </div>

          <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
            <input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} id="is_active" style={{ width:18, height:18, accentColor:"#FF835E" }} />
            <label htmlFor="is_active" style={{ fontSize: "14px", cursor: "pointer" }}>{t("products_page.is_active")}</label>
          </div>

          {error && <div style={{ color: "#dc2626", fontSize: "13px", marginBottom: "16px", padding: "12px", background: "#fff0f0", borderRadius: "10px" }}>⚠️ {error}</div>}

          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "15px", background: "#FF835E", color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif", opacity: loading ? 0.6 : 1 }}>
            {loading ? t("common.saving") : t("common.save")}
          </button>
        </form>
      </div>
    </div>
  )
}