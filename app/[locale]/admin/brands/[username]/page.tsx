"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"

export default function EditBrandPage() {
  const t = useTranslations()
  const locale = useLocale()
  const isAr = locale === "ar"
  const { username } = useParams()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [featuredIds, setFeaturedIds] = useState<number[]>([])
  const [productSearch, setProductSearch] = useState("")

  const [form, setForm] = useState({
    name: "", description: "",
    banner1_title: "", banner2_title: "",
    wide_banner_title: "", wide_banner_desc: "",
    sale_banner_title: "", sale_banner_desc: "",
    promo_text: "", promo_sub: "",
    countdown_title: "", countdown_sub: "",
    name_en: "", description_en: "",
    banner1_title_en: "", banner2_title_en: "",
    wide_banner_title_en: "", wide_banner_desc_en: "",
    sale_banner_title_en: "", sale_banner_desc_en: "",
    promo_text_en: "", promo_sub_en: "",
    countdown_title_en: "", countdown_sub_en: "",
    logo: "", cover_image: "",
    banner1_image: "", banner2_image: "",
    wide_banner_image: "", sale_banner_image: "",
    countdown_end: "",
    rating: "", followers: "",
  })

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/brands/${username}?locale=sa-ar`).then(r => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/brands/${username}?locale=sa-en`).then(r => r.json()),
    ]).then(([dAr, dEn]) => {
      const br = dAr.brand || {}
      const brEn = dEn.brand || {}
      setForm(f => ({
        ...f,
        ...br,
        name: br.name || "",
        description: br.description || "",
        name_en: brEn.name_en || brEn.name || "",
        description_en: brEn.description_en || brEn.description || "",
        countdown_end: br.countdown_end ? new Date(br.countdown_end).toISOString().slice(0,16) : "",
      }))
      try { if (br.featured_products) setFeaturedIds(JSON.parse(br.featured_products)) } catch {}
      setFetching(false)
    }).catch(() => setFetching(false))

    fetch("/api/admin/products-list")
      .then(r => r.json())
      .then(data => setAllProducts(data.products || []))
  }, [])

  const upload = async (file: File): Promise<string> => {
    const fd = new FormData()
    fd.append("file", file)
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
    const data = await res.json()
    return data.url || ""
  }

  const handleFile = async (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await upload(file)
    if (url) setForm(f => ({ ...f, [field]: url }))
  }

  const toggleFeatured = (id: number) => {
    setFeaturedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const moveFeatured = (id: number, dir: -1 | 1) => {
    setFeaturedIds(prev => {
      const idx = prev.indexOf(id)
      if (idx < 0) return prev
      const next = [...prev]
      const swap = idx + dir
      if (swap < 0 || swap >= next.length) return prev
      ;[next[idx], next[swap]] = [next[swap], next[idx]]
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(""); setSuccess(""); setLoading(true)
    try {
      const body = {
        ...form,
        countdown_end: form.countdown_end ? new Date(form.countdown_end).getTime() : null,
        followers: parseInt(form.followers) || 0,
        featured_products: JSON.stringify(featuredIds),
      }
      const res = await fetch(`/api/admin/brands/${username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || t("common.error")); setLoading(false); return }
      setSuccess(t("common.success"))
    } catch { setError(t("common.error")) }
    setLoading(false)
  }

  const inp = { width: "100%", padding: "12px 14px", background: "#fff", border: "1px solid #e5e5e5", borderRadius: "10px", color: "#111", fontSize: "13px", outline: "none", fontFamily: "Cairo, system-ui, sans-serif", boxSizing: "border-box" as const }
  const lbl = { display: "block", fontSize: "11px", color: "#555", marginBottom: "6px", fontWeight: "700" as const }

  // helper: نختار حقل حسب لغة الـ URL
  const getField = (arField: string, enField: string) => isAr ? (form as any)[arField] : (form as any)[enField]
  const setField = (arField: string, enField: string, value: string) => {
    if (isAr) setForm({...form, [arField]: value})
    else setForm({...form, [enField]: value})
  }

  const ImageField = ({ field, title }: { field: string, title: string }) => {
    const ref = useRef<HTMLInputElement>(null)
    const val = (form as any)[field]
    return (
      <div style={{ marginBottom: "12px" }}>
        <label style={lbl}>{title}</label>
        <input ref={ref} type="file" accept="image/*,video/*" onChange={e => handleFile(field, e)} style={{ display: "none" }} />
        <div onClick={() => ref.current?.click()} style={{ width: "100%", height: val ? "120px" : "48px", borderRadius: "10px", border: "1px dashed #333", background: "#fff", cursor: "pointer", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {val ? <img src={val} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ color: "#555", fontSize: "13px" }}>+ {isAr ? "رفع صورة" : "Upload image"}</span>}
        </div>
        {val && <button type="button" onClick={() => setForm(f => ({ ...f, [field]: "" }))} style={{ marginTop: "4px", background: "none", border: "none", color: "#dc2626", fontSize: "11px", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif" }}>{isAr ? "حذف الصورة" : "Remove image"}</button>}
      </div>
    )
  }

  const Section = ({ title }: { title: string }) => (
    <div style={{ padding: "16px 0 8px", borderBottom: "1px solid #e5e5e5", marginBottom: "16px" }}>
      <p style={{ color: "#555", fontSize: "11px", fontWeight: "700" }}>{title}</p>
    </div>
  )

  const filteredProducts = allProducts.filter(p =>
    p.name?.toLowerCase().includes(productSearch.toLowerCase())
  )

  const featuredProducts = featuredIds.map(id => allProducts.find(p => p.id === id)).filter(Boolean)

  if (fetching) return (
    <div style={{ minHeight: "100vh", background:"#EEEEEE", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#555", fontFamily: "Cairo, system-ui, sans-serif" }}>{t("common.loading")}</p>
    </div>
  )

  const textField = (arKey: string, enKey: string, placeholder: string, multiline = false) => {
    const value = getField(arKey, enKey)
    const onChange = (v: string) => setField(arKey, enKey, v)
    const styles = { ...inp, textAlign: isAr ? "right" : "left" as const, ...(multiline ? { resize: "vertical" as const } : {}) }
    if (multiline) {
      return <textarea style={styles} rows={2} value={value} onChange={e => onChange(e.target.value)} dir={isAr ? "rtl" : "ltr"} placeholder={placeholder} />
    }
    return <input style={styles} value={value} onChange={e => onChange(e.target.value)} dir={isAr ? "rtl" : "ltr"} placeholder={placeholder} />
  }

  return (
    <div style={{ minHeight: "100vh", background:"#EEEEEE", color: "#111", fontFamily: "Cairo, system-ui, sans-serif", direction: isAr ? "rtl" : "ltr" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e5e5", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background:"#EEEEEE", zIndex: 10 }}>
        <Link href={`/${locale}/admin/brands`} style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>
          {isAr ? "← رجوع" : "← Back"}
        </Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>{t("brands_page.edit_brand")}</span>
        <a href={`https://klafstore.com/sa-${locale}/brand/${username}`} target="_blank" rel="noopener noreferrer" style={{ color: "#555", fontSize: "12px", textDecoration: "none" }}>
          {t("common.view")} →
        </a>
      </div>

      <div style={{ padding: "20px 16px", maxWidth: "500px", margin: "0 auto" }}>
        <form onSubmit={handleSubmit}>

          <Section title={isAr ? "المعلومات الأساسية" : "Basic Information"} />
          <ImageField field="logo" title={t("brands_page.logo")} />
          <ImageField field="cover_image" title={t("brands_page.cover_image")} />

          <div style={{ marginBottom: "12px" }}>
            <label style={lbl}>{t("brands_page.brand_name")}</label>
            {textField("name", "name_en", isAr ? "نايكي" : "Nike")}
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label style={lbl}>{t("brands_page.brand_description")}</label>
            {textField("description", "description_en", "", true)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
            <div><label style={lbl}>{t("brands_page.rating")}</label><input style={inp} value={form.rating} onChange={e => setForm({...form, rating: e.target.value})} placeholder="4.8" /></div>
            <div><label style={lbl}>{t("brands_page.followers")}</label><input style={inp} type="number" value={form.followers} onChange={e => setForm({...form, followers: e.target.value})} placeholder="1500" /></div>
          </div>

          <Section title={t("brands_page.featured_products")} />
          <p style={{ color: "#555", fontSize: "11px", marginBottom: "12px" }}>
            {isAr ? "اختر المنتجات التي تريد عرضها — يمكنك ترتيبها بالأسهم" : "Select products to feature — use arrows to reorder"}
          </p>

          {featuredProducts.length > 0 && (
            <div style={{ marginBottom: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {featuredProducts.map((p: any, i: number) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "10px", background: "#fff", border: "1px solid #e5e5e5", borderRadius: "10px", padding: "10px 12px" }}>
                  {p.image && <img src={p.image} style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "12px", fontWeight: 700, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                    <p style={{ fontSize: "11px", color: "#555", margin: 0 }}>{p.price} {t("common.currency")}</p>
                  </div>
                  <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                    <button type="button" onClick={() => moveFeatured(p.id, -1)} disabled={i === 0}
                      style={{ background: "#f0f0f0", border: "1px solid #e5e5e5", color: i === 0 ? "#aaa" : "#111", borderRadius: "6px", width: "26px", height: "26px", cursor: i === 0 ? "not-allowed" : "pointer", fontSize: "12px" }}>↑</button>
                    <button type="button" onClick={() => moveFeatured(p.id, 1)} disabled={i === featuredProducts.length - 1}
                      style={{ background: "#f0f0f0", border: "1px solid #e5e5e5", color: i === featuredProducts.length - 1 ? "#aaa" : "#111", borderRadius: "6px", width: "26px", height: "26px", cursor: i === featuredProducts.length - 1 ? "not-allowed" : "pointer", fontSize: "12px" }}>↓</button>
                    <button type="button" onClick={() => toggleFeatured(p.id)}
                      style={{ background: "#fff0f0", border: "1px solid #fed7d7", color: "#dc2626", borderRadius: "6px", width: "26px", height: "26px", cursor: "pointer", fontSize: "12px" }}>×</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <input type="text" value={productSearch} onChange={e => setProductSearch(e.target.value)}
            placeholder={isAr ? "ابحث عن منتج لإضافته..." : "Search for product to add..."}
            style={{ ...inp, marginBottom: "8px" }} />

          {productSearch && (
            <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "10px", overflow: "hidden", marginBottom: "16px", maxHeight: "200px", overflowY: "auto" }}>
              {filteredProducts.slice(0, 10).map((p: any) => {
                const selected = featuredIds.includes(p.id)
                return (
                  <div key={p.id} onClick={() => { toggleFeatured(p.id); setProductSearch("") }}
                    style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderBottom: "1px solid #f0f0f0", cursor: "pointer", background: selected ? "#f0fff0" : "transparent" }}>
                    {p.image && <img src={p.image} style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover", flexShrink: 0 }} />}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "12px", fontWeight: 700, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                      <p style={{ fontSize: "11px", color: "#555", margin: 0 }}>{p.price} {t("common.currency")}</p>
                    </div>
                    <span style={{ fontSize: "11px", color: selected ? "#16a34a" : "#555", flexShrink: 0 }}>{selected ? (isAr ? "✓ مضاف" : "✓ Added") : (isAr ? "+ إضافة" : "+ Add")}</span>
                  </div>
                )
              })}
              {filteredProducts.length === 0 && <p style={{ padding: "12px", color: "#555", fontSize: "12px", textAlign: "center" }}>{isAr ? "لا يوجد نتائج" : "No results"}</p>}
            </div>
          )}

          <Section title={t("brands_page.promo_strip")} />
          <div style={{ marginBottom: "12px" }}>
            <label style={lbl}>{t("brands_page.promo_main")}</label>
            {textField("promo_text", "promo_text_en", isAr ? "شحن مجاني" : "Free shipping")}
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label style={lbl}>{t("brands_page.promo_sub")}</label>
            {textField("promo_sub", "promo_sub_en", isAr ? "للطلبات +200" : "Orders +200")}
          </div>

          <Section title={t("brands_page.dual_banners")} />
          <ImageField field="banner1_image" title={isAr ? "البانر الأول — صورة" : "Banner 1 — Image"} />
          <div style={{ marginBottom: "12px" }}>
            <label style={lbl}>{isAr ? "البانر الأول — عنوان" : "Banner 1 — Title"}</label>
            {textField("banner1_title", "banner1_title_en", isAr ? "تخفيضات حصرية" : "Exclusive Sales")}
          </div>
          <ImageField field="banner2_image" title={isAr ? "البانر الثاني — صورة" : "Banner 2 — Image"} />
          <div style={{ marginBottom: "12px" }}>
            <label style={lbl}>{isAr ? "البانر الثاني — عنوان" : "Banner 2 — Title"}</label>
            {textField("banner2_title", "banner2_title_en", isAr ? "إصدارات خاصة" : "Special Editions")}
          </div>

          <Section title={t("brands_page.wide_banner")} />
          <ImageField field="wide_banner_image" title={t("common.image")} />
          <div style={{ marginBottom: "12px" }}>
            <label style={lbl}>{t("common.title")}</label>
            {textField("wide_banner_title", "wide_banner_title_en", isAr ? "مجموعة الصيف" : "Summer Collection")}
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label style={lbl}>{t("common.description")}</label>
            {textField("wide_banner_desc", "wide_banner_desc_en", "", false)}
          </div>

          <Section title={t("brands_page.sale_banner")} />
          <ImageField field="sale_banner_image" title={t("common.image")} />
          <div style={{ marginBottom: "12px" }}>
            <label style={lbl}>{t("common.title")}</label>
            {textField("sale_banner_title", "sale_banner_title_en", isAr ? "تصفية نهاية الموسم" : "End of Season Sale")}
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label style={lbl}>{t("common.description")}</label>
            {textField("sale_banner_desc", "sale_banner_desc_en", isAr ? "خصومات تصل إلى 50%" : "Up to 50% off")}
          </div>

          <Section title={t("brands_page.countdown")} />
          <div style={{ marginBottom: "12px" }}>
            <label style={lbl}>{t("brands_page.countdown_title")}</label>
            {textField("countdown_title", "countdown_title_en", isAr ? "عرض محدود الوقت" : "Limited time offer")}
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label style={lbl}>{t("brands_page.countdown_sub")}</label>
            {textField("countdown_sub", "countdown_sub_en", isAr ? "خصم 30%" : "30% off")}
          </div>
          <div style={{ marginBottom: "24px" }}>
            <label style={lbl}>{t("brands_page.countdown_end")}</label>
            <input style={inp} type="datetime-local" value={form.countdown_end} onChange={e => setForm({...form, countdown_end: e.target.value})} />
          </div>

          {error && <div style={{ color: "#dc2626", fontSize: "13px", marginBottom: "16px", padding: "12px", background: "#fff0f0", borderRadius: "10px" }}>⚠️ {error}</div>}
          {success && <div style={{ color: "#16a34a", fontSize: "13px", marginBottom: "16px", padding: "12px", background: "#f0fff0", borderRadius: "10px" }}>✓ {success}</div>}

          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "15px", background: "#FF835E", color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif", opacity: loading ? 0.6 : 1, marginBottom: "20px" }}>
            {loading ? t("common.saving") : t("common.save")}
          </button>
        </form>
      </div>
    </div>
  )
}