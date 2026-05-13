"use client"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"

export default function DesignPage() {
  const t = useTranslations()
  const locale = useLocale()
  const isAr = locale === "ar"

  const items = [
    {
      label: isAr ? "الألوان والثيم" : "Colors & Theme",
      desc: isAr ? "اللون الرئيسي، الثانوي، الخلفية" : "Primary, secondary, background colors",
      href: `/${locale}/admin/store_management/settings`,
      icon: "M12 2a10 10 0 110 20A10 10 0 0112 2z",
      color: "#FFF0EB",
      stroke: "#FF835E"
    },
    {
      label: isAr ? "الخطوط" : "Fonts",
      desc: isAr ? "نوع الخط وأحجامه" : "Font family and sizes",
      href: `/${locale}/admin/store_management/settings`,
      icon: "M4 6h16M4 12h16M4 18h7",
      color: "#EEF1FF",
      stroke: "#2A3FA0"
    },
    {
      label: isAr ? "الهيدر والفوتر" : "Header & Footer",
      desc: isAr ? "شعار، روابط، ألوان" : "Logo, links, colors",
      href: `/${locale}/admin/store_management/settings`,
      icon: "M3 5h18M3 19h18",
      color: "#E8F5EE",
      stroke: "#2A7A45"
    },
    {
      label: isAr ? "بطاقة المنتج" : "Product Card",
      desc: isAr ? "تخصيص شكل البطاقة" : "Customize card design",
      href: `/${locale}/admin/pages`,
      icon: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
      color: "#FFF8E6",
      stroke: "#B07A00"
    },
  ]

  return (
    <div style={{ minHeight:"100vh", background:"#EEEEEE", direction: isAr ? "rtl" : "ltr", fontFamily:"Cairo,system-ui,sans-serif" }}>
      <div style={{ padding:"16px 20px", borderBottom:"1px solid #e5e5e5", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:"#fff", zIndex:10, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
        <Link href={`/${locale}/admin`} style={{ color:"#888", fontSize:"13px", textDecoration:"none" }}>
          {isAr ? "← رجوع" : "← Back"}
        </Link>
        <span style={{ fontWeight:"700", fontSize:"16px" }}>{t("store_management.design")}</span>
        <div />
      </div>
      <div style={{ padding:"16px", maxWidth:"700px", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {items.map(item => (
          <Link key={item.href+item.label} href={item.href} style={{ textDecoration: "none" }}>
            <div style={{ background:"#fff", borderRadius:16, padding:16, border:"1px solid #e5e5e5", boxShadow:"0 1px 4px rgba(0,0,0,.04)", display:"flex", gap:12, alignItems:"flex-start", cursor:"pointer" }}>
              <div style={{ width:42, height:42, borderRadius:10, background:item.color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <svg width="20" height="20" fill="none" stroke={item.stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d={item.icon}/></svg>
              </div>
              <div>
                <p style={{ fontWeight:"700", fontSize:14, margin:0, color:"#111" }}>{item.label}</p>
                <p style={{ fontSize:11, color:"#888", margin:"3px 0 0" }}>{item.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}