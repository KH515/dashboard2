"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"

export default function ReportsPage() {
  const t = useTranslations()
  const locale = useLocale()
  const isAr = locale === "ar"
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/orders").then(r=>r.json()).then(d=>{ setOrders(d.orders||[]); setLoading(false) }).catch(()=>setLoading(false))
  }, [])

  const delivered = orders.filter(o=>o.status==="delivered")
  const revenue = delivered.reduce((s,o)=>s+(o.total_price||0),0)
  const pending = orders.filter(o=>o.status==="pending").length
  const cancelled = orders.filter(o=>o.status==="cancelled").length

  return (
    <div style={{ minHeight:"100vh", background:"#EEEEEE", direction: isAr ? "rtl" : "ltr", fontFamily:"Cairo,system-ui,sans-serif" }}>
      <div style={{ padding:"16px 20px", borderBottom:"1px solid #e5e5e5", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:"#fff", zIndex:10, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
        <Link href={`/${locale}/admin`} style={{ color:"#888", fontSize:"13px", textDecoration:"none" }}>
          {isAr ? "← رجوع" : "← Back"}
        </Link>
        <span style={{ fontWeight:"700", fontSize:"16px" }}>{t("analytics_page.reports")}</span>
        <div />
      </div>
      <div style={{ padding:16, maxWidth:"700px", margin:"0 auto" }}>
        {loading ? <p style={{ textAlign:"center", color:"#888", padding:"40px 0" }}>{t("common.loading")}</p> : (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
              {[
                { label: t("analytics_page.total_revenue"), value: revenue.toFixed(2)+" "+t("common.currency"), color:"#FF835E" },
                { label: isAr ? "الطلبات المكتملة" : "Completed Orders", value: delivered.length, color:"#2A7A45" },
                { label: isAr ? "طلبات معلقة" : "Pending Orders", value: pending, color:"#B07A00" },
                { label: isAr ? "طلبات ملغاة" : "Cancelled Orders", value: cancelled, color:"#C0392B" },
              ].map(s => (
                <div key={s.label} style={{ background:"#fff", borderRadius:14, padding:14, border:"1px solid #e5e5e5", textAlign:"center", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                  <p style={{ margin:0, fontSize:20, fontWeight:900, color:s.color }}>{s.value}</p>
                  <p style={{ margin:0, fontSize:11, color:"#888", marginTop:4 }}>{s.label}</p>
                </div>
              ))}
            </div>
            <div style={{ background:"#fff", borderRadius:14, padding:16, border:"1px solid #e5e5e5" }}>
              <p style={{ fontWeight:800, fontSize:14, margin:"0 0 12px", color:"#111" }}>
                {isAr ? "معدل التحويل" : "Conversion Rate"}
              </p>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:13, color:"#555" }}>
                  {isAr ? "الطلبات المكتملة" : "Completed Orders"}
                </span>
                <span style={{ fontSize:13, fontWeight:700, color:"#111" }}>{orders.length>0?Math.round(delivered.length/orders.length*100):0}%</span>
              </div>
              <div style={{ height:8, background:"#f0f0f0", borderRadius:4, overflow:"hidden" }}>
                <div style={{ height:"100%", width:(orders.length>0?delivered.length/orders.length*100:0)+"%", background:"#FF835E", borderRadius:4, transition:"width .5s" }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}