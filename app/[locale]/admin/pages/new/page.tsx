"use client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

const CATEGORIES = [
  { key: "ads", label: "إعلانات" },
  { key: "categories", label: "تصنيفات" },
  { key: "brands", label: "علامات تجارية" },
  { key: "blog", label: "مدونة" },
  { key: "static", label: "صفحة ثابتة" },
]

export default function NewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultCat = searchParams.get("cat") || "static"

  const [tab, setTab] = useState("basic")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [desc, setDesc] = useState("")
  const [category, setCategory] = useState(defaultCat)

  const [metaTitle, setMetaTitle] = useState("")
  const [metaDesc, setMetaDesc] = useState("")
  const [metaImage, setMetaImage] = useState("")
  const [metaKeywords, setMetaKeywords] = useState("")
  const [canonical, setCanonical] = useState("")
  const [robots, setRobots] = useState("index, follow")

  const [ogTitle, setOgTitle] = useState("")
  const [ogDesc, setOgDesc] = useState("")
  const [ogImage, setOgImage] = useState("")

  const [twCard, setTwCard] = useState("summary_large_image")
  const [twTitle, setTwTitle] = useState("")
  const [twDesc, setTwDesc] = useState("")
  const [twImage, setTwImage] = useState("")

  const [schemaType, setSchemaType] = useState("WebPage")

  const inp = { width:"100%", padding:"11px 14px", background:"#f8f8f8", border:"1px solid #e5e5e5", borderRadius:"10px", color:"#111", fontSize:"13px", outline:"none", fontFamily:"ThmanyahSans,system-ui,sans-serif", boxSizing:"border-box" as const, marginBottom:"10px" }
  const label = { fontSize:"11px", color:"#888", fontWeight:"700", display:"block", marginBottom:"5px" }

  const save = async () => {
    if (!title || !slug) { setError("العنوان والـ slug مطلوبان"); return }
    setSaving(true); setError("")
    const res = await fetch("/api/admin/pages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, description: desc, category, meta_title: metaTitle||title, meta_description: metaDesc||desc, meta_image: metaImage, meta_keywords: metaKeywords, canonical, robots, og_title: ogTitle||title, og_description: ogDesc||desc, og_image: ogImage||metaImage, twitter_card: twCard, twitter_title: twTitle||title, twitter_description: twDesc||desc, twitter_image: twImage||ogImage||metaImage, schema_type: schemaType })
    })
    const data = await res.json()
    if (res.ok) router.push("/admin/pages/" + data.page.id)
    else { setError(data.error || "حدث خطأ"); setSaving(false) }
  }

  const TABS = [{ key:"basic",label:"أساسي" },{ key:"seo",label:"SEO" },{ key:"og",label:"سوشيال" },{ key:"advanced",label:"متقدم" }]

  return (
    <div style={{ minHeight:"100vh",background:"#EEEEEE",color:"#111",fontFamily:"ThmanyahSans,system-ui,sans-serif",direction:"rtl" }}>
      <div style={{ padding:"14px 20px",borderBottom:"1px solid #ddd",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:"#fff",zIndex:10,boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
        <Link href="/admin/pages" style={{ color:"#888",fontSize:"13px",textDecoration:"none" }}>← رجوع</Link>
        <span style={{ fontWeight:"700",fontSize:"15px" }}>صفحة جديدة</span>
        <button onClick={save} disabled={saving} style={{ background:"#FF835E",color:"#111",border:"none",padding:"8px 18px",borderRadius:"9px",fontWeight:"800",fontSize:"13px",cursor:saving?"not-allowed":"pointer",fontFamily:"ThmanyahSans,system-ui,sans-serif" }}>{saving?"جاري...":"نشر"}</button>
      </div>

      {/* TABS */}
      <div style={{ display:"flex",background:"#fff",borderBottom:"1px solid #ddd" }}>
        {TABS.map(t => <button key={t.key} onClick={()=>setTab(t.key)} style={{ flex:1,padding:"12px",background:"transparent",border:"none",borderBottom:tab===t.key?"2px solid #FF835E":"2px solid transparent",color:tab===t.key?"#FF835E":"#888",cursor:"pointer",fontFamily:"ThmanyahSans,system-ui,sans-serif",fontSize:"13px",fontWeight:"700" }}>{t.label}</button>)}
      </div>

      <div style={{ padding:"16px",maxWidth:"600px",margin:"0 auto" }}>
        {error && <div style={{ background:"#fff0f0",border:"1px solid #fecaca",color:"#e53e3e",padding:"12px 16px",borderRadius:"10px",marginBottom:"12px",fontSize:"13px" }}>{error}</div>}

        {/* BASIC */}
        {tab==="basic" && (
          <div>
            <div style={{ background:"#fff",borderRadius:"14px",padding:"16px",marginBottom:"12px",border:"1px solid #e5e5e5" }}>
              <p style={{ fontWeight:"800",fontSize:"14px",margin:"0 0 14px",color:"#111" }}>معلومات الصفحة</p>
              <label style={label}>عنوان الصفحة *</label>
              <input value={title} onChange={e=>{setTitle(e.target.value);if(!slug)setSlug(e.target.value.toLowerCase().replace(/\s+/g,"-").replace(/[^\w-]/g,""))}} placeholder="مثال: صفحة الأقسام" style={inp} />
              <label style={label}>الرابط (slug) *</label>
              <input value={slug} onChange={e=>setSlug(e.target.value)} placeholder="مثال: categories" style={inp} />
              <label style={label}>الوصف</label>
              <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="وصف قصير للصفحة" rows={3} style={{ ...inp, resize:"none" as const }} />
            </div>
            <div style={{ background:"#fff",borderRadius:"14px",padding:"16px",border:"1px solid #e5e5e5" }}>
              <p style={{ fontWeight:"800",fontSize:"14px",margin:"0 0 14px",color:"#111" }}>التصنيف</p>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px" }}>
                {CATEGORIES.map(cat => <button key={cat.key} onClick={()=>setCategory(cat.key)} style={{ padding:"10px",background:category===cat.key?"#FF835E":"#f8f8f8",color:category===cat.key?"#fff":"#555",border:category===cat.key?"1px solid #FF835E":"1px solid #e5e5e5",borderRadius:"10px",cursor:"pointer",fontFamily:"ThmanyahSans,system-ui,sans-serif",fontSize:"12px",fontWeight:"700" }}>{cat.label}</button>)}
              </div>
            </div>
          </div>
        )}

        {/* SEO */}
        {tab==="seo" && (
          <div style={{ background:"#fff",borderRadius:"14px",padding:"16px",border:"1px solid #e5e5e5" }}>
            <p style={{ fontWeight:"800",fontSize:"14px",margin:"0 0 4px",color:"#111" }}>إعدادات SEO</p>
            <p style={{ fontSize:"11px",color:"#888",margin:"0 0 14px" }}>اتركها فارغة وستُحسب تلقائياً من العنوان والوصف</p>
            <label style={label}>Meta Title</label>
            <input value={metaTitle} onChange={e=>setMetaTitle(e.target.value)} placeholder={title||"عنوان الصفحة في Google"} style={inp} />
            <label style={label}>Meta Description</label>
            <textarea value={metaDesc} onChange={e=>setMetaDesc(e.target.value)} placeholder={desc||"وصف الصفحة في Google (150-160 حرف)"} rows={3} style={{ ...inp, resize:"none" as const }} />
            <label style={label}>Meta Keywords</label>
            <input value={metaKeywords} onChange={e=>setMetaKeywords(e.target.value)} placeholder="كلمة1, كلمة2, كلمة3" style={inp} />
            <label style={label}>Meta Image (رابط الصورة)</label>
            <input value={metaImage} onChange={e=>setMetaImage(e.target.value)} placeholder="https://cdn.klafstore.com/..." style={inp} />
            <label style={label}>Canonical URL</label>
            <input value={canonical} onChange={e=>setCanonical(e.target.value)} placeholder={"https://klafstore.com/page/"+slug} style={inp} />
            <label style={label}>Robots</label>
            <select value={robots} onChange={e=>setRobots(e.target.value)} style={{ ...inp, marginBottom:0 }}>
              <option value="index, follow">index, follow (افتراضي)</option>
              <option value="noindex, follow">noindex, follow</option>
              <option value="index, nofollow">index, nofollow</option>
              <option value="noindex, nofollow">noindex, nofollow</option>
            </select>
          </div>
        )}

        {/* SOCIAL */}
        {tab==="og" && (
          <div>
            <div style={{ background:"#fff",borderRadius:"14px",padding:"16px",marginBottom:"12px",border:"1px solid #e5e5e5" }}>
              <p style={{ fontWeight:"800",fontSize:"14px",margin:"0 0 4px",color:"#111" }}>Open Graph (واتساب، فيسبوك، سناب)</p>
              <p style={{ fontSize:"11px",color:"#888",margin:"0 0 14px" }}>اتركها فارغة وستُحسب من الـ SEO تلقائياً</p>
              <label style={label}>OG Title</label>
              <input value={ogTitle} onChange={e=>setOgTitle(e.target.value)} placeholder={metaTitle||title} style={inp} />
              <label style={label}>OG Description</label>
              <textarea value={ogDesc} onChange={e=>setOgDesc(e.target.value)} placeholder={metaDesc||desc} rows={3} style={{ ...inp, resize:"none" as const }} />
              <label style={label}>OG Image</label>
              <input value={ogImage} onChange={e=>setOgImage(e.target.value)} placeholder={metaImage||"https://cdn.klafstore.com/..."} style={inp} />
            </div>
            <div style={{ background:"#fff",borderRadius:"14px",padding:"16px",border:"1px solid #e5e5e5" }}>
              <p style={{ fontWeight:"800",fontSize:"14px",margin:"0 0 4px",color:"#111" }}>Twitter / X</p>
              <label style={label}>Twitter Card</label>
              <select value={twCard} onChange={e=>setTwCard(e.target.value)} style={{ ...inp }}>
              <option value="summary_large_image">صورة كبيرة (summary_large_image)</option>
              <option value="summary">ملخص (summary)</option>
              </select>
              <label style={label}>Twitter Title</label>
              <input value={twTitle} onChange={e=>setTwTitle(e.target.value)} placeholder={ogTitle||metaTitle||title} style={inp} />
              <label style={label}>Twitter Description</label>
              <textarea value={twDesc} onChange={e=>setTwDesc(e.target.value)} placeholder={ogDesc||metaDesc||desc} rows={2} style={{ ...inp, resize:"none" as const }} />
              <label style={label}>Twitter Image</label>
              <input value={twImage} onChange={e=>setTwImage(e.target.value)} placeholder={ogImage||metaImage} style={inp} />
            </div>
          </div>
        )}

        {/* ADVANCED */}
        {tab==="advanced" && (
          <div style={{ background:"#fff",borderRadius:"14px",padding:"16px",border:"1px solid #e5e5e5" }}>
            <p style={{ fontWeight:"800",fontSize:"14px",margin:"0 0 14px",color:"#111" }}>إعدادات متقدمة</p>
            <label style={label}>Schema Type</label>
            <select value={schemaType} onChange={e=>setSchemaType(e.target.value)} style={{ ...inp }}>
              <option value="WebPage">WebPage (افتراضي)</option>
              <option value="Article">Article (مقال)</option>
              <option value="Product">Product (منتج)</option>
              <option value="FAQPage">FAQPage (أسئلة شائعة)</option>
              <option value="ContactPage">ContactPage (تواصل)</option>
              <option value="AboutPage">AboutPage (من نحن)</option>
              <option value="CollectionPage">CollectionPage (مجموعة)</option>
            </select>
            <div style={{ background:"#f8f8f8",borderRadius:"10px",padding:"12px 14px",border:"1px solid #e5e5e5",marginTop:"4px" }}>
              <p style={{ fontSize:"11px",color:"#888",margin:0,lineHeight:"1.7" }}>💡 Schema Type يساعد Google على فهم نوع الصفحة وعرضها بشكل أفضل في نتائج البحث</p>
            </div>
          </div>
        )}

        <button onClick={save} disabled={saving} style={{ width:"100%",padding:"14px",marginTop:"12px",background:saving?"#ddd":"#FF835E",color:saving?"#999":"#fff",border:"none",borderRadius:"12px",fontWeight:"800",fontSize:"14px",cursor:saving?"not-allowed":"pointer",fontFamily:"ThmanyahSans,system-ui,sans-serif" }}>{saving?"جاري الحفظ...":"نشر الصفحة"}</button>
      </div>
    </div>
  )
}
