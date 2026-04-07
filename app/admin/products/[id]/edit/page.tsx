"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    sale_price: "",
    is_active: true,
  })

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then(r => r.json())
      .then(data => {
        const p = data.product
        if (p) setForm({
          name: p.name || "",
          description: p.description || "",
          price: p.price || "",
          stock: p.stock || "",
          category: p.category || "",
          sale_price: p.sale_price || "",
          is_active: p.is_active === 1,
        })
        setFetching(false)
      })
      .catch(() => setFetching(false))
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
      if (!res.ok) { setError(data.error || "حصل خطأ"); setLoading(false); return }
      router.push(`/admin/products/${id}`)
    } catch {
      setError("تعذر الاتصال بالسيرفر")
      setLoading(false)
    }
  }

  const inp = {
    width: "100%", padding: "13px 16px", background: "#111", border: "1px solid #222",
    borderRadius: "12px", color: "white", fontSize: "14px", outline: "none",
    textAlign: "right" as const, fontFamily: "Cairo, system-ui, sans-serif", boxSizing: "border-box" as const,
  }

  if (fetching) return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#555", fontFamily: "Cairo, system-ui, sans-serif" }}>جاري التحميل...</p>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#000", zIndex: 10 }}>
        <Link href={`/admin/products/${id}`} style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>← رجوع</Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>تعديل المنتج</span>
        <span />
      </div>

      <div style={{ padding: "24px 16px", maxWidth: "500px", margin: "0 auto" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>الاسم *</label>
            <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inp} />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>الوصف</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              rows={3} style={{ ...inp, resize: "vertical" as const }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>السعر *</label>
              <input type="number" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} style={inp} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>المخزون *</label>
              <input type="number" required value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} style={inp} />
            </div>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>سعر التخفيض</label>
            <input type="number" value={form.sale_price} onChange={e => setForm({...form, sale_price: e.target.value})} style={inp} />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>التصنيف</label>
            <input type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inp} />
          </div>

          <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
            <input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} id="is_active" />
            <label htmlFor="is_active" style={{ fontSize: "14px", cursor: "pointer" }}>المنتج نشط</label>
          </div>

          {error && <div style={{ color: "#f87171", fontSize: "13px", marginBottom: "16px", padding: "12px", background: "rgba(239,68,68,0.08)", borderRadius: "10px" }}>⚠️ {error}</div>}

          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "15px", background: "#fff", color: "#000", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif", opacity: loading ? 0.6 : 1 }}>
            {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </form>
      </div>
    </div>
  )
}