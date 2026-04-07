"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function NewAdPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    title: "",
    body: "",
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

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#000", zIndex: 10 }}>
        <Link href="/admin/ads" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>← رجوع</Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>إضافة إعلان</span>
        <span />
      </div>

      <div style={{ padding: "24px 16px", maxWidth: "500px", margin: "0 auto" }}>
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

          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "15px", background: "#fff", color: "#000", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif", opacity: loading ? 0.6 : 1 }}>
            {loading ? "جاري الإضافة..." : "إضافة الإعلان"}
          </button>
        </form>
      </div>
    </div>
  )
}