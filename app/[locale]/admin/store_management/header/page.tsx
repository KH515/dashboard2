"use client"
import { useState, useEffect } from "react"
import { useTranslations, useLocale } from "next-intl"

export default function HeaderSettings() {
  const t = useTranslations()
  const locale = useLocale()
  const isAr = locale === "ar"

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState<"search"|"text"|"image"|"toggles">("search")

  // بيانات عربية
  const [searchPhrases, setSearchPhrases] = useState<string[]>([])
  const [textBanners, setTextBanners] = useState<{t1:string;t2:string}[]>([])
  const [imageBanners, setImageBanners] = useState<{src:string;href:string}[]>([])

  // بيانات إنجليزية
  const [searchPhrasesEn, setSearchPhrasesEn] = useState<string[]>([])
  const [textBannersEn, setTextBannersEn] = useState<{t1:string;t2:string}[]>([])

  const [toggles, setToggles] = useState({ show_text_banner:true, show_image_banner:true, show_search:true, show_categories:true })

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const [resAr, resEn] = await Promise.all([
        fetch("${process.env.NEXT_PUBLIC_API_URL}/api/header?locale=sa-ar").then(r => r.json()),
        fetch("${process.env.NEXT_PUBLIC_API_URL}/api/header?locale=sa-en").then(r => r.json()),
      ])
      setSearchPhrases(resAr.search_phrases || [])
      setTextBanners(resAr.text_banners || [])
      setImageBanners(resAr.image_banners || [])
      setSearchPhrasesEn(resEn.search_phrases || [])
      setTextBannersEn(resEn.text_banners || [])
      setToggles({
        show_text_banner: resAr.show_text_banner !== "false" && resAr.show_text_banner !== false,
        show_image_banner: resAr.show_image_banner !== "false" && resAr.show_image_banner !== false,
        show_search: resAr.show_search !== "false" && resAr.show_search !== false,
        show_categories: resAr.show_categories !== "false" && resAr.show_categories !== false,
      })
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const save = async () => {
    setSaving(true)
    try {
      await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/header", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          search_phrases: { value: searchPhrases, value_en: searchPhrasesEn },
          text_banners: { value: textBanners, value_en: textBannersEn },
          image_banners: imageBanners,
          show_text_banner: String(toggles.show_text_banner),
          show_image_banner: String(toggles.show_image_banner),
          show_search: String(toggles.show_search),
          show_categories: String(toggles.show_categories),
        })
      })
      alert(t("common.success"))
    } catch { alert(t("common.error")) }
    setSaving(false)
  }

  const uploadImage = async (file: File): Promise<string> => {
    const fd = new FormData()
    fd.append("file", file)
    fd.append("folder", "banners")
    const res = await fetch("/api/admin/upload", { method:"POST", body:fd })
    const d = await res.json()
    return d.url
  }

  if (loading) return <div style={{ padding:40, textAlign:"center", color:"#888" }}>{t("common.loading")}</div>

  // البيانات حسب لغة الـ URL
  const currentPhrases = isAr ? searchPhrases : searchPhrasesEn
  const setCurrentPhrases = isAr ? setSearchPhrases : setSearchPhrasesEn
  const currentBanners = isAr ? textBanners : textBannersEn
  const setCurrentBanners = isAr ? setTextBanners : setTextBannersEn

  const tabs = [
    { k:"search", l: t("header_page.search_phrases"), c: currentPhrases.length },
    { k:"text", l: t("header_page.text_banner"), c: currentBanners.length },
    { k:"image", l: t("header_page.image_banner"), c: imageBanners.length },
    { k:"toggles", l: t("header_page.toggles"), c: 0 },
  ]

  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:24, direction: isAr ? "rtl" : "ltr" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:900, color:"#111", margin:0 }}>{t("header_page.title")}</h1>
          <p style={{ fontSize:13, color:"#888", margin:"4px 0 0" }}>{t("header_page.subtitle")}</p>
        </div>
        <button onClick={save} disabled={saving} style={{ padding:"10px 24px", background:"#FF835E", color:"#fff", border:"none", borderRadius:10, fontWeight:800, cursor:"pointer", fontSize:14, opacity:saving?.6:1 }}>
          {saving ? t("common.saving") : t("common.save")}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:4, marginBottom:20, borderBottom:"1px solid #eee" }}>
        {tabs.map(tab2 => (
          <button key={tab2.k} onClick={()=>setTab(tab2.k as any)} style={{ padding:"12px 18px", background:"transparent", border:"none", borderBottom: tab===tab2.k?"2px solid #FF835E":"2px solid transparent", color: tab===tab2.k?"#FF835E":"#666", fontWeight:700, cursor:"pointer", fontSize:13 }}>
            {tab2.l} {tab2.c>0 && <span style={{ marginRight:6, marginLeft:6, padding:"2px 7px", background:"#fff0eb", color:"#FF835E", borderRadius:10, fontSize:11 }}>{tab2.c}</span>}
          </button>
        ))}
      </div>

      {tab==="search" && (
        <div style={{ background:"#fff", borderRadius:12, padding:20, border:"1px solid #eee" }}>
          <p style={{ fontSize:13, color:"#666", marginBottom:16 }}>
            {isAr ? "نصوص تتبدل تلقائياً في حقل البحث" : "Texts that rotate automatically in the search field"}
          </p>
          {currentPhrases.map((p, i) => (
            <div key={i} style={{ display:"flex", gap:8, marginBottom:8 }}>
              <input value={p} onChange={e=>{const n=[...currentPhrases];n[i]=e.target.value;setCurrentPhrases(n)}}
                placeholder={isAr ? "ابحث عن أقلام..." : "Search for pens..."}
                style={{ flex:1, padding:"10px 14px", border:"1px solid #ddd", borderRadius:8, fontSize:14, fontFamily:"inherit" }} dir={isAr ? "rtl" : "ltr"} />
              <button onClick={()=>setCurrentPhrases(currentPhrases.filter((_,j)=>j!==i))} style={{ width:40, background:"#fff0f0", color:"#dc2626", border:"1px solid #fed7d7", borderRadius:8, cursor:"pointer", fontWeight:800 }}>✕</button>
            </div>
          ))}
          <button onClick={()=>setCurrentPhrases([...currentPhrases, ""])} style={{ marginTop:8, padding:"10px 16px", background:"#fff5f2", color:"#FF835E", border:"1px dashed #FF835E", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"inherit" }}>
            + {t("header_page.add_search_text")}
          </button>
        </div>
      )}

      {tab==="text" && (
        <div style={{ background:"#fff", borderRadius:12, padding:20, border:"1px solid #eee" }}>
          <p style={{ fontSize:13, color:"#666", marginBottom:16 }}>
            {isAr ? "البنر البرتقالي اللي يتبدل" : "Rotating orange banner"}
          </p>
          {currentBanners.map((b, i) => (
            <div key={i} style={{ display:"flex", gap:8, marginBottom:10, padding:12, background:"#fafafa", borderRadius:10 }}>
              <div style={{ flex:1, display:"flex", flexDirection:"column", gap:6 }}>
                <input value={b.t1} placeholder={isAr ? "العنوان (مثل: توصيل مجاني)" : "Title (e.g. Free Shipping)"} onChange={e=>{const n=[...currentBanners];n[i].t1=e.target.value;setCurrentBanners(n)}}
                  style={{ padding:"9px 12px", border:"1px solid #ddd", borderRadius:7, fontSize:13, fontFamily:"inherit", fontWeight:700 }} dir={isAr ? "rtl" : "ltr"} />
                <input value={b.t2} placeholder={isAr ? "الوصف (مثل: للطلبات +200 ر.س)" : "Description (e.g. Orders +200 SAR)"} onChange={e=>{const n=[...currentBanners];n[i].t2=e.target.value;setCurrentBanners(n)}}
                  style={{ padding:"9px 12px", border:"1px solid #ddd", borderRadius:7, fontSize:13, fontFamily:"inherit" }} dir={isAr ? "rtl" : "ltr"} />
              </div>
              <button onClick={()=>setCurrentBanners(currentBanners.filter((_,j)=>j!==i))} style={{ width:40, background:"#fff0f0", color:"#dc2626", border:"1px solid #fed7d7", borderRadius:8, cursor:"pointer", fontWeight:800 }}>✕</button>
            </div>
          ))}
          <button onClick={()=>setCurrentBanners([...currentBanners, {t1:"",t2:""}])} style={{ marginTop:8, padding:"10px 16px", background:"#fff5f2", color:"#FF835E", border:"1px dashed #FF835E", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"inherit" }}>
            + {t("header_page.add_text_banner")}
          </button>
        </div>
      )}

      {tab==="image" && (
        <div style={{ background:"#fff", borderRadius:12, padding:20, border:"1px solid #eee" }}>
          <p style={{ fontSize:13, color:"#666", marginBottom:16 }}>
            {isAr ? "صور تتبدل بجانب البنر النصي (الحجم المثالي: 320×80)" : "Images that rotate beside the text banner (Optimal size: 320×80)"}
          </p>
          {imageBanners.map((b, i) => (
            <div key={i} style={{ display:"flex", gap:10, marginBottom:10, padding:12, background:"#fafafa", borderRadius:10, alignItems:"center" }}>
              <div style={{ width:100, height:50, background:"#fff", borderRadius:7, overflow:"hidden", flexShrink:0, border:"1px solid #ddd", display:"flex", alignItems:"center", justifyContent:"center" }}>
                {b.src ? <img src={b.src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <span style={{ fontSize:11, color:"#bbb" }}>{isAr ? "لا توجد صورة" : "No image"}</span>}
              </div>
              <div style={{ flex:1, display:"flex", flexDirection:"column", gap:6 }}>
                <input type="file" accept="image/*" onChange={async e=>{
                  const file = e.target.files?.[0]
                  if (!file) return
                  const url = await uploadImage(file)
                  const n=[...imageBanners];n[i].src=url;setImageBanners(n)
                }} style={{ fontSize:12 }} />
                <input value={b.href} placeholder={isAr ? "الرابط (مثل: /category/كتب)" : "Link (e.g. /category/books)"} onChange={e=>{const n=[...imageBanners];n[i].href=e.target.value;setImageBanners(n)}}
                  style={{ padding:"8px 10px", border:"1px solid #ddd", borderRadius:6, fontSize:12, fontFamily:"inherit" }} />
              </div>
              <button onClick={()=>setImageBanners(imageBanners.filter((_,j)=>j!==i))} style={{ width:36, height:36, background:"#fff0f0", color:"#dc2626", border:"1px solid #fed7d7", borderRadius:8, cursor:"pointer", fontWeight:800 }}>✕</button>
            </div>
          ))}
          <button onClick={()=>setImageBanners([...imageBanners, {src:"",href:""}])} style={{ marginTop:8, padding:"10px 16px", background:"#fff5f2", color:"#FF835E", border:"1px dashed #FF835E", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"inherit" }}>
            + {t("header_page.add_image_banner")}
          </button>
        </div>
      )}

      {tab==="toggles" && (
        <div style={{ background:"#fff", borderRadius:12, padding:20, border:"1px solid #eee" }}>
          <p style={{ fontSize:13, color:"#666", marginBottom:16 }}>
            {isAr ? "تحكم بإظهار / إخفاء عناصر الهيدر" : "Control showing/hiding header elements"}
          </p>
          {[
            { k:"show_search", l: t("header_page.show_search") },
            { k:"show_text_banner", l: t("header_page.show_text_banner") },
            { k:"show_image_banner", l: t("header_page.show_image_banner") },
            { k:"show_categories", l: t("header_page.show_categories") },
          ].map(item => (
            <label key={item.k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 12px", borderBottom:"1px solid #f5f5f5", cursor:"pointer" }}>
              <span style={{ fontSize:14, fontWeight:600, color:"#111" }}>{item.l}</span>
              <input type="checkbox" checked={(toggles as any)[item.k]} onChange={e=>setToggles({...toggles, [item.k]:e.target.checked})} style={{ width:18, height:18, cursor:"pointer", accentColor:"#FF835E" }} />
            </label>
          ))}
        </div>
      )}
    </div>
  )
}