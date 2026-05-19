import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AdsLoginPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) redirect("/login")

  const pages = [
    { href:"customer", label:"العملاء", sub:"إعلانات صفحة تسجيل العملاء", color:"#FF835E", icon:<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/></svg> },
    { href:"seller", label:"البائعين", sub:"إعلانات صفحة تسجيل البائعين", color:"#2A3FA0", icon:<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> },
    { href:"affiliate", label:"العمولة", sub:"إعلانات صفحة تسجيل العمولة", color:"#166534", icon:<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> },
    { href:"staff", label:"الموظفين", sub:"إعلانات صفحة تسجيل الموظفين", color:"#7c3aed", icon:<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg> },
    { href:"admin", label:"الأدمن", sub:"إعلانات صفحة تسجيل الأدمن", color:"#1a1a2e", icon:<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  ]

  return (
    <div style={{ fontFamily:"Cairo,system-ui,sans-serif", direction:"rtl", padding:"24px", maxWidth:900, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <Link href="../ads" style={{ textDecoration:"none", color:"#aaa", fontSize:"13px" }}>← رجوع</Link>
        <h1 style={{ fontSize:"20px", fontWeight:"900", color:"#111", margin:0 }}>إعلانات صفحات التسجيل</h1>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
        {pages.map(p => (
          <Link key={p.href} href={`login/${p.href}`} style={{ textDecoration:"none" }}>
            <div style={{ background:"#fff", borderRadius:"14px", padding:"20px", border:"1px solid #ebebeb", display:"flex", flexDirection:"column" as const, gap:12, cursor:"pointer" }}>
              <div style={{ width:44, height:44, borderRadius:"12px", background:p.color+"15", display:"flex", alignItems:"center", justifyContent:"center", color:p.color }}>
                {p.icon}
              </div>
              <div>
                <p style={{ fontSize:"14px", fontWeight:"800", color:"#111", margin:"0 0 4px" }}>{p.label}</p>
                <p style={{ fontSize:"11px", color:"#aaa", margin:0 }}>{p.sub}</p>
              </div>
              <div style={{ display:"flex", justifyContent:"flex-end" }}>
                <svg width="16" height="16" fill="none" stroke="#ccc" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l-6-6 6-6"/></svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}