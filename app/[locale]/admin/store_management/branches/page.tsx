"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"

interface Branch { id:number; name:string; city:string|null; address:string|null; phone:string|null; email:string|null; whatsapp:string|null; latitude:number|null; longitude:number|null; google_maps_url:string|null; working_hours:string|null; is_main:number; is_active:number }

export default function BranchesPage() {
  const t = useTranslations()
  const locale = useLocale()
  const isAr = locale === "ar"
  const [loading, setLoading] = useState(true)
  const [branches, setBranches] = useState<Branch[]>([])
  const [editing, setEditing] = useState<Branch|null>(null)
  const [hours, setHours] = useState<Record<string,string>>({})

  const days = [
    {k:"sat",l: isAr ? "السبت" : "Saturday"},
    {k:"sun",l: isAr ? "الأحد" : "Sunday"},
    {k:"mon",l: isAr ? "الإثنين" : "Monday"},
    {k:"tue",l: isAr ? "الثلاثاء" : "Tuesday"},
    {k:"wed",l: isAr ? "الأربعاء" : "Wednesday"},
    {k:"thu",l: isAr ? "الخميس" : "Thursday"},
    {k:"fri",l: isAr ? "الجمعة" : "Friday"}
  ]

  useEffect(() => { load() }, [])

  const load = async () => {
    try {
      const r = await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/branches")
      const d = await r.json()
      setBranches(d.branches || [])
    } catch {}
    setLoading(false)
  }

  const openNew = () => {
    setEditing({ id:0, name:"", city:"", address:"", phone:"", email:"", whatsapp:"", latitude:null, longitude:null, google_maps_url:"", working_hours:"", is_main:0, is_active:1 })
    setHours({})
  }

  const openEdit = (b: Branch) => {
    setEditing({...b})
    try { setHours(JSON.parse(b.working_hours||"{}")) } catch { setHours({}) }
  }

  const save = async () => {
    if (!editing || !editing.name) { alert(isAr ? "اسم الفرع مطلوب" : "Branch name required"); return }
    const data = { ...editing, working_hours: JSON.stringify(hours) }
    try {
      if (editing.id === 0) {
        await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/branches", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) })
      } else {
        await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/branches/"+editing.id, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) })
      }
      setEditing(null)
      load()
      alert(t("common.success"))
    } catch { alert(t("common.error")) }
  }

  const remove = async (id:number) => {
    if (!confirm(t("common.confirm_delete"))) return
    await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/branches/"+id, { method:"DELETE" })
    load()
  }

  if (loading) return <div style={{ padding:40, textAlign:"center", color:"#888" }}>{t("common.loading")}</div>

  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:24, direction: isAr ? "rtl" : "ltr" }}>
      <Link href={`/${locale}/admin`} style={{ fontSize:13, color:"#888", textDecoration:"none" }}>
        {isAr ? "← العودة" : "← Back"}
      </Link>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8, marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:900, color:"#111", margin:0 }}>{t("store_management.branches")}</h1>
          <p style={{ fontSize:13, color:"#888", margin:"4px 0 0" }}>
            {isAr ? "إدارة فروع المتجر ومعلومات الاتصال" : "Manage store branches and contact info"}
          </p>
        </div>
        <button onClick={openNew} style={{ padding:"10px 20px", background:"#FF835E", color:"#fff", border:"none", borderRadius:10, fontWeight:800, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>
          + {isAr ? "إضافة فرع" : "Add branch"}
        </button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:14 }}>
        {branches.map(b => (
          <div key={b.id} style={{ background:"#fff", borderRadius:12, padding:18, border:"1px solid #eee" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                  <h3 style={{ fontSize:15, fontWeight:800, color:"#111", margin:0 }}>{b.name}</h3>
                  {b.is_main===1 && <span style={{ padding:"3px 8px", background:"#fff5f2", color:"#FF835E", borderRadius:6, fontSize:10, fontWeight:800 }}>{isAr ? "رئيسي" : "Main"}</span>}
                  {b.is_active!==1 && <span style={{ padding:"3px 8px", background:"#f5f5f5", color:"#888", borderRadius:6, fontSize:10, fontWeight:800 }}>{t("common.inactive")}</span>}
                </div>
                {b.city && <p style={{ fontSize:12, color:"#888", margin:0 }}>{b.city}</p>}
              </div>
            </div>
            {b.address && <p style={{ fontSize:12, color:"#666", margin:"6px 0", lineHeight:1.5 }}>{b.address}</p>}
            <div style={{ display:"flex", flexDirection:"column", gap:4, marginTop:10 }}>
              {b.phone && <div style={{ fontSize:12, color:"#666" }}>📞 {b.phone}</div>}
              {b.email && <div style={{ fontSize:12, color:"#666" }}>✉️ {b.email}</div>}
            </div>
            <div style={{ display:"flex", gap:6, marginTop:14 }}>
              <button onClick={()=>openEdit(b)} style={{ flex:1, padding:"8px", background:"#FF835E", color:"#fff", border:"none", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:12, fontFamily:"inherit" }}>{t("common.edit")}</button>
              {b.is_main!==1 && (
                <button onClick={()=>remove(b.id)} style={{ width:36, background:"#fff0f0", color:"#dc2626", border:"1px solid #fed7d7", borderRadius:8, cursor:"pointer", fontWeight:800 }}>✕</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:500, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:20, overflowY:"auto" }} onClick={e=>e.target===e.currentTarget && setEditing(null)}>
          <div style={{ background:"#fff", borderRadius:14, padding:24, maxWidth:600, width:"100%", marginTop:30, marginBottom:30 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <h2 style={{ fontSize:18, fontWeight:800, margin:0 }}>
                {editing.id===0 ? (isAr ? "فرع جديد" : "New Branch") : (isAr ? "تعديل الفرع" : "Edit Branch")}
              </h2>
              <button onClick={()=>setEditing(null)} style={{ background:"#f5f5f5", border:"none", width:30, height:30, borderRadius:7, cursor:"pointer", fontSize:14 }}>✕</button>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div style={{ gridColumn:"1 / -1" }}>
                <label style={{ fontSize:12, fontWeight:700, color:"#333", display:"block", marginBottom:5 }}>{isAr ? "اسم الفرع *" : "Branch name *"}</label>
                <input value={editing.name} onChange={e=>setEditing({...editing,name:e.target.value})} style={{ width:"100%", padding:"9px 11px", border:"1px solid #ddd", borderRadius:7, fontSize:13, fontFamily:"inherit" }} dir={isAr ? "rtl" : "ltr"} />
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:"#333", display:"block", marginBottom:5 }}>{isAr ? "المدينة" : "City"}</label>
                <input value={editing.city||""} onChange={e=>setEditing({...editing,city:e.target.value})} style={{ width:"100%", padding:"9px 11px", border:"1px solid #ddd", borderRadius:7, fontSize:13, fontFamily:"inherit" }} dir={isAr ? "rtl" : "ltr"} />
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:"#333", display:"block", marginBottom:5 }}>{t("footer_page.phone")}</label>
                <input value={editing.phone||""} onChange={e=>setEditing({...editing,phone:e.target.value})} placeholder="+966..." style={{ width:"100%", padding:"9px 11px", border:"1px solid #ddd", borderRadius:7, fontSize:13, fontFamily:"inherit" }} />
              </div>
              <div style={{ gridColumn:"1 / -1" }}>
                <label style={{ fontSize:12, fontWeight:700, color:"#333", display:"block", marginBottom:5 }}>{t("footer_page.address")}</label>
                <input value={editing.address||""} onChange={e=>setEditing({...editing,address:e.target.value})} style={{ width:"100%", padding:"9px 11px", border:"1px solid #ddd", borderRadius:7, fontSize:13, fontFamily:"inherit" }} dir={isAr ? "rtl" : "ltr"} />
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:"#333", display:"block", marginBottom:5 }}>{t("footer_page.email")}</label>
                <input value={editing.email||""} onChange={e=>setEditing({...editing,email:e.target.value})} style={{ width:"100%", padding:"9px 11px", border:"1px solid #ddd", borderRadius:7, fontSize:13, fontFamily:"inherit" }} />
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:"#333", display:"block", marginBottom:5 }}>WhatsApp</label>
                <input value={editing.whatsapp||""} onChange={e=>setEditing({...editing,whatsapp:e.target.value})} placeholder="+966..." style={{ width:"100%", padding:"9px 11px", border:"1px solid #ddd", borderRadius:7, fontSize:13, fontFamily:"inherit" }} />
              </div>
              <div style={{ gridColumn:"1 / -1" }}>
                <label style={{ fontSize:12, fontWeight:700, color:"#333", display:"block", marginBottom:5 }}>{isAr ? "رابط Google Maps" : "Google Maps URL"}</label>
                <input value={editing.google_maps_url||""} onChange={e=>setEditing({...editing,google_maps_url:e.target.value})} placeholder="https://maps.google.com/..." style={{ width:"100%", padding:"9px 11px", border:"1px solid #ddd", borderRadius:7, fontSize:13, fontFamily:"inherit" }} />
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:"#333", display:"block", marginBottom:5 }}>Latitude</label>
                <input type="number" step="any" value={editing.latitude||""} onChange={e=>setEditing({...editing,latitude:e.target.value?parseFloat(e.target.value):null})} placeholder="24.7136" style={{ width:"100%", padding:"9px 11px", border:"1px solid #ddd", borderRadius:7, fontSize:13, fontFamily:"inherit" }} />
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:"#333", display:"block", marginBottom:5 }}>Longitude</label>
                <input type="number" step="any" value={editing.longitude||""} onChange={e=>setEditing({...editing,longitude:e.target.value?parseFloat(e.target.value):null})} placeholder="46.6753" style={{ width:"100%", padding:"9px 11px", border:"1px solid #ddd", borderRadius:7, fontSize:13, fontFamily:"inherit" }} />
              </div>
            </div>

            <div style={{ marginTop:14, paddingTop:14, borderTop:"1px solid #f0f0f0" }}>
              <p style={{ fontSize:12, fontWeight:800, color:"#333", marginBottom:8 }}>
                {isAr ? "ساعات العمل" : "Working Hours"}
              </p>
              <div style={{ display:"grid", gridTemplateColumns:"100px 1fr", gap:6, fontSize:12 }}>
                {days.map(d => (
                  <div key={d.k} style={{ display: "contents" }}>
                    <div style={{ display:"flex", alignItems:"center", color:"#666", fontWeight:600 }}>{d.l}</div>
                    <input value={hours[d.k]||""} onChange={e=>setHours({...hours,[d.k]:e.target.value})} placeholder={isAr ? "9-22 أو مغلق" : "9-22 or closed"} style={{ padding:"7px 10px", border:"1px solid #ddd", borderRadius:6, fontSize:12, fontFamily:"inherit" }} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop:14, paddingTop:14, borderTop:"1px solid #f0f0f0", display:"flex", flexDirection:"column", gap:8 }}>
              <label style={{ display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}>
                <span style={{ fontSize:13, fontWeight:600, color:"#111" }}>{isAr ? "الفرع الرئيسي" : "Main branch"}</span>
                <input type="checkbox" checked={editing.is_main===1} onChange={e=>setEditing({...editing,is_main:e.target.checked?1:0})} style={{ width:18, height:18, cursor:"pointer", accentColor:"#FF835E" }} />
              </label>
              <label style={{ display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}>
                <span style={{ fontSize:13, fontWeight:600, color:"#111" }}>{isAr ? "الفرع مفعّل" : "Branch active"}</span>
                <input type="checkbox" checked={editing.is_active===1} onChange={e=>setEditing({...editing,is_active:e.target.checked?1:0})} style={{ width:18, height:18, cursor:"pointer", accentColor:"#FF835E" }} />
              </label>
            </div>

            <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:18 }}>
              <button onClick={()=>setEditing(null)} style={{ padding:"9px 18px", background:"#f5f5f5", color:"#333", border:"none", borderRadius:8, cursor:"pointer", fontWeight:700, fontFamily:"inherit", fontSize:13 }}>{t("common.cancel")}</button>
              <button onClick={save} style={{ padding:"9px 22px", background:"#FF835E", color:"#fff", border:"none", borderRadius:8, cursor:"pointer", fontWeight:800, fontFamily:"inherit", fontSize:13 }}>{t("common.save")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}