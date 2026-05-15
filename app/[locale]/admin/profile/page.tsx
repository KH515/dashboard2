"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const RoleBadge = ({ role }: { role: string }) => {
  const roles: Record<string, { label: string; color: string; bg: string }> = {
    admin: { label: "مدير النظام", color: "#fff", bg: "#111" },
    moderator: { label: "مشرف", color: "#fff", bg: "#2A3FA0" },
  }
  const r = roles[role] || roles.admin
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:r.bg, color:r.color, padding:"4px 12px", borderRadius:"20px", fontSize:"11px", fontWeight:"700" }}>
      <svg width="10" height="10" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
      {r.label}
    </span>
  )
}

const maskEmail = (email: string) => {
  const [user, domain] = email.split("@")
  return user.slice(0, 3) + "***@" + domain
}

export default function ProfilePage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [msg, setMsg] = useState("")
  const [error, setError] = useState("")
  const [form, setForm] = useState({ name: "", username: "" })

  useEffect(() => {
    fetch("/api/staff/me", { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        if (d.user) {
          setUser(d.user)
          setForm({ name: d.user.name || "", username: d.user.username || "" })
        } else router.push("/ar/login")
      })
      .catch(() => router.push("/ar/login"))
      .finally(() => setLoading(false))
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadProgress(0)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "avatars")
      
      // simulate progress
      const interval = setInterval(() => setUploadProgress(p => Math.min(p + 20, 90)), 200)
      
      const res = await fetch("/api/staff/upload", { method: "POST", body: formData, credentials: "include" })
      clearInterval(interval)
      setUploadProgress(100)
      
      const data = await res.json()
      if (data.url) {
        await fetch("/api/staff/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ avatar: data.url })
        })
        setUser((u: any) => ({ ...u, avatar: data.url }))
        setMsg("تم تحديث الصورة")
      }
    } catch { setError("فشل رفع الصورة") }
    finally { setUploading(false); setUploadProgress(0) }
  }

  const saveInfo = async () => {
    setSaving(true); setMsg(""); setError("")
    const res = await fetch("/api/staff/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: form.name, username: form.username })
    })
    const data = await res.json()
    if (res.ok) { setMsg("تم حفظ البيانات بنجاح"); setUser((u: any) => ({ ...u, ...form })) }
    else setError(data.error || "حصل خطأ")
    setSaving(false)
  }

  const inp = {
    width: "100%", padding: "13px 16px", background: "#f5f5f7", border: "1.5px solid #e5e5e5",
    borderRadius: "12px", fontSize: "14px", outline: "none", fontFamily: "Cairo,system-ui,sans-serif",
    color: "#111", boxSizing: "border-box" as const, transition: "border-color 0.2s"
  }

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#F5F5F7", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Cairo,system-ui,sans-serif" }}>
      <div style={{ textAlign:"center" as const }}>
        <div style={{ width:40, height:40, border:"3px solid #FF835E", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 12px" }}></div>
        <p style={{ color:"#888", fontSize:"14px" }}>جاري التحميل...</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:"100vh", background:"#F5F5F7", fontFamily:"Cairo,system-ui,sans-serif", direction:"rtl" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      
      {/* Header */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e5e5e5", position:"sticky", top:0, zIndex:10, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
        <div style={{ maxWidth:"600px", margin:"0 auto", padding:"0 16px", display:"flex", alignItems:"center", justifyContent:"space-between", height:"56px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <Link href="/ar/admin" style={{ width:32, height:32, borderRadius:"50%", background:"#f5f5f7", border:"1px solid #e5e5e5", display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none", color:"#555" }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
            </Link>
            <span style={{ fontSize:"17px", fontWeight:"900", color:"#111" }}>الملف الشخصي</span>
          </div>
          <Link href="/ar/admin/profile/change-password" style={{ fontSize:"12px", color:"#FF835E", fontWeight:"700", textDecoration:"none" }}>تغيير كلمة المرور</Link>
        </div>
      </div>

      <div style={{ maxWidth:"600px", margin:"0 auto", padding:"20px 16px" }}>
        
        {/* Avatar Section */}
        <div style={{ background:"#fff", borderRadius:"20px", padding:"28px 20px", marginBottom:"16px", border:"1px solid #e5e5e5", textAlign:"center" as const, boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
          <div style={{ position:"relative", width:100, height:100, margin:"0 auto 16px" }}>
            <div style={{ width:100, height:100, borderRadius:"50%", background:user?.avatar ? "transparent" : "#FF835E", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", boxShadow:"0 4px 16px rgba(255,131,94,.3)", border:"3px solid #fff" }}>
              {user?.avatar
                ? <img src={user.avatar} style={{ width:"100%", height:"100%", objectFit:"cover" }} alt="" />
                : <span style={{ color:"#fff", fontSize:"36px", fontWeight:"900" }}>{user?.name?.[0] || "A"}</span>}
            </div>
            <button onClick={() => fileRef.current?.click()} style={{ position:"absolute", bottom:0, left:0, width:30, height:30, borderRadius:"50%", background:"#FF835E", border:"2px solid #fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="14" height="14" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleUpload} />
          </div>
          
          {/* Upload Progress */}
          {uploading && (
            <div style={{ marginBottom:12 }}>
              <div style={{ background:"#f5f5f7", borderRadius:6, height:6, overflow:"hidden" }}>
                <div style={{ height:"100%", background:"#FF835E", width:`${uploadProgress}%`, transition:"width 0.2s", borderRadius:6 }}></div>
              </div>
              <p style={{ fontSize:"11px", color:"#888", margin:"4px 0 0" }}>جاري الرفع... {uploadProgress}%</p>
            </div>
          )}

          <h2 style={{ fontSize:"22px", fontWeight:"900", margin:"0 0 4px", color:"#111" }}>{user?.name}</h2>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginBottom:8 }}>
            <span style={{ color:"#888", fontSize:"13px", fontWeight:"700" }}>@{user?.username}</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginBottom:12 }}>
            <svg width="13" height="13" fill="none" stroke="#bbb" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            <span style={{ color:"#bbb", fontSize:"12px" }}>{user?.email ? maskEmail(user.email) : ""}</span>
          </div>
          <RoleBadge role={user?.role} />

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:16 }}>
            <div style={{ background:"#f5f5f7", borderRadius:"12px", padding:"12px" }}>
              <p style={{ margin:0, fontSize:"10px", color:"#aaa", fontWeight:"600" }}>تاريخ الانضمام</p>
              <p style={{ margin:"4px 0 0", fontSize:"12px", fontWeight:"800", color:"#333" }}>{user?.created_at ? new Date(user.created_at).toLocaleDateString("ar-SA") : "—"}</p>
            </div>
            <div style={{ background:"#f5f5f7", borderRadius:"12px", padding:"12px" }}>
              <p style={{ margin:0, fontSize:"10px", color:"#aaa", fontWeight:"600" }}>آخر دخول</p>
              <p style={{ margin:"4px 0 0", fontSize:"12px", fontWeight:"800", color:"#333" }}>{user?.last_login ? new Date(user.last_login).toLocaleDateString("ar-SA") : "—"}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {msg && <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:"12px", padding:"12px 16px", marginBottom:16, color:"#166534", fontSize:"13px", fontWeight:"700", display:"flex", alignItems:"center", gap:8 }}>✅ {msg}</div>}
        {error && <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:"12px", padding:"12px 16px", marginBottom:16, color:"#991b1b", fontSize:"13px", fontWeight:"700" }}>⚠️ {error}</div>}

        {/* Edit Form */}
        <div style={{ background:"#fff", borderRadius:"20px", padding:"20px", marginBottom:"16px", border:"1px solid #e5e5e5", boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
          <h3 style={{ fontSize:"14px", fontWeight:"800", color:"#111", margin:"0 0 16px" }}>تعديل البيانات</h3>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:"12px", fontWeight:"700", color:"#666", display:"block", marginBottom:6 }}>الاسم الكامل</label>
            <input style={inp} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="اسمك الكامل" />
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:"12px", fontWeight:"700", color:"#666", display:"block", marginBottom:6 }}>اليوزرنيم</label>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", color:"#aaa", fontSize:"14px", fontWeight:"700" }}>@</span>
              <input style={{ ...inp, paddingRight:32 }} value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="username" dir="ltr" />
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={saveInfo} disabled={saving} style={{ flex:1, padding:"13px", background:"#111", color:"#fff", border:"none", borderRadius:"12px", fontSize:"14px", fontWeight:"800", cursor:"pointer", fontFamily:"Cairo,system-ui,sans-serif", opacity:saving ? 0.6 : 1 }}>
              {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
            </button>
            <button onClick={() => setForm({ name: user?.name || "", username: user?.username || "" })} style={{ padding:"13px 16px", background:"#f5f5f7", color:"#888", border:"1px solid #e5e5e5", borderRadius:"12px", fontSize:"13px", fontWeight:"700", cursor:"pointer", fontFamily:"Cairo,system-ui,sans-serif" }}>
              إلغاء
            </button>
          </div>
        </div>

        {/* Security */}
        <Link href="/ar/admin/profile/change-password" style={{ textDecoration:"none" }}>
          <div style={{ background:"#fff", borderRadius:"20px", padding:"18px 20px", border:"1px solid #e5e5e5", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 2px 8px rgba(0,0,0,.04)", cursor:"pointer" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:"12px", background:"#fff3f0", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="18" height="18" fill="none" stroke="#FF835E" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              </div>
              <div>
                <p style={{ margin:0, fontSize:"14px", fontWeight:"800", color:"#111" }}>تغيير كلمة المرور</p>
                <p style={{ margin:"2px 0 0", fontSize:"11px", color:"#aaa" }}>تأكد من أمان حسابك</p>
              </div>
            </div>
            <svg width="16" height="16" fill="none" stroke="#ccc" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l-6-6 6-6"/></svg>
          </div>
        </Link>
      </div>
    </div>
  )
}