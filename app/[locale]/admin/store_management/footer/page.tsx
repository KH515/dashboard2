"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"

interface FooterLink { label: string; href: string }
interface FooterColumn { title: string; links: FooterLink[] }
interface SocialLink { platform: string; url: string }
interface Contact { phone: string; email: string; address: string }

export default function FooterSettings() {
  const t = useTranslations()
  const locale = useLocale()
  const isAr = locale === "ar"

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState<"columns"|"social"|"contact"|"general">("columns")

  const [columns, setColumns] = useState<FooterColumn[]>([])
  const [contact, setContact] = useState<Contact>({phone:"",email:"",address:""})
  const [copyright, setCopyright] = useState("")
  const [columnsEn, setColumnsEn] = useState<FooterColumn[]>([])
  const [contactEn, setContactEn] = useState<Contact>({phone:"",email:"",address:""})
  const [copyrightEn, setCopyrightEn] = useState("")
  const [social, setSocial] = useState<SocialLink[]>([])
  const [showFooter, setShowFooter] = useState(true)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const [resAr, resEn] = await Promise.all([
        fetch("${process.env.NEXT_PUBLIC_API_URL}/api/footer?locale=sa-ar").then(r => r.json()),
        fetch("${process.env.NEXT_PUBLIC_API_URL}/api/footer?locale=sa-en").then(r => r.json()),
      ])
      setColumns(resAr.columns || [])
      setContact(resAr.contact || {phone:"",email:"",address:""})
      setCopyright(resAr.copyright || "")
      setColumnsEn(resEn.columns || [])
      setContactEn(resEn.contact || {phone:"",email:"",address:""})
      setCopyrightEn(resEn.copyright || "")
      setSocial(resAr.social_links || [])
      setShowFooter(resAr.show_footer !== "false" && resAr.show_footer !== false)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const save = async () => {
    setSaving(true)
    try {
      await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          columns: { value: columns, value_en: columnsEn },
          contact: { value: contact, value_en: contactEn },
          copyright: { value: copyright, value_en: copyrightEn },
          social_links: social,
          show_footer: String(showFooter)
        })
      })
      alert(t("common.success"))
    } catch { alert(t("common.error")) }
    setSaving(false)
  }

  if (loading) return <div style={{ padding:40, textAlign:"center", color:"#888" }}>{t("common.loading")}</div>

  // البيانات حسب لغة الـ URL
  const currentColumns = isAr ? columns : columnsEn
  const setCurrentColumns = isAr ? setColumns : setColumnsEn
  const currentContact = isAr ? contact : contactEn
  const setCurrentContact = isAr ? setContact : setContactEn
  const currentCopyright = isAr ? copyright : copyrightEn
  const setCurrentCopyright = isAr ? setCopyright : setCopyrightEn

  const platforms = ["instagram","twitter","tiktok","facebook","snapchat","youtube","whatsapp"]

  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:24, direction: isAr ? "rtl" : "ltr" }}>
      <Link href={`/${locale}/admin`} style={{ fontSize:13, color:"#888", textDecoration:"none", marginBottom:8, display:"inline-block" }}>
        {isAr ? "← العودة" : "← Back"}
      </Link>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:900, color:"#111", margin:0 }}>{t("footer_page.title")}</h1>
          <p style={{ fontSize:13, color:"#888", margin:"4px 0 0" }}>{t("footer_page.subtitle")}</p>
        </div>
        <button onClick={save} disabled={saving} style={{ padding:"10px 24px", background:"#FF835E", color:"#fff", border:"none", borderRadius:10, fontWeight:800, cursor:"pointer", fontSize:14, opacity:saving?.6:1 }}>
          {saving ? t("common.saving") : t("common.save")}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:4, marginBottom:20, borderBottom:"1px solid #eee", flexWrap:"wrap" }}>
        {[
          {k:"columns",l: t("footer_page.columns"), c: currentColumns.length},
          {k:"social",l: t("footer_page.social"), c: social.length},
          {k:"contact",l: t("footer_page.contact"), c: 0},
          {k:"general",l: t("footer_page.general"), c: 0}
        ].map(tab2 => (
          <button key={tab2.k} onClick={()=>setTab(tab2.k as any)} style={{ padding:"12px 18px", background:"transparent", border:"none", borderBottom: tab===tab2.k?"2px solid #FF835E":"2px solid transparent", color: tab===tab2.k?"#FF835E":"#666", fontWeight:700, cursor:"pointer", fontSize:13 }}>
            {tab2.l} {tab2.c>0 && <span style={{ marginRight:6, marginLeft:6, padding:"2px 7px", background:"#fff0eb", color:"#FF835E", borderRadius:10, fontSize:11 }}>{tab2.c}</span>}
          </button>
        ))}
      </div>

      {tab==="columns" && (
        <div style={{ background:"#fff", borderRadius:12, padding:20, border:"1px solid #eee" }}>
          <p style={{ fontSize:13, color:"#666", marginBottom:16 }}>
            {isAr ? "أعمدة الروابط في الفوتر" : "Footer link columns"}
          </p>
          {currentColumns.map((col, ci) => (
            <div key={ci} style={{ marginBottom:16, padding:14, background:"#fafafa", borderRadius:10 }}>
              <div style={{ display:"flex", gap:8, marginBottom:10 }}>
                <input value={col.title} placeholder={t("footer_page.column_title")} onChange={e=>{const n=[...currentColumns];n[ci].title=e.target.value;setCurrentColumns(n)}}
                  style={{ flex:1, padding:"9px 12px", border:"1px solid #ddd", borderRadius:7, fontSize:14, fontWeight:700, fontFamily:"inherit" }} dir={isAr ? "rtl" : "ltr"} />
                <button onClick={()=>setCurrentColumns(currentColumns.filter((_,i)=>i!==ci))} style={{ width:40, background:"#fff0f0", color:"#dc2626", border:"1px solid #fed7d7", borderRadius:7, cursor:"pointer", fontWeight:800 }}>✕</button>
              </div>
              {col.links.map((link, li) => (
                <div key={li} style={{ display:"flex", gap:6, marginBottom:6, paddingRight:8, paddingLeft:8 }}>
                  <input value={link.label} placeholder={t("footer_page.link_label")} onChange={e=>{const n=[...currentColumns];n[ci].links[li].label=e.target.value;setCurrentColumns(n)}}
                    style={{ flex:1, padding:"7px 10px", border:"1px solid #ddd", borderRadius:6, fontSize:12, fontFamily:"inherit" }} dir={isAr ? "rtl" : "ltr"} />
                  <input value={link.href} placeholder="/about" onChange={e=>{const n=[...currentColumns];n[ci].links[li].href=e.target.value;setCurrentColumns(n)}}
                    style={{ flex:1, padding:"7px 10px", border:"1px solid #ddd", borderRadius:6, fontSize:12, fontFamily:"inherit" }} />
                  <button onClick={()=>{const n=[...currentColumns];n[ci].links=n[ci].links.filter((_,i)=>i!==li);setCurrentColumns(n)}} style={{ width:30, background:"#fff0f0", color:"#dc2626", border:"1px solid #fed7d7", borderRadius:6, cursor:"pointer", fontSize:11 }}>✕</button>
                </div>
              ))}
              <button onClick={()=>{const n=[...currentColumns];n[ci].links.push({label:"",href:""});setCurrentColumns(n)}} style={{ marginTop:6, padding:"6px 12px", background:"#fff", color:"#FF835E", border:"1px dashed #FF835E", borderRadius:6, cursor:"pointer", fontSize:12, fontFamily:"inherit", fontWeight:700 }}>
                + {t("footer_page.add_link")}
              </button>
            </div>
          ))}
          <button onClick={()=>setCurrentColumns([...currentColumns,{title:"",links:[]}])} style={{ padding:"10px 16px", background:"#fff5f2", color:"#FF835E", border:"1px dashed #FF835E", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"inherit" }}>
            + {t("footer_page.add_column")}
          </button>
        </div>
      )}

      {tab==="social" && (
        <div style={{ background:"#fff", borderRadius:12, padding:20, border:"1px solid #eee" }}>
          {social.map((s, i) => (
            <div key={i} style={{ display:"flex", gap:8, marginBottom:8 }}>
              <select value={s.platform} onChange={e=>{const n=[...social];n[i].platform=e.target.value;setSocial(n)}}
                style={{ width:140, padding:"9px 12px", border:"1px solid #ddd", borderRadius:7, fontSize:13, fontFamily:"inherit" }}>
                {platforms.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <input value={s.url} placeholder="https://..." onChange={e=>{const n=[...social];n[i].url=e.target.value;setSocial(n)}}
                style={{ flex:1, padding:"9px 12px", border:"1px solid #ddd", borderRadius:7, fontSize:13, fontFamily:"inherit" }} />
              <button onClick={()=>setSocial(social.filter((_,j)=>j!==i))} style={{ width:40, background:"#fff0f0", color:"#dc2626", border:"1px solid #fed7d7", borderRadius:7, cursor:"pointer", fontWeight:800 }}>✕</button>
            </div>
          ))}
          <button onClick={()=>setSocial([...social,{platform:"instagram",url:""}])} style={{ marginTop:8, padding:"10px 16px", background:"#fff5f2", color:"#FF835E", border:"1px dashed #FF835E", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"inherit" }}>
            + {t("footer_page.add_social")}
          </button>
        </div>
      )}

      {tab==="contact" && (
        <div style={{ background:"#fff", borderRadius:12, padding:20, border:"1px solid #eee", display:"flex", flexDirection:"column", gap:12 }}>
          <div>
            <label style={{ fontSize:13, fontWeight:700, color:"#333", display:"block", marginBottom:6 }}>{t("footer_page.phone")}</label>
            <input value={currentContact.phone} onChange={e=>setCurrentContact({...currentContact,phone:e.target.value})} placeholder="+966..." style={{ width:"100%", padding:"10px 12px", border:"1px solid #ddd", borderRadius:8, fontSize:14, fontFamily:"inherit" }} />
          </div>
          <div>
            <label style={{ fontSize:13, fontWeight:700, color:"#333", display:"block", marginBottom:6 }}>{t("footer_page.email")}</label>
            <input value={currentContact.email} onChange={e=>setCurrentContact({...currentContact,email:e.target.value})} placeholder="info@..." style={{ width:"100%", padding:"10px 12px", border:"1px solid #ddd", borderRadius:8, fontSize:14, fontFamily:"inherit" }} />
          </div>
          <div>
            <label style={{ fontSize:13, fontWeight:700, color:"#333", display:"block", marginBottom:6 }}>{t("footer_page.address")}</label>
            <input value={currentContact.address} onChange={e=>setCurrentContact({...currentContact,address:e.target.value})} placeholder={isAr ? "الرياض، السعودية" : "Riyadh, Saudi Arabia"} style={{ width:"100%", padding:"10px 12px", border:"1px solid #ddd", borderRadius:8, fontSize:14, fontFamily:"inherit" }} dir={isAr ? "rtl" : "ltr"} />
          </div>
        </div>
      )}

      {tab==="general" && (
        <div style={{ background:"#fff", borderRadius:12, padding:20, border:"1px solid #eee" }}>
          <label style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:"1px solid #f5f5f5", cursor:"pointer" }}>
            <span style={{ fontSize:14, fontWeight:600, color:"#111" }}>{t("footer_page.show_footer")}</span>
            <input type="checkbox" checked={showFooter} onChange={e=>setShowFooter(e.target.checked)} style={{ width:18, height:18, cursor:"pointer", accentColor:"#FF835E" }} />
          </label>
          <div style={{ marginTop:14 }}>
            <label style={{ fontSize:13, fontWeight:700, color:"#333", display:"block", marginBottom:6 }}>{t("footer_page.copyright")}</label>
            <input value={currentCopyright} onChange={e=>setCurrentCopyright(e.target.value)} style={{ width:"100%", padding:"10px 12px", border:"1px solid #ddd", borderRadius:8, fontSize:14, fontFamily:"inherit" }} dir={isAr ? "rtl" : "ltr"} />
          </div>
        </div>
      )}
    </div>
  )
}