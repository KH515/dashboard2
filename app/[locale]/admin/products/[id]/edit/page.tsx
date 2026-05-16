"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const id = params.id as string
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState("")
  const [error, setError] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [form, setForm] = useState({
    name: "", description: "", price: "", stock: "",
    sale_price: "", category: "", sku: "", weight: "", is_active: true
  })

  useEffect(() => {
    fetch(`/api/admin/products/${id}`, { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        if (d.product) {
          const p = d.product
          setForm({
            name: p.name || "", description: p.description || "",
            price: String(p.price || ""), stock: String(p.stock || ""),
            sale_price: String(p.sale_price || ""), category: p.category || "",
            sku: p.sku || "", weight: String(p.weight || ""), is_active: p.is_active === 1
          })
          if (p.images) {
            try { setImages(JSON.parse(p.images)) } catch { if (p.image) setImages([p.image]) }
          } else if (p.image) setImages([p.image])
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    for (const file of files) {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "products")
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData, credentials: "include" })
      const data = await res.json()
      if (data.url) setImages(prev => [...prev, data.url])
    }
    setUploading(false)
  }

  const save = async () => {
    if (!form.name || !form.price || !form.stock) { setError("الاسم والسعر والكمية مطلوبة"); return }
    setSaving(true); setMsg(""); setError("")
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: form.name, description: form.description || null,
        price: parseFloat(form.price), stock: parseInt(form.stock),
        sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
        category: form.category || null, sku: form.sku || null,
        weight: form.weight ? parseFloat(form.weight) : null,
        is_active: form.is_active ? 1 : 0,
        image: images[0] || null, images: images.length > 0 ? images : null,
      })
    })
    const data = await res.json()
    if (res.ok) { setMsg("✅ تم حفظ التغييرات"); setTimeout(() => router.push(`/${locale}/admin/products/${id}`), 1500) }
    else setError(data.error || "حصل خطأ")
    setSaving(false)
  }

  const inp = { width:"100%", padding:"12px 14px", background:"#f5f5f7", border:"1.5px solid #e5e5e5", borderRadius:"10px", fontSize:"14px", outline:"none", fontFamily:"Cairo,system-ui,sans-serif", color:"#111", boxSizing:"border-box" as const }

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#F5F5F7", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Cairo,system-ui,sans-serif" }}>
      <p style={{ color:"#aaa" }}>جاري التحميل...</p>
    </div>
  )

  return (
    <div style={{ minHeight:"100vh", background:"#F5F5F7", fontFamily:"Cairo,system-ui,sans-serif", direction:"rtl" }}>
      <div style={{ background:"#fff", borderBottom:"1px solid #e5e5e5", position:"sticky", top:0, zIndex:10, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
        <div style={{ maxWidth:"700px", margin:"0 auto", padding:"0 16px", display:"flex", alignItems:"center", justifyContent:"space-between", height:"56px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <Link href={`/${locale}/admin/products/${id}`} style={{ width:32, height:32, borderRadius:"50%", background:"#f5f5f7", border:"1px solid #e5e5e5", display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none", color:"#555" }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
            </Link>
            <span style={{ fontSize:"17px", fontWeight:"900", color:"#111" }}>تعديل المنتج</span>
          </div>
          <button onClick={save} disabled={saving} style={{ background:"#FF835E", color:"#fff", padding:"8px 20px", borderRadius:"10px", border:"none", cursor:"pointer", fontSize:"13px", fontWeight:"800", fontFamily:"Cairo,system-ui,sans-serif", opacity:saving ? 0.6 : 1 }}>
            {saving ? "جاري الحفظ..." : "حفظ"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth:"700px", margin:"0 auto", padding:"20px 16px" }}>
        {msg && <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:"12px", padding:"12px 16px", marginBottom:16, color:"#166534", fontSize:"13px", fontWeight:"700" }}>{msg}</div>}
        {error && <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:"12px", padding:"12px 16px", marginBottom:16, color:"#991b1b", fontSize:"13px", fontWeight:"700" }}>⚠️ {error}</div>}

        {/* Status */}
        <div style={{ background:"#fff", borderRadius:"16px", padding:"16px 20px", marginBottom:12, border:"1px solid #e5e5e5", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:"14px", fontWeight:"700", color:"#111" }}>حالة المنتج</span>
          <button onClick={() => setForm({...form, is_active: !form.is_active})} style={{ background: form.is_active ? "#f0fdf4" : "#fef2f2", color: form.is_active ? "#166534" : "#991b1b", border: `1px solid ${form.is_active ? "#bbf7d0" : "#fecaca"}`, padding:"6px 16px", borderRadius:"20px", cursor:"pointer", fontSize:"13px", fontWeight:"700", fontFamily:"Cairo,system-ui,sans-serif" }}>
            {form.is_active ? "نشط ✓" : "غير نشط"}
          </button>
        </div>

        {/* Images */}
        <div style={{ background:"#fff", borderRadius:"16px", padding:"20px", marginBottom:12, border:"1px solid #e5e5e5" }}>
          <p style={{ fontSize:"13px", fontWeight:"800", color:"#111", margin:"0 0 12px" }}>صور المنتج</p>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" as const }}>
            {images.map((img, i) => (
              <div key={i} style={{ position:"relative", width:80, height:80 }}>
                <img src={img} style={{ width:80, height:80, borderRadius:10, objectFit:"cover", border:"1px solid #e5e5e5" }} alt="" />
                <button onClick={() => setImages(images.filter((_, j) => j !== i))} style={{ position:"absolute", top:-6, left:-6, width:20, height:20, borderRadius:"50%", background:"#e53e3e", color:"#fff", border:"none", cursor:"pointer", fontSize:"12px", display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
              </div>
            ))}
            <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ width:80, height:80, borderRadius:10, border:"2px dashed #e5e5e5", background:"#f5f5f7", cursor:"pointer", display:"flex", flexDirection:"column" as const, alignItems:"center", justifyContent:"center", gap:4, color:"#aaa", fontSize:"11px" }}>
              {uploading ? "..." : <><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg><span>إضافة</span></>}
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple style={{ display:"none" }} onChange={handleUpload} />
        </div>

        {/* Basic */}
        <div style={{ background:"#fff", borderRadius:"16px", padding:"20px", marginBottom:12, border:"1px solid #e5e5e5" }}>
          <p style={{ fontSize:"13px", fontWeight:"800", color:"#111", margin:"0 0 16px" }}>المعلومات الأساسية</p>
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:"12px", fontWeight:"700", color:"#666", display:"block", marginBottom:6 }}>اسم المنتج *</label>
            <input style={inp} value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:"12px", fontWeight:"700", color:"#666", display:"block", marginBottom:6 }}>الوصف</label>
            <textarea style={{...inp, minHeight:80, resize:"vertical" as const}} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div>
            <label style={{ fontSize:"12px", fontWeight:"700", color:"#666", display:"block", marginBottom:6 }}>التصنيف</label>
            <input style={inp} value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
          </div>
        </div>

        {/* Pricing */}
        <div style={{ background:"#fff", borderRadius:"16px", padding:"20px", marginBottom:12, border:"1px solid #e5e5e5" }}>
          <p style={{ fontSize:"13px", fontWeight:"800", color:"#111", margin:"0 0 16px" }}>السعر والمخزون</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
            <div>
              <label style={{ fontSize:"12px", fontWeight:"700", color:"#666", display:"block", marginBottom:6 }}>السعر (ر.س) *</label>
              <input style={inp} type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} dir="ltr" />
            </div>
            <div>
              <label style={{ fontSize:"12px", fontWeight:"700", color:"#666", display:"block", marginBottom:6 }}>الكمية *</label>
              <input style={inp} type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} dir="ltr" />
            </div>
          </div>
          <div>
            <label style={{ fontSize:"12px", fontWeight:"700", color:"#666", display:"block", marginBottom:6 }}>سعر التخفيض</label>
            <input style={inp} type="number" value={form.sale_price} onChange={e => setForm({...form, sale_price: e.target.value})} dir="ltr" />
          </div>
        </div>

        {/* Extra */}
        <div style={{ background:"#fff", borderRadius:"16px", padding:"20px", marginBottom:24, border:"1px solid #e5e5e5" }}>
          <p style={{ fontSize:"13px", fontWeight:"800", color:"#111", margin:"0 0 16px" }}>معلومات إضافية</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label style={{ fontSize:"12px", fontWeight:"700", color:"#666", display:"block", marginBottom:6 }}>SKU</label>
              <input style={inp} value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} dir="ltr" />
            </div>
            <div>
              <label style={{ fontSize:"12px", fontWeight:"700", color:"#666", display:"block", marginBottom:6 }}>الوزن (كجم)</label>
              <input style={inp} type="number" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} dir="ltr" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}