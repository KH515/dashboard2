"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"

export default function ReviewsPage() {
  const t = useTranslations()
  const locale = useLocale()
  const isAr = locale === "ar"
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/reviews").then(r=>r.json()).then(d=>{ setReviews(d.reviews||[]); setLoading(false) }).catch(()=>setLoading(false))
  }, [])

  return (
    <div style={{ minHeight:"100vh", background:"#EEEEEE", direction: isAr ? "rtl" : "ltr", fontFamily:"Cairo,system-ui,sans-serif" }}>
      <div style={{ padding:"16px 20px", borderBottom:"1px solid #e5e5e5", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:"#fff", zIndex:10, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
        <Link href={`/${locale}/admin`} style={{ color:"#888", fontSize:"13px", textDecoration:"none" }}>
          {isAr ? "← رجوع" : "← Back"}
        </Link>
        <span style={{ fontWeight:"700", fontSize:"16px" }}>
          {isAr ? "التقييمات" : "Reviews"}
        </span>
        <span style={{ fontSize:"12px", color:"#888" }}>{reviews.length}</span>
      </div>
      <div style={{ padding:16, maxWidth:"700px", margin:"0 auto" }}>
        {loading ? <p style={{ textAlign:"center", color:"#888", padding:"40px 0" }}>{t("common.loading")}</p> : reviews.length===0 ? <p style={{ textAlign:"center", color:"#888", padding:"40px 0" }}>{isAr ? "لا يوجد تقييمات" : "No reviews"}</p> : (
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {reviews.map((r:any) => (
              <div key={r.id} style={{ background:"#fff", borderRadius:14, padding:"14px 16px", border:"1px solid #e5e5e5", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:32, height:32, borderRadius:"50%", background:"#FFF0EB", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:14, color:"#FF835E" }}>{r.buyer_name?.[0]||"?"}</div>
                    <div>
                      <p style={{ margin:0, fontWeight:700, fontSize:13, color:"#111" }}>{r.buyer_name}</p>
                      <p style={{ margin:0, fontSize:10, color:"#888" }}>{new Date(r.created_at).toLocaleDateString(isAr ? "ar-SA" : "en-US")}</p>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:2 }}>{[1,2,3,4,5].map(s => <span key={s} style={{ color:s<=r.rating?"#f59e0b":"#ddd", fontSize:14 }}>★</span>)}</div>
                </div>
                {r.comment && <p style={{ fontSize:13, color:"#555", margin:0, lineHeight:1.6 }}>{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}