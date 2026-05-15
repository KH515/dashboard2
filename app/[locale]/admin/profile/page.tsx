"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const maskEmail = (email: string) => {
  const [user, domain] = email.split("@")
  return user.slice(0, 3) + "***@" + domain
}

const RoleBadge = ({ role }: { role: string }) => {
  const roles: Record<string, { label: string; color: string; bg: string }> = {
    admin: { label: "مدير النظام", color: "#fff", bg: "#111" },
    moderator: { label: "مشرف", color: "#fff", bg: "#2A3FA0" },
  }
  const r = roles[role] || roles.admin
  return <span style={{ background: r.bg, color: r.color, padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700" }}>{r.label}</span>
}

const Row = ({ icon, label, desc, href, color = "#FF835E", danger = false }: any) => (
  <Link href={href} style={{ textDecoration: "none" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "#fff", borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: "10px", background: danger ? "#fff0f0" : `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {icon}
        </div>
        <div>
          <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: danger ? "#e53e3e" : "#111" }}>{label}</p>
          {desc && <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#aaa" }}>{desc}</p>}
        </div>
      </div>
      <svg width="16" height="16" fill="none" stroke="#ccc" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l-6-6 6-6"/></svg>
    </div>
  </Link>
)

const SectionTitle = ({ title }: { title: string }) => (
  <p style={{ margin: "20px 16px 6px", fontSize: "11px", fontWeight: "800", color: "#aaa", textTransform: "uppercase" as const, letterSpacing: "1px" }}>{title}</p>
)

export default function ProfilePage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [msg, setMsg] = useState("")

  useEffect(() => {
    fetch("/api/staff/me", { credentials: "include" })
      .then(r => r.json())
      .then(d => { if (d.user) setUser(d.user); else router.push("/ar/login") })
      .catch(() => router.push("/ar/login"))
      .finally(() => setLoading(false))
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setProgress(0)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "avatars")
      const interval = setInterval(() => setProgress(p => Math.min(p + 15, 85)), 150)
      const res = await fetch("/api/staff/upload", { method: "POST", body: formData, credentials: "include" })
      clearInterval(interval); setProgress(100)
      const data = await res.json()
      if (data.url) {
        await fetch("/api/staff/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ avatar: data.url }) })
        setUser((u: any) => ({ ...u, avatar: data.url }))
        setMsg("✅ تم تحديث الصورة")
        setTimeout(() => setMsg(""), 3000)
      }
    } catch { setMsg("❌ فشل رفع الصورة") }
    finally { setUploading(false); setProgress(0) }
  }

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    router.push("/ar/login")
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#F5F5F7", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#aaa", fontFamily: "Cairo,system-ui,sans-serif" }}>جاري التحميل...</p>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: "#F5F5F7", fontFamily: "Cairo,system-ui,sans-serif", direction: "rtl" }}>
      
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e5e5", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", gap: 10, height: "56px" }}>
          <Link href="/ar/admin" style={{ width: 32, height: 32, borderRadius: "50%", background: "#f5f5f7", border: "1px solid #e5e5e5", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", color: "#555" }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
          </Link>
          <span style={{ fontSize: "17px", fontWeight: "900", color: "#111" }}>حسابي</span>
        </div>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>

        {/* Profile Header */}
        <div style={{ background: "#fff", padding: "24px 16px 20px", borderBottom: "8px solid #F5F5F7" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: user?.avatar ? "transparent" : "#FF835E", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "3px solid #fff", boxShadow: "0 2px 12px rgba(255,131,94,.25)" }}>
                {user?.avatar ? <img src={user.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" /> : <span style={{ color: "#fff", fontSize: "28px", fontWeight: "900" }}>{user?.name?.[0] || "A"}</span>}
              </div>
              <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ position: "absolute", bottom: 0, left: 0, width: 24, height: 24, borderRadius: "50%", background: "#FF835E", border: "2px solid #fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                {uploading ? <div style={{ width: 10, height: 10, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.6s linear infinite" }}></div> : <svg width="11" height="11" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>}
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleUpload} />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: "18px", fontWeight: "900", margin: "0 0 2px", color: "#111" }}>{user?.name}</h2>
              <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#888" }}>@{user?.username}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <RoleBadge role={user?.role} />
              </div>
            </div>
          </div>

          {/* Email masked */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, padding: "8px 12px", background: "#f5f5f7", borderRadius: "10px" }}>
            <svg width="14" height="14" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            <span style={{ fontSize: "12px", color: "#888", flex: 1 }}>{user?.email ? maskEmail(user.email) : ""}</span>
          </div>

          {/* Progress bar */}
          {uploading && (
            <div style={{ marginTop: 10 }}>
              <div style={{ background: "#f0f0f0", borderRadius: 4, height: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", background: "#FF835E", width: `${progress}%`, transition: "width 0.2s", borderRadius: 4 }}></div>
              </div>
            </div>
          )}
          
          {msg && <p style={{ margin: "8px 0 0", fontSize: "12px", color: msg.includes("✅") ? "#166534" : "#e53e3e", fontWeight: "700" }}>{msg}</p>}
        </div>

        {/* Account Section */}
        <SectionTitle title="الحساب" />
        <div style={{ background: "#fff", borderRadius: "16px", margin: "0 0 0 0", overflow: "hidden", border: "1px solid #f0f0f0" }}>
          <Row href="/ar/admin/profile/edit" label="تعديل الملف الشخصي" desc="الاسم، اليوزرنيم" color="#FF835E"
            icon={<svg width="18" height="18" fill="none" stroke="#FF835E" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/></svg>} />
          <Row href="/ar/admin/profile/change-password" label="تغيير كلمة المرور" desc="تأكد من أمان حسابك" color="#2A3FA0"
            icon={<svg width="18" height="18" fill="none" stroke="#2A3FA0" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>} />
        </div>

        {/* Preferences Section */}
        <SectionTitle title="التفضيلات" />
        <div style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", border: "1px solid #f0f0f0" }}>
          <Row href="/ar/admin" label="اللغة" desc="العربية" color="#2A7A45"
            icon={<svg width="18" height="18" fill="none" stroke="#2A7A45" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6"/></svg>} />
          <Row href="/ar/admin" label="الإشعارات" desc="تحكم في التنبيهات" color="#B07A00"
            icon={<svg width="18" height="18" fill="none" stroke="#B07A00" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>} />
        </div>

        {/* Info Section */}
        <SectionTitle title="المعلومات" />
        <div style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", border: "1px solid #f0f0f0" }}>
          <Row href="/ar/admin/store_management/policies" label="سياسة الخصوصية" color="#6B46C1"
            icon={<svg width="18" height="18" fill="none" stroke="#6B46C1" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>} />
          <Row href="/ar/admin" label="المساعدة والدعم" color="#C0392B"
            icon={<svg width="18" height="18" fill="none" stroke="#C0392B" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/></svg>} />
        </div>

        {/* Logout */}
        <div style={{ margin: "20px 0 40px", background: "#fff", borderRadius: "16px", overflow: "hidden", border: "1px solid #f0f0f0" }}>
          <button onClick={logout} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "transparent", border: "none", cursor: "pointer", fontFamily: "Cairo,system-ui,sans-serif" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "10px", background: "#fff0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" fill="none" stroke="#e53e3e" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
              </div>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "#e53e3e" }}>تسجيل الخروج</span>
            </div>
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "0 0 20px" }}>
          <div style={{ background: "#fff", borderRadius: "14px", padding: "14px", border: "1px solid #f0f0f0", textAlign: "center" as const }}>
            <p style={{ margin: 0, fontSize: "10px", color: "#aaa", fontWeight: "600" }}>تاريخ الانضمام</p>
            <p style={{ margin: "4px 0 0", fontSize: "12px", fontWeight: "800", color: "#333" }}>{user?.created_at ? new Date(user.created_at).toLocaleDateString("ar-SA") : "—"}</p>
          </div>
          <div style={{ background: "#fff", borderRadius: "14px", padding: "14px", border: "1px solid #f0f0f0", textAlign: "center" as const }}>
            <p style={{ margin: 0, fontSize: "10px", color: "#aaa", fontWeight: "600" }}>آخر دخول</p>
            <p style={{ margin: "4px 0 0", fontSize: "12px", fontWeight: "800", color: "#333" }}>{user?.last_login ? new Date(user.last_login).toLocaleDateString("ar-SA") : "—"}</p>
          </div>
        </div>

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}