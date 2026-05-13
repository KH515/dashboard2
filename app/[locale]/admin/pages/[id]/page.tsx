"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

const ICONS: Record<string,string> = {
  hero_slider: `<svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
  mini_banners: `<svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="3" width="9" height="14" rx="2"/><rect x="13" y="3" width="9" height="14" rx="2"/></svg>`,
  categories: `<svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M4 6h16M4 12h8M4 18h12"/></svg>`,
  products_new: `<svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>`,
  products_best: `<svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  flash_deals: `<svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  category_row: `<svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="7" width="4" height="10" rx="1"/><rect x="8" y="5" width="4" height="12" rx="1"/><rect x="14" y="3" width="4" height="14" rx="1"/></svg>`,
  ad_banner: `<svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 3H3v18h18V3z"/><path d="M9 9h6M9 12h4"/></svg>`,
  brands: `<svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><circle cx="7" cy="7" r="1.5"/></svg>`,
  text_block: `<svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M4 6h16M4 10h16M4 14h10"/></svg>`,
}

const SECTION_TYPES = [
  { type: "hero_slider", label: "بنر رئيسي", sub: "بنر كبير متحرك" },
  { type: "mini_banners", label: "بنرات صغيرة", sub: "بنرات قابلة للتمرير" },
  { type: "categories", label: "الأقسام", sub: "عرض التصنيفات" },
  { type: "products_new", label: "أحدث المنتجات", sub: "صف منتجات جديدة" },
  { type: "products_best", label: "الأكثر مبيعاً", sub: "منتجات الأكثر طلباً" },
  { type: "flash_deals", label: "عروض اليوم", sub: "منتجات مخفضة مع عداد" },
  { type: "category_row", label: "صف قسم", sub: "منتجات قسم معين" },
  { type: "ad_banner", label: "إعلان", sub: "بنر إعلاني" },
  { type: "brands", label: "البراندات", sub: "عرض البراندات" },
  { type: "text_block", label: "نص", sub: "فقرة نصية" },
]

const TYPE_LABELS: Record<string,string> = { hero_slider:"بنر رئيسي", mini_banners:"بنرات صغيرة", categories:"الأقسام", products_new:"أحدث المنتجات", products_best:"الأكثر مبيعاً", flash_deals:"عروض اليوم", category_row:"صف قسم", ad_banner:"إعلان", brands:"البراندات", text_block:"نص" }

