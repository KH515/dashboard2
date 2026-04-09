"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

export default function EditBrandPage() {
  const { username } = useParams()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [featuredIds, setFeaturedIds] = useState<number[]>([])
  const [productSearch, setProductSearch] = useState("")
  const [form, setForm] = useState({
    name: "", description: "", logo: "", cover_image: "",
    banner1_image: "", banner1_title: "",
    banner2_image: "", banner2_title: "",
    wide_banner_image: "", wide_banner_title: "", wide_banner_desc: "",
    sale_banner_image: "", sale_banner_title: "", sale_banner_desc: "",
    promo_text: "", promo_sub: "",
    countdown_title: "", countdown_sub: "", countdown_end: "",
    rating: "", followers: "",
  })

  useEffect(() => {
    fetch(`https://api.klafstore.com/api/brands/${username}`)
      .then(r => r.json())
      .then(data => {
        if (data.brand) {
          setForm({ ...form, ...data.brand, countdown_end: data.brand.countdown_end ? new Date(data.brand.countdown_end).toISOString().slice(0,16) : "" })
          try { if (data.brand.featured_products) setFeaturedIds(JSON.parse(data.brand.featured_products)) } catch {}
        }
        setFetching(false)
      })
      .catch(() => setFetching(false))

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
      if (!res.ok) { setError(data.error || "حصل خطأ"); setLoading(false); return }
      setSuccess("تم الحفظ بنجاح")
    } catch { setError("تعذر الاتصال بالسيرفر") }
    setLoading(false)
  }

  const inp = { width: "100%", padding: "12px 14px", background: "#111", border: "1px solid #222", borderRadius: "10px", color: "white", fontSize: "13px", outline: "none", textAlign: "right" as const, fontFamily: "Cairo, system-ui, sans-serif", boxSizing: "border-box" as const }
  const lbl = { display: "block", fontSize: "11px", color: "#555", marginBottom: "6px", fontWeight: "700" as const }

  const ImageField = ({ field, title }: { field: string, title: string }) => {
    const ref = useRef<HTMLInputElement>(null)
    const val = (form as any)[field]
    return (
      <div style={{ marginBottom: "12px" }}>
        <label style={lbl}>{title}</label>
        <input ref={ref} type="file" accept="image/*,video/*" onChange={e => handleFile(field, e)} style={{ display: "none" }} />
        <div onClick={() => ref.current?.click()} style={{ width: "100%", height: val ? "120px" : "48px", borderRadius: "10px", border: "1px dashed #333", background: "#111", cursor: "pointer", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {val ? <img src={val} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ color: "#555", fontSize: "13px" }}>+ رفع صورة</span>}
        </div>
        {val && <button type="button" onClick={() => setForm(f => ({ ...f, [field]: "" }))} style={{ marginTop: "4px", background: "none", border: "none", color: "#f87171", fontSize: "11px", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif" }}>حذف الصورة</button>}
      </div>
    )
  }

  const Section = ({ title }: { title: string }) => (
    <div style={{ padding: "16px 0 8px", borderBottom: "1px solid #111", marginBottom: "16px" }}>
      <p style={{ color: "#555", fontSize: "11px", fontWeight: "700" }}>{title}</p>
    </div>
  )

  const filteredProducts = allProducts.filter(p =>
    p.name?.toLowerCase().includes(productSearch.toLowerCase())
  )

  const featuredProducts = featuredIds.map(id => allProducts.find(p => p.id === id)).filter(Boolean)

  if (fetching) return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#555", fontFamily: "Cairo, system-ui, sans-serif" }}>جاري التحميل...</p>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#000", zIndex: 10 }}>
        <Link href="/admin/brands" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>← رجوع</Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>تعديل البراند</span>
        <a href={`https://klafstore.com/brand/${username}`} target="_blank" rel="noopener noreferrer" style={{ color: "#555", fontSize: "12px", textDecoration: "none" }}>عرض ←</a>
      </div>

      <div style={{ padding: "20px 16px", maxWidth: "500px", margin: "0 auto" }}>
        <form onSubmit={handleSubmit}>

          <Section title="المعلومات الأساسية" />
          <ImageField field="logo" title="شعار البراند" />
          <ImageField field="cover_image" title="صورة الغلاف (Hero Background)" />
          <div style={{ marginBottom: "12px" }}>
            <label style={lbl}>اسم البراند</label>
            <input style={inp} value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label style={lbl}>الوصف</label>
            <textarea style={{ ...inp, resize: "vertical" as const }} rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
            <div><label style={lbl}>التقييم</label><input style={inp} value={form.rating} onChange={e => setForm({...form, rating: e.target.value})} placeholder="4.8" /></div>
            <div><label style={lbl}>المتابعون</label><input style={inp} type="number" value={form.followers} onChange={e => setForm({...form, followers: e.target.value})} placeholder="1500" /></div>
          </div>

          {/* ── المنتجات المختارة ── */}
          <Section title="المنتجات المختارة (Featured)" />
          <p style={{ color: "#555", fontSize: "11px", marginBottom: "12px" }}>اختر المنتجات التي تريد عرضها بين البانرات — يمكنك ترتيبها بالأسهم</p>

          {/* المنتجات المختارة حالياً */}
          {featuredProducts.length > 0 && (
            <div style={{ marginBottom: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {featuredProducts.map((p: any, i: number) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "10px", background: "#111", border: "1px solid #222", borderRadius: "10px", padding: "10px 12px" }}>
                  {p.image && <img src={p.image} style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "12px", fontWeight: 700, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                    <p style={{ fontSize: "11px", color: "#555", margin: 0 }}>{p.price} ر.س</p>
                  </div>
                  <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                    <button type="button" onClick={() => moveFeatured(p.id, -1)} disabled={i === 0}
                      style={{ background: "#1a1a1a", border: "1px solid #222", color: i === 0 ? "#333" : "#fff", borderRadius: "6px", width: "26px", height: "26px", cursor: i === 0 ? "not-allowed" : "pointer", fontSize: "12px" }}>←</button>
                    <button type="button" onClick={() => moveFeatured(p.id, 1)} disabled={i === featuredProducts.length - 1}
                      style={{ background: "#1a1a1a", border: "1px solid #222", color: i === featuredProducts.length - 1 ? "#333" : "#fff", borderRadius: "6px", width: "26px", height: "26px", cursor: i === featuredProducts.length - 1 ? "not-allowed" : "pointer", fontSize: "12px" }}>→</button>
                    <button type="button" onClick={() => toggleFeatured(p.id)}
                      style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", borderRadius: "6px", width: "26px", height: "26px", cursor: "pointer", fontSize: "12px" }}>×</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* بحث وإضافة منتجات */}
          <input type="text" value={productSearch} onChange={e => setProductSearch(e.target.value)}
            placeholder="ابحث عن منتج لإضافته..."
            style={{ ...inp, marginBottom: "8px" }} />

          {productSearch && (
            <div style={{ background: "#111", border: "1px solid #222", borderRadius: "10px", overflow: "hidden", marginBottom: "16px", maxHeight: "200px", overflowY: "auto" }}>
              {filteredProducts.slice(0, 10).map((p: any) => {
                const selected = featuredIds.includes(p.id)
                return (
                  <div key={p.id} onClick={() => { toggleFeatured(p.id); setProductSearch("") }}
                    style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderBottom: "1px solid #1a1a1a", cursor: "pointer", background: selected ? "rgba(74,222,128,0.05)" : "transparent" }}>
                    {p.image && <img src={p.image} style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover", flexShrink: 0 }} />}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "12px", fontWeight: 700, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                      <p style={{ fontSize: "11px", color: "#555", margin: 0 }}>{p.price} ر.س</p>
                    </div>
                    <span style={{ fontSize: "11px", color: selected ? "#4ade80" : "#555", flexShrink: 0 }}>{selected ? "✓ مضاف" : "+ إضافة"}</span>
                  </div>
                )
              })}
              {filteredProducts.length === 0 && <p style={{ padding: "12px", color: "#555", fontSize: "12px", textAlign: "center" }}>لا يوجد نتائج</p>}
            </div>
          )}

          <Section title="البانر الترويجي (Promo Strip)" />
          <div style={{ marginBottom: "12px" }}>
            <label style={lbl}>النص الرئيسي</label>
            <input style={inp} value={form.promo_text} onChange={e => setForm({...form, promo_text: e.target.value})} placeholder="شحن مجاني على جميع الطلبات" />
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label style={lbl}>النص الثانوي</label>
            <input style={inp} value={form.promo_sub} onChange={e => setForm({...form, promo_sub: e.target.value})} placeholder="عند الشراء بأكثر من 200 ر.س" />
          </div>

          <Section title="البانرات المزدوجة" />
          <ImageField field="banner1_image" title="البانر الأول — صورة" />
          <div style={{ marginBottom: "12px" }}>
            <label style={lbl}>البانر الأول — عنوان</label>
            <input style={inp} value={form.banner1_title} onChange={e => setForm({...form, banner1_title: e.target.value})} placeholder="تخفيضات حصرية" />
          </div>
          <ImageField field="banner2_image" title="البانر الثاني — صورة" />
          <div style={{ marginBottom: "12px" }}>
            <label style={lbl}>البانر الثاني — عنوان</label>
            <input style={inp} value={form.banner2_title} onChange={e => setForm({...form, banner2_title: e.target.value})} placeholder="إصدارات خاصة" />
          </div>

          <Section title="البانر الكبير (Wide Banner)" />
          <ImageField field="wide_banner_image" title="الصورة" />
          <div style={{ marginBottom: "12px" }}>
            <label style={lbl}>العنوان</label>
            <input style={inp} value={form.wide_banner_title} onChange={e => setForm({...form, wide_banner_title: e.target.value})} placeholder="مجموعة الصيف" />
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label style={lbl}>الوصف</label>
            <input style={inp} value={form.wide_banner_desc} onChange={e => setForm({...form, wide_banner_desc: e.target.value})} placeholder="خفيفة ومريحة لكل المناسبات" />
          </div>

          <Section title="بانر التصفية (Sale Banner)" />
          <ImageField field="sale_banner_image" title="الصورة" />
          <div style={{ marginBottom: "12px" }}>
            <label style={lbl}>العنوان</label>
            <input style={inp} value={form.sale_banner_title} onChange={e => setForm({...form, sale_banner_title: e.target.value})} placeholder="تصفية نهاية الموسم" />
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label style={lbl}>الوصف</label>
            <input style={inp} value={form.sale_banner_desc} onChange={e => setForm({...form, sale_banner_desc: e.target.value})} placeholder="خصومات تصل إلى 50%" />
          </div>

          <Section title="العد التنازلي (Countdown)" />
          <div style={{ marginBottom: "12px" }}>
            <label style={lbl}>عنوان العرض</label>
            <input style={inp} value={form.countdown_title} onChange={e => setForm({...form, countdown_title: e.target.value})} placeholder="عرض محدود الوقت" />
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label style={lbl}>وصف العرض</label>
            <input style={inp} value={form.countdown_sub} onChange={e => setForm({...form, countdown_sub: e.target.value})} placeholder="خصم 30% على جميع الأحذية" />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <label style={lbl}>تاريخ انتهاء العرض</label>
            <input style={{ ...inp, colorScheme: "dark" }} type="datetime-local" value={form.countdown_end} onChange={e => setForm({...form, countdown_end: e.target.value})} />
          </div>

          {error && <div style={{ color: "#f87171", fontSize: "13px", marginBottom: "16px", padding: "12px", background: "rgba(239,68,68,0.08)", borderRadius: "10px" }}>⚠️ {error}</div>}
          {success && <div style={{ color: "#4ade80", fontSize: "13px", marginBottom: "16px", padding: "12px", background: "rgba(74,222,128,0.08)", borderRadius: "10px" }}>✓ {success}</div>}

          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "15px", background: "#fff", color: "#000", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif", opacity: loading ? 0.6 : 1, marginBottom: "20px" }}>
            {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </form>
      </div>
    </div>
  )
}