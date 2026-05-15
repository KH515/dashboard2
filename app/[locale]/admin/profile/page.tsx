"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.klafstore.com"

const RoleBadge = ({ role }: { role: string }) => {
  const roles: Record<string, { label: string; color: string; bg: string }> = {
    admin: { label: "مدير", color: "#fff", bg: "#111" },
    moderator: { label: "مشرف", color: "#fff", bg: "#2A3FA0" },
  }
  const r = roles[role] || roles.admin
  return <span style={{ background: r.bg, color: r.color, padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700" }}>{r.label}</span>
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")
  const [error, setError] = useState("")
  const [tab, setTab] = useState<"info" | "password">("info")
  const [form, setForm] = useState({ name: "", username: "", avatar: "" })
  const [pass, setPass] = useState({ current: "", new: "", confirm: "" })

  useEffect(() => {
    const token = document.cookie.match(/accessToken=([^;]+)/)?.[1]
    if (!token) { router.push("/ar/login"); return }
    fetch(`${API}/api/staff/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        if (d.user) {
          setUser(d.user)
          setForm({ name: d.user.name || "", username: d.user.username || "", avatar: d.user.avatar || "" })
        } else router.push("/ar/login")
      })
      .catch(() => router.push("/ar/login"))
      .finally(() => setLoading(false))
  }, [])

  const saveInfo = async () => {
    setSaving(true); setMsg(""); setError("")
    const token = document.cookie.match(/accessToken=([^;]+)/)?.[1]
    const res = await fetch(`${API}/api/staff/me`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: form.name, username: form.username, avatar: form.avatar })
    })
    const data = await res.json()
    if (res.ok) setMsg("✅ تم حفظ البيانات")
    else setError(data.error || "حصل خطأ")
    setSaving(false)
  }

  const savePassword = async () => {
    if (pass.new !== pass.confirm) { setError("كلمة المرور الجديدة غير متطابقة"); return }
    if (pass.new.length < 6) { setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return }
    setSaving(true); setMsg(""); setError("")
    const token = document.cookie.match(/accessToken=([^;]+)/)?.[1]
    const res = await fetch(`${API}/api/staff/me`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ current_password: pass.current, new_password: pass.new })
    })
    const data = await res.json()
    if (res.ok) { setMsg("✅ تم تغيير كلمة المرور"); setPass({ current: "", new: "", confirm: "" }) }
    else setError(data.error || "حصل خطأ")
    setSaving(false)
  }

  const inp = { width: "100%", padding: "12px 14px", background: "#f5f5f7", border: "1px solid #e5e5e5", borderRadius: "10px", fontSize: "14px", outline: "none", fontFamily: "Cairo,system-ui,sans-serif", color: "#111", boxSizing: "border-box" as const }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#F5F5F7", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#888", fontFamily: "Cairo,system-ui,sans-serif" }}>جاري التحميل...</p>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: "#F5F5F7", fontFamily: "Cairo,system-ui,sans-serif", direction: "rtl" }}>
      
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e5e5", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", gap: 12, height: "56px" }}>
          <Link href="/ar/admin" style={{ color: "#888", textDecoration: "none", fontSize: "20px" }}>←</Link>
          <span style={{ fontSize: "18px", fontWeight: "900", color: "#111" }}>الملف الشخصي</span>
        </div>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px 16px" }}>
        
        {/* Profile Card */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", marginBottom: "16px", border: "1px solid #e5e5e5", textAlign: "center" as const }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: user?.avatar ? "transparent" : "#FF835E", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", overflow: "hidden", boxShadow: "0 4px 12px rgba(255,131,94,.3)" }}>
            {user?.avatar ? <img src={user.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" /> : <span style={{ color: "#fff", fontSize: "32px", fontWeight: "900" }}>{user?.name?.[0] || "A"}</span>}
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: "900", margin: "0 0 4px" }}>{user?.name}</h2>
          <p style={{ color: "#888", fontSize: "13px", margin: "0 0 8px" }}>@{user?.username} · {user?.email}</p>
          <RoleBadge role={user?.role} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 16 }}>
            <div style={{ background: "#f5f5f7", borderRadius: "10px", padding: "10px" }}>
              <p style={{ margin: 0, fontSize: "11px", color: "#888" }}>تاريخ الانضمام</p>
              <p style={{ margin: "2px 0 0", fontSize: "12px", fontWeight: "700" }}>{user?.created_at ? new Date(user.created_at).toLocaleDateString("ar-SA") : "—"}</p>
            </div>
            <div style={{ background: "#f5f5f7", borderRadius: "10px", padding: "10px" }}>
              <p style={{ margin: 0, fontSize: "11px", color: "#888" }}>آخر تسجيل دخول</p>
              <p style={{ margin: "2px 0 0", fontSize: "12px", fontWeight: "700" }}>{user?.last_login ? new Date(user.last_login).toLocaleDateString("ar-SA") : "—"}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[{ key: "info", label: "المعلومات" }, { key: "password", label: "كلمة المرور" }].map(t => (
            <button key={t.key} onClick={() => { setTab(t.key as any); setMsg(""); setError("") }}
              style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", cursor: "pointer", fontFamily: "Cairo,system-ui,sans-serif", fontSize: "13px", fontWeight: "700", background: tab === t.key ? "#111" : "#fff", color: tab === t.key ? "#fff" : "#888", transition: "all 0.2s" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Messages */}
        {msg && <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "12px 16px", marginBottom: 16, color: "#166534", fontSize: "13px", fontWeight: "700" }}>{msg}</div>}
        {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "12px 16px", marginBottom: 16, color: "#991b1b", fontSize: "13px", fontWeight: "700" }}>⚠️ {error}</div>}

        {/* Info Tab */}
        {tab === "info" && (
          <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", border: "1px solid #e5e5e5" }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: "13px", fontWeight: "700", color: "#555", display: "block", marginBottom: 6 }}>الاسم</label>
              <input style={inp} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="اسمك الكامل" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: "13px", fontWeight: "700", color: "#555", display: "block", marginBottom: 6 }}>اليوزرنيم</label>
              <input style={inp} value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="username" dir="ltr" />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: "13px", fontWeight: "700", color: "#555", display: "block", marginBottom: 6 }}>رابط الصورة الشخصية</label>
              <input style={inp} value={form.avatar} onChange={e => setForm({ ...form, avatar: e.target.value })} placeholder="https://..." dir="ltr" />
              {form.avatar && <img src={form.avatar} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", marginTop: 8, border: "2px solid #e5e5e5" }} alt="" onError={e => (e.currentTarget.style.display = "none")} />}
            </div>
            <button onClick={saveInfo} disabled={saving} style={{ width: "100%", padding: "13px", background: "#111", color: "#fff", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer", fontFamily: "Cairo,system-ui,sans-serif", opacity: saving ? 0.6 : 1 }}>
              {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
            </button>
          </div>
        )}

        {/* Password Tab */}
        {tab === "password" && (
          <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", border: "1px solid #e5e5e5" }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: "13px", fontWeight: "700", color: "#555", display: "block", marginBottom: 6 }}>كلمة المرور الحالية</label>
              <input style={inp} type="password" value={pass.current} onChange={e => setPass({ ...pass, current: e.target.value })} placeholder="••••••••" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: "13px", fontWeight: "700", color: "#555", display: "block", marginBottom: 6 }}>كلمة المرور الجديدة</label>
              <input style={inp} type="password" value={pass.new} onChange={e => setPass({ ...pass, new: e.target.value })} placeholder="••••••••" />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: "13px", fontWeight: "700", color: "#555", display: "block", marginBottom: 6 }}>تأكيد كلمة المرور</label>
              <input style={inp} type="password" value={pass.confirm} onChange={e => setPass({ ...pass, confirm: e.target.value })} placeholder="••••••••" />
            </div>
            <button onClick={savePassword} disabled={saving} style={{ width: "100%", padding: "13px", background: "#111", color: "#fff", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer", fontFamily: "Cairo,system-ui,sans-serif", opacity: saving ? 0.6 : 1 }}>
              {saving ? "جاري الحفظ..." : "تغيير كلمة المرور"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}