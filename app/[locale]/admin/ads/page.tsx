import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AdsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) redirect("/login")

  const pages = [
    { href:"orders", label:"طلباتي", sub:"إعلانات صفحة الطلبات", color:"#FF835E", icon:<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg> },
    { href:"invoices", label:"فواتيري", sub:"إعلانات صفحة الفواتير", color:"#2A3FA0", icon:<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg> },
    { href:"wishlist", label:"المفضلة", sub:"إعلانات صفحة المفضلة", color:"#e53e3e", icon:<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> },
    { href:"loyalty", label:"نظام الولاء", sub:"إعلانات صفحة الولاء", color:"#f59e0b", icon:<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
    { href:"edit", label:"تعديل الملف", sub:"إعلانات صفحة التعديل", color:"#7c3aed", icon:<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
    { href:"home", label:"الرئيسية", sub:"إعلانات الصفحة الرئيسية", color:"#166534", icon:<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { href:"login", label:"صفحات التسجيل", sub:"إعلانات تسجيل الدخول", color:"#0f172a", icon:<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg> },
  ]

  return (
    <div style={{ fontFamily:"Cairo,system-ui,sans-serif", direction:"rtl", padding:"24px", maxWidth:900, margin:"0 auto" }}>
      <h1 style={{ fontSize:"20px", fontWeight:"900", color:"#111", margin:"0 0 20px" }}>إدارة الإعلانات</h1>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
        {pages.map(p => (
          <Link key={p.href} href={`ads/${p.href}`} style={{ textDecoration:"none" }}>
            <div style={{ background:"#fff", borderRadius:"14px", padding:"20px", border:"1px solid #ebebeb", display:"flex", flexDirection:"column" as const, gap:12, transition:"box-shadow 0.2s", cursor:"pointer" }}>
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