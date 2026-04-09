"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

export default function EditBrandPage() {
  const { username } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
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
        if (data.brand) setForm({ ...form, ...data.brand, countdown_end: data.brand.countdown_end ? new Date(data.brand.countdown_end).toISOString().slice(0,16) : "" })
        setFetching(false)
      })
      .catch(() => setFetching(false))
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(""); setSuccess(""); setLoading(true)
    try {
      const body = { ...form, countdown_end: form.countdown_end ? new Date(form.countdown_end).getTime() : null, followers: parseInt(form.followers) || 0 }
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
  const label = { display: "block", fontSize: "11px", color: "#555", marginBottom: "6px", fontWeight: "700" as const }

  const ImageField = ({ field, title }: { field: string, title: string }) => {
    const ref = useRef<HTMLInputElement>(null)
    const val = (form as any)[field]
    return (
      <div style={{ marginBottom: "12px" }}>
        <label style={label}>{title}</label>
        <input ref={ref} type="file" accept="image/*,video/*" onChange={e => handleFile(field, e)} style={{ display: "none" }} />
        <div onClick={() => ref.current?.click()} style={{ width: "100%", height: val ? "120px" : "48px", borderRadius: "10px", border: "1px dashed #333", background: "#111", cursor: "pointer", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {val ? <img src={val} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ color: "#555", fontSize: "13px" }}>+ رفع صورة</span>}
        </div>
        {val && (
          <button type="button" onClick={() => setForm(f => ({ ...f, [field]: "" }))}
            style={{ marginTop: "4px", background: "none", border: "none", color: "#f87171", fontSize: "11px", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif" }}>
            حذف الصورة
          </button>
        )}
      </div>
    )
  }

  const Section = ({ title }: { title: string }) => (
    <div style={{ padding: "16px 0 8px", borderBottom: "1px solid #111", marginBottom: "16px" }}>
      <p style={{ color: "#555", fontSize: "11px", fontWeight: "700" }}>{title}</p>
    </div>
  )

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
            <label style={label}>اسم البراند</label>
            <input style={inp} value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label style={label}>الوصف</label>
            <textarea style={{ ...inp, resize: "vertical" as const }} rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
            <div><label style={label}>التقييم</label><input style={inp} value={form.rating} onChange={e => setForm({...form, rating: e.target.value})} placeholder="4.8" /></div>
            <div><label style={label}>المتابعون</label><input style={inp} type="number" value={form.followers} onChange={e => setForm({...form, followers: e.target.value})} placeholder="1500" /></div>
          </div>

          <Section title="البانر الترويجي (Promo Strip)" />
          <div style={{ marginBottom: "12px" }}>
            <label style={label}>النص الرئيسي</label>
            <input style={inp} value={form.promo_text} onChange={e => setForm({...form, promo_text: e.target.value})} placeholder="شحن مجاني على جميع الطلبات" />
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label style={label}>النص الثانوي</label>
            <input style={inp} value={form.promo_sub} onChange={e => setForm({...form, promo_sub: e.target.value})} placeholder="عند الشراء بأكثر من 200 ر.س" />
          </div>

          <Section title="البانرات المزدوجة" />
          <ImageField field="banner1_image" title="البانر الأول — صورة" />
          <div style={{ marginBottom: "12px" }}>
            <label style={label}>البانر الأول — عنوان</label>
            <input style={inp} value={form.banner1_title} onChange={e => setForm({...form, banner1_title: e.target.value})} placeholder="تخفيضات حصرية" />
          </div>
          <ImageField field="banner2_image" title="البانر الثاني — صورة" />
          <div style={{ marginBottom: "12px" }}>
            <label style={label}>البانر الثاني — عنوان</label>
            <input style={inp} value={form.banner2_title} onChange={e => setForm({...form, banner2_title: e.target.value})} placeholder="إصدارات خاصة" />
          </div>

          <Section title="البانر الكبير (Wide Banner)" />
          <ImageField field="wide_banner_image" title="الصورة" />
          <div style={{ marginBottom: "12px" }}>
            <label style={label}>العنوان</label>
            <input style={inp} value={form.wide_banner_title} onChange={e => setForm({...form, wide_banner_title: e.target.value})} placeholder="مجموعة الصيف" />
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label style={label}>الوصف</label>
            <input style={inp} value={form.wide_banner_desc} onChange={e => setForm({...form, wide_banner_desc: e.target.value})} placeholder="خفيفة ومريحة لكل المناسبات" />
          </div>

          <Section title="بانر التصفية (Sale Banner)" />
          <ImageField field="sale_banner_image" title="الصورة" />
          <div style={{ marginBottom: "12px" }}>
            <label style={label}>العنوان</label>
            <input style={inp} value={form.sale_banner_title} onChange={e => setForm({...form, sale_banner_title: e.target.value})} placeholder="تصفية نهاية الموسم" />
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label style={label}>الوصف</label>
            <input style={inp} value={form.sale_banner_desc} onChange={e => setForm({...form, sale_banner_desc: e.target.value})} placeholder="خصومات تصل إلى 50%" />
          </div>

          <Section title="العد التنازلي (Countdown)" />
          <div style={{ marginBottom: "12px" }}>
            <label style={label}>عنوان العرض</label>
            <input style={inp} value={form.countdown_title} onChange={e => setForm({...form, countdown_title: e.target.value})} placeholder="عرض محدود الوقت" />
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label style={label}>وصف العرض</label>
            <input style={inp} value={form.countdown_sub} onChange={e => setForm({...form, countdown_sub: e.target.value})} placeholder="خصم 30% على جميع الأحذية" />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <label style={label}>تاريخ انتهاء العرض</label>
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