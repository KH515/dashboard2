"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"

export default function InvoicesPage() {
  const t = useTranslations()
  const locale = useLocale()
  const isAr = locale === "ar"
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/orders").then(r=>r.json()).then(d=>{ setOrders((d.orders||[]).filter((o:any)=>o.status==="delivered")); setLoading(false) }).catch(()=>setLoading(false))
  }, [])

  const total = orders.reduce((s,o)=>s+(o.total_price||0),0)
  const tax = total * 0.15

  return (
    <div style={{ minHeight:"100vh", background:"#EEEEEE", direction: isAr ? "rtl" : "ltr", fontFamily:"Cairo,system-ui,sans-serif" }}>
      <div style={{ padding:"16px 20px", borderBottom:"1px solid #e5e5e5", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:"#fff", zIndex:10, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
        <Link href={`/${locale}/admin`} style={{ color:"#888", fontSize:"13px", textDecoration:"none" }}>
          {isAr ? "← رجوع" : "← Back"}
        </Link>
        <span style={{ fontWeight:"700", fontSize:"16px" }}>{t("invoices_page.title")}</span>
        <span style={{ fontSize:"12px", color:"#888" }}>{orders.length}</span>
      </div>
      <div style={{ padding:16, maxWidth:"700px", margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
          <div style={{ background:"#fff", borderRadius:14, padding:14, border:"1px solid #e5e5e5", textAlign:"center" }}>
            <p style={{ margin:0, fontSize:20, fontWeight:900, color:"#FF835E" }}>{total.toFixed(2)}</p>
            <p style={{ margin:0, fontSize:11, color:"#888" }}>
              {isAr ? "إجمالي المبيعات ر.س" : "Total Sales SAR"}
            </p>
          </div>
          <div style={{ background:"#fff", borderRadius:14, padding:14, border:"1px solid #e5e5e5", textAlign:"center" }}>
            <p style={{ margin:0, fontSize:20, fontWeight:900, color:"#2A7A45" }}>{tax.toFixed(2)}</p>
            <p style={{ margin:0, fontSize:11, color:"#888" }}>
              {isAr ? "ضريبة القيمة المضافة ر.س" : "VAT (15%) SAR"}
            </p>
          </div>
        </div>
        {loading ? <p style={{ textAlign:"center", color:"#888", padding:"40px 0" }}>{t("common.loading")}</p> : orders.length === 0 ? (
          <p style={{ textAlign:"center", color:"#888", padding:"40px 0" }}>{t("invoices_page.no_invoices")}</p>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {orders.map((o:any) => (
              <div key={o.id} style={{ background:"#fff", borderRadius:14, padding:"14px 16px", border:"1px solid #e5e5e5", display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                <div>
                  <p style={{ margin:0, fontWeight:700, fontSize:14, color:"#111" }}>{t("invoices_page.invoice_number")} #{o.id}</p>
                  <p style={{ margin:0, fontSize:11, color:"#888" }}>{new Date(o.created_at).toLocaleDateString(isAr ? "ar-SA" : "en-US")}</p>
                </div>
                <div style={{ textAlign: isAr ? "left" : "right" as const }}>
                  <p style={{ margin:0, fontWeight:900, fontSize:14, color:"#111" }}>{Number(o.total_price).toFixed(2)} {t("common.currency")}</p>
                  <p style={{ margin:0, fontSize:10, color:"#888" }}>
                    {isAr ? "ضريبة" : "VAT"}: {(Number(o.total_price)*0.15).toFixed(2)} {t("common.currency")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}