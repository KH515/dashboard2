"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"

export default function SettingsPage() {
  const t = useTranslations()
  const locale = useLocale()
  const isAr = locale === "ar"
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
    { key:"general", label: t("settings_page.general") },
    { key:"design", label: t("store_management.design") },
    { key:"store", label: t("nav.store_management") },
    { key:"contact", label: t("footer_page.contact") },
  ]

  if (loading) return <div style={{ minHeight:"100vh", background:"#EEEEEE", display:"flex", alignItems:"center", justifyContent:"center" }}><div style={{ width:36, height:36, border:"3px solid #ffe4da", borderTopColor:"#FF835E", borderRadius:"50%", animation:"spin .9s linear infinite" }}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>

  return (
    <div style={{ minHeight:"100vh", background:"#EEEEEE", direction: isAr ? "rtl" : "ltr", fontFamily:"Cairo,system-ui,sans-serif" }}>
      <div style={{ padding:"14px 20px", borderBottom:"1px solid #e5e5e5", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:"#fff", zIndex:10, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
        <Link href={`/${locale}/admin`} style={{ color:"#888", fontSize:"13px", textDecoration:"none" }}>
          {isAr ? "← رجوع" : "← Back"}
        </Link>
        <span style={{ fontWeight:"700", fontSize:"16px" }}>{t("settings_page.title")}</span>
        <button onClick={save} disabled={saving} style={{ background:saved?"#2A7A45":"#FF835E", color:"#fff", border:"none", padding:"7px 16px", borderRadius:"9px", fontWeight:"700", fontSize:"13px", cursor:"pointer", fontFamily:"Cairo,system-ui,sans-serif", transition:"all .2s" }}>
          {saving ? t("common.saving") : saved ? "✓ " + t("common.success") : t("common.save")}
        </button>
      </div>

      <div style={{ display:"flex", gap:0, background:"#fff", borderBottom:"1px solid #e5e5e5", overflowX:"auto" }}>
        {TABS.map(tt => <button key={tt.key} onClick={()=>setTab(tt.key)} style={{ flex:1, padding:"12px 8px", border:"none", borderBottom:tab===tt.key?"2px solid #FF835E":"2px solid transparent", background:"transparent", color:tab===tt.key?"#FF835E":"#888", fontFamily:"Cairo,system-ui,sans-serif", fontSize:"13px", fontWeight:"700", cursor:"pointer", whiteSpace:"nowrap" as const }}>{tt.label}</button>)}
      </div>

      <div style={{ padding:"16px", maxWidth:"600px", margin:"0 auto" }}>

        {tab==="general" && (
          <div>
            <div style={card}>
              <p style={{ fontWeight:"800", fontSize:14, margin:"0 0 14px", color:"#111" }}>
                {isAr ? "معلومات المتجر" : "Store Information"}
              </p>
              <label style={lbl}>{t("settings_page.store_name")}</label>
              <input value={settings.store_name||""} onChange={e=>set("store_name",e.target.value)} style={{ ...inp, marginBottom:10 }} />
              <label style={lbl}>{t("settings_page.store_logo")} ({isAr ? "رابط" : "URL"})</label>
              <input value={settings.store_logo||""} onChange={e=>set("store_logo",e.target.value)} style={{ ...inp, marginBottom:10 }} />
              {settings.store_logo && <img src={settings.store_logo} style={{ height:40, borderRadius:8, marginBottom:10 }} />}
              <label style={lbl}>{t("settings_page.currency")}</label>
              <input value={settings.currency||""} onChange={e=>set("currency",e.target.value)} style={inp} />
            </div>
            <div style={card}>
              <p style={{ fontWeight:"800", fontSize:14, margin:"0 0 14px", color:"#111" }}>
                {isAr ? "الشحن والضريبة" : "Shipping & Tax"}
              </p>
              <label style={lbl}>{isAr ? "نسبة الضريبة (%)" : "Tax Rate (%)"}</label>
              <input type="number" value={settings.tax_rate||""} onChange={e=>set("tax_rate",e.target.value)} style={{ ...inp, marginBottom:10 }} />
              <label style={lbl}>{isAr ? "الحد الأدنى للشحن المجاني (ر.س)" : "Free shipping threshold (SAR)"}</label>
              <input type="number" value={settings.free_shipping_min||""} onChange={e=>set("free_shipping_min",e.target.value)} style={inp} />
            </div>
          </div>
        )}

        {tab==="design" && (
          <div>
            <div style={card}>
              <p style={{ fontWeight:"800", fontSize:14, margin:"0 0 14px", color:"#111" }}>
                {isAr ? "الألوان" : "Colors"}
              </p>
              <label style={lbl}>{isAr ? "اللون الرئيسي" : "Primary Color"}</label>
              <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:10 }}>
                <input type="color" value={settings.primary_color||"#FF835E"} onChange={e=>set("primary_color",e.target.value)} style={{ width:44, height:44, borderRadius:8, border:"1px solid #e5e5e5", cursor:"pointer", padding:2 }} />
                <input value={settings.primary_color||""} onChange={e=>set("primary_color",e.target.value)} style={{ ...inp, flex:1 }} />
              </div>
              <label style={lbl}>{isAr ? "اللون الثانوي" : "Secondary Color"}</label>
              <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:10 }}>
                <input type="color" value={settings.secondary_color||"#111111"} onChange={e=>set("secondary_color",e.target.value)} style={{ width:44, height:44, borderRadius:8, border:"1px solid #e5e5e5", cursor:"pointer", padding:2 }} />
                <input value={settings.secondary_color||""} onChange={e=>set("secondary_color",e.target.value)} style={{ ...inp, flex:1 }} />
              </div>
              <label style={lbl}>{isAr ? "خلفية الهيدر" : "Header Background"}</label>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <input type="color" value={settings.header_bg||"#ffffff"} onChange={e=>set("header_bg",e.target.value)} style={{ width:44, height:44, borderRadius:8, border:"1px solid #e5e5e5", cursor:"pointer", padding:2 }} />
                <input value={settings.header_bg||""} onChange={e=>set("header_bg",e.target.value)} style={{ ...inp, flex:1 }} />
              </div>
            </div>
            <div style={card}>
              <p style={{ fontWeight:"800", fontSize:14, margin:"0 0 14px", color:"#111" }}>
                {isAr ? "الخط" : "Font"}
              </p>
              <label style={lbl}>{isAr ? "نوع الخط" : "Font Family"}</label>
              <select value={settings.font_family||"ThmanyahSans"} onChange={e=>set("font_family",e.target.value)} style={{ ...inp }}>
                <option value="ThmanyahSans">ThmanyahSans ({isAr ? "الحالي" : "Current"})</option>
                <option value="Cairo">Cairo</option>
                <option value="Tajawal">Tajawal</option>
                <option value="Almarai">Almarai</option>
              </select>
            </div>
          </div>
        )}

        {tab==="store" && (
          <div style={card}>
              <p style={{ fontWeight:"800", fontSize:14, margin:"0 0 14px", color:"#111" }}>
                {isAr ? "إعدادات المتجر" : "Store Settings"}
              </p>
              <label style={lbl}>{isAr ? "إظهار الضريبة للمستخدم" : "Show tax to user"}</label>
              <div onClick={()=>set("show_tax", settings.show_tax==="true"?"false":"true")} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", background:"#f8f8f8", borderRadius:10, cursor:"pointer", marginBottom:10 }}>
                <span style={{ fontSize:13, color:"#111" }}>
                  {isAr ? "شامل الضريبة" : "Tax inclusive"}
                </span>
                <div style={{ width:40, height:22, borderRadius:11, background:settings.show_tax==="true"?"#FF835E":"#ddd", position:"relative", transition:"background .2s" }}><div style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:2, left:settings.show_tax==="true"?20:2, transition:"left .2s" }} /></div>
              </div>
          </div>
        )}

        {tab==="contact" && (
          <div style={card}>
            <p style={{ fontWeight:"800", fontSize:14, margin:"0 0 14px", color:"#111" }}>
              {isAr ? "معلومات التواصل" : "Contact Information"}
            </p>
            <label style={lbl}>{t("footer_page.phone")}</label>
            <input value={settings.store_phone||""} onChange={e=>set("store_phone",e.target.value)} placeholder="+966XXXXXXXXX" style={{ ...inp, marginBottom:10 }} />
            <label style={lbl}>{t("footer_page.email")}</label>
            <input value={settings.store_email||""} onChange={e=>set("store_email",e.target.value)} placeholder="info@klafstore.com" style={{ ...inp, marginBottom:10 }} />
            <label style={lbl}>{t("footer_page.address")}</label>
            <input value={settings.store_address||""} onChange={e=>set("store_address",e.target.value)} placeholder={isAr ? "المدينة، المملكة العربية السعودية" : "City, Saudi Arabia"} style={inp} dir={isAr ? "rtl" : "ltr"} />
          </div>
        )}

      </div>
    </div>
  )
}