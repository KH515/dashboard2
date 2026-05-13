"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"

export default function ShippingPaymentPage() {
  const t = useTranslations()
  const locale = useLocale()
  const isAr = locale === "ar"
  const [settings, setSettings] = useState<Record<string,string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch("/api/admin/settings").then(r=>r.json()).then(d=>setSettings(d.settings||{}))
  }, [])

  const set = (key: string, val: string) => setSettings(prev=>({...prev,[key]:val}))

  const save = async () => {
    setSaving(true)
    await fetch("/api/admin/settings", { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(settings) })
    setSaving(false); setSaved(true); setTimeout(()=>setSaved(false),2000)
  }

  const inp = { width:"100%", padding:"11px 14px", background:"#f8f8f8", border:"1px solid #e5e5e5", borderRadius:10, fontSize:"13px", outline:"none", fontFamily:"Cairo,system-ui,sans-serif", boxSizing:"border-box" as const }
  const card = { background:"#fff", borderRadius:16, padding:16, border:"1px solid #e5e5e5", marginBottom:12, boxShadow:"0 1px 4px rgba(0,0,0,.04)" }
  const lbl = { fontSize:"11px", color:"#888", fontWeight:"700" as const, display:"block" as const, marginBottom:6 }

  const paymentMethods = [
    { key:"payment_stcpay", label: "STC Pay" },
    { key:"payment_mada", label: isAr ? "مدى" : "Mada" },
    { key:"payment_visa", label: "Visa / Mastercard" },
    { key:"payment_tabby", label: isAr ? "تابي - الدفع بالتقسيط" : "Tabby - Buy now pay later" },
    { key:"payment_tamara", label: isAr ? "تمارا - الدفع بالتقسيط" : "Tamara - Buy now pay later" },
  ]

  return (
    <div style={{ minHeight:"100vh", background:"#EEEEEE", direction: isAr ? "rtl" : "ltr", fontFamily:"Cairo,system-ui,sans-serif" }}>
      <div style={{ padding:"16px 20px", borderBottom:"1px solid #e5e5e5", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:"#fff", zIndex:10, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
        <Link href={`/${locale}/admin`} style={{ color:"#888", fontSize:"13px", textDecoration:"none" }}>
          {isAr ? "← رجوع" : "← Back"}
        </Link>
        <span style={{ fontWeight:"700", fontSize:"16px" }}>{t("store_management.shipping_payment")}</span>
        <button onClick={save} style={{ background:saved?"#2A7A45":"#FF835E", color:"#fff", border:"none", padding:"7px 16px", borderRadius:9, fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"Cairo,system-ui,sans-serif" }}>
          {saving ? t("common.saving") : saved ? "✓ " + t("common.success") : t("common.save")}
        </button>
      </div>
      <div style={{ padding:16, maxWidth:"600px", margin:"0 auto" }}>
        <div style={card}>
          <p style={{ fontWeight:800, fontSize:14, margin:"0 0 14px", color:"#111" }}>
            {isAr ? "إعدادات الشحن" : "Shipping Settings"}
          </p>
          <label style={lbl}>
            {isAr ? "الحد الأدنى للشحن المجاني (ر.س)" : "Free shipping threshold (SAR)"}
          </label>
          <input type="number" value={settings.free_shipping_min||""} onChange={e=>set("free_shipping_min",e.target.value)} style={{ ...inp, marginBottom:10 }} />
          <label style={lbl}>
            {isAr ? "تكلفة الشحن الافتراضية (ر.س)" : "Default shipping cost (SAR)"}
          </label>
          <input type="number" value={settings.shipping_cost||""} onChange={e=>set("shipping_cost",e.target.value)} style={inp} />
        </div>
        <div style={card}>
          <p style={{ fontWeight:800, fontSize:14, margin:"0 0 14px", color:"#111" }}>
            {isAr ? "بوابات الدفع" : "Payment Gateways"}
          </p>
          {paymentMethods.map(p => (
            <div key={p.key} onClick={()=>set(p.key, settings[p.key]==="true"?"false":"true")} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", background:"#f8f8f8", borderRadius:10, cursor:"pointer", marginBottom:8 }}>
              <span style={{ fontSize:13, color:"#111", fontWeight:600 }}>{p.label}</span>
              <div style={{ width:40, height:22, borderRadius:11, background:settings[p.key]==="true"?"#FF835E":"#ddd", position:"relative", transition:"background .2s" }}><div style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:2, left:settings[p.key]==="true"?20:2, transition:"left .2s" }} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}