"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function NewBrandPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "",
    username: "",
    logo: "",
    description: "",
  })

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (data.url) setForm(f => ({ ...f, logo: data.url }))
    } catch { setError("فشل رفع الصورة") }
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "حصل خطأ"); setLoading(false); return }
      router.push("/admin/brands")
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

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#000", zIndex: 10 }}>
        <Link href="/admin/brands" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>← رجوع</Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>إضافة براند</span>
        <span />
      </div>

      <div style={{ padding: "24px 16px", maxWidth: "500px", margin: "0 auto" }}>
        <form onSubmit={handleSubmit}>

          {/* Logo */}
          <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
            <div onClick={() => fileRef.current?.click()}
              style={{ width: "80px", height: "80px", borderRadius: "20px", background: "#111", border: "1px dashed #333", overflow: "hidden", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
              {form.logo
                ? <img src={form.logo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ color: "#555", fontSize: "24px" }}>+</span>
              }
            </div>
            <p style={{ color: "#555", fontSize: "12px", margin: 0 }}>{uploading ? "جاري الرفع..." : "اضغط لرفع الشعار"}</p>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>اسم البراند *</label>
            <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Nike" style={inp} />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>اليوزرنيم *</label>
            <input type="text" required value={form.username} onChange={e => setForm({...form, username: e.target.value.toLowerCase().replace(/\s/g, "")})} placeholder="nike" style={inp} />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>وصف البراند</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              placeholder="وصف مختصر عن البراند..." rows={3}
              style={{ ...inp, resize: "vertical" as const }} />
          </div>

          {error && <div style={{ color: "#f87171", fontSize: "13px", marginBottom: "16px", padding: "12px", background: "rgba(239,68,68,0.08)", borderRadius: "10px" }}>⚠️ {error}</div>}

          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "15px", background: "#fff", color: "#000", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif", opacity: loading ? 0.6 : 1 }}>
            {loading ? "جاري الإضافة..." : "إضافة البراند"}
          </button>
        </form>
      </div>
    </div>
  )
}