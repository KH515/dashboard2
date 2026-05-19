"use client"
import { useState, useEffect, useRef } from "react"

const PLACEMENTS = [
  { value:"profile_orders", label:"طلباتي" },
  { value:"profile_invoices", label:"فواتيري" },
  { value:"profile_wishlist", label:"المفضلة" },
  { value:"profile_loyalty", label:"نظام الولاء" },
  { value:"profile_edit", label:"تعديل الملف" },
  { value:"store_home", label:"الرئيسية" },
]

const POSITIONS = [
  { value:"top", label:"أعلى الصفحة" },
  { value:"bottom", label:"أسفل الصفحة" },
]

const emptyForm = { title:"", subtitle:"", cta_text:"تسوق الآن", cta_url:"/", bg_color:"#FF835E", placement:"profile_orders", position:"top", image_url:"", media_type:"image", is_active:1 }

export default function AdsClient({ token, initialAds }: { token: string, initialAds: any[] }) {
  const [ads, setAds] = useState<any[]>(initialAds || [])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({...emptyForm})
  const fileRef = useRef<HTMLInputElement>(null)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.klafstore.com"

  const fetchAds = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/ads-proxy")
      const data = await res.json()
      setAds(data.ads || [])
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { fetchAds() }, [])

  const save = async () => {
    setSaving(true)
    try {
      const url = editing ? `/api/ads-proxy/${editing.id}` : "/api/ads-proxy"
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ title:form.title, subtitle:form.subtitle, cta_text:form.cta_text, cta_url:form.cta_url, bg_color:form.bg_color, placement:form.placement, position:form.position, image_url:form.image_url, is_active:form.is_active })
      })
      const data = await res.json()
      if (res.ok || data.ad || data.message) {
        setMsg(editing ? "تم تحديث الإعلان ✅" : "تم إضافة الإعلان ✅")
        setShowForm(false); setEditing(null); setForm({...emptyForm})
        fetchAds()
        setTimeout(() => setMsg(""), 3000)
      } else setMsg("خطأ: " + (data.error || "حصل مشكلة"))
    } catch { setMsg("تعذر الاتصال") } finally { setSaving(false) }
  }

  const upload = async (file: File) => {
    setUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    fd.append("folder", "banners")
    try {
      const res = await fetch("/api/upload-proxy", { method:"POST", body:fd })
      const data = await res.json()
      if (data.url) setForm(f => ({...f, image_url:data.url}))
    } catch {} finally { setUploading(false) }
  }

  const toggleActive = async (ad: any) => {
    await fetch(`/api/ads-proxy/${ad.id}`, { method:"PUT", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ is_active: ad.is_active ? 0 : 1 }) })
    fetchAds()
  }

  const deleteAd = async (id: number) => {
    if (!confirm("حذف الإعلان؟")) return
    await fetch(`/api/ads-proxy/${id}`, { method:"DELETE" })
    fetchAds()
  }

  const startEdit = (ad: any) => {
    setEditing(ad)
    setForm({ title:ad.title||"", subtitle:ad.subtitle||"", cta_text:ad.cta_text||"", cta_url:ad.cta_url||"", bg_color:ad.bg_color||"#FF835E", placement:ad.placement||"profile_orders", position:ad.position||"top", image_url:ad.image_url||"", media_type:"image", is_active:ad.is_active })
    setShowForm(true)
    window.scrollTo(0,0)
  }

  const inp = { width:"100%", padding:"8px 12px", background:"#f5f5f7", border:"1px solid #e5e5e5", borderRadius:"8px", fontSize:"13px", outline:"none", fontFamily:"Cairo,system-ui,sans-serif", color:"#111", boxSizing:"border-box" as const }

  const IconImage = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
  const IconVideo = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
  const IconEdit = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
  const IconDelete = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
  const IconUpload = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>

  return (
    <div style={{ fontFamily:"Cairo,system-ui,sans-serif", direction:"rtl", padding:"24px", maxWidth:900, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h1 style={{ fontSize:"20px", fontWeight:"900", color:"#111", margin:0 }}>إدارة الإعلانات</h1>
        <button onClick={() => { setForm({...emptyForm}); setEditing(null); setShowForm(true) }} style={{ background:"#FF835E", color:"#fff", border:"none", borderRadius:"10px", padding:"9px 18px", fontSize:"13px", fontWeight:"700", cursor:"pointer", fontFamily:"Cairo,system-ui,sans-serif", display:"flex", alignItems:"center", gap:6 }}>
          <svg width="14" height="14" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          إضافة إعلان
        </button>
      </div>

      {msg && <div style={{ background: msg.includes("خطأ")||msg.includes("تعذر") ? "#fef2f2":"#f0fdf4", border:`1px solid ${msg.includes("خطأ")||msg.includes("تعذر") ? "#fecaca":"#bbf7d0"}`, borderRadius:"10px", padding:"10px 14px", marginBottom:16, color: msg.includes("خطأ")||msg.includes("تعذر") ? "#991b1b":"#166534", fontSize:"13px", fontWeight:"700" }}>{msg}</div>}

      {showForm && (
        <div style={{ background:"#fff", borderRadius:"14px", padding:"20px", marginBottom:20, border:"1px solid #e5e5e5" }}>
          <p style={{ fontSize:"14px", fontWeight:"900", color:"#111", margin:"0 0 16px" }}>{editing ? "تعديل إعلان" : "إعلان جديد"}</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
            <div>
              <label style={{ fontSize:"11px", fontWeight:"700", color:"#888", display:"block", marginBottom:4 }}>العنوان</label>
              <input style={inp} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="عنوان الإعلان" />
            </div>
            <div>
              <label style={{ fontSize:"11px", fontWeight:"700", color:"#888", display:"block", marginBottom:4 }}>النص الفرعي</label>
              <input style={inp} value={form.subtitle} onChange={e=>setForm({...form,subtitle:e.target.value})} placeholder="نص إضافي" />
            </div>
            <div>
              <label style={{ fontSize:"11px", fontWeight:"700", color:"#888", display:"block", marginBottom:4 }}>نص الزر</label>
              <input style={inp} value={form.cta_text} onChange={e=>setForm({...form,cta_text:e.target.value})} placeholder="تسوق الآن" />
            </div>
            <div>
              <label style={{ fontSize:"11px", fontWeight:"700", color:"#888", display:"block", marginBottom:4 }}>رابط الزر</label>
              <input style={inp} value={form.cta_url} onChange={e=>setForm({...form,cta_url:e.target.value})} placeholder="/products" dir="ltr" />
            </div>
            <div>
              <label style={{ fontSize:"11px", fontWeight:"700", color:"#888", display:"block", marginBottom:4 }}>الصفحة</label>
              <select style={inp} value={form.placement} onChange={e=>setForm({...form,placement:e.target.value})}>
                {PLACEMENTS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:"11px", fontWeight:"700", color:"#888", display:"block", marginBottom:4 }}>المكان</label>
              <select style={inp} value={form.position} onChange={e=>setForm({...form,position:e.target.value})}>
                {POSITIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:"11px", fontWeight:"700", color:"#888", display:"block", marginBottom:4 }}>لون الخلفية</label>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <input type="color" value={form.bg_color} onChange={e=>setForm({...form,bg_color:e.target.value})} style={{ width:40, height:34, borderRadius:8, border:"1px solid #e5e5e5", cursor:"pointer", padding:2 }} />
                <input style={{...inp, flex:1}} value={form.bg_color} onChange={e=>setForm({...form,bg_color:e.target.value})} dir="ltr" />
              </div>
            </div>
          </div>

          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:"11px", fontWeight:"700", color:"#888", display:"block", marginBottom:6 }}>الصورة أو الفيديو</label>
            <div style={{ display:"flex", gap:8, marginBottom:8 }}>
              {[{v:"image",l:"صورة",I:IconImage},{v:"video",l:"فيديو",I:IconVideo}].map(({v,l,I}) => (
                <button key={v} onClick={() => setForm({...form,media_type:v})} style={{ flex:1, padding:"8px", borderRadius:"8px", border: form.media_type===v ? "2px solid #FF835E":"1px solid #e5e5e5", background: form.media_type===v ? "#fff3f0":"#f5f5f7", color: form.media_type===v ? "#FF835E":"#888", fontWeight:"700", fontSize:"12px", cursor:"pointer", fontFamily:"Cairo,system-ui,sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                  <I />{l}
                </button>
              ))}
            </div>
            <div onClick={() => !form.image_url && fileRef.current?.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files?.[0];if(f)upload(f)}} style={{ border:"2px dashed #e5e5e5", borderRadius:"12px", overflow:"hidden", cursor:form.image_url?"default":"pointer", minHeight:120, display:"flex", alignItems:"center", justifyContent:"center", background:"#fafafa", position:"relative" as const }}>
              {form.image_url ? (
                <>
                  {form.media_type==="video" ? <video src={form.image_url} style={{ width:"100%", maxHeight:180, display:"block" }} controls /> : <img src={form.image_url} style={{ width:"100%", maxHeight:180, objectFit:"cover", display:"block" }} alt="" />}
                  <button onClick={e=>{e.stopPropagation();setForm({...form,image_url:""})}} style={{ position:"absolute" as const, top:8, left:8, background:"rgba(0,0,0,.6)", color:"#fff", border:"none", borderRadius:"50%", width:28, height:28, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
                  <button onClick={e=>{e.stopPropagation();fileRef.current?.click()}} style={{ position:"absolute" as const, top:8, right:8, background:"rgba(0,0,0,.6)", color:"#fff", border:"none", borderRadius:"8px", padding:"4px 10px", cursor:"pointer", fontSize:11, fontWeight:"700", fontFamily:"Cairo,system-ui,sans-serif", display:"flex", alignItems:"center", gap:4 }}><IconUpload /> تغيير</button>
                </>
              ) : (
                <div style={{ textAlign:"center" as const, padding:20 }}>
                  {uploading ? <div style={{ color:"#FF835E", fontSize:"13px", fontWeight:"700" }}>جاري الرفع...</div> : <>
                    <div style={{ color:"#ccc", marginBottom:8 }}><IconUpload /></div>
                    <p style={{ color:"#aaa", fontSize:"12px", margin:"0 0 8px" }}>اسحب الملف هنا أو</p>
                    <span style={{ background:"#FF835E", color:"#fff", padding:"6px 14px", borderRadius:"8px", fontSize:"12px", fontWeight:"700" }}>اختر ملف</span>
                  </>}
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept={form.media_type==="video"?"video/*":"image/*"} style={{ display:"none" }} onChange={e=>{const f=e.target.files?.[0];if(f)upload(f)}} />
            {(form.title||form.image_url) && (
              <div style={{ marginTop:10 }}>
                <label style={{ fontSize:"11px", fontWeight:"700", color:"#888", display:"block", marginBottom:6 }}>معاينة</label>
                <div style={{ borderRadius:"12px", overflow:"hidden", border:"1px solid #e5e5e5" }}>
                  {form.image_url ? (form.media_type==="video" ? <video src={form.image_url} style={{ width:"100%", maxHeight:100, display:"block" }} /> : <img src={form.image_url} style={{ width:"100%", maxHeight:100, objectFit:"cover", display:"block" }} alt="" />) : (
                    <div style={{ background:form.bg_color, padding:"14px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div>
                        <p style={{ color:"#fff", fontSize:"13px", fontWeight:"900", margin:"0 0 2px" }}>{form.title}</p>
                        {form.subtitle && <p style={{ color:"rgba(255,255,255,.8)", fontSize:"11px", margin:0 }}>{form.subtitle}</p>}
                      </div>
                      {form.cta_text && <span style={{ background:"rgba(255,255,255,.2)", borderRadius:"7px", padding:"4px 10px", fontSize:"12px", fontWeight:"700", color:"#fff" }}>{form.cta_text}</span>}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
            <button onClick={()=>{setShowForm(false);setEditing(null)}} style={{ background:"#f5f5f7", border:"1px solid #e5e5e5", borderRadius:"9px", padding:"9px 18px", fontSize:"13px", fontWeight:"600", color:"#555", cursor:"pointer", fontFamily:"Cairo,system-ui,sans-serif" }}>إلغاء</button>
            <button onClick={save} disabled={saving} style={{ background:"#FF835E", color:"#fff", border:"none", borderRadius:"9px", padding:"9px 18px", fontSize:"13px", fontWeight:"700", cursor:"pointer", fontFamily:"Cairo,system-ui,sans-serif", opacity:saving?0.6:1 }}>
              {saving ? "جاري الحفظ..." : "حفظ"}
            </button>
          </div>
        </div>
      )}

      {loading ? <div style={{ textAlign:"center" as const, padding:40, color:"#aaa" }}>جاري التحميل...</div>
      : ads.length === 0 ? <div style={{ background:"#fff", borderRadius:"14px", padding:"40px", border:"1px solid #e5e5e5", textAlign:"center" as const, color:"#aaa" }}>ما في إعلانات بعد</div>
      : <div style={{ display:"flex", flexDirection:"column" as const, gap:10 }}>
          {ads.map((ad:any) => (
            <div key={ad.id} style={{ background:"#fff", borderRadius:"14px", padding:"14px 16px", border:"1px solid #e5e5e5", display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:56, height:44, borderRadius:"8px", background:ad.bg_color||"#FF835E", flexShrink:0, overflow:"hidden" }}>
                {ad.image_url && <img src={ad.image_url} style={{ width:"100%", height:"100%", objectFit:"cover" }} alt="" />}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4, flexWrap:"wrap" as const }}>
                  <span style={{ fontSize:"13px", fontWeight:"800", color:"#111" }}>{ad.title||"بدون عنوان"}</span>
                  <span style={{ background:"#f5f5f7", borderRadius:"6px", padding:"2px 8px", fontSize:"10px", color:"#555" }}>{PLACEMENTS.find(p=>p.value===ad.placement)?.label}</span>
                  <span style={{ background:ad.position==="top"?"#dbeafe":"#fef3c7", borderRadius:"6px", padding:"2px 8px", fontSize:"10px", color:ad.position==="top"?"#1d4ed8":"#b45309" }}>{POSITIONS.find(p=>p.value===ad.position)?.label}</span>
                </div>
                {ad.subtitle && <p style={{ fontSize:"11px", color:"#aaa", margin:0 }}>{ad.subtitle}</p>}
              </div>
              <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                <button onClick={()=>toggleActive(ad)} style={{ background:ad.is_active?"#dcfce7":"#f5f5f7", border:"none", borderRadius:"8px", padding:"6px 10px", fontSize:"11px", fontWeight:"700", color:ad.is_active?"#166534":"#aaa", cursor:"pointer", fontFamily:"Cairo,system-ui,sans-serif" }}>
                  {ad.is_active?"مفعل":"معطل"}
                </button>
                <button onClick={()=>startEdit(ad)} style={{ background:"#f5f5f7", border:"none", borderRadius:"8px", padding:"6px 10px", cursor:"pointer", display:"flex", alignItems:"center" }}><IconEdit /></button>
                <button onClick={()=>deleteAd(ad.id)} style={{ background:"#fef2f2", border:"none", borderRadius:"8px", padding:"6px 10px", cursor:"pointer", display:"flex", alignItems:"center" }}><IconDelete /></button>
              </div>
            </div>
          ))}
        </div>}
    </div>
  )
}