"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function BannerSlider({ locale, apiUrl, token }: { locale: string, apiUrl: string, token: string }) {
  const [ads, setAds] = useState<any[]>([])
  const [current, setCurrent] = useState(0)
  const isAr = locale === "ar"
  const L = (p: string) => `/${locale}${p}`

  const placeholders = [
    { bg: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" },
    { bg: "linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%)" },
    { bg: "linear-gradient(135deg, #16213e 0%, #0f172a 100%)" },
  ]

  useEffect(() => {
    fetch(`${apiUrl}/api/ads?placement=dash_admin`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(d => { if (d.ads?.length) setAds(d.ads) }).catch(() => {})
  }, [])

  useEffect(() => {
    const items = ads.length || 3
    const t = setInterval(() => setCurrent(c => (c + 1) % items), 4000)
    return () => clearInterval(t)
  }, [ads])

  const items = ads.length ? ads : placeholders

  return (
    <div style={{ width:"100%", height:"160px", position:"relative", overflow:"hidden" }}>
      {items.map((item: any, i: number) => (
        <div key={i} style={{
          position:"absolute", inset:0,
          background: item.image_url ? `url(${item.image_url}) center/cover` : (item.bg || "linear-gradient(135deg, #1a1a2e, #0f3460)"),
          opacity: i === current ? 1 : 0,
          transition: "opacity 0.8s ease",
          display:"flex", alignItems:"center", justifyContent:"center"
        }}>
          {!item.image_url && (
            <div style={{ textAlign:"center", color:"rgba(255,255,255,0.15)" }}>
              <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
          )}
          {item.title && (
            <div style={{ position:"absolute", bottom:16, right: isAr ? "auto" : 16, left: isAr ? 16 : "auto", color:"#fff" }}>
              <p style={{ margin:0, fontSize:"14px", fontWeight:"800", fontFamily:"Cairo,system-ui,sans-serif" }}>{item.title}</p>
              {item.subtitle && <p style={{ margin:"2px 0 0", fontSize:"11px", opacity:0.7 }}>{item.subtitle}</p>}
            </div>
          )}
        </div>
      ))}
      <div style={{ position:"absolute", bottom:8, left:"50%", transform:"translateX(-50%)", display:"flex", gap:4, zIndex:2 }}>
        {items.map((_: any, i: number) => (
          <div key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? 16 : 6, height:6, borderRadius:3, background: i === current ? "#FF835E" : "rgba(255,255,255,0.4)", cursor:"pointer", transition:"all 0.3s" }} />
        ))}
      </div>
      <Link href={L("/admin/marketing/ads")} style={{ position:"absolute", top:8, right:8, background:"rgba(0,0,0,0.4)", color:"#fff", padding:"3px 8px", borderRadius:"5px", textDecoration:"none", fontSize:"10px", fontWeight:"700" }}>{isAr ? "إدارة البنرات" : "Manage Banners"}</Link>
    </div>
  )
}