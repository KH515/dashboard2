"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const maskEmail = (email: string) => {
  if (!email) return ""
  const [user, domain] = email.split("@")
  return user.slice(0, 3) + "***@" + domain
}

const roleInfo: Record<string, { label: string; color: string; bg: string; permissions: string[] }> = {
  admin: {
    label: "مدير النظام",
    color: "#fff",
    bg: "#111",
    permissions: ["إدارة المستخدمين", "إدارة المنتجات", "إدارة الطلبات", "إدارة الإعدادات", "إدارة البائعين", "عرض التقارير", "إدارة البنرات", "إدارة الكوبونات"]
  },
  moderator: {
    label: "مشرف",
    color: "#fff",
    bg: "#2A3FA0",
    permissions: ["إدارة المنتجات", "إدارة الطلبات", "الرد على العملاء", "عرض التقارير"]
  },
}

export default function ProfilePage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showPerms, setShowPerms] = useState(false)
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
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "avatars")
      const res = await fetch("/api/staff/upload", { method: "POST", body: formData, credentials: "include" })
      const data = await res.json()
      if (data.url) {
        await fetch("/api/staff/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ avatar: data.url }) })
        setUser((u: any) => ({ ...u, avatar: data.url }))
        setMsg("✅ تم تحديث الصورة")
        setTimeout(() => setMsg(""), 3000)
      }
    } catch { setMsg("❌ فشل رفع الصورة") }
    finally { setUploading(false) }
  }

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    router.push("/ar/login")
  }

  const role = roleInfo[user?.role] || roleInfo.admin

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#F5F5F7", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Cairo,system-ui,sans-serif" }}>
      <p style={{ color:"#aaa" }}>جاري التحميل...</p>
    </div>
  )

  return (
    <div style={{ minHeight:"100vh", background:"#F5F5F7", fontFamily:"Cairo,system-ui,sans-serif", direction:"rtl" }}>
      <style>{`@keyframes spin { to { transform:rotate(360deg) } } @keyframes fadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }`}</style>

      {/* Header */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e5e5e5", position:"sticky", top:0, zIndex:10, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
        <div style={{ maxWidth:"500px", margin:"0 auto", padding:"0 16px", display:"flex", alignItems:"center", gap:10, height:"56px" }}>
          <Link href="/ar/admin" style={{ width:32, height:32, borderRadius:"50%", background:"#f5f5f7", border:"1px solid #e5e5e5", display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none", color:"#555", flexShrink:0 }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
          </Link>
          <span style={{ fontSize:"17px", fontWeight:"900", color:"#111" }}>حسابي</span>
        </div>
      </div>

      <div style={{ maxWidth:"500px", margin:"0 auto" }}>

        {/* Profile Section */}
        <div style={{ background:"#fff", padding:"32px 16px 24px", borderBottom:"8px solid #F5F5F7", textAlign:"center" as const }}>
          
          {/* Avatar */}
          <div style={{ position:"relative", width:90, height:90, margin:"0 auto 16px" }}>
            <div style={{ width:90, height:90, borderRadius:"50%", background:user?.avatar ? "transparent" : "#FF835E", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", border:"3px solid #fff", boxShadow:"0 4px 16px rgba(255,131,94,.25)" }}>
              {user?.avatar
                ? <img src={user.avatar} style={{ width:"100%", height:"100%", objectFit:"cover" }} alt="" />
                : <span style={{ color:"#fff", fontSize:"36px", fontWeight:"900" }}>{user?.name?.[0] || "A"}</span>}
            </div>
            <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ position:"absolute", bottom:2, left:2, width:28, height:28, borderRadius:"50%", background:"#FF835E", border:"2.5px solid #fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", padding:0, boxShadow:"0 2px 6px rgba(255,131,94,.4)" }}>
              {uploading
                ? <div style={{ width:12, height:12, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.6s linear infinite" }}></div>
                : <svg width="13" height="13" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>}
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleUpload} />
          </div>

          {/* Name */}
          <h2 style={{ fontSize:"22px", fontWeight:"900", margin:"0 0 4px", color:"#111" }}>{user?.name}</h2>
          
          {/* Username */}
          <p style={{ margin:"0 0 10px", fontSize:"14px", color:"#888", fontWeight:"600" }}>@{user?.username}</p>

          {/* Email masked */}
          <p style={{ margin:"0 0 14px", fontSize:"12px", color:"#bbb" }}>{maskEmail(user?.email)}</p>

          {/* Role Badge - clickable */}
          <button onClick={() => setShowPerms(!showPerms)} style={{ background:role.bg, color:role.color, padding:"5px 14px", borderRadius:"20px", fontSize:"12px", fontWeight:"700", border:"none", cursor:"pointer", fontFamily:"Cairo,system-ui,sans-serif", display:"inline-flex", alignItems:"center", gap:5 }}>
            <svg width="11" height="11" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            {role.label}
            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d={showPerms ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"}/></svg>
          </button>

          {/* Permissions popup */}
          {showPerms && (
            <div style={{ margin:"12px auto 0", maxWidth:280, background:"#fff", borderRadius:"14px", border:"1px solid #e5e5e5", padding:"14px", textAlign:"right" as const, boxShadow:"0 4px 20px rgba(0,0,0,.08)", animation:"fadeIn 0.2s ease" }}>
              <p style={{ margin:"0 0 10px", fontSize:"12px", fontWeight:"800", color:"#555" }}>الصلاحيات الممنوحة:</p>
              {role.permissions.map((p, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 0", borderBottom: i < role.permissions.length - 1 ? "1px solid #f5f5f5" : "none" }}>
                  <svg width="12" height="12" fill="none" stroke="#FF835E" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                  <span style={{ fontSize:"12px", color:"#333" }}>{p}</span>
                </div>
              ))}
            </div>
          )}

          {msg && <p style={{ margin:"10px 0 0", fontSize:"12px", color:msg.includes("✅") ? "#166534" : "#e53e3e", fontWeight:"700" }}>{msg}</p>}
        </div>

        {/* Menu */}
        <div style={{ padding:"8px 16px 40px" }}>
          
          {/* Account */}
          <div style={{ background:"#fff", borderRadius:"16px", overflow:"hidden", border:"1px solid #efefef", marginTop:20 }}>
            {[
              { href:"/ar/admin/profile/edit", label:"تعديل الملف الشخصي", icon:"M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z", color:"#FF835E" },
              { href:"/ar/admin", label:"اللغة", desc:"العربية", icon:"M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6", color:"#2A7A45", last:true },
            ].map((item, i, arr) => (
              <Link key={i} href={item.href} style={{ textDecoration:"none" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", background:"#fff", borderBottom: i < arr.length - 1 ? "1px solid #f5f5f7" : "none" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:36, height:36, borderRadius:"10px", background:`${item.color}15`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <svg width="18" height="18" fill="none" stroke={item.color} strokeWidth="1.5" viewBox="0 0 24 24"><path d={item.icon}/></svg>
                    </div>
                    <div>
                      <p style={{ margin:0, fontSize:"14px", fontWeight:"700", color:"#111" }}>{item.label}</p>
                      {item.desc && <p style={{ margin:"2px 0 0", fontSize:"11px", color:"#aaa" }}>{item.desc}</p>}
                    </div>
                  </div>
                  <svg width="16" height="16" fill="none" stroke="#ccc" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l-6-6 6-6"/></svg>
                </div>
              </Link>
            ))}
          </div>

          {/* Support */}
          <div style={{ background:"#fff", borderRadius:"16px", overflow:"hidden", border:"1px solid #efefef", marginTop:12 }}>
            {[
              { href:"/ar/admin", label:"الأسئلة الشائعة", icon:"M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color:"#2A3FA0" },
              { href:"/ar/admin", label:"الدعم الفني", icon:"M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z", color:"#6B46C1", last:true },
            ].map((item, i, arr) => (
              <Link key={i} href={item.href} style={{ textDecoration:"none" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", background:"#fff", borderBottom: i < arr.length - 1 ? "1px solid #f5f5f7" : "none" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:36, height:36, borderRadius:"10px", background:`${item.color}15`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <svg width="18" height="18" fill="none" stroke={item.color} strokeWidth="1.5" viewBox="0 0 24 24"><path d={item.icon}/></svg>
                    </div>
                    <p style={{ margin:0, fontSize:"14px", fontWeight:"700", color:"#111" }}>{item.label}</p>
                  </div>
                  <svg width="16" height="16" fill="none" stroke="#ccc" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l-6-6 6-6"/></svg>
                </div>
              </Link>
            ))}
          </div>

          {/* Logout */}
          <div style={{ background:"#fff", borderRadius:"16px", overflow:"hidden", border:"1px solid #efefef", marginTop:12 }}>
            <button onClick={logout} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", background:"transparent", border:"none", cursor:"pointer", fontFamily:"Cairo,system-ui,sans-serif" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:36, height:36, borderRadius:"10px", background:"#fff0f0", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="18" height="18" fill="none" stroke="#e53e3e" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                </div>
                <span style={{ fontSize:"14px", fontWeight:"700", color:"#e53e3e" }}>تسجيل الخروج</span>
              </div>
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}