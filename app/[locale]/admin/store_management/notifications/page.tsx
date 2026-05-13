"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"

interface Template { id:number; event_key:string; channel:string; subject:string|null; body:string; enabled:number }

const variables: Record<string,string[]> = {
  order_confirmed: ["{customer_name}","{order_id}","{total}"],
  order_shipped: ["{customer_name}","{order_id}","{tracking}"],
  order_delivered: ["{customer_name}","{order_id}"],
  welcome: ["{customer_name}"],
  password_reset: ["{customer_name}","{reset_link}"],
  abandoned_cart: ["{customer_name}","{cart_url}"],
}

export default function NotificationsPage() {
  const t = useTranslations()
  const locale = useLocale()
  const isAr = locale === "ar"
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState<"templates"|"settings">("templates")
  const [templates, setTemplates] = useState<Template[]>([])
  const [editing, setEditing] = useState<Template|null>(null)
  const [settings, setSettings] = useState({ sender_name:"", sender_email:"", reply_to:"", sms_enabled:true, email_enabled:true, push_enabled:true })

  const eventLabel = (key: string) => {
    const labels: Record<string, string> = {
      order_confirmed: isAr ? "تأكيد الطلب" : "Order Confirmed",
      order_shipped: isAr ? "شحن الطلب" : "Order Shipped",
      order_delivered: isAr ? "توصيل الطلب" : "Order Delivered",
      welcome: isAr ? "ترحيب بعميل جديد" : "Welcome New Customer",
      password_reset: isAr ? "إعادة تعيين كلمة المرور" : "Password Reset",
      abandoned_cart: isAr ? "سلة متروكة" : "Abandoned Cart",
    }
    return labels[key] || key
  }

  useEffect(() => { load() }, [])

  const load = async () => {
    try {
      const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/notifications")
      const d = await res.json()
      setTemplates(d.templates || [])
      setSettings({
        sender_name: d.settings?.sender_name || "",
        sender_email: d.settings?.sender_email || "",
        reply_to: d.settings?.reply_to || "",
        sms_enabled: d.settings?.sms_enabled !== "false",
        email_enabled: d.settings?.email_enabled !== "false",
        push_enabled: d.settings?.push_enabled !== "false",
      })
    } catch {}
    setLoading(false)
  }

  const saveTemplate = async () => {
    if (!editing) return
    setSaving(true)
    try {
      await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/notifications/template/"+editing.id, {
        method:"PUT", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ subject:editing.subject, body:editing.body, enabled:editing.enabled })
      })
      setTemplates(templates.map(tt => tt.id===editing.id ? editing : tt))
      setEditing(null)
      alert(t("common.success"))
    } catch { alert(t("common.error")) }
    setSaving(false)
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/notifications/settings", {
        method:"PUT", headers:{"Content-Type":"application/json"},
        body: JSON.stringify(settings)
      })
      alert(t("common.success"))
    } catch { alert(t("common.error")) }
    setSaving(false)
  }

  if (loading) return <div style={{ padding:40, textAlign:"center", color:"#888" }}>{t("common.loading")}</div>

  const grouped: Record<string, Template[]> = {}
  templates.forEach(tt => { if(!grouped[tt.event_key]) grouped[tt.event_key]=[]; grouped[tt.event_key].push(tt) })

  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:24, direction: isAr ? "rtl" : "ltr" }}>
      <Link href={`/${locale}/admin`} style={{ fontSize:13, color:"#888", textDecoration:"none" }}>
        {isAr ? "← العودة" : "← Back"}
      </Link>
      <h1 style={{ fontSize:24, fontWeight:900, color:"#111", margin:"8px 0 4px" }}>{t("store_management.notifications")}</h1>
      <p style={{ fontSize:13, color:"#888", marginBottom:24 }}>
        {isAr ? "قوالب Email و SMS التي تُرسل للعملاء" : "Email and SMS templates sent to customers"}
      </p>

      <div style={{ display:"flex", gap:4, marginBottom:20, borderBottom:"1px solid #eee" }}>
        {[{k:"templates",l: isAr ? "القوالب" : "Templates"},{k:"settings",l: isAr ? "الإعدادات" : "Settings"}].map(tt=>(
          <button key={tt.k} onClick={()=>setTab(tt.k as any)} style={{ padding:"12px 20px", background:"transparent", border:"none", borderBottom:tab===tt.k?"2px solid #FF835E":"2px solid transparent", color:tab===tt.k?"#FF835E":"#666", fontWeight:700, cursor:"pointer", fontSize:13 }}>{tt.l}</button>
        ))}
      </div>

      {tab==="templates" && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {Object.entries(grouped).map(([ek, ts]) => (
            <div key={ek} style={{ background:"#fff", borderRadius:12, padding:18, border:"1px solid #eee" }}>
              <h3 style={{ fontSize:15, fontWeight:800, color:"#111", margin:"0 0 12px" }}>{eventLabel(ek)}</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {ts.map(tt => (
                  <div key={tt.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", background:"#fafafa", borderRadius:8 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ padding:"3px 9px", background: tt.channel==="email"?"#e0f2fe":"#fef3c7", color: tt.channel==="email"?"#0369a1":"#92400e", borderRadius:6, fontSize:11, fontWeight:800, textTransform:"uppercase" }}>{tt.channel}</span>
                      <span style={{ fontSize:13, color:"#666" }}>{tt.subject || tt.body.slice(0,50)+"..."}</span>
                    </div>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <input type="checkbox" checked={tt.enabled===1} onChange={async e=>{
                        const updated = {...tt, enabled: e.target.checked?1:0}
                        setTemplates(templates.map(x=>x.id===tt.id?updated:x))
                        await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/notifications/template/"+tt.id, { method:"PUT", headers:{"Content-Type":"application/json"}, body: JSON.stringify({subject:tt.subject,body:tt.body,enabled:e.target.checked}) })
                      }} style={{ width:18, height:18, cursor:"pointer", accentColor:"#FF835E" }} />
                      <button onClick={()=>setEditing(tt)} style={{ padding:"6px 14px", background:"#FF835E", color:"#fff", border:"none", borderRadius:7, cursor:"pointer", fontWeight:700, fontSize:12, fontFamily:"inherit" }}>{t("common.edit")}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="settings" && (
        <div style={{ background:"#fff", borderRadius:12, padding:20, border:"1px solid #eee" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:20 }}>
            <div>
              <label style={{ fontSize:13, fontWeight:700, color:"#333", display:"block", marginBottom:6 }}>
                {isAr ? "اسم المرسل" : "Sender name"}
              </label>
              <input value={settings.sender_name} onChange={e=>setSettings({...settings,sender_name:e.target.value})} style={{ width:"100%", padding:"10px 12px", border:"1px solid #ddd", borderRadius:8, fontSize:14, fontFamily:"inherit" }} dir={isAr ? "rtl" : "ltr"} />
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:700, color:"#333", display:"block", marginBottom:6 }}>
                {isAr ? "إيميل المرسل" : "Sender email"}
              </label>
              <input value={settings.sender_email} onChange={e=>setSettings({...settings,sender_email:e.target.value})} style={{ width:"100%", padding:"10px 12px", border:"1px solid #ddd", borderRadius:8, fontSize:14, fontFamily:"inherit" }} />
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:700, color:"#333", display:"block", marginBottom:6 }}>
                {isAr ? "الرد على (Reply-To)" : "Reply-To"}
              </label>
              <input value={settings.reply_to} onChange={e=>setSettings({...settings,reply_to:e.target.value})} style={{ width:"100%", padding:"10px 12px", border:"1px solid #ddd", borderRadius:8, fontSize:14, fontFamily:"inherit" }} />
            </div>
          </div>
          <div style={{ borderTop:"1px solid #eee", paddingTop:16 }}>
            <p style={{ fontSize:11, fontWeight:800, color:"#aaa", letterSpacing:1, marginBottom:8 }}>
              {isAr ? "القنوات المفعّلة" : "Enabled Channels"}
            </p>
            {[{k:"email_enabled",l: isAr ? "الإيميل (Email)" : "Email"},{k:"sms_enabled",l: isAr ? "الرسائل النصية (SMS)" : "SMS"},{k:"push_enabled",l: isAr ? "الإشعارات الفورية (Push)" : "Push Notifications"}].map(tt=>(
              <label key={tt.k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid #f5f5f5", cursor:"pointer" }}>
                <span style={{ fontSize:14, fontWeight:600, color:"#111" }}>{tt.l}</span>
                <input type="checkbox" checked={(settings as any)[tt.k]} onChange={e=>setSettings({...settings, [tt.k]:e.target.checked})} style={{ width:18, height:18, cursor:"pointer", accentColor:"#FF835E" }} />
              </label>
            ))}
          </div>
          <button onClick={saveSettings} disabled={saving} style={{ marginTop:20, padding:"10px 24px", background:"#FF835E", color:"#fff", border:"none", borderRadius:10, fontWeight:800, cursor:"pointer", fontSize:14, opacity:saving?.6:1 }}>
            {saving ? t("common.saving") : t("common.save")}
          </button>
        </div>
      )}

      {editing && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={e=>e.target===e.currentTarget && setEditing(null)}>
          <div style={{ background:"#fff", borderRadius:14, padding:24, maxWidth:600, width:"100%", maxHeight:"90vh", overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <h2 style={{ fontSize:18, fontWeight:800, color:"#111", margin:0 }}>
                {eventLabel(editing.event_key)}{" "}
                <span style={{ fontSize:11, color:"#888", marginRight:8 }}>({editing.channel})</span>
              </h2>
              <button onClick={()=>setEditing(null)} style={{ background:"#f5f5f5", border:"none", width:30, height:30, borderRadius:7, cursor:"pointer", fontSize:14 }}>✕</button>
            </div>
            {variables[editing.event_key] && (
              <div style={{ background:"#fff5f2", padding:10, borderRadius:8, marginBottom:14 }}>
                <p style={{ fontSize:11, fontWeight:800, color:"#FF835E", marginBottom:6 }}>
                  {isAr ? "المتغيرات المتاحة (انقر للنسخ):" : "Available variables (click to copy):"}
                </p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {variables[editing.event_key].map(v=>(
                    <code key={v} onClick={()=>navigator.clipboard.writeText(v)} style={{ padding:"4px 9px", background:"#fff", border:"1px solid #ffd4c4", borderRadius:5, fontSize:11, color:"#FF835E", cursor:"pointer", fontFamily:"monospace" }}>{v}</code>
                  ))}
                </div>
              </div>
            )}
            {editing.channel==="email" && (
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:13, fontWeight:700, color:"#333", display:"block", marginBottom:6 }}>
                  {isAr ? "عنوان الإيميل" : "Email subject"}
                </label>
                <input value={editing.subject||""} onChange={e=>setEditing({...editing,subject:e.target.value})} style={{ width:"100%", padding:"10px 12px", border:"1px solid #ddd", borderRadius:8, fontSize:14, fontFamily:"inherit" }} dir={isAr ? "rtl" : "ltr"} />
              </div>
            )}
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:13, fontWeight:700, color:"#333", display:"block", marginBottom:6 }}>
                {editing.channel==="email" ? (isAr ? "محتوى الإيميل (HTML)" : "Email content (HTML)") : (isAr ? "نص الرسالة" : "Message text")}
              </label>
              <textarea value={editing.body} onChange={e=>setEditing({...editing,body:e.target.value})} rows={editing.channel==="email"?12:4} style={{ width:"100%", padding:"10px 12px", border:"1px solid #ddd", borderRadius:8, fontSize:13, fontFamily: editing.channel==="email"?"monospace":"inherit", resize:"vertical" }} dir={isAr ? "rtl" : "ltr"} />
              {editing.channel==="sms" && <p style={{ fontSize:11, color:"#888", marginTop:4 }}>
                {isAr ? "الطول" : "Length"}: {editing.body.length} / 160
              </p>}
            </div>
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
              <button onClick={()=>setEditing(null)} style={{ padding:"9px 18px", background:"#f5f5f5", color:"#333", border:"none", borderRadius:8, cursor:"pointer", fontWeight:700, fontFamily:"inherit", fontSize:13 }}>{t("common.cancel")}</button>
              <button onClick={saveTemplate} disabled={saving} style={{ padding:"9px 22px", background:"#FF835E", color:"#fff", border:"none", borderRadius:8, cursor:"pointer", fontWeight:800, fontFamily:"inherit", fontSize:13 }}>
                {saving ? t("common.saving") : t("common.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}