"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"

export default function AbandonedCartsPage() {
  const t = useTranslations()
  const locale = useLocale()
  const isAr = locale === "ar"
  const [carts, setCarts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/abandoned-carts").then(r=>r.json()).then(d=>{ setCarts(d.carts||[]); setLoading(false) }).catch(()=>setLoading(false))
  }, [])

  return (
    <div style={{ minHeight:"100vh", background:"#EEEEEE", direction: isAr ? "rtl" : "ltr", fontFamily:"Cairo,system-ui,sans-serif" }}>
      <div style={{ padding:"16px 20px", borderBottom:"1px solid #e5e5e5", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:"#fff", zIndex:10, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
        <Link href={`/${locale}/admin`} style={{ color:"#888", fontSize:"13px", textDecoration:"none" }}>
          {isAr ? "← رجوع" : "← Back"}
        </Link>
        <span style={{ fontWeight:"700", fontSize:"16px" }}>{t("carts_page.title")}</span>
        <span style={{ fontSize:"12px", color:"#888" }}>{carts.length}</span>
      </div>
      <div style={{ padding:16, maxWidth:"700px", margin:"0 auto" }}>
        {loading ? <p style={{ textAlign:"center", color:"#888", padding:"40px 0" }}>{t("common.loading")}</p> : carts.length===0 ? (
          <div style={{ textAlign:"center", padding:"60px 20px", background:"#fff", borderRadius:16, border:"1px solid #e5e5e5" }}>
            <p style={{ color:"#888", fontSize:14 }}>{t("carts_page.no_carts")} 🎉</p>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {carts.map((cart:any) => (
              <div key={cart.id} style={{ background:"#fff", borderRadius:14, padding:"14px 16px", border:"1px solid #e5e5e5", display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                <div>
                  <p style={{ margin:0, fontWeight:700, fontSize:14, color:"#111" }}>{cart.buyer_name || (isAr ? "مجهول" : "Unknown")}</p>
                  <p style={{ margin:0, fontSize:11, color:"#888" }}>
                    {cart.items_count} {isAr ? "منتج" : "items"} • {new Date(cart.updated_at).toLocaleDateString(isAr ? "ar-SA" : "en-US")}
                  </p>
                </div>
                <span style={{ fontWeight:900, fontSize:14, color:"#FF835E" }}>{cart.total} {t("common.currency")}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}