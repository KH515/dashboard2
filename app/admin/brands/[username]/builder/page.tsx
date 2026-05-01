"use client"
export const dynamic = "force-dynamic"

import React, { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { fetchWithAuth } from "../../../lib/auth"

type SectionType =
  | "hero" | "categories" | "products_top" | "products_new"
  | "products_featured" | "products_suggested" | "promo_strip"
  | "banner_dual" | "banner_wide" | "banner_triple" | "banner_sale" | "countdown"

interface Section { id: string; type: SectionType; config: Record<string,any>; is_active: boolean; sort_order: number }
interface Product  { id: number; name: string; price: number; image: string|null; stock: number }
interface Category { id: number; name: string }

const META: Record<SectionType,{ label:string; desc:string }> = {
  hero:               { label:"الهيرو",          desc:"صورة الغلاف + الشعار + الإحصائيات" },
  categories:         { label:"الأقسام",         desc:"دوائر الأقسام مع صور" },
  products_top:       { label:"الأكثر مبيعاً",   desc:"تلقائي أو يدوي" },
  products_new:       { label:"وصل حديثاً",      desc:"آخر المنتجات" },
  products_featured:  { label:"منتجات مختارة",   desc:"تختارها يدوياً" },
  products_suggested: { label:"قد يعجبك",        desc:"مقترحة تلقائياً" },
  promo_strip:        { label:"شريط الشحن",      desc:"نص ترويجي مع زر" },
  banner_dual:        { label:"بانرين جانبي",    desc:"بانران بصور" },
  banner_wide:        { label:"بانر عريض",       desc:"بانر كبير بصورة ونص" },
  banner_triple:      { label:"بانرات ثلاثية",   desc:"ثلاث بطاقات" },
  banner_sale:        { label:"بانر التخفيض",    desc:"بانر SALE" },
  countdown:          { label:"عد تنازلي",       desc:"مؤقت لعرض محدود" },
}

const F: React.CSSProperties = { fontFamily:"Cairo,system-ui,sans-serif" }
const inp: React.CSSProperties = { width:"100%", padding:"9px 12px", background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:"9px", color:"white", outline:"none", fontFamily:"Cairo,sans-serif", fontSize:"13px", textAlign:"right", boxSizing:"border-box" }
const lbl: React.CSSProperties = { fontSize:"11px", color:"#666", marginBottom:"5px", display:"block" }

function ImgField({ value, onChange, label }: { value:string; onChange:(v:string)=>void; label:string }) {
  const ref = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const upload = async (file: File) => {
    setLoading(true)
    try {
      const fd = new FormData(); fd.append("file", file)
      const res = await fetchWithAuth("/api/admin/upload", { method:"POST", headers:{}, body:fd })
      const d = await res.json(); if (d.url) onChange(d.url)
    } finally { setLoading(false) }
  }
  return (
    <div style={{ marginBottom:"12px" }}>
      <span style={lbl}>{label}</span>
      <input ref={ref} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>{ const f=e.target.files?.[0]; if(f) upload(f) }}/>
      <div onClick={()=>ref.current?.click()} style={{ width:"100%", borderRadius:"10px", border:"1px dashed #333", background:"#1a1a1a", cursor:"pointer", overflow:"hidden", minHeight:"52px", display:"flex", alignItems:"center", justifyContent:"center" }}>
        {value ? <img src={value} style={{ width:"100%", height:"110px", objectFit:"cover" }}/> : <span style={{ color:"#555", fontSize:"12px" }}>{loading?"جاري الرفع...":"+ رفع صورة"}</span>}
      </div>
      {value && <button type="button" onClick={()=>onChange("")} style={{ marginTop:"4px", background:"none", border:"none", color:"#f87171", fontSize:"11px", cursor:"pointer", ...F }}>× حذف</button>}
    </div>
  )
}

