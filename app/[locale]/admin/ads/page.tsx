"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

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

export default function AdsPage() {
  const params = useParams()
  const locale = params.locale as string
  const [ads, setAds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ title:"", subtitle:"", cta_text:"", cta_url:"", bg_color:"#FF835E", placement:"profile_orders", position:"top", image_url:"", is_active:1 })

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.klafstore.com"

  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""

  const fetchAds = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${apiUrl}/api/ads/all`, { headers:{ Authorization:"Bearer "+getToken() } })
      const data = await res.json()
      setAds(data.ads || [])
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { fetchAds() }, [])

  const save = async () => {
    setSaving(true)
    try {
      const url = editing ? `${apiUrl}/api/ads/${editing.id}` : `${apiUrl}/api/ads`
      const method = editing ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers:{ Authorization:"Bearer "+getToken(), "Content-Type":"application/json" },
        body: JSON.stringify(form)
      })
      if (res.ok) {
        setMsg(editing ? "تم تحديث الإعلان" : "تم إضافة الإعلان")
        setShowForm(false); setEditing(null)
        setForm({ title:"", subtitle:"", cta_text:"", cta_url:"", bg_color:"#FF835E", placement:"profile_orders", position:"top", image_url:"", is_active:1 })
        fetchAds()
        setTimeout(() => setMsg(""), 3000)
      }
    } catch {} finally { setSaving(false) }
  }

  const toggleActive = async (ad: any) => {
    await fetch(`${apiUrl}/api/ads/${ad.id}`, {
      method:"PUT",
      headers:{ Authorization:"Bearer "+getToken(), "Content-Type":"application/json" },
      body: JSON.stringify({ is_active: ad.is_active ? 0 : 1 })
    })
    fetchAds()
  }

  const deleteAd = async (id: number) => {
    if (!confirm("حذف الإعلان؟")) return
    await fetch(`${apiUrl}/api/ads/${id}`, { method:"DELETE", headers:{ Authorization:"Bearer "+getToken() } })
    fetchAds()
  }

  const startEdit = (ad: any) => {
    setEditing(ad)
    setForm({ title:ad.title||"", subtitle:ad.subtitle||"", cta_text:ad.cta_text||"", cta_url:ad.cta_url||"", bg_color:ad.bg_color||"#FF835E", placement:ad.placement||"profile_orders", position:ad.position||"top", image_url:ad.image_url||"", is_active:ad.is_active })
    setShowForm(true)
  }

  const inp = { width:"100%", padding:"8px 12px", background:"#f5f5f7", border:"1px solid #e5e5e5", borderRadius:"8px", fontSize:"13px", outline:"none", fontFamily:"Cairo,system-ui,sans-serif", color:"#111", boxSizing:"border-box" as const }

  return (
    <div style={{ fontFamily:"Cairo,system-ui,sans-serif", direction:"rtl", padding:"24px", maxWidth:900, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h1 style={{ fontSize:"20px", fontWeight:"900", color:"#111", margin:0 }}>إدارة الإعلانات</h1>
        <button onClick={() => { setShowForm(true); setEditing(null) }} style={{ background:"#FF835E", color:"#fff", border:"none", borderRadius:"10px", padding:"9px 18px", fontSize:"13px", fontWeight:"700", cursor:"pointer", fontFamily:"Cairo,system-ui,sans-serif" }}>
          + إضافة إعلان
        </button>
      </div>

      {msg && <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:"10px", padding:"10px 14px", marginBottom:16, color:"#166534", fontSize:"13px", fontWeight:"700" }}>✅ {msg}</div>}

      {/* فورم الإضافة/التعديل */}
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
              <label style={{ fontSize:"11px", fontWeight:"700", color:"#888", display:"block", marginBottom:4 }}>رابط الصورة (CDN)</label>
              <input style={inp} value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} placeholder="https://..." dir="ltr" />
            </div>
            <div>
              <label style={{ fontSize:"11px", fontWeight:"700", color:"#888", display:"block", marginBottom:4 }}>لون الخلفية</label>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <input type="color" value={form.bg_color} onChange={e=>setForm({...form,bg_color:e.target.value})} style={{ width:40, height:36, borderRadius:8, border:"1px solid #e5e5e5", cursor:"pointer" }} />
                <input style={{...inp, flex:1}} value={form.bg_color} onChange={e=>setForm({...form,bg_color:e.target.value})} dir="ltr" />
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
            <button onClick={() => { setShowForm(false); setEditing(null) }} style={{ background:"#f5f5f7", border:"1px solid #e5e5e5", borderRadius:"9px", padding:"9px 18px", fontSize:"13px", fontWeight:"600", color:"#555", cursor:"pointer", fontFamily:"Cairo,system-ui,sans-serif" }}>إلغاء</button>
            <button onClick={save} disabled={saving} style={{ background:"#FF835E", color:"#fff", border:"none", borderRadius:"9px", padding:"9px 18px", fontSize:"13px", fontWeight:"700", cursor:"pointer", fontFamily:"Cairo,system-ui,sans-serif", opacity:saving?0.6:1 }}>
              {saving ? "جاري الحفظ..." : "حفظ"}
            </button>
          </div>
        </div>
      )}

      {/* قائمة الإعلانات */}
      {loading ? (
        <div style={{ textAlign:"center" as const, padding:40, color:"#aaa" }}>جاري التحميل...</div>
      ) : ads.length === 0 ? (
        <div style={{ background:"#fff", borderRadius:"14px", padding:"40px", border:"1px solid #e5e5e5", textAlign:"center" as const, color:"#aaa" }}>ما في إعلانات بعد</div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column" as const, gap:10 }}>
          {ads.map((ad:any) => (
            <div key={ad.id} style={{ background:"#fff", borderRadius:"14px", padding:"16px", border:"1px solid #e5e5e5", display:"flex", alignItems:"center", gap:12 }}>
              {/* معاينة اللون */}
              <div style={{ width:48, height:48, borderRadius:"10px", background:ad.bg_color||"#FF835E", flexShrink:0, overflow:"hidden" }}>
                {ad.image_url && <img src={ad.image_url} style={{ width:"100%", height:"100%", objectFit:"cover" }} alt="" />}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                  <span style={{ fontSize:"13px", fontWeight:"800", color:"#111" }}>{ad.title || "بدون عنوان"}</span>
                  <span style={{ background:"#f5f5f7", borderRadius:"6px", padding:"2px 8px", fontSize:"10px", color:"#555" }}>{PLACEMENTS.find(p=>p.value===ad.placement)?.label || ad.placement}</span>
                  <span style={{ background: ad.position==="top" ? "#dbeafe" : "#fef3c7", borderRadius:"6px", padding:"2px 8px", fontSize:"10px", color: ad.position==="top" ? "#1d4ed8" : "#b45309" }}>{POSITIONS.find(p=>p.value===ad.position)?.label}</span>
                </div>
                {ad.subtitle && <p style={{ fontSize:"11px", color:"#aaa", margin:0 }}>{ad.subtitle}</p>}
              </div>
              <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                <button onClick={() => toggleActive(ad)} style={{ background: ad.is_active ? "#dcfce7" : "#f5f5f7", border:"none", borderRadius:"8px", padding:"6px 12px", fontSize:"11px", fontWeight:"700", color: ad.is_active ? "#166534" : "#aaa", cursor:"pointer", fontFamily:"Cairo,system-ui,sans-serif" }}>
                  {ad.is_active ? "مفعل" : "معطل"}
                </button>
                <button onClick={() => startEdit(ad)} style={{ background:"#f5f5f7", border:"none", borderRadius:"8px", padding:"6px 12px", fontSize:"11px", fontWeight:"600", color:"#555", cursor:"pointer", fontFamily:"Cairo,system-ui,sans-serif" }}>تعديل</button>
                <button onClick={() => deleteAd(ad.id)} style={{ background:"#fef2f2", border:"none", borderRadius:"8px", padding:"6px 12px", fontSize:"11px", fontWeight:"600", color:"#e53e3e", cursor:"pointer", fontFamily:"Cairo,system-ui,sans-serif" }}>حذف</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}