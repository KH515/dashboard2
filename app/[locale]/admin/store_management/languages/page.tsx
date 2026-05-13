"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"

interface Language { id:number; code:string; name:string; native_name:string; flag:string|null; direction:string; is_default:number; is_enabled:number; sort_order:number }

const suggestions = [
  { code:"ur", name:"Urdu", native_name:"اردو", flag:"🇵🇰", direction:"rtl" },
  { code:"hi", name:"Hindi", native_name:"हिन्दी", flag:"🇮🇳", direction:"ltr" },
  { code:"tl", name:"Tagalog", native_name:"Tagalog", flag:"🇵🇭", direction:"ltr" },
  { code:"bn", name:"Bengali", native_name:"বাংলা", flag:"🇧🇩", direction:"ltr" },
  { code:"id", name:"Indonesian", native_name:"Indonesia", flag:"🇮🇩", direction:"ltr" },
  { code:"tr", name:"Turkish", native_name:"Türkçe", flag:"🇹🇷", direction:"ltr" },
  { code:"fr", name:"French", native_name:"Français", flag:"🇫🇷", direction:"ltr" },
  { code:"es", name:"Spanish", native_name:"Español", flag:"🇪🇸", direction:"ltr" },
  { code:"de", name:"German", native_name:"Deutsch", flag:"🇩🇪", direction:"ltr" },
  { code:"zh", name:"Chinese", native_name:"中文", flag:"🇨🇳", direction:"ltr" },
]

export default function LanguagesPage() {
  const t = useTranslations()
  const locale = useLocale()
  const isAr = locale === "ar"
  const [loading, setLoading] = useState(true)
  const [langs, setLangs] = useState<Language[]>([])
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => { load() }, [])

  const load = async () => {
    try {
      const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/languages")
      const d = await res.json()
      setLangs(d.languages || [])
    } catch {}
    setLoading(false)
  }

  const update = async (id:number, data:any) => {
    await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/languages/"+id, {
      method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data)
    })
    load()
  }

  const add = async (lang:any) => {
    await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/languages", {
      method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(lang)
    })
    setShowAdd(false)
    load()
  }

  const remove = async (id:number) => {
    if (!confirm(t("common.confirm_delete"))) return
    await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/languages/"+id, { method:"DELETE" })
    load()
  }

  if (loading) return <div style={{ padding:40, textAlign:"center", color:"#888" }}>{t("common.loading")}</div>

  const existingCodes = langs.map(l=>l.code)
  const availableSuggestions = suggestions.filter(s=>!existingCodes.includes(s.code))

  return (
    <div style={{ maxWidth:800, margin:"0 auto", padding:24, direction: isAr ? "rtl" : "ltr" }}>
      <Link href={`/${locale}/admin`} style={{ fontSize:13, color:"#888", textDecoration:"none" }}>
        {isAr ? "← العودة" : "← Back"}
      </Link>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8, marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:900, color:"#111", margin:0 }}>{t("store_management.languages")}</h1>
          <p style={{ fontSize:13, color:"#888", margin:"4px 0 0" }}>
            {isAr ? "اللغات المدعومة في المتجر" : "Supported languages in the store"}
          </p>
        </div>
        <button onClick={()=>setShowAdd(true)} style={{ padding:"10px 20px", background:"#FF835E", color:"#fff", border:"none", borderRadius:10, fontWeight:800, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>
          + {isAr ? "إضافة لغة" : "Add Language"}
        </button>
      </div>

      <div style={{ background:"#fff", borderRadius:12, border:"1px solid #eee", overflow:"hidden" }}>
        {langs.map(l => (
          <div key={l.id} style={{ display:"flex", alignItems:"center", padding:16, borderBottom:"1px solid #f5f5f5", gap:14 }}>
            <div style={{ fontSize:32, lineHeight:1 }}>{l.flag || "🌐"}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
                <span style={{ fontSize:15, fontWeight:800, color:"#111" }}>{l.native_name}</span>
                {l.is_default===1 && <span style={{ padding:"3px 9px", background:"#fff5f2", color:"#FF835E", borderRadius:6, fontSize:10, fontWeight:800 }}>
                  {isAr ? "الافتراضية" : "Default"}
                </span>}
                <span style={{ padding:"3px 7px", background:"#f5f5f5", color:"#666", borderRadius:5, fontSize:10, fontWeight:700, textTransform:"uppercase" }}>{l.direction}</span>
              </div>
              <div style={{ fontSize:12, color:"#888" }}>{l.name} • {l.code}</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              {l.is_default!==1 && (
                <button onClick={()=>update(l.id, {is_default:true})} style={{ padding:"6px 12px", background:"#fff", border:"1px solid #ddd", borderRadius:7, cursor:"pointer", fontSize:11, fontFamily:"inherit", fontWeight:700, color:"#666" }}>
                  {isAr ? "اجعلها افتراضية" : "Set default"}
                </button>
              )}
              <label style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}>
                <input type="checkbox" checked={l.is_enabled===1} onChange={e=>update(l.id, {is_enabled:e.target.checked})} style={{ width:18, height:18, cursor:"pointer", accentColor:"#FF835E" }} />
                <span style={{ fontSize:12, color:"#666", fontWeight:600 }}>
                  {isAr ? "مفعّلة" : "Enabled"}
                </span>
              </label>
              {l.is_default!==1 && (
                <button onClick={()=>remove(l.id)} style={{ width:32, height:32, background:"#fff0f0", color:"#dc2626", border:"1px solid #fed7d7", borderRadius:7, cursor:"pointer", fontWeight:800 }}>✕</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={e=>e.target===e.currentTarget && setShowAdd(false)}>
          <div style={{ background:"#fff", borderRadius:14, padding:24, maxWidth:500, width:"100%", maxHeight:"80vh", overflowY:"auto" }}>
            <h2 style={{ fontSize:18, fontWeight:800, margin:"0 0 16px" }}>
              {isAr ? "اختر لغة" : "Choose a language"}
            </h2>
            {availableSuggestions.length === 0 ? (
              <p style={{ fontSize:13, color:"#888", textAlign:"center", padding:20 }}>
                {isAr ? "كل اللغات مضافة" : "All languages added"}
              </p>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {availableSuggestions.map(s => (
                  <button key={s.code} onClick={()=>add(s)} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:"#fafafa", border:"1px solid #eee", borderRadius:10, cursor:"pointer", textAlign: isAr ? "right" : "left" as const, fontFamily:"inherit", transition:"all .15s" }} onMouseEnter={e=>(e.currentTarget.style.background="#fff5f2")} onMouseLeave={e=>(e.currentTarget.style.background="#fafafa")}>
                    <span style={{ fontSize:24 }}>{s.flag}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, fontWeight:700, color:"#111" }}>{s.native_name}</div>
                      <div style={{ fontSize:11, color:"#888" }}>{s.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <button onClick={()=>setShowAdd(false)} style={{ marginTop:14, padding:"9px 18px", background:"#f5f5f5", border:"none", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"inherit", width:"100%" }}>{t("common.cancel")}</button>
          </div>
        </div>
      )}
    </div>
  )
}