function ProductPicker({ selected, onChange, products }: { selected:number[]; onChange:(ids:number[])=>void; products:Product[] }) {
  const [q, setQ] = useState("")
  const filtered = products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || String(p.id).includes(q))
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"8px" }}>
        <span style={{ fontSize:"12px", fontWeight:700 }}>محدد ({selected.length})</span>
        {selected.length>0 && <button onClick={()=>onChange([])} style={{ background:"none", border:"none", color:"#f87171", fontSize:"11px", cursor:"pointer", ...F }}>إلغاء الكل</button>}
      </div>
      <input style={{ ...inp, marginBottom:"8px" }} placeholder="ابحث..." value={q} onChange={e=>setQ(e.target.value)}/>
      <div style={{ maxHeight:"220px", overflowY:"auto", display:"flex", flexDirection:"column", gap:"5px" }}>
        {filtered.slice(0,30).map(p => {
          const sel = selected.includes(p.id)
          return (
            <div key={p.id} onClick={()=>onChange(sel?selected.filter(id=>id!==p.id):[...selected,p.id])}
              style={{ display:"flex", alignItems:"center", gap:"10px", padding:"8px 10px", borderRadius:"10px", cursor:"pointer", background:sel?"rgba(255,255,255,0.06)":"#1a1a1a", border:`1px solid ${sel?"#444":"#2a2a2a"}` }}>
              <div style={{ width:34, height:34, borderRadius:8, overflow:"hidden", flexShrink:0, background:"#222" }}>
                {p.image ? <img src={p.image} style={{ width:"100%", height:"100%", objectFit:"cover" }}/> : <div style={{ width:"100%", height:"100%", background:"#333" }}/>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:"12px", fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</div>
                <div style={{ fontSize:"10px", color:"#555" }}>{p.price} ر.س</div>
              </div>
              <div style={{ width:20, height:20, borderRadius:6, background:sel?"#fff":"#2a2a2a", border:`1.5px solid ${sel?"#fff":"#444"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {sel && <svg width="10" height="10" fill="none" stroke="#000" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CatPicker({ selected, onChange, cats }: { selected:any[]; onChange:(v:any[])=>void; cats:Category[] }) {
  const imgRef = useRef<{[key:number]: HTMLInputElement|null}>({})
  const [uploading, setUploading] = useState<number|null>(null)

  const uploadImg = async (file: File, catId: number) => {
    setUploading(catId)
    try {
      const fd = new FormData(); fd.append("file", file)
      const res = await fetchWithAuth("/api/admin/upload", { method:"POST", headers:{}, body:fd })
      const d = await res.json()
      if (d.url) {
        const exists = selected.find(s=>s.id===catId)
        if (exists) onChange(selected.map(s=>s.id===catId?{...s,img:d.url}:s))
        else onChange([...selected,{ id:catId, name:cats.find(c=>c.id===catId)?.name, img:d.url }])
      }
    } finally { setUploading(null) }
  }

  const toggle = (cat: Category) => {
    const exists = selected.find(s=>s.id===cat.id)
    if (exists) onChange(selected.filter(s=>s.id!==cat.id))
    else onChange([...selected,{ id:cat.id, name:cat.name }])
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
      {cats.map(cat => {
        const sel = selected.find(s=>s.id===cat.id)
        return (
          <div key={cat.id} style={{ borderRadius:"12px", border:`1px solid ${sel?"#444":"#2a2a2a"}`, background:sel?"rgba(255,255,255,0.04)":"#1a1a1a", overflow:"hidden" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 12px", cursor:"pointer" }} onClick={()=>toggle(cat)}>
              <div style={{ width:38, height:38, borderRadius:"50%", overflow:"hidden", flexShrink:0, background:"#222", display:"flex", alignItems:"center", justifyContent:"center" }}>
                {sel?.img ? <img src={sel.img} style={{ width:"100%", height:"100%", objectFit:"cover" }}/> : <span style={{ color:"#555", fontSize:"18px" }}>+</span>}
              </div>
              <span style={{ flex:1, fontSize:"13px", fontWeight:600 }}>{cat.name}</span>
              <div style={{ width:20, height:20, borderRadius:6, background:sel?"#fff":"#2a2a2a", border:`1.5px solid ${sel?"#fff":"#444"}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {sel && <svg width="10" height="10" fill="none" stroke="#000" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
            </div>
            {sel && (
              <div style={{ padding:"0 12px 10px" }}>
                <input ref={el=>{ imgRef.current[cat.id]=el }} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>{ const f=e.target.files?.[0]; if(f) uploadImg(f,cat.id) }}/>
                <button onClick={()=>imgRef.current[cat.id]?.click()} style={{ width:"100%", padding:"6px", borderRadius:"8px", background:"#222", border:"1px dashed #333", color:"#666", fontSize:"11px", cursor:"pointer", ...F }}>
                  {uploading===cat.id?"جاري الرفع...":sel?.img?"تغيير الصورة":"+ رفع صورة"}
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function Editor({ section, onSave, onClose, products, cats }: { section:Section; onSave:(cfg:Record<string,any>)=>void; onClose:()=>void; products:Product[]; cats:Category[] }) {
  const [cfg, setCfg] = useState<Record<string,any>>(section.config||{})
  const set = (k: string, v: any) => setCfg(p=>({...p,[k]:v}))

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(6px)", zIndex:600, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#111", border:"1px solid #222", borderRadius:"20px", width:"100%", maxWidth:"520px", maxHeight:"88vh", overflowY:"auto", direction:"rtl", ...F }}>
        <div style={{ padding:"16px 20px", borderBottom:"1px solid #1a1a1a", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, background:"#111", zIndex:1 }}>
          <div>
            <div style={{ fontSize:"15px", fontWeight:800 }}>إعدادات — {META[section.type].label}</div>
            <div style={{ fontSize:"11px", color:"#555", marginTop:"2px" }}>{META[section.type].desc}</div>
          </div>
          <button onClick={onClose} style={{ width:30, height:30, borderRadius:9, background:"#1a1a1a", border:"1px solid #333", color:"#888", cursor:"pointer", fontSize:14 }}>✕</button>
        </div>

        <div style={{ padding:"20px" }}>
          {section.type==="hero" && (<>
            <ImgField label="صورة الغلاف" value={cfg.cover_image||""} onChange={v=>set("cover_image",v)}/>
            <ImgField label="الشعار" value={cfg.logo||""} onChange={v=>set("logo",v)}/>
            <div style={{ marginBottom:"12px" }}><span style={lbl}>اسم البراند</span><input style={inp} value={cfg.name||""} onChange={e=>set("name",e.target.value)}/></div>
            <div style={{ marginBottom:"12px" }}><span style={lbl}>الوصف</span><textarea style={{ ...inp, resize:"vertical" } as any} rows={2} value={cfg.description||""} onChange={e=>set("description",e.target.value)}/></div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
              <div><span style={lbl}>التقييم</span><input style={inp} value={cfg.rating||""} onChange={e=>set("rating",e.target.value)} placeholder="4.8"/></div>
              <div><span style={lbl}>المتابعون</span><input style={inp} type="number" value={cfg.followers||""} onChange={e=>set("followers",e.target.value)}/></div>
            </div>
          </>)}

          {section.type==="categories" && (
            <CatPicker selected={cfg.categories||[]} onChange={v=>set("categories",v)} cats={cats}/>
          )}

          {["products_top","products_new","products_featured"].includes(section.type) && (<>
            {section.type!=="products_featured" && (
              <div style={{ display:"flex", gap:"8px", marginBottom:"14px" }}>
                {["auto","manual"].map(m=>(
                  <button key={m} onClick={()=>set("mode",m)} style={{ flex:1, padding:"8px", borderRadius:"9px", border:`1px solid ${(cfg.mode||"auto")===m?"#fff":"#333"}`, background:(cfg.mode||"auto")===m?"rgba(255,255,255,0.08)":"#1a1a1a", color:(cfg.mode||"auto")===m?"#fff":"#555", fontSize:"12px", fontWeight:700, cursor:"pointer", ...F }}>
                    {m==="auto"?"تلقائي":"يدوي"}
                  </button>
                ))}
              </div>
            )}
            {(cfg.mode||"auto")==="auto" && section.type!=="products_featured" ? (
              <div><span style={lbl}>عدد المنتجات</span><input type="number" style={inp} value={cfg.limit||10} onChange={e=>set("limit",Number(e.target.value))} min={4} max={20}/></div>
            ) : (
              <ProductPicker selected={cfg.product_ids||[]} onChange={ids=>set("product_ids",ids)} products={products}/>
            )}
          </>)}

          {section.type==="products_suggested" && (
            <div><span style={lbl}>عدد المنتجات</span><input type="number" style={inp} value={cfg.limit||6} onChange={e=>set("limit",Number(e.target.value))} min={4} max={20}/></div>
          )}

          {section.type==="promo_strip" && (<>
            <div style={{ marginBottom:"12px" }}><span style={lbl}>النص الرئيسي</span><input style={inp} value={cfg.text||""} onChange={e=>set("text",e.target.value)} placeholder="شحن مجاني على جميع الطلبات"/></div>
            <div style={{ marginBottom:"12px" }}><span style={lbl}>النص الثانوي</span><input style={inp} value={cfg.sub||""} onChange={e=>set("sub",e.target.value)}/></div>
            <div><span style={lbl}>نص الزر</span><input style={inp} value={cfg.btn||"اطلب الآن"} onChange={e=>set("btn",e.target.value)}/></div>
          </>)}

          {section.type==="banner_dual" && (<>
            <div style={{ marginBottom:"14px", padding:"14px", background:"#1a1a1a", borderRadius:"12px", border:"1px solid #2a2a2a" }}>
              <p style={{ ...lbl, color:"#888", marginBottom:"10px" }}>البانر الأول</p>
              <ImgField label="الصورة" value={cfg.b1_img||""} onChange={v=>set("b1_img",v)}/>
              <input style={inp} value={cfg.b1_title||""} onChange={e=>set("b1_title",e.target.value)} placeholder="عنوان البانر"/>
            </div>
            <div style={{ padding:"14px", background:"#1a1a1a", borderRadius:"12px", border:"1px solid #2a2a2a" }}>
              <p style={{ ...lbl, color:"#888", marginBottom:"10px" }}>البانر الثاني</p>
              <ImgField label="الصورة" value={cfg.b2_img||""} onChange={v=>set("b2_img",v)}/>
              <input style={inp} value={cfg.b2_title||""} onChange={e=>set("b2_title",e.target.value)} placeholder="عنوان البانر"/>
            </div>
          </>)}

          {section.type==="banner_wide" && (<>
            <ImgField label="صورة البانر" value={cfg.image||""} onChange={v=>set("image",v)}/>
            <div style={{ marginBottom:"12px" }}><span style={lbl}>العنوان</span><input style={inp} value={cfg.title||""} onChange={e=>set("title",e.target.value)}/></div>
            <div style={{ marginBottom:"12px" }}><span style={lbl}>الوصف</span><input style={inp} value={cfg.desc||""} onChange={e=>set("desc",e.target.value)}/></div>
            <div><span style={lbl}>نص الزر</span><input style={inp} value={cfg.btn||"اكتشف الآن"} onChange={e=>set("btn",e.target.value)}/></div>
          </>)}

          {section.type==="banner_triple" && (<>
            {[1,2,3].map(n=>(
              <div key={n} style={{ marginBottom:"12px", padding:"12px", background:"#1a1a1a", borderRadius:"12px", border:"1px solid #2a2a2a" }}>
                <p style={{ ...lbl, color:"#888", marginBottom:"8px" }}>البطاقة {n}</p>
                <ImgField label="الصورة" value={cfg[`c${n}_img`]||""} onChange={v=>set(`c${n}_img`,v)}/>
                <input style={inp} value={cfg[`c${n}_title`]||""} onChange={e=>set(`c${n}_title`,e.target.value)} placeholder={["أكثر مبيعاً","وصل حديثاً","كولكشن الشتاء"][n-1]}/>
              </div>
            ))}
          </>)}

          {section.type==="banner_sale" && (<>
            <ImgField label="صورة الخلفية" value={cfg.image||""} onChange={v=>set("image",v)}/>
            <div style={{ marginBottom:"12px" }}><span style={lbl}>العنوان</span><input style={inp} value={cfg.title||""} onChange={e=>set("title",e.target.value)}/></div>
            <div style={{ marginBottom:"12px" }}><span style={lbl}>الوصف</span><input style={inp} value={cfg.desc||""} onChange={e=>set("desc",e.target.value)}/></div>
            <div><span style={lbl}>نص الزر</span><input style={inp} value={cfg.btn||"تسوق الآن"} onChange={e=>set("btn",e.target.value)}/></div>
          </>)}

          {section.type==="countdown" && (<>
            <div style={{ marginBottom:"12px" }}><span style={lbl}>عنوان العرض</span><input style={inp} value={cfg.title||""} onChange={e=>set("title",e.target.value)} placeholder="عرض محدود الوقت"/></div>
            <div style={{ marginBottom:"12px" }}><span style={lbl}>وصف العرض</span><input style={inp} value={cfg.sub||""} onChange={e=>set("sub",e.target.value)}/></div>
            <div><span style={lbl}>تاريخ الانتهاء</span><input style={{ ...inp, colorScheme:"dark" } as any} type="datetime-local" value={cfg.end||""} onChange={e=>set("end",e.target.value)}/></div>
          </>)}
        </div>

        <div style={{ padding:"14px 20px", borderTop:"1px solid #1a1a1a", display:"flex", gap:"8px", justifyContent:"flex-end", position:"sticky", bottom:0, background:"#111" }}>
          <button onClick={onClose} style={{ background:"#1a1a1a", border:"1px solid #333", color:"#888", padding:"9px 18px", borderRadius:"10px", fontSize:"13px", cursor:"pointer", ...F }}>إلغاء</button>
          <button onClick={()=>onSave(cfg)} style={{ background:"#fff", color:"#000", padding:"9px 20px", borderRadius:"10px", fontSize:"13px", fontWeight:800, border:"none", cursor:"pointer", ...F }}>حفظ</button>
        </div>
      </div>
    </div>
  )
}

export default function BrandBuilderPage() {
  const { username } = useParams()
  const router = useRouter()
  const [sections, setSections] = useState<Section[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [cats, setCats]         = useState<Category[]>([])
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [msg, setMsg]           = useState("")
  const [dragIdx, setDragIdx]   = useState<number|null>(null)
  const [editSec, setEditSec]   = useState<Section|null>(null)
  const [showAdd, setShowAdd]   = useState(false)

  const showMsg = (t: string) => { setMsg(t); setTimeout(()=>setMsg(""),3000) }

  const defaultSections = (): Section[] => [
    { id:"hero",              type:"hero",              config:{}, is_active:true,  sort_order:1 },
    { id:"products_top",      type:"products_top",      config:{}, is_active:true,  sort_order:2 },
    { id:"promo_strip",       type:"promo_strip",       config:{}, is_active:false, sort_order:3 },
    { id:"banner_dual",       type:"banner_dual",       config:{}, is_active:false, sort_order:4 },
    { id:"products_new",      type:"products_new",      config:{}, is_active:true,  sort_order:5 },
    { id:"banner_wide",       type:"banner_wide",       config:{}, is_active:false, sort_order:6 },
    { id:"countdown",         type:"countdown",         config:{}, is_active:false, sort_order:7 },
    { id:"products_featured", type:"products_featured", config:{}, is_active:false, sort_order:8 },
    { id:"banner_sale",       type:"banner_sale",       config:{}, is_active:false, sort_order:9 },
    { id:"products_suggested",type:"products_suggested",config:{}, is_active:true,  sort_order:10 },
  ]

  useEffect(()=>{
    const load = async () => {
      try {
        const [bRes, pRes, cRes] = await Promise.all([
          fetchWithAuth(`https://api.klafstore.com/api/brands/${username}/builder`),
          fetch("/api/admin/products-list"),
          fetch("https://api.klafstore.com/api/categories"),
        ])
        const [bData, pData, cData] = await Promise.all([bRes.json(), pRes.json(), cRes.json()])
        setSections(bData.sections?.length ? bData.sections : defaultSections())
        setProducts(pData.products||[])
        setCats((cData.categories||[]).filter((c:any)=>!c.parent_id))
      } catch { setSections(defaultSections()) }
      setLoading(false)
    }
    load()
  },[username])

  const save = async () => {
    setSaving(true)
    try {
      await fetchWithAuth(`https://api.klafstore.com/api/brands/${username}/builder`, {
        method:"PUT",
        body: JSON.stringify({ sections: sections.map((s,i)=>({...s, sort_order:i+1})) }),
      })
      showMsg("تم الحفظ بنجاح")
    } catch { showMsg("حصل خطأ") }
    setSaving(false)
  }

  const toggle    = (id:string) => setSections(p=>p.map(s=>s.id===id?{...s,is_active:!s.is_active}:s))
  const remove    = (id:string) => { if(!confirm("حذف؟")) return; setSections(p=>p.filter(s=>s.id!==id)) }
  const saveEdit  = (cfg:Record<string,any>) => { if(!editSec) return; setSections(p=>p.map(s=>s.id===editSec.id?{...s,config:cfg}:s)); setEditSec(null); showMsg("تم الحفظ") }
  const moveUp    = (i:number) => { const a=[...sections]; if(i===0)return; [a[i-1],a[i]]=[a[i],a[i-1]]; setSections(a) }
  const moveDown  = (i:number) => { const a=[...sections]; if(i===sections.length-1)return; [a[i],a[i+1]]=[a[i+1],a[i]]; setSections(a) }
  const addSec    = (type:SectionType) => { setSections(p=>[...p,{ id:`${type}_${Date.now()}`, type, config:{}, is_active:true, sort_order:p.length+1 }]); setShowAdd(false); showMsg("تم إضافة القسم") }

  const onDragStart = (i:number) => setDragIdx(i)
  const onDragEnd   = () => setDragIdx(null)
  const onDragOver  = (e:React.DragEvent, i:number) => {
    e.preventDefault()
    if (dragIdx===null||dragIdx===i) return
    const a=[...sections]; const d=a.splice(dragIdx,1)[0]; a.splice(i,0,d)
    setSections(a); setDragIdx(i)
  }

  return (
    <div style={{ minHeight:"100vh", background:"#000", color:"white", direction:"rtl", ...F }}>
      <div style={{ padding:"20px", maxWidth:"680px", margin:"0 auto" }}>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"20px" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <button onClick={()=>router.back()} style={{ background:"none", border:"none", color:"#555", cursor:"pointer", fontSize:"20px" }}>←</button>
              <h2 style={{ fontSize:"20px", fontWeight:800, margin:0 }}>Brand Builder</h2>
              <span style={{ fontSize:"12px", color:"#555", background:"#111", border:"1px solid #222", padding:"2px 10px", borderRadius:"20px" }}>@{username}</span>
            </div>
            <p style={{ fontSize:"11px", color:"#444", marginTop:"4px" }}>اسحب لتغيير الترتيب — اضغط الإعدادات لتعديل المحتوى</p>
          </div>
          <div style={{ display:"flex", gap:"8px" }}>
            <button onClick={()=>setShowAdd(true)} style={{ background:"#1a1a1a", border:"1px solid #333", color:"#fff", padding:"8px 16px", borderRadius:"10px", fontSize:"13px", fontWeight:700, cursor:"pointer", ...F }}>+ قسم</button>
            <button onClick={save} disabled={saving} style={{ background:"#fff", color:"#000", padding:"8px 18px", borderRadius:"10px", fontSize:"13px", fontWeight:800, border:"none", cursor:saving?"not-allowed":"pointer", opacity:saving?0.6:1, ...F }}>{saving?"حفظ...":"حفظ"}</button>
          </div>
        </div>

        {msg && <div style={{ background:"rgba(34,197,94,.08)", border:"1px solid rgba(34,197,94,.2)", color:"#4ade80", padding:"10px 14px", borderRadius:"10px", fontSize:"13px", marginBottom:"14px" }}>{msg}</div>}

        <a href={`https://klafstore.com/brand/${username}`} target="_blank" rel="noopener noreferrer"
          style={{ display:"flex", alignItems:"center", gap:"8px", padding:"10px 14px", borderRadius:"12px", background:"#0a0a0a", border:"1px solid #1a1a1a", color:"#555", fontSize:"12px", textDecoration:"none", marginBottom:"16px" }}>
          ↗ معاينة — klafstore.com/brand/{username}
        </a>

        {loading ? <p style={{ color:"#444", textAlign:"center", padding:"60px" }}>جاري التحميل...</p> : (
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {sections.map((sec, idx) => (
              <div key={sec.id} draggable onDragStart={()=>onDragStart(idx)} onDragOver={e=>onDragOver(e,idx)} onDragEnd={onDragEnd}
                style={{ background:dragIdx===idx?"#1a1a1a":"#111", border:`1px solid ${dragIdx===idx?"#444":"#222"}`, borderRadius:"14px", padding:"13px 15px", display:"flex", alignItems:"center", gap:"12px", cursor:"grab", opacity:sec.is_active?1:0.45 }}>
                <div style={{ color:"#3a3a3a", flexShrink:0 }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:"13px", fontWeight:700 }}>{META[sec.type].label}</div>
                  <div style={{ fontSize:"10px", color:"#555", marginTop:"2px" }}>{META[sec.type].desc}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:"5px", flexShrink:0 }}>
                  <button onClick={()=>setEditSec(sec)} style={{ width:30, height:30, borderRadius:8, background:"#1a1a1a", border:"1px solid #2a2a2a", color:"#888", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button onClick={()=>toggle(sec.id)} style={{ padding:"5px 10px", borderRadius:"8px", fontSize:"11px", fontWeight:700, cursor:"pointer", border:`1px solid ${sec.is_active?"rgba(34,197,94,.25)":"rgba(239,68,68,.2)"}`, background:sec.is_active?"rgba(34,197,94,.08)":"rgba(239,68,68,.07)", color:sec.is_active?"#4ade80":"#f87171", ...F }}>
                    {sec.is_active?"مفعّل":"معطّل"}
                  </button>
                  <button onClick={()=>moveUp(idx)} disabled={idx===0} style={{ width:30, height:30, borderRadius:8, background:"#1a1a1a", border:"1px solid #2a2a2a", color:idx===0?"#2a2a2a":"#888", cursor:idx===0?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>
                  </button>
                  <button onClick={()=>moveDown(idx)} disabled={idx===sections.length-1} style={{ width:30, height:30, borderRadius:8, background:"#1a1a1a", border:"1px solid #2a2a2a", color:idx===sections.length-1?"#2a2a2a":"#888", cursor:idx===sections.length-1?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  <button onClick={()=>remove(sec.id)} style={{ width:30, height:30, borderRadius:8, background:"rgba(239,68,68,.07)", border:"1px solid rgba(239,68,68,.15)", color:"#f87171", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAdd && (
        <div onClick={()=>setShowAdd(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(6px)", zIndex:600, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"#111", border:"1px solid #222", borderRadius:"20px", width:"100%", maxWidth:"480px", maxHeight:"85vh", overflowY:"auto", direction:"rtl", ...F }}>
            <div style={{ padding:"16px 20px", borderBottom:"1px solid #1a1a1a", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontSize:"15px", fontWeight:800 }}>إضافة قسم</span>
              <button onClick={()=>setShowAdd(false)} style={{ width:30, height:30, borderRadius:9, background:"#1a1a1a", border:"1px solid #333", color:"#888", cursor:"pointer", fontSize:14 }}>✕</button>
            </div>
            <div style={{ padding:"16px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
              {(Object.entries(META) as [SectionType,any][]).map(([type,meta])=>(
                <div key={type} onClick={()=>addSec(type)}
                  style={{ padding:"13px", borderRadius:"12px", cursor:"pointer", background:"#1a1a1a", border:"1px solid #2a2a2a" }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="#555"}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="#2a2a2a"}}>
                  <div style={{ fontSize:"12px", fontWeight:700, marginBottom:"3px" }}>{meta.label}</div>
                  <div style={{ fontSize:"10px", color:"#555" }}>{meta.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {editSec && <Editor section={editSec} onSave={saveEdit} onClose={()=>setEditSec(null)} products={products} cats={cats}/>}
    </div>
  )
}