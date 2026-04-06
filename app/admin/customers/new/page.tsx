"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const roles = [
  { value: "customer", label: "عميل" },
  { value: "seller", label: "بائع" },
  { value: "affiliate", label: "عمولة" },
  { value: "manager", label: "مدير" },
]

export default function NewUserPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "customer",
    phone: "",
    iban: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "حصل خطأ"); setLoading(false); return }
      router.push("/admin/customers")
    } catch {
      setError("تعذر الاتصال بالسيرفر")
      setLoading(false)
    }
  }

  const inp = {
    width: "100%",
    padding: "13px 16px",
    background: "#111",
    border: "1px solid #222",
    borderRadius: "12px",
    color: "white",
    fontSize: "14px",
    outline: "none",
    textAlign: "right" as const,
    fontFamily: "Cairo, system-ui, sans-serif",
    boxSizing: "border-box" as const,
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#000", zIndex: 10 }}>
        <Link href="/admin/customers" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>← رجوع</Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>إضافة حساب</span>
        <span />
      </div>

      <div style={{ padding: "24px 16px", maxWidth: "500px", margin: "0 auto" }}>
        <form onSubmit={handleSubmit}>
          
          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>الاسم *</label>
            <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="محمد عبدالله" style={inp} />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>الإيميل *</label>
            <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="example@email.com" style={inp} />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>اليوزرنيم</label>
            <input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})} placeholder="username" style={inp} />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>كلمة المرور *</label>
            <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" style={inp} />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>الدور *</label>
            <select required value={form.role} onChange={e => setForm({...form, role: e.target.value})}
              style={{ ...inp, appearance: "none" as const }}>
              {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>الجوال</label>
            <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="05xxxxxxxx" style={inp} />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>الآيبان</label>
            <input type="text" value={form.iban} onChange={e => setForm({...form, iban: e.target.value})} placeholder="SA..." style={inp} />
          </div>

          {error && <div style={{ color: "#f87171", fontSize: "13px", marginBottom: "16px", padding: "12px", background: "rgba(239,68,68,0.08)", borderRadius: "10px" }}>⚠️ {error}</div>}

          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "15px", background: "#fff", color: "#000", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif", opacity: loading ? 0.6 : 1 }}>
            {loading ? "جاري الإضافة..." : "إضافة الحساب"}
          </button>
        </form>
      </div>
    </div>
  )
}