"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function NewAdPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [preview, setPreview] = useState(false)
  const [form, setForm] = useState({
    title: "",
    body: "",
    image: "",
    target: "all",
    expires_at: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#000", zIndex: 10 }}>
        <Link href="/admin/ads" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>← رجوع</Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>إضافة إعلان</span>
        <button onClick={() => setPreview(!preview)}
          style={{ background: "transparent", border: "1px solid #222", color: "#fff", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontFamily: "Cairo, system-ui, sans-serif" }}>
          {preview ? "تعديل" : "معاينة"}
        </button>
      </div>

      <div style={{ padding: "24px 16px", maxWidth: "500px", margin: "0 auto" }}>

        {/* معاينة */}
        {preview ? (
          <div>
            <p style={{ color: "#555", fontSize: "11px", fontWeight: "700", marginBottom: "16px" }}>معاينة الإعلان</p>
            <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "16px", overflow: "hidden" }}>
              {form.image && (
                <div style={{ height: "180px", overflow: "hidden" }}>
                  <img src={form.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
              <div style={{ padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <h3 style={{ fontWeight: "800", fontSize: "16px", margin: 0 }}>{form.title || "عنوان الإعلان"}</h3>
                  <span style={{ background: "#1a1a1a", border: "1px solid #222", padding: "3px 10px", borderRadius: "20px", fontSize: "11px" }}>{targetLabel}</span>
                </div>
                {form.body && <p style={{ color: "#555", fontSize: "13px", margin: 0 }}>{form.body}</p>}
                {form.expires_at && <p style={{ color: "#333", fontSize: "11px", margin: "12px 0 0" }}>ينتهي: {form.expires_at}</p>}
              </div>
            </div>
            <button onClick={() => setPreview(false)}
              style={{ width: "100%", marginTop: "16px", padding: "14px", background: "transparent", border: "1px solid #222", color: "#fff", borderRadius: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif" }}>
              ← رجوع للتعديل
            </button>
            <button onClick={handleSubmit} disabled={loading}
              style={{ width: "100%", marginTop: "10px", padding: "15px", background: "#fff", color: "#000", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif", opacity: loading ? 0.6 : 1 }}>
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
              <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>رابط الصورة (بانر)</label>
              <input type="url" value={form.image} onChange={e => setForm({...form, image: e.target.value})}
                placeholder="https://cdn.klafstore.com/..." style={inp} />
              {form.image && (
                <div style={{ marginTop: "8px", height: "120px", borderRadius: "10px", overflow: "hidden", border: "1px solid #222" }}>
                  <img src={form.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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