"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

const GROUPS = [
  { title:"الرئيسية والمحتوى", color:"#FF835E", bg:"#FFF0EB", pages: [
    { label:"الرئيسية", path:"/home", edit:"/admin/pages/home" },
    { label:"الصفحات المخصصة", path:"/page/...", edit:null, custom:true },
  ]},
  { title:"التسوق", color:"#2A7A45", bg:"#E8F5EE", pages: [
    { label:"المنتجات", path:"/products", edit:"/admin/products" },
    { label:"التصنيفات", path:"/category", edit:"/admin/catalog/categories" },
    { label:"العلامات التجارية", path:"/brand", edit:"/admin/catalog/brands" },
  ]},
  { title:"الشراء", color:"#2A3FA0", bg:"#EEF1FF", pages: [
    { label:"السلة", path:"/cart", edit:null },
    { label:"الدفع", path:"/checkout", edit:null },
    { label:"الطلبات", path:"/order", edit:"/admin/sales/orders" },
  ]},
  { title:"الحساب الشخصي", color:"#B07A00", bg:"#FFF8E6", pages: [
    { label:"الملف الشخصي", path:"/profile", edit:null },
    { label:"تسجيل الدخول", path:"/login", edit:null },
    { label:"إنشاء حساب", path:"/register", edit:null },
  ]},
  { title:"أخرى", color:"#888", bg:"#f5f5f5", pages: [
    { label:"السياسات", path:"/policy", edit:null },
    { label:"البائعين", path:"/seller", edit:"/admin/users/vendors" },
  ]},
]

export default function PagesAdmin() {
  const [dynPages, setDynPages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState<"static"|"custom">("static")

  useEffect(() => {
    fetch("/api/admin/pages").then(r=>r.json()).then(d=>{ setDynPages(d.pages||[]); setLoading(false) }).catch(()=>setLoading(false))
  }, [])

  return (
    <div style={{ minHeight:"100vh", background:"#EEEEEE", direction:"rtl", fontFamily:"Cairo,system-ui,sans-serif" }}>
      {/* Header */}
      <div style={{ padding:"14px 20px", borderBottom:"1px solid #e5e5e5", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:"#fff", zIndex:10, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
        <Link href="/admin" style={{ color:"#888", fontSize:"13px" }}>← رجوع</Link>
        <span style={{ fontWeight:"700", fontSize:"16px" }}>صفحات المتجر</span>
        <Link href="/admin/pages/new" style={{ background:"#FF835E", color:"#fff", padding:"6px 14px", borderRadius:"8px", fontWeight:"700", fontSize:"12px" }}>+ جديدة</Link>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:4, padding:"10px 16px", background:"#fff", borderBottom:"1px solid #e5e5e5" }}>
        {[{key:"static",label:"صفحات المتجر"},{key:"custom",label:`المخصصة (${dynPages.length})`}].map(t => (
          <button key={t.key} onClick={()=>setTab(t.key as any)} style={{ padding:"7px 16px", borderRadius:20, border:"none", cursor:"pointer", fontFamily:"Cairo,system-ui,sans-serif", fontSize:12, fontWeight:700, background:tab===t.key?"#FF835E":"#f0f0f0", color:tab===t.key?"#fff":"#888", transition:"all .2s" }}>{t.label}</button>
        ))}
      </div>

      <div style={{ padding:"12px 16px", maxWidth:"700px", margin:"0 auto" }}>
        <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="ابحث..."
          style={{ width:"100%", padding:"11px 14px", background:"#fff", border:"1px solid #e5e5e5", borderRadius:12, fontSize:13, outline:"none", fontFamily:"Cairo,system-ui,sans-serif", boxSizing:"border-box" as const, marginBottom:14 }} />

        {tab==="static" && GROUPS.map(group => {
          const pages = group.pages.filter(p => !p.custom && (search===""||p.label.includes(search)||p.path.includes(search)))
          if (!pages.length) return null
          return (
            <div key={group.title} style={{ marginBottom:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:group.color }} />
                <span style={{ fontSize:11, fontWeight:700, color:"#888", textTransform:"uppercase" as const, letterSpacing:"1px" }}>{group.title}</span>
              </div>
              <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e5e5e5", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                {pages.map((p,i) => (
                  <div key={p.path} style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:12, borderBottom:i<pages.length-1?"1px solid #f0f0f0":"none" }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:group.bg, border:`2px solid ${group.color}`, flexShrink:0 }} />
                    <div style={{ flex:1 }}>
                      <p style={{ fontWeight:700, fontSize:13, margin:0, color:"#111" }}>{p.label}</p>
                      <p style={{ fontSize:11, color:"#888", margin:0 }}>klafstore.com{p.path}</p>
                    </div>
                    <div style={{ display:"flex", gap:6 }}>
                      <a href={"http://localhost:3001"+p.path} target="_blank" style={{ fontSize:11, color:"#888", padding:"4px 10px", border:"1px solid #e5e5e5", borderRadius:7 }}>معاينة</a>
                      {p.edit && <Link href={p.edit} style={{ fontSize:11, color:"#fff", background:group.color, padding:"4px 10px", borderRadius:7 }}>تعديل</Link>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {tab==="custom" && (
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {loading ? <p style={{ textAlign:"center", color:"#888", padding:"30px 0" }}>جاري التحميل...</p> : dynPages.filter(p=>search===""||p.title?.includes(search)).length===0 ? (
              <div style={{ textAlign:"center", padding:"50px 20px", background:"#fff", borderRadius:14, border:"2px dashed #e5e5e5" }}>
                <p style={{ color:"#888", marginBottom:12 }}>لا يوجد صفحات مخصصة</p>
                <Link href="/admin/pages/new" style={{ background:"#FF835E", color:"#fff", padding:"9px 18px", borderRadius:10, fontWeight:700, fontSize:13 }}>+ أنشئ صفحة</Link>
              </div>
            ) : dynPages.filter(p=>search===""||p.title?.includes(search)).map((p:any) => (
              <div key={p.id} style={{ background:"#fff", borderRadius:14, padding:"12px 16px", border:"1px solid #e5e5e5", display:"flex", alignItems:"center", gap:12, boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                    <p style={{ fontWeight:700, fontSize:13, margin:0, color:"#111" }}>{p.title}</p>
                    <span style={{ background:p.is_active?"#E8F5EE":"#f5f5f5", color:p.is_active?"#2A7A45":"#888", fontSize:9, fontWeight:800, padding:"2px 8px", borderRadius:20 }}>{p.is_active?"نشطة":"معطلة"}</span>
                  </div>
                  <p style={{ fontSize:11, color:"#888", margin:0 }}>klafstore.com/page/{p.slug}</p>
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  <a href={"http://localhost:3001/page/"+p.slug} target="_blank" style={{ fontSize:11, color:"#888", padding:"4px 10px", border:"1px solid #e5e5e5", borderRadius:7 }}>معاينة</a>
                  <Link href={"/admin/pages/"+p.id} style={{ fontSize:11, color:"#fff", background:"#FF835E", padding:"4px 10px", borderRadius:7 }}>تعديل</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
