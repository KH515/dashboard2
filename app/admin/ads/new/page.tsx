"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function NewAdPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [preview, setPreview] = useState(false)
  const [form, setForm] = useState({
    title: "",
    body: "",
    image: "",
    target: "all",
    expires_at: "",
  })

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      })
      const data = await res.json()
      if (data.url) setForm(f => ({ ...f, image: data.url }))
    } catch {
      setError("فشل رفع الملف")
    }
    setUploading(false)
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/admin/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          expires_at: form.expires_at ? new Date(form.expires_at).getTime() / 1000 : null,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "حصل خطأ"); setLoading(false); return }
      router.push("/admin/ads")
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

  const targetLabel = form.target === "seller" ? "البائعون فقط" : form.target === "affiliate" ? "العمولة فقط" : "الجميع"
  const isVideo = form.image?.match(/\.(mp4|webm|mov)$/i)

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#000", zIndex: 10 }}>
        <Link href="/admin/ads" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>← رجوع</Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>إضافة إعلان</span>
        <button type="button" onClick={() => setPreview(!preview)}
          style={{ background: "transparent", border: "1px solid #222", color: "#fff", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontFamily: "Cairo, system-ui, sans-serif" }}>
          {preview ? "تعديل" : "معاينة"}
        </button>
      </div>

      <div style={{ padding: "24px 16px", maxWidth: "500px", margin: "0 auto" }}>
        {preview ? (
          <div>
            <p style={{ color: "#555", fontSize: "11px", fontWeight: "700", marginBottom: "16px" }}>معاينة — كيف يراه المستخدم</p>
            <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "16px", overflow: "hidden", marginBottom: "16px" }}>
              {form.image && (
                <div style={{ height: "200px", overflow: "hidden", background: "#0a0a0a" }}>
                  {isVideo ? (
                    <video src={form.image} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <img src={form.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>
              )}
              <div style={{ padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <h3 style={{ fontWeight: "800", fontSize: "18px", margin: 0 }}>{form.title || "عنوان الإعلان"}</h3>
                  <span style={{ background: "#1a1a1a", border: "1px solid #222", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", flexShrink: 0, marginRight: "8px" }}>{targetLabel}</span>
                </div>
                {form.body && <p style={{ color: "#888", fontSize: "14px", margin: 0, lineHeight: "1.6" }}>{form.body}</p>}
                {form.expires_at && (
                  <p style={{ color: "#333", fontSize: "11px", margin: "12px 0 0", borderTop: "1px solid #1a1a1a", paddingTop: "12px" }}>
                    ينتهي الإعلان: {new Date(form.expires_at).toLocaleDateString("ar-SA")}
                  </p>
                )}
              </div>
            </div>
            <button type="button" onClick={() => setPreview(false)}
              style={{ width: "100%", marginBottom: "10px", padding: "14px", background: "transparent", border: "1px solid #222", color: "#fff", borderRadius: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif" }}>
              ← رجوع للتعديل
            </button>
            <button type="button" onClick={() => handleSubmit()} disabled={loading}
              style={{ width: "100%", padding: "15px", background: "#fff", color: "#000", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif", opacity: loading ? 0.6 : 1 }}>
              {loading ? "جاري النشر..." : "نشر الإعلان"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>العنوان *</label>
              <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="عنوان الإعلان" style={inp} />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>النص</label>
              <textarea value={form.body} onChange={e => setForm({...form, body: e.target.value})}
                placeholder="تفاصيل الإعلان..." rows={4}
                style={{ ...inp, resize: "vertical" as const }} />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>صورة أو فيديو (بانر)</label>
              <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleUpload} style={{ display: "none" }} />
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                style={{ width: "100%", padding: "13px 16px", background: "#111", border: "1px dashed #333", borderRadius: "12px", color: uploading ? "#555" : "#fff", fontSize: "14px", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif", textAlign: "center" }}>
                {uploading ? "جاري الرفع..." : form.image ? "تغيير الملف" : "اضغط لرفع صورة أو فيديو"}
              </button>
              {form.image && (
                <div style={{ marginTop: "8px", borderRadius: "10px", overflow: "hidden", border: "1px solid #222", position: "relative" }}>
                  {isVideo ? (
                    <video src={form.image} controls muted style={{ width: "100%", maxHeight: "160px", objectFit: "cover" }} />
                  ) : (
                    <img src={form.image} style={{ width: "100%", height: "140px", objectFit: "cover" }} />
                  )}
                  <button type="button" onClick={() => setForm({...form, image: ""})}
                    style={{ position: "absolute", top: "8px", left: "8px", background: "rgba(0,0,0,0.7)", border: "none", color: "#fff", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", fontSize: "14px" }}>
                    ×
                  </button>
                </div>
              )}
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>الجمهور *</label>
              <select value={form.target} onChange={e => setForm({...form, target: e.target.value})}
                style={{ ...inp, appearance: "none" as const }}>
                <option value="all">الجميع (بائعون + عمولة)</option>
                <option value="seller">البائعون فقط</option>
                <option value="affiliate">العمولة فقط</option>
              </select>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>تاريخ انتهاء الإعلان</label>
              <input type="date" value={form.expires_at} onChange={e => setForm({...form, expires_at: e.target.value})}
                style={{ ...inp, colorScheme: "dark" }} />
            </div>

            {error && <div style={{ color: "#f87171", fontSize: "13px", marginBottom: "16px", padding: "12px", background: "rgba(239,68,68,0.08)", borderRadius: "10px" }}>⚠️ {error}</div>}

            <button type="button" onClick={() => setPreview(true)}
              style={{ width: "100%", marginBottom: "10px", padding: "14px", background: "transparent", border: "1px solid #222", color: "#fff", borderRadius: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif" }}>
              معاينة الإعلان
            </button>
            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "15px", background: "#fff", color: "#000", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif", opacity: loading ? 0.6 : 1 }}>
              {loading ? "جاري الإضافة..." : "إضافة الإعلان"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}