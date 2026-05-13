"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"

interface PolicyItem { id:number; slug:string; title:string; is_published:number; updated_at:number }
interface PolicyFull extends PolicyItem { content:string; title_en?:string; content_en?:string }

export default function PoliciesPage() {
  const t = useTranslations()
  const locale = useLocale()
  const isAr = locale === "ar"

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [policies, setPolicies] = useState<PolicyItem[]>([])
  const [editing, setEditing] = useState<PolicyFull|null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newPolicy, setNewPolicy] = useState({ slug:"", title:"", title_en:"", content:"", content_en:"" })

  useEffect(() => { load() }, [locale])

  const load = async () => {
    try {
      const r = await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/policies?locale=" + (isAr ? "sa-ar" : "sa-en"))
      const d = await r.json()
      setPolicies(d.policies || [])
    } catch {}
    setLoading(false)
  }

  const openEdit = async (p: PolicyItem) => {
    try {
      const [resAr, resEn] = await Promise.all([
        fetch("${process.env.NEXT_PUBLIC_API_URL}/api/policies/"+p.slug+"?locale=sa-ar").then(r=>r.json()),
        fetch("${process.env.NEXT_PUBLIC_API_URL}/api/policies/"+p.slug+"?locale=sa-en").then(r=>r.json()),
      ])
      setEditing({
        ...resAr,
        title_en: resEn.title || "",
        content_en: resEn.content || ""
      })
    } catch {}
  }

  const save = async () => {
    if (!editing) return
    setSaving(true)
    try {
      await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/policies/"+editing.id, {
        method:"PUT", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          title: editing.title,
          title_en: editing.title_en,
          content: editing.content,
          content_en: editing.content_en,
          is_published: editing.is_published===1
        })
      })
      setEditing(null)
      load()
      alert(t("common.success"))
    } catch { alert(t("common.error")) }
    setSaving(false)
  }

  const addPolicy = async () => {
    if (!newPolicy.slug || !newPolicy.title) { alert(t("common.error")); return }
    try {
      await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/policies", {
        method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(newPolicy)
      })
      setShowAdd(false)
      setNewPolicy({slug:"",title:"",title_en:"",content:"",content_en:""})
      load()
    } catch { alert(t("common.error")) }
  }

  const remove = async (id:number) => {
    if (!confirm(t("common.confirm_delete"))) return
    await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/policies/"+id, { method:"DELETE" })
    load()
  }

  const insertHTML = (html: string) => {
    if (!editing) return
    if (isAr) {
      setEditing({...editing, content: editing.content + html})
    } else {
      setEditing({...editing, content_en: (editing.content_en || "") + html})
    }
  }

  if (loading) return <div style={{ padding:40, textAlign:"center", color:"#888" }}>{t("common.loading")}</div>

  const currentTitle = editing && (isAr ? editing.title : (editing.title_en || ""))
  const currentContent = editing && (isAr ? editing.content : (editing.content_en || ""))

  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:24, direction: isAr ? "rtl" : "ltr" }}>
      <Link href={`/${locale}/admin`} style={{ fontSize:13, color:"#888", textDecoration:"none" }}>
        {isAr ? "← العودة" : "← Back"}
      </Link>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8, marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:900, color:"#111", margin:0 }}>{t("policies_page.title")}</h1>
          <p style={{ fontSize:13, color:"#888", margin:"4px 0 0" }}>{t("policies_page.subtitle")}</p>
        </div>
        <button onClick={()=>setShowAdd(true)} style={{ padding:"10px 20px", background:"#FF835E", color:"#fff", border:"none", borderRadius:10, fontWeight:800, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>
          + {t("policies_page.new_policy")}
        </button>
      </div>

      <div style={{ background:"#fff", borderRadius:12, border:"1px solid #eee", overflow:"hidden" }}>
        {policies.map(p => (
          <div key={p.id} style={{ display:"flex", alignItems:"center", padding:14, borderBottom:"1px solid #f5f5f5", gap:12 }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                <h3 style={{ fontSize:14, fontWeight:700, color:"#111", margin:0 }}>{p.title}</h3>
                {p.is_published===1 ? <span style={{ padding:"2px 8px", background:"#dcfce7", color:"#166534", borderRadius:5, fontSize:10, fontWeight:800 }}>{t("common.published")}</span>
                : <span style={{ padding:"2px 8px", background:"#f5f5f5", color:"#888", borderRadius:5, fontSize:10, fontWeight:800 }}>{t("common.draft")}</span>}
              </div>
              <div style={{ fontSize:11, color:"#888" }}>/{p.slug}</div>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <a href={"https://klafstore.com/sa-" + locale + "/policy/"+p.slug} target="_blank" style={{ padding:"7px 12px", background:"#f5f5f5", color:"#333", border:"none", borderRadius:7, cursor:"pointer", fontSize:11, fontWeight:700, textDecoration:"none" }}>{t("common.view")}</a>
              <button onClick={()=>openEdit(p)} style={{ padding:"7px 14px", background:"#FF835E", color:"#fff", border:"none", borderRadius:7, cursor:"pointer", fontWeight:700, fontSize:11, fontFamily:"inherit" }}>{t("common.edit")}</button>
              <button onClick={()=>remove(p.id)} style={{ width:32, background:"#fff0f0", color:"#dc2626", border:"1px solid #fed7d7", borderRadius:7, cursor:"pointer", fontWeight:800 }}>✕</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal تعديل */}
      {editing && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:500, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:20, overflowY:"auto" }} onClick={e=>e.target===e.currentTarget && setEditing(null)}>
          <div style={{ background:"#fff", borderRadius:14, padding:24, maxWidth:800, width:"100%", marginTop:20, marginBottom:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <h2 style={{ fontSize:18, fontWeight:800, margin:0 }}>{t("policies_page.edit_policy")}: {editing.title}</h2>
              <button onClick={()=>setEditing(null)} style={{ background:"#f5f5f5", border:"none", width:30, height:30, borderRadius:7, cursor:"pointer", fontSize:14 }}>✕</button>
            </div>

            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:700, color:"#333", display:"block", marginBottom:5 }}>{t("common.title")}</label>
              <input value={currentTitle || ""} onChange={e=>{
                if (isAr) setEditing({...editing, title:e.target.value})
                else setEditing({...editing, title_en:e.target.value})
              }} style={{ width:"100%", padding:"10px 12px", border:"1px solid #ddd", borderRadius:8, fontSize:14, fontFamily:"inherit" }} dir={isAr ? "rtl" : "ltr"} />
            </div>

            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:700, color:"#333", display:"block", marginBottom:5 }}>{t("policies_page.content")}</label>
              <div style={{ display:"flex", gap:4, marginBottom:6, flexWrap:"wrap" }}>
                {[
                  {l: "H2", h: isAr ? "<h2>عنوان</h2>" : "<h2>Heading</h2>"},
                  {l: "H3", h: isAr ? "<h3>عنوان</h3>" : "<h3>Heading</h3>"},
                  {l: isAr ? "فقرة" : "Paragraph", h: isAr ? "<p>نص الفقرة</p>" : "<p>Paragraph text</p>"},
                  {l: isAr ? "قائمة" : "List", h: "<ul><li>Item 1</li><li>Item 2</li></ul>"},
                ].map(b => (
                  <button key={b.l} onClick={()=>insertHTML(b.h)} style={{ padding:"5px 10px", background:"#f5f5f5", border:"1px solid #ddd", borderRadius:6, cursor:"pointer", fontSize:11, fontFamily:"inherit", fontWeight:600, color:"#666" }}>+ {b.l}</button>
                ))}
              </div>
              <textarea value={currentContent || ""} onChange={e=>{
                if (isAr) setEditing({...editing, content:e.target.value})
                else setEditing({...editing, content_en:e.target.value})
              }} rows={16} style={{ width:"100%", padding:"12px 14px", border:"1px solid #ddd", borderRadius:8, fontSize:13, fontFamily:"monospace", resize:"vertical", lineHeight:1.6 }} dir={isAr ? "rtl" : "ltr"} />
            </div>

            <div style={{ marginBottom:14 }}>
              <p style={{ fontSize:11, fontWeight:800, color:"#aaa", letterSpacing:1, marginBottom:8 }}>{t("policies_page.preview")}</p>
              <div style={{ padding:"14px 18px", background:"#fafafa", borderRadius:10, border:"1px solid #eee", maxHeight:200, overflowY:"auto" }} dangerouslySetInnerHTML={{__html: currentContent || ""}} />
            </div>

            <label style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderTop:"1px solid #f0f0f0", cursor:"pointer" }}>
              <span style={{ fontSize:13, fontWeight:600, color:"#111" }}>{t("policies_page.is_published")}</span>
              <input type="checkbox" checked={editing.is_published===1} onChange={e=>setEditing({...editing, is_published:e.target.checked?1:0})} style={{ width:18, height:18, cursor:"pointer", accentColor:"#FF835E" }} />
            </label>

            <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:14 }}>
              <button onClick={()=>setEditing(null)} style={{ padding:"10px 20px", background:"#f5f5f5", color:"#333", border:"none", borderRadius:8, cursor:"pointer", fontWeight:700, fontFamily:"inherit", fontSize:13 }}>{t("common.cancel")}</button>
              <button onClick={save} disabled={saving} style={{ padding:"10px 24px", background:"#FF835E", color:"#fff", border:"none", borderRadius:8, cursor:"pointer", fontWeight:800, fontFamily:"inherit", fontSize:13 }}>{saving ? t("common.saving") : t("common.save")}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal إضافة */}
      {showAdd && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={e=>e.target===e.currentTarget && setShowAdd(false)}>
          <div style={{ background:"#fff", borderRadius:14, padding:24, maxWidth:500, width:"100%" }}>
            <h2 style={{ fontSize:18, fontWeight:800, marginBottom:16 }}>{t("policies_page.new_policy")}</h2>
            <input value={newPolicy.slug} onChange={e=>setNewPolicy({...newPolicy,slug:e.target.value})} placeholder={isAr ? "slug (مثل: warranty)" : "slug (e.g. warranty)"} style={{ width:"100%", padding:"10px 12px", border:"1px solid #ddd", borderRadius:8, fontSize:14, fontFamily:"inherit", marginBottom:10 }} />
            <input value={newPolicy.title} onChange={e=>setNewPolicy({...newPolicy,title:e.target.value})} placeholder={isAr ? "العنوان (عربي)" : "Title (Arabic)"} style={{ width:"100%", padding:"10px 12px", border:"1px solid #ddd", borderRadius:8, fontSize:14, fontFamily:"inherit", marginBottom:10 }} dir="rtl" />
            <input value={newPolicy.title_en} onChange={e=>setNewPolicy({...newPolicy,title_en:e.target.value})} placeholder="Title (English)" style={{ width:"100%", padding:"10px 12px", border:"1px solid #ddd", borderRadius:8, fontSize:14, fontFamily:"inherit", marginBottom:10 }} />
            <textarea value={newPolicy.content} onChange={e=>setNewPolicy({...newPolicy,content:e.target.value})} placeholder={isAr ? "<p>محتوى عربي...</p>" : "<p>Arabic content...</p>"} rows={4} style={{ width:"100%", padding:"10px 12px", border:"1px solid #ddd", borderRadius:8, fontSize:13, fontFamily:"monospace", resize:"vertical", marginBottom:10 }} dir="rtl" />
            <textarea value={newPolicy.content_en} onChange={e=>setNewPolicy({...newPolicy,content_en:e.target.value})} placeholder="<p>English content...</p>" rows={4} style={{ width:"100%", padding:"10px 12px", border:"1px solid #ddd", borderRadius:8, fontSize:13, fontFamily:"monospace", resize:"vertical" }} />
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:14 }}>
              <button onClick={()=>setShowAdd(false)} style={{ padding:"9px 18px", background:"#f5f5f5", color:"#333", border:"none", borderRadius:8, cursor:"pointer", fontWeight:700, fontFamily:"inherit", fontSize:13 }}>{t("common.cancel")}</button>
              <button onClick={addPolicy} style={{ padding:"9px 22px", background:"#FF835E", color:"#fff", border:"none", borderRadius:8, cursor:"pointer", fontWeight:800, fontFamily:"inherit", fontSize:13 }}>{t("common.add")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}