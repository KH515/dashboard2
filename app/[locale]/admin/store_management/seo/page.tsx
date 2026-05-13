"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"

export default function SeoPage() {
  const t = useTranslations()
  const locale = useLocale()
  const isAr = locale === "ar"
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState<"general"|"social"|"analytics"|"verification"|"schema"|"advanced">("general")
  const [d, setD] = useState<Record<string,string>>({})

  useEffect(() => { load() }, [])

  const load = async () => {
    try {
      const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/seo")
      setD(await res.json())
    } catch {}
    setLoading(false)
  }

  const save = async () => {
    setSaving(true)
    try {
      await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/seo", {
        method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(d)
      })
      alert(t("common.success"))
    } catch { alert(t("common.error")) }
    setSaving(false)
  }

  const upd = (k:string, v:string) => setD({...d, [k]:v})

  if (loading) return <div style={{ padding:40, textAlign:"center", color:"#888" }}>{t("common.loading")}</div>

  const Field = ({k, l, ph, ml=false, hint=""}:{k:string;l:string;ph?:string;ml?:boolean;hint?:string}) => (
    <div style={{ marginBottom:14 }}>
      <label style={{ fontSize:13, fontWeight:700, color:"#333", display:"block", marginBottom:6 }}>{l}</label>
      {ml ? (
        <textarea value={d[k]||""} onChange={e=>upd(k,e.target.value)} placeholder={ph} rows={3}
          style={{ width:"100%", padding:"10px 12px", border:"1px solid #ddd", borderRadius:8, fontSize:13, fontFamily:"inherit", resize:"vertical" }} dir={isAr ? "rtl" : "ltr"} />
      ) : (
        <input value={d[k]||""} onChange={e=>upd(k,e.target.value)} placeholder={ph}
          style={{ width:"100%", padding:"10px 12px", border:"1px solid #ddd", borderRadius:8, fontSize:14, fontFamily:"inherit" }} dir={isAr ? "rtl" : "ltr"} />
      )}
      {hint && <p style={{ fontSize:11, color:"#888", marginTop:4 }}>{hint}</p>}
    </div>
  )

  const tabs = [
    { k:"general", l: isAr ? "عام" : "General" },
    { k:"social", l: isAr ? "وسائل التواصل" : "Social Media" },
    { k:"analytics", l: isAr ? "التحليلات" : "Analytics" },
    { k:"verification", l: isAr ? "التحقق" : "Verification" },
    { k:"schema", l:"Schema.org" },
    { k:"advanced", l: isAr ? "متقدم" : "Advanced" },
  ]

  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:24, direction: isAr ? "rtl" : "ltr" }}>
      <Link href={`/${locale}/admin`} style={{ fontSize:13, color:"#888", textDecoration:"none" }}>
        {isAr ? "← العودة" : "← Back"}
      </Link>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8, marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:900, color:"#111", margin:0 }}>
            {isAr ? "SEO والنطاق" : "SEO & Domain"}
          </h1>
          <p style={{ fontSize:13, color:"#888", margin:"4px 0 0" }}>
            {isAr ? "تحسين محركات البحث، Analytics، وعناوين الميتا" : "Search engine optimization, Analytics, and Meta tags"}
          </p>
        </div>
        <button onClick={save} disabled={saving} style={{ padding:"10px 24px", background:"#FF835E", color:"#fff", border:"none", borderRadius:10, fontWeight:800, cursor:"pointer", fontSize:14, opacity:saving?.6:1, fontFamily:"inherit" }}>
          {saving ? t("common.saving") : t("common.save")}
        </button>
      </div>

      <div style={{ display:"flex", gap:4, marginBottom:20, borderBottom:"1px solid #eee", overflowX:"auto" }}>
        {tabs.map(tt => (
          <button key={tt.k} onClick={()=>setTab(tt.k as any)} style={{ padding:"12px 18px", background:"transparent", border:"none", borderBottom:tab===tt.k?"2px solid #FF835E":"2px solid transparent", color:tab===tt.k?"#FF835E":"#666", fontWeight:700, cursor:"pointer", fontSize:13, whiteSpace:"nowrap", fontFamily:"inherit" }}>{tt.l}</button>
        ))}
      </div>

      <div style={{ background:"#fff", borderRadius:12, padding:20, border:"1px solid #eee" }}>

        {tab==="general" && (<>
          <Field k="site_title" l={isAr ? "عنوان الموقع" : "Site Title"} ph={isAr ? "كاف – تسوق بكل سهولة" : "Kaaf – Easy shopping"} hint={isAr ? "يظهر في تبويب المتصفح ونتائج Google" : "Shows in browser tab and Google results"} />
          <Field k="site_description" l={isAr ? "وصف الموقع" : "Site Description"} ph={isAr ? "منصة تسوق إلكتروني موثوقة..." : "Trusted online shopping..."} ml hint={isAr ? "بين 150-160 حرف للحصول على أفضل ظهور" : "150-160 chars for best display"} />
          <Field k="site_keywords" l={isAr ? "الكلمات المفتاحية" : "Keywords"} ph={isAr ? "تسوق, متجر, السعودية" : "shopping, store, Saudi"} hint={isAr ? "مفصولة بفواصل" : "Comma separated"} />
          <Field k="canonical_url" l={isAr ? "الرابط الأساسي (Canonical)" : "Canonical URL"} ph="https://klafstore.com" />
          <Field k="og_image" l={isAr ? "الصورة الافتراضية للمشاركة" : "Default share image"} ph="https://cdn..." hint={isAr ? "تظهر عند مشاركة الموقع في وسائل التواصل" : "Shows when sharing on social media"} />
        </>)}

        {tab==="social" && (<>
          <Field k="twitter_handle" l={isAr ? "حساب تويتر/X" : "Twitter/X handle"} ph="@klafstore" />
          <Field k="og_image" l="Open Graph Image" ph="https://cdn..." hint="1200×630px" />
          <p style={{ fontSize:12, color:"#888", marginTop:14 }}>
            {isAr ? "هذه الإعدادات تحدد كيف يظهر موقعك عند مشاركته في Facebook، Twitter، WhatsApp، إلخ." : "These settings control how your site appears when shared on Facebook, Twitter, WhatsApp, etc."}
          </p>
        </>)}

        {tab==="analytics" && (<>
          <Field k="google_analytics_id" l="Google Analytics 4" ph="G-XXXXXXXXXX" hint={isAr ? "لتتبع الزوار والمبيعات" : "Track visitors and sales"} />
          <Field k="google_tag_manager_id" l="Google Tag Manager" ph="GTM-XXXXXXX" />
          <Field k="facebook_pixel_id" l="Facebook Pixel" ph="123456789012345" hint={isAr ? "لإعلانات Facebook و Instagram" : "For Facebook and Instagram ads"} />
          <Field k="tiktok_pixel_id" l="TikTok Pixel" ph="C4XXXXXXXXX" />
          <Field k="snapchat_pixel_id" l="Snapchat Pixel" ph="XXXXX-XXXX" />
        </>)}

        {tab==="verification" && (<>
          <Field k="search_console_verification" l="Google Search Console" ph={isAr ? "content code من meta tag" : "content code from meta tag"} hint={isAr ? "من إعدادات Google Search Console" : "From Google Search Console settings"} />
          <Field k="bing_verification" l="Bing Webmaster" ph="content code" />
        </>)}

        {tab==="schema" && (<>
          <Field k="schema_business_type" l={isAr ? "نوع العمل" : "Business Type"} ph="OnlineStore" hint={isAr ? "OnlineStore, LocalBusiness, إلخ" : "OnlineStore, LocalBusiness, etc."} />
          <Field k="schema_business_name" l={isAr ? "اسم العمل" : "Business Name"} ph={isAr ? "كاف" : "Kaaf"} />
          <Field k="schema_phone" l={t("footer_page.phone")} ph="+966..." />
          <Field k="schema_country" l={isAr ? "رمز الدولة" : "Country Code"} ph="SA" hint={isAr ? "SA, AE, KW, إلخ" : "SA, AE, KW, etc."} />
        </>)}

        {tab==="advanced" && (<>
          <Field k="robots" l="Robots Meta" ph="index, follow" hint={isAr ? "index, follow أو noindex, nofollow" : "index, follow or noindex, nofollow"} />
          <Field k="robots_txt" l="robots.txt" ml hint={isAr ? "محتوى ملف robots.txt" : "robots.txt file content"} />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderTop:"1px solid #f5f5f5" }}>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:"#111" }}>
                {isAr ? "إنشاء Sitemap.xml تلقائياً" : "Auto-generate Sitemap.xml"}
              </div>
              <div style={{ fontSize:11, color:"#888" }}>https://klafstore.com/sitemap.xml</div>
            </div>
            <input type="checkbox" checked={d.sitemap_enabled !== "false"} onChange={e=>upd("sitemap_enabled", String(e.target.checked))} style={{ width:18, height:18, cursor:"pointer", accentColor:"#FF835E" }} />
          </div>
        </>)}

      </div>

      {tab==="general" && (
        <div style={{ marginTop:20, background:"#f9f9f9", borderRadius:12, padding:16, border:"1px solid #eee" }}>
          <p style={{ fontSize:11, fontWeight:800, color:"#aaa", letterSpacing:1, marginBottom:10 }}>
            {isAr ? "معاينة Google" : "Google Preview"}
          </p>
          <div style={{ background:"#fff", padding:14, borderRadius:8 }}>
            <div style={{ fontSize:11, color:"#0f5132", marginBottom:2 }}>{d.canonical_url || "https://klafstore.com"}</div>
            <div style={{ fontSize:18, color:"#1a0dab", fontWeight:500, marginBottom:4, lineHeight:1.3 }}>{d.site_title || (isAr ? "عنوان الموقع" : "Site title")}</div>
            <div style={{ fontSize:13, color:"#4d5156", lineHeight:1.5 }}>{d.site_description || (isAr ? "وصف الموقع يظهر هنا..." : "Site description appears here...")}</div>
          </div>
        </div>
      )}
    </div>
  )
}