export default function PageBuilder() {
  const params = useParams()
  const id = params.id as string
  const [page, setPage] = useState<any>(null)
  const [sections, setSections] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editSec, setEditSec] = useState<any>(null)
  const [configSec, setConfigSec] = useState<any>(null)
  const [localConfig, setLocalConfig] = useState<any>({})
  const [drag, setDrag] = useState<number|null>(null)
  const [dragOver, setDragOver] = useState<number|null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const [pRes, sRes, cRes, bRes] = await Promise.all([
      fetch("/api/admin/pages"),
      fetch("/api/admin/pages/" + id),
      fetch("${process.env.NEXT_PUBLIC_API_URL}/api/categories"),
      fetch("${process.env.NEXT_PUBLIC_API_URL}/api/brands"),
    ])
    const [pData, sData, cData, bData] = await Promise.all([pRes.json(), sRes.json(), cRes.json(), bRes.json()])
    setPage(pData.pages?.find((p: any) => String(p.id) === id) || null)
    setSections(sData.sections || [])
    setCategories(cData.categories || [])
    setBrands(bData.brands || [])
    setLoading(false)
  }

  const getConfig = (sec: any) => { try { return JSON.parse(sec.config || "{}") } catch { return {} } }

  const addSection = async (type: string) => {
    setShowAdd(false)
    const res = await fetch("/api/admin/pages/" + id + "/sections", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, title: TYPE_LABELS[type] || type, config: "{}" }) })
    const data = await res.json()
    if (data.section) { setSections(prev => [...prev, data.section]); setConfigSec(data.section); setLocalConfig(getConfig(data.section)) }
  }

  const deleteSection = async (sid: number) => {
    if (!confirm("حذف هذا القسم؟")) return
    await fetch("/api/admin/pages/" + id + "/sections/" + sid, { method: "DELETE" })
    setSections(prev => prev.filter(s => s.id !== sid))
    if (configSec?.id === sid) setConfigSec(null)
  }

  const toggleSection = async (sec: any) => {
    const v = sec.is_active ? 0 : 1
    await fetch("/api/admin/pages/" + id + "/sections/" + sec.id, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_active: v }) })
    setSections(prev => prev.map(s => s.id === sec.id ? { ...s, is_active: v } : s))
  }

  const saveTitle = async (sec: any, title: string) => {
    await fetch("/api/admin/pages/" + id + "/sections/" + sec.id, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title }) })
    setSections(prev => prev.map(s => s.id === sec.id ? { ...s, title } : s))
    setEditSec(null)
  }

  const saveConfig = async (sec: any, config: any) => {
    const configStr = JSON.stringify(config)
    await fetch("/api/admin/pages/" + id + "/sections/" + sec.id, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ config: configStr }) })
    setSections(prev => prev.map(s => s.id === sec.id ? { ...s, config: configStr } : s))
    setLocalConfig(config)
  }

  const saveLocalConfig = async () => {
    if (!configSec) return
    await saveConfig(configSec, localConfig)
  }

  const uploadImage = async (file: File): Promise<string> => {
    const fd = new FormData(); fd.append("file", file)
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
    const data = await res.json()
    return data.url || ""
  }

  const reorder = (newSecs: any[]) => {
    const updated = newSecs.map((s, idx) => ({ ...s, sort_order: idx + 1 }))
    setSections(updated)
    setHasChanges(true)
  }

  const saveOrder = async () => {
    setSaving(true)
    await fetch("/api/admin/pages/" + id + "/reorder", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sections: sections.map((s, idx) => ({ id: s.id, sort_order: idx + 1, is_active: s.is_active })) })
    })
    setHasChanges(false)
    setSaving(false)
  }

  const moveUp = (i: number) => { if (i===0) return; const s=[...sections]; const t=s[i]; s[i]=s[i-1]; s[i-1]=t; reorder(s) }
  const moveDown = (i: number) => { if (i===sections.length-1) return; const s=[...sections]; const t=s[i]; s[i]=s[i+1]; s[i+1]=t; reorder(s) }
  const onDragStart = (i: number) => setDrag(i)
  const onDragOver = (e: any, i: number) => { e.preventDefault(); setDragOver(i) }
  const onDrop = (i: number) => { if (drag===null||drag===i) { setDrag(null); setDragOver(null); return }; const s=[...sections]; const [m]=s.splice(drag,1); s.splice(i,0,m); reorder(s); setDrag(null); setDragOver(null) }

  if (loading) return <div style={{ minHeight:"100vh",background:"#EEEEEE",display:"flex",alignItems:"center",justifyContent:"center" }}><p style={{ color:"#555",fontFamily:"Cairo,system-ui,sans-serif" }}>جاري التحميل...</p></div>

  const slides = (localConfig.slides) || (configSec ? getConfig(configSec).slides : []) || [{ image_url:"",title:"",subtitle:"",cta_text:"",cta_url:"" }]

  return (
    <div style={{ minHeight:"100vh",background:"#EEEEEE",color:"#111",fontFamily:"Cairo,system-ui,sans-serif",direction:"rtl" }}>
      {/* HEADER */}
      <div style={{ padding:"14px 16px",borderBottom:"1px solid #e5e5e5",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:"#fff",zIndex:10 }}>
        <Link href="/admin/pages" style={{ color:"#555",fontSize:"13px",textDecoration:"none" }}>← رجوع</Link>
        <div style={{ textAlign:"center" }}>
          <p style={{ fontWeight:"800",fontSize:"15px",margin:0 }}>{page?.title||"صفحة"}</p>
          <p style={{ color:"#555",fontSize:"11px",margin:0 }}>/{page?.slug}</p>
        </div>
        <div style={{ display:"flex",gap:"6px",alignItems:"center" }}>
          {hasChanges && <button onClick={saveOrder} style={{ background:"#4ade80",color:"#000",border:"none",padding:"7px 14px",borderRadius:"9px",fontWeight:"800",fontSize:"12px",cursor:"pointer",fontFamily:"Cairo,system-ui,sans-serif" }}>{saving?"جاري...":"حفظ الترتيب"}</button>}
          <a href={"http://localhost:3001/page/"+page?.slug} target="_blank" style={{ fontSize:"12px",background:"#fff",color:"#111",padding:"7px 12px",borderRadius:"9px",fontWeight:"700",textDecoration:"none",border:"1px solid #e5e5e5" }}>معاينة</a>
          <button onClick={() => setShowAdd(true)} style={{ background:"#fff",color:"#000",border:"none",padding:"7px 14px",borderRadius:"9px",fontWeight:"800",fontSize:"12px",cursor:"pointer",fontFamily:"Cairo,system-ui,sans-serif" }}>+ إضافة</button>
        </div>
      </div>

      <div style={{ display:"flex",height:"calc(100vh - 57px)" }}>

        {/* SECTIONS LIST */}
        <div style={{ flex:1,overflowY:"auto",padding:"12px" }}>
          <div style={{ background:"#f8f8f8",border:"1px solid #e5e5e5",borderRadius:"12px",padding:"12px 16px",marginBottom:"12px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <div><p style={{ fontSize:"12px",color:"#555",margin:0 }}>رابط الصفحة</p><p style={{ fontSize:"13px",fontWeight:"700",margin:"3px 0 0",color:"#4ade80" }}>klafstore.com/page/{page?.slug}</p></div>
            <span style={{ background:page?.is_active?"#001a0d":"#1a1a1a",color:page?.is_active?"#4ade80":"#555",padding:"4px 12px",borderRadius:"20px",fontSize:"11px",fontWeight:"700" }}>{page?.is_active?"نشطة":"معطلة"}</span>
          </div>

          {sections.length===0 ? (
            <div style={{ textAlign:"center",padding:"60px 20px",border:"2px dashed #1a1a1a",borderRadius:"16px" }}>
              <p style={{ color:"#333",fontSize:"14px",marginBottom:"12px" }}>لا يوجد أقسام بعد</p>
              <button onClick={() => setShowAdd(true)} style={{ background:"#fff",color:"#000",border:"none",padding:"10px 20px",borderRadius:"10px",fontWeight:"800",fontSize:"13px",cursor:"pointer",fontFamily:"Cairo,system-ui,sans-serif" }}>+ أضف قسم</button>
            </div>
          ) : (
            <div style={{ display:"flex",flexDirection:"column",gap:"8px" }}>
              {sections.map((sec,i) => (
                <div key={sec.id} draggable onDragStart={()=>onDragStart(i)} onDragOver={e=>onDragOver(e,i)} onDrop={()=>onDrop(i)} onDragEnd={()=>{setDrag(null);setDragOver(null)}}
                  onClick={()=>{setConfigSec(sec);setLocalConfig(getConfig(sec))}}
                  style={{ background:configSec?.id===sec.id?"#111":dragOver===i?"#111":"#0d0d0d",border:configSec?.id===sec.id?"1px solid #FF835E":dragOver===i?"1px solid #FF835E":"1px solid #1a1a1a",borderRadius:"12px",padding:"12px 14px",opacity:drag===i?0.5:1,transition:"all .15s",cursor:"pointer" }}>
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:"10px",flex:1 }}>
                      <svg width="14" height="14" fill="none" stroke="#444" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/></svg>
                      <div style={{ width:"32px",height:"32px",background:"#f0f0f0",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                        <div style={{ width:"18px",height:"18px",color:"#FF835E" }} dangerouslySetInnerHTML={{ __html: ICONS[sec.type]||"" }} />
                      </div>
                      <div style={{ flex:1 }}>
                        {editSec===sec.id ? (
                          <input defaultValue={sec.title} onBlur={e=>saveTitle(sec,e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveTitle(sec,(e.target as any).value)} autoFocus onClick={e=>e.stopPropagation()}
                            style={{ background:"#f0f0f0",border:"1px solid #ddd",borderRadius:"8px",padding:"5px 10px",color:"#111",fontSize:"13px",fontWeight:"700",outline:"none",width:"100%",fontFamily:"Cairo,system-ui,sans-serif" }} />
                        ) : (
                          <p onDoubleClick={e=>{e.stopPropagation();setEditSec(sec.id)}} style={{ fontWeight:"700",fontSize:"13px",margin:0 }}>{sec.title||TYPE_LABELS[sec.type]||sec.type}</p>
                        )}
                        <p style={{ color:"#555",fontSize:"11px",margin:"3px 0 0" }}>{TYPE_LABELS[sec.type]||sec.type}</p>
                      </div>
                    </div>
                    <div style={{ display:"flex",alignItems:"center",gap:"5px" }} onClick={e=>e.stopPropagation()}>
                      <button onClick={()=>moveUp(i)} disabled={i===0} style={{ background:"transparent",border:"none",color:i===0?"#333":"#555",cursor:i===0?"not-allowed":"pointer",padding:"4px 6px",fontSize:"14px" }}>↑</button>
                      <button onClick={()=>moveDown(i)} disabled={i===sections.length-1} style={{ background:"transparent",border:"none",color:i===sections.length-1?"#333":"#555",cursor:i===sections.length-1?"not-allowed":"pointer",padding:"4px 6px",fontSize:"14px" }}>↓</button>
                      <button onClick={()=>toggleSection(sec)} style={{ background:sec.is_active?"#001a0d":"#1a1a1a",border:"none",color:sec.is_active?"#4ade80":"#555",padding:"4px 9px",borderRadius:"7px",fontSize:"10px",fontWeight:"700",cursor:"pointer",fontFamily:"Cairo,system-ui,sans-serif" }}>{sec.is_active?"نشط":"معطل"}</button>
                      <button onClick={()=>deleteSection(sec.id)} style={{ background:"#1a0000",border:"none",color:"#f87171",padding:"4px 9px",borderRadius:"7px",fontSize:"10px",fontWeight:"700",cursor:"pointer",fontFamily:"Cairo,system-ui,sans-serif" }}>حذف</button>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={()=>setShowAdd(true)} style={{ width:"100%",padding:"12px",marginTop:"4px",background:"#f5f5f5",border:"1px dashed #222",color:"#555",borderRadius:"12px",fontSize:"13px",fontWeight:"700",cursor:"pointer",fontFamily:"Cairo,system-ui,sans-serif" }}>+ إضافة قسم</button>
            </div>
          )}
        </div>

        {/* CONFIG PANEL */}
        {configSec && (
          <div style={{ width:"300px",borderRight:"1px solid #e5e5e5",overflowY:"auto",padding:"16px",background:"#050505",flexShrink:0 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px" }}>
              <span style={{ fontWeight:"800",fontSize:"14px" }}>إعدادات القسم</span>
              <button onClick={()=>setConfigSec(null)} style={{ background:"#f0f0f0",border:"none",color:"#111",width:"28px",height:"28px",borderRadius:"50%",cursor:"pointer",fontSize:"14px" }}>×</button>
            </div>

            {/* TITLE */}
            <div style={{ marginBottom:"14px" }}>
              <label style={{ fontSize:"11px",color:"#555",fontWeight:"700",display:"block",marginBottom:"6px" }}>عنوان القسم</label>
              <input defaultValue={configSec.title} key={configSec.id+"t"} onBlur={e=>saveTitle(configSec,e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveTitle(configSec,(e.target as any).value)}
                style={{ width:"100%",padding:"10px 12px",background:"#fff",border:"1px solid #e5e5e5",borderRadius:"10px",color:"#111",fontSize:"13px",outline:"none",fontFamily:"Cairo,system-ui,sans-serif",boxSizing:"border-box" as const }} />
            </div>

            {/* HERO + MINI BANNERS */}
            {(configSec.type==="hero_slider"||configSec.type==="mini_banners") && (() => {
              const cfg = getConfig(configSec)
              const sls: any[] = localConfig.slides || cfg.slides || [{ image_url:"",title:"",subtitle:"",cta_text:"",cta_url:"" }]
              return (
                <div style={{ marginBottom:"14px" }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px" }}>
                    <label style={{ fontSize:"11px",color:"#555",fontWeight:"700" }}>الشرائح ({sls.length})</label>
                    <button onClick={()=>setLocalConfig({...localConfig,slides:[...sls,{image_url:"",title:"",subtitle:"",cta_text:"",cta_url:""}]})}
                      style={{ background:"#f0f0f0",border:"1px solid #ddd",color:"#111",padding:"4px 10px",borderRadius:"7px",fontSize:"11px",fontWeight:"700",cursor:"pointer",fontFamily:"Cairo,system-ui,sans-serif" }}>+ شريحة</button>
                  </div>
                  {sls.map((slide: any, si: number) => (
                    <div key={si} style={{ background:"#fff",border:"1px solid #e5e5e5",borderRadius:"10px",padding:"12px",marginBottom:"8px" }}>
                      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px" }}>
                        <span style={{ fontSize:"11px",fontWeight:"700",color:"#555" }}>شريحة {si+1}</span>
                        {sls.length>1 && <button onClick={()=>{const ns=[...sls];ns.splice(si,1);setLocalConfig({...localConfig,slides:ns})}} style={{ background:"#1a0000",border:"none",color:"#f87171",padding:"3px 8px",borderRadius:"6px",fontSize:"10px",cursor:"pointer",fontFamily:"Cairo,system-ui,sans-serif" }}>حذف</button>}
                      </div>
                      {slide.image_url && <img src={slide.image_url} style={{ width:"100%",height:"70px",objectFit:"cover",borderRadius:"8px",marginBottom:"6px" }} />}
                      <label style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",width:"100%",padding:"8px",background:"#f0f0f0",border:"1px dashed #333",borderRadius:"8px",cursor:"pointer",fontSize:"11px",color:"#888",fontFamily:"Cairo,system-ui,sans-serif",marginBottom:"6px" }}>
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        {slide.image_url?"تغيير الصورة":"رفع صورة"}
                        <input type="file" accept="image/*" style={{ display:"none" }} onChange={async e=>{const file=e.target.files?.[0];if(!file)return;const url=await uploadImage(file);const ns=[...sls];ns[si]={...ns[si],image_url:url};setLocalConfig({...localConfig,slides:ns})}} />
                      </label>
                      <input placeholder="العنوان" value={slide.title||""} onChange={e=>{const ns=[...sls];ns[si]={...ns[si],title:e.target.value};setLocalConfig({...localConfig,slides:ns})}}
                        style={{ width:"100%",padding:"7px 10px",background:"#f0f0f0",border:"1px solid #e5e5e5",borderRadius:"8px",color:"#111",fontSize:"12px",outline:"none",fontFamily:"Cairo,system-ui,sans-serif",marginBottom:"6px",boxSizing:"border-box" as const }} />
                      <input placeholder="النص الثانوي" value={slide.subtitle||""} onChange={e=>{const ns=[...sls];ns[si]={...ns[si],subtitle:e.target.value};setLocalConfig({...localConfig,slides:ns})}}
                        style={{ width:"100%",padding:"7px 10px",background:"#f0f0f0",border:"1px solid #e5e5e5",borderRadius:"8px",color:"#111",fontSize:"12px",outline:"none",fontFamily:"Cairo,system-ui,sans-serif",marginBottom:"6px",boxSizing:"border-box" as const }} />
                      <input placeholder="نص الزر" value={slide.cta_text||""} onChange={e=>{const ns=[...sls];ns[si]={...ns[si],cta_text:e.target.value};setLocalConfig({...localConfig,slides:ns})}}
                        style={{ width:"100%",padding:"7px 10px",background:"#f0f0f0",border:"1px solid #e5e5e5",borderRadius:"8px",color:"#111",fontSize:"12px",outline:"none",fontFamily:"Cairo,system-ui,sans-serif",marginBottom:"6px",boxSizing:"border-box" as const }} />
                      <input placeholder="رابط الزر (/products)" value={slide.cta_url||""} onChange={e=>{const ns=[...sls];ns[si]={...ns[si],cta_url:e.target.value};setLocalConfig({...localConfig,slides:ns})}}
                        style={{ width:"100%",padding:"7px 10px",background:"#f0f0f0",border:"1px solid #e5e5e5",borderRadius:"8px",color:"#111",fontSize:"12px",outline:"none",fontFamily:"Cairo,system-ui,sans-serif",boxSizing:"border-box" as const }} />
                    </div>
                  ))}
                </div>
              )
            })()}

            {/* CATEGORY ROW */}
            {configSec.type==="category_row" && (
              <div style={{ marginBottom:"14px" }}>
                <label style={{ fontSize:"11px",color:"#555",fontWeight:"700",display:"block",marginBottom:"6px" }}>اختر القسم</label>
                <select key={configSec.id+"c"} defaultValue={getConfig(configSec).category_id||""} onChange={e=>saveConfig(configSec,{...getConfig(configSec),category_id:Number(e.target.value)})}
                  style={{ width:"100%",padding:"10px 12px",background:"#fff",border:"1px solid #e5e5e5",borderRadius:"10px",color:"#111",fontSize:"13px",outline:"none",fontFamily:"Cairo,system-ui,sans-serif" }}>
                  <option value="">-- اختر قسم --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            )}

            {/* CATEGORIES */}
            {configSec.type==="categories" && (
              <div style={{ marginBottom:"14px" }}>
                <label style={{ fontSize:"11px",color:"#555",fontWeight:"700",display:"block",marginBottom:"6px" }}>اختر الأقسام</label>
                <div style={{ display:"flex",flexDirection:"column",gap:"6px",maxHeight:"200px",overflowY:"auto" }}>
                  {categories.filter(c=>!c.parent_id).map(c => {
                    const cfg=getConfig(configSec); const sel:number[]=cfg.category_ids||[]; const on=sel.includes(c.id)
                    return <div key={c.id} onClick={()=>{const n=on?sel.filter((x:number)=>x!==c.id):[...sel,c.id];saveConfig(configSec,{...cfg,category_ids:n})}} style={{ padding:"8px 12px",background:on?"#1a1000":"#111",border:on?"1px solid #FF835E":"1px solid #1a1a1a",borderRadius:"8px",cursor:"pointer",fontSize:"12px",fontWeight:"600",color:on?"#FF835E":"#888",display:"flex",justifyContent:"space-between" }}>{c.name}{on&&<span>✓</span>}</div>
                  })}
                </div>
              </div>
            )}

            {/* BRANDS */}
            {configSec.type==="brands" && (
              <div style={{ marginBottom:"14px" }}>
                <label style={{ fontSize:"11px",color:"#555",fontWeight:"700",display:"block",marginBottom:"6px" }}>اختر البراندات</label>
                <div style={{ display:"flex",flexDirection:"column",gap:"6px",maxHeight:"200px",overflowY:"auto" }}>
                  {brands.map(b => {
                    const cfg=getConfig(configSec); const sel:string[]=cfg.brand_usernames||[]; const on=sel.includes(b.username)
                    return <div key={b.username} onClick={()=>{const n=on?sel.filter((x:string)=>x!==b.username):[...sel,b.username];saveConfig(configSec,{...cfg,brand_usernames:n})}} style={{ padding:"8px 12px",background:on?"#1a1000":"#111",border:on?"1px solid #FF835E":"1px solid #1a1a1a",borderRadius:"8px",cursor:"pointer",fontSize:"12px",fontWeight:"600",color:on?"#FF835E":"#888",display:"flex",justifyContent:"space-between",alignItems:"center" }}><span>{b.name}</span>{on&&<span style={{ color:"#FF835E" }}>✓</span>}</div>
                  })}
                </div>
              </div>
            )}

            {/* SIZE CONFIG - للصفوف */}
            {(configSec.type==="products_new"||configSec.type==="products_best"||configSec.type==="flash_deals"||configSec.type==="category_row") && (
              <div style={{ marginBottom:"14px" }}>
                <label style={{ fontSize:"11px",color:"#555",fontWeight:"700",display:"block",marginBottom:"8px" }}>حجم البطاقة</label>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"6px" }}>
                  {(["sm","md","lg"] as const).map(s => {
                    const cfg = getConfig(configSec)
                    const cur = localConfig.size || cfg.size || "md"
                    const labels = { sm:"صغير", md:"متوسط", lg:"كبير" }
                    return <button key={s} onClick={()=>{setLocalConfig({...localConfig,size:s});saveConfig(configSec,{...cfg,size:s})}} style={{ padding:"8px 4px",background:cur===s?"#FF835E":"#111",color:cur===s?"#fff":"#888",border:cur===s?"1px solid #FF835E":"1px solid #1a1a1a",borderRadius:"8px",cursor:"pointer",fontSize:"11px",fontWeight:"700",fontFamily:"Cairo,system-ui,sans-serif" }}>{labels[s]}</button>
                  })}
                </div>
              </div>
            )}

            {/* PRODUCTS CONFIG */}
            {(configSec.type==="products_new"||configSec.type==="products_best"||configSec.type==="flash_deals"||configSec.type==="category_row") && (() => {
              const cfg = getConfig(configSec)
              const toggle = (key: string) => saveConfig(configSec, {...cfg, [key]: !cfg[key]})
              const toggles = [
                { key:"showBrand", label:"البراند", default:true },
                { key:"showCategory", label:"القسم والتصنيف", default:true },
                { key:"showShare", label:"زر المشاركة", default:true },
                { key:"showTax", label:"شامل الضريبة", default:true },
                { key:"showOldPrice", label:"السعر القديم", default:true },
                { key:"showDiscount", label:"نسبة الخصم", default:true },
                { key:"showTags", label:"التاقات", default:true },
              ]
              return (
                <div style={{ marginBottom:"14px" }}>
                  <label style={{ fontSize:"11px",color:"#555",fontWeight:"700",display:"block",marginBottom:"8px" }}>نوع التاق</label>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5px",marginBottom:"12px" }}>
                    {(["new","best","limited","none"] as const).map(t => {
                      const labels = { new:"وصل حديثاً", best:"الأكثر مبيعاً", limited:"كمية محدودة", none:"بدون" }
                      const cur = cfg.tagType || "new"
                      return <button key={t} onClick={()=>saveConfig(configSec,{...cfg,tagType:t})} style={{ padding:"7px",background:cur===t?"#FF835E":"#111",color:cur===t?"#fff":"#888",border:cur===t?"1px solid #FF835E":"1px solid #1a1a1a",borderRadius:"8px",cursor:"pointer",fontSize:"10px",fontWeight:"700",fontFamily:"Cairo,system-ui,sans-serif" }}>{labels[t]}</button>
                    })}
                  </div>
                  <label style={{ fontSize:"11px",color:"#555",fontWeight:"700",display:"block",marginBottom:"8px" }}>عناصر البطاقة</label>
                  <div style={{ display:"flex",flexDirection:"column",gap:"6px" }}>
                    {toggles.map(t => {
                      const val = cfg[t.key] !== undefined ? cfg[t.key] : t.default
                      return (
                        <div key={t.key} onClick={()=>toggle(t.key)} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 10px",background:"#111",borderRadius:"8px",cursor:"pointer",border:"1px solid #1a1a1a" }}>
                          <span style={{ fontSize:"12px",color:"#ccc" }}>{t.label}</span>
                          <div style={{ width:"36px",height:"20px",borderRadius:"10px",background:val?"#FF835E":"#333",position:"relative",transition:"background .2s" }}>
                            <div style={{ width:"16px",height:"16px",borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:val?18:2,transition:"left .2s" }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })()}

            {/* PRODUCTS LIMIT */}
            {(configSec.type==="products_new"||configSec.type==="products_best"||configSec.type==="flash_deals") && (
              <div style={{ marginBottom:"14px" }}>
                <label style={{ fontSize:"11px",color:"#555",fontWeight:"700",display:"block",marginBottom:"6px" }}>عدد المنتجات</label>
                <input type="number" key={configSec.id+"l"} defaultValue={getConfig(configSec).limit||12} min={4} max={24}
                  onBlur={e=>saveConfig(configSec,{...getConfig(configSec),limit:Number(e.target.value)})}
                  style={{ width:"100%",padding:"10px 12px",background:"#fff",border:"1px solid #e5e5e5",borderRadius:"10px",color:"#111",fontSize:"13px",outline:"none",fontFamily:"Cairo,system-ui,sans-serif" }} />
              </div>
            )}

            {/* TEXT BLOCK */}
            {configSec.type==="text_block" && (
              <div style={{ marginBottom:"14px" }}>
                <label style={{ fontSize:"11px",color:"#555",fontWeight:"700",display:"block",marginBottom:"6px" }}>النص</label>
                <textarea key={configSec.id+"txt"} defaultValue={getConfig(configSec).text||""} rows={5}
                  onBlur={e=>saveConfig(configSec,{...getConfig(configSec),text:e.target.value})}
                  style={{ width:"100%",padding:"10px 12px",background:"#fff",border:"1px solid #e5e5e5",borderRadius:"10px",color:"#111",fontSize:"13px",outline:"none",fontFamily:"Cairo,system-ui,sans-serif",resize:"none" as const,boxSizing:"border-box" as const }} />
              </div>
            )}

            <button onClick={saveLocalConfig} style={{ width:"100%",padding:"12px",background:"#FF835E",color:"#111",border:"none",borderRadius:"10px",fontWeight:"800",fontSize:"13px",cursor:"pointer",fontFamily:"Cairo,system-ui,sans-serif",marginBottom:"10px" }}>حفظ التغييرات</button>
            <div style={{ padding:"10px 12px",background:"#f8f8f8",borderRadius:"10px",border:"1px solid #e5e5e5" }}>
              <p style={{ fontSize:"11px",color:"#555",margin:0 }}>اضغط حفظ بعد تعديل إعدادات القسم</p>
            </div>
          </div>
        )}
      </div>

      {/* ADD MODAL */}
      {showAdd && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center" }} onClick={()=>setShowAdd(false)}>
          <div style={{ background:"#fff",borderRadius:"20px 20px 0 0",padding:"20px",width:"100%",maxWidth:"600px",maxHeight:"80vh",overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px" }}>
              <span style={{ fontWeight:"800",fontSize:"15px" }}>إضافة قسم</span>
              <button onClick={()=>setShowAdd(false)} style={{ background:"#f0f0f0",border:"none",color:"#111",width:"30px",height:"30px",borderRadius:"50%",cursor:"pointer",fontSize:"16px" }}>×</button>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px" }}>
              {SECTION_TYPES.map(st => (
                <button key={st.type} onClick={()=>addSection(st.type)}
                  style={{ background:"#f0f0f0",border:"1px solid #e5e5e5",borderRadius:"12px",padding:"14px 12px",cursor:"pointer",textAlign:"right",color:"#111",fontFamily:"Cairo,system-ui,sans-serif",transition:"all .2s",display:"flex",flexDirection:"column",gap:"6px" }}
                  onMouseEnter={e=>(e.currentTarget.style.borderColor="#FF835E")}
                  onMouseLeave={e=>(e.currentTarget.style.borderColor="#222")}>
                  <div style={{ width:"28px",height:"28px",background:"#fff",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <div style={{ width:"18px",height:"18px",color:"#FF835E" }} dangerouslySetInnerHTML={{ __html: ICONS[st.type]||"" }} />
                  </div>
                  <div style={{ fontSize:"12px",fontWeight:"800" }}>{st.label}</div>
                  <div style={{ fontSize:"10px",color:"#555" }}>{st.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
