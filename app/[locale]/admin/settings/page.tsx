"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string,string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState("general")

  useEffect(() => {
    fetch("/api/admin/settings").then(r=>r.json()).then(d=>{ setSettings(d.settings||{}); setLoading(false) })
  }, [])

  const set = (key: string, value: string) => setSettings(prev => ({ ...prev, [key]: value }))

  const save = async () => {
    setSaving(true)
    await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inp = { width:"100%", padding:"11px 14px", background:"#f8f8f8", border:"1px solid #e5e5e5", borderRadius:"10px", fontSize:"13px", outline:"none", fontFamily:"Cairo,system-ui,sans-serif", boxSizing:"border-box" as const }
  const lbl = { fontSize:"11px", color:"#888", fontWeight:"700" as const, display:"block" as const, marginBottom:6 }
  const card = { background:"#fff", borderRadius:16, padding:16, border:"1px solid #e5e5e5", marginBottom:12, boxShadow:"0 1px 4px rgba(0,0,0,.04)" }

  const TABS = [
    { key:"general", label:"عام" },
    { key:"design", label:"التصميم" },
    { key:"store", label:"المتجر" },
    { key:"contact", label:"التواصل" },
  ]

  if (loading) return <div style={{ minHeight:"100vh", background:"#EEEEEE", display:"flex", alignItems:"center", justifyContent:"center" }}><div style={{ width:36, height:36, border:"3px solid #ffe4da", borderTopColor:"#FF835E", borderRadius:"50%", animation:"spin .9s linear infinite" }}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>

  return (
    <div style={{ minHeight:"100vh", background:"#EEEEEE", direction:"rtl", fontFamily:"Cairo,system-ui,sans-serif" }}>
      <div style={{ padding:"14px 20px", borderBottom:"1px solid #e5e5e5", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:"#fff", zIndex:10, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
        <Link href="/admin" style={{ color:"#888", fontSize:"13px" }}>← رجوع</Link>
        <span style={{ fontWeight:"700", fontSize:"16px" }}>إعدادات المتجر</span>
        <button onClick={save} disabled={saving} style={{ background:saved?"#2A7A45":"#FF835E", color:"#fff", border:"none", padding:"7px 16px", borderRadius:"9px", fontWeight:"700", fontSize:"13px", cursor:"pointer", fontFamily:"Cairo,system-ui,sans-serif", transition:"all .2s" }}>{saving?"جاري...":saved?"✓ تم الحفظ":"حفظ"}</button>
      </div>

      {/* TABS */}
      <div style={{ display:"flex", gap:0, background:"#fff", borderBottom:"1px solid #e5e5e5", overflowX:"auto" }}>
        {TABS.map(t => <button key={t.key} onClick={()=>setTab(t.key)} style={{ flex:1, padding:"12px 8px", border:"none", borderBottom:tab===t.key?"2px solid #FF835E":"2px solid transparent", background:"transparent", color:tab===t.key?"#FF835E":"#888", fontFamily:"Cairo,system-ui,sans-serif", fontSize:"13px", fontWeight:"700", cursor:"pointer", whiteSpace:"nowrap" as const }}>{t.label}</button>)}
      </div>

      <div style={{ padding:"16px", maxWidth:"600px", margin:"0 auto" }}>

        {/* عام */}
        {tab==="general" && (
          <div>
            <div style={card}>
              <p style={{ fontWeight:"800", fontSize:14, margin:"0 0 14px", color:"#111" }}>معلومات المتجر</p>
              <label style={lbl}>اسم المتجر</label>
              <input value={settings.store_name||""} onChange={e=>set("store_name",e.target.value)} style={{ ...inp, marginBottom:10 }} />
              <label style={lbl}>شعار المتجر (رابط)</label>
              <input value={settings.store_logo||""} onChange={e=>set("store_logo",e.target.value)} style={{ ...inp, marginBottom:10 }} />
              {settings.store_logo && <img src={settings.store_logo} style={{ height:40, borderRadius:8, marginBottom:10 }} />}
              <label style={lbl}>العملة</label>
              <input value={settings.currency||""} onChange={e=>set("currency",e.target.value)} style={inp} />
            </div>
            <div style={card}>
              <p style={{ fontWeight:"800", fontSize:14, margin:"0 0 14px", color:"#111" }}>الشحن والضريبة</p>
              <label style={lbl}>نسبة الضريبة (%)</label>
              <input type="number" value={settings.tax_rate||""} onChange={e=>set("tax_rate",e.target.value)} style={{ ...inp, marginBottom:10 }} />
              <label style={lbl}>الحد الأدنى للشحن المجاني (ر.س)</label>
              <input type="number" value={settings.free_shipping_min||""} onChange={e=>set("free_shipping_min",e.target.value)} style={inp} />
            </div>
          </div>
        )}

        {/* التصميم */}
        {tab==="design" && (
          <div>
            <div style={card}>
              <p style={{ fontWeight:"800", fontSize:14, margin:"0 0 14px", color:"#111" }}>الألوان</p>
              <label style={lbl}>اللون الرئيسي</label>
              <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:10 }}>
                <input type="color" value={settings.primary_color||"#FF835E"} onChange={e=>set("primary_color",e.target.value)} style={{ width:44, height:44, borderRadius:8, border:"1px solid #e5e5e5", cursor:"pointer", padding:2 }} />
                <input value={settings.primary_color||""} onChange={e=>set("primary_color",e.target.value)} style={{ ...inp, flex:1 }} />
              </div>
              <label style={lbl}>اللون الثانوي</label>
              <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:10 }}>
                <input type="color" value={settings.secondary_color||"#111111"} onChange={e=>set("secondary_color",e.target.value)} style={{ width:44, height:44, borderRadius:8, border:"1px solid #e5e5e5", cursor:"pointer", padding:2 }} />
                <input value={settings.secondary_color||""} onChange={e=>set("secondary_color",e.target.value)} style={{ ...inp, flex:1 }} />
              </div>
              <label style={lbl}>خلفية الهيدر</label>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <input type="color" value={settings.header_bg||"#ffffff"} onChange={e=>set("header_bg",e.target.value)} style={{ width:44, height:44, borderRadius:8, border:"1px solid #e5e5e5", cursor:"pointer", padding:2 }} />
                <input value={settings.header_bg||""} onChange={e=>set("header_bg",e.target.value)} style={{ ...inp, flex:1 }} />
              </div>
            </div>
            <div style={card}>
              <p style={{ fontWeight:"800", fontSize:14, margin:"0 0 14px", color:"#111" }}>الخط</p>
              <label style={lbl}>نوع الخط</label>
              <select value={settings.font_family||"ThmanyahSans"} onChange={e=>set("font_family",e.target.value)} style={{ ...inp }}>
                <option value="ThmanyahSans">ThmanyahSans (الحالي)</option>
                <option value="Cairo">Cairo</option>
                <option value="Tajawal">Tajawal</option>
                <option value="Almarai">Almarai</option>
              </select>
            </div>
          </div>
        )}

        {/* المتجر */}
        {tab==="store" && (
          <div style={card}>
              <p style={{ fontWeight:"800", fontSize:14, margin:"0 0 14px", color:"#111" }}>إعدادات المتجر</p>
              <label style={lbl}>إظهار الضريبة للمستخدم</label>
              <div onClick={()=>set("show_tax", settings.show_tax==="true"?"false":"true")} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", background:"#f8f8f8", borderRadius:10, cursor:"pointer", marginBottom:10 }}>
                <span style={{ fontSize:13, color:"#111" }}>شامل الضريبة</span>
                <div style={{ width:40, height:22, borderRadius:11, background:settings.show_tax==="true"?"#FF835E":"#ddd", position:"relative", transition:"background .2s" }}><div style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:2, left:settings.show_tax==="true"?20:2, transition:"left .2s" }} /></div>
              </div>
          </div>
        )}

        {/* التواصل */}
        {tab==="contact" && (
          <div style={card}>
            <p style={{ fontWeight:"800", fontSize:14, margin:"0 0 14px", color:"#111" }}>معلومات التواصل</p>
            <label style={lbl}>رقم الجوال</label>
            <input value={settings.store_phone||""} onChange={e=>set("store_phone",e.target.value)} placeholder="+966XXXXXXXXX" style={{ ...inp, marginBottom:10 }} />
            <label style={lbl}>البريد الإلكتروني</label>
            <input value={settings.store_email||""} onChange={e=>set("store_email",e.target.value)} placeholder="info@klafstore.com" style={{ ...inp, marginBottom:10 }} />
            <label style={lbl}>العنوان</label>
            <input value={settings.store_address||""} onChange={e=>set("store_address",e.target.value)} placeholder="المدينة، المملكة العربية السعودية" style={inp} />
          </div>
        )}

      </div>
    </div>
  )
}
