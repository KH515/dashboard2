"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"

export default function CouponsPage() {
  const t = useTranslations()
  const locale = useLocale()
  const isAr = locale === "ar"
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [code, setCode] = useState("")
  const [discount, setDiscount] = useState("")
  const [type, setType] = useState("percent")
  const [minOrder, setMinOrder] = useState("")
  const [maxUses, setMaxUses] = useState("")
  const [expiry, setExpiry] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadCoupons() }, [])

  const loadCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons")
      const data = await res.json()
      setCoupons(data.coupons || [])
    } catch {} finally { setLoading(false) }
  }

  const save = async () => {
    if (!code || !discount) return
    setSaving(true)
    await fetch("/api/admin/coupons", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ code, discount: Number(discount), type, min_order: Number(minOrder)||0, max_uses: Number(maxUses)||0, expires_at: expiry ? new Date(expiry).getTime() : null }) })
    await loadCoupons()
    setCode(""); setDiscount(""); setMinOrder(""); setMaxUses(""); setExpiry(""); setShowAdd(false); setSaving(false)
  }

  const deleteCoupon = async (id: number) => {
    if (!confirm(t("common.confirm_delete"))) return
    await fetch("/api/admin/coupons/" + id, { method:"DELETE" })
    setCoupons(prev => prev.filter(c => c.id !== id))
  }

  const inp = { width:"100%", padding:"11px 14px", background:"#f8f8f8", border:"1px solid #e5e5e5", borderRadius:10, fontSize:"13px", outline:"none", fontFamily:"Cairo,system-ui,sans-serif", boxSizing:"border-box" as const, marginBottom:10 }

  return (
    <div style={{ minHeight:"100vh", background:"#EEEEEE", direction: isAr ? "rtl" : "ltr", fontFamily:"Cairo,system-ui,sans-serif" }}>
      <div style={{ padding:"16px 20px", borderBottom:"1px solid #e5e5e5", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:"#fff", zIndex:10, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
        <Link href={`/${locale}/admin`} style={{ color:"#888", fontSize:"13px", textDecoration:"none" }}>
          {isAr ? "← رجوع" : "← Back"}
        </Link>
        <span style={{ fontWeight:"700", fontSize:"16px" }}>{t("marketing_page.coupons")}</span>
        <button onClick={()=>setShowAdd(true)} style={{ background:"#FF835E", color:"#fff", border:"none", padding:"7px 14px", borderRadius:9, fontWeight:"700", fontSize:12, cursor:"pointer", fontFamily:"Cairo,system-ui,sans-serif" }}>
          + {t("common.new")}
        </button>
      </div>
      <div style={{ padding:16, maxWidth:"700px", margin:"0 auto" }}>
        {loading ? <p style={{ textAlign:"center", color:"#888", padding:"40px 0" }}>{t("common.loading")}</p> : coupons.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px 20px", background:"#fff", borderRadius:16, border:"2px dashed #e5e5e5" }}>
            <p style={{ color:"#888", marginBottom:12 }}>{isAr ? "لا يوجد كوبونات" : "No coupons"}</p>
            <button onClick={()=>setShowAdd(true)} style={{ background:"#FF835E", color:"#fff", border:"none", padding:"10px 20px", borderRadius:10, fontWeight:"700", cursor:"pointer", fontFamily:"Cairo,system-ui,sans-serif" }}>+ {t("marketing_page.new_coupon")}</button>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {coupons.map((c:any) => (
              <div key={c.id} style={{ background:"#fff", borderRadius:14, padding:"14px 16px", border:"1px solid #e5e5e5", display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ background:"#FFF0EB", borderRadius:10, padding:"8px 14px" }}>
                    <span style={{ fontWeight:"900", fontSize:15, color:"#FF835E", letterSpacing:1 }}>{c.code}</span>
                  </div>
                  <div>
                    <p style={{ margin:0, fontWeight:"700", fontSize:13, color:"#111" }}>
                      {c.type==="percent" ? c.discount+"%" : c.discount+" "+t("common.currency")} {t("marketing_page.discount")}
                    </p>
                    <p style={{ margin:0, fontSize:11, color:"#888" }}>
                      {c.uses_count||0}/{c.max_uses||"∞"} {isAr ? "استخدام" : "uses"} {c.min_order>0 ? (isAr ? "• حد أدنى " + c.min_order + " ر.س" : "• Min " + c.min_order + " SAR") : ""}
                    </p>
                  </div>
                </div>
                <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                  <span style={{ background:c.is_active?"#E8F5EE":"#f5f5f5", color:c.is_active?"#2A7A45":"#888", fontSize:9, fontWeight:800, padding:"3px 8px", borderRadius:20 }}>
                    {c.is_active ? t("common.active") : t("common.inactive")}
                  </span>
                  <button onClick={()=>deleteCoupon(c.id)} style={{ background:"#fff0f0", color:"#e53e3e", border:"1px solid #fed7d7", padding:"5px 10px", borderRadius:8, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"Cairo,system-ui,sans-serif" }}>{t("common.delete")}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showAdd && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:100, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={()=>setShowAdd(false)}>
          <div style={{ background:"#fff", borderRadius:"20px 20px 0 0", padding:20, width:"100%", maxWidth:500 }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <span style={{ fontWeight:"800", fontSize:15 }}>{t("marketing_page.new_coupon")}</span>
              <button onClick={()=>setShowAdd(false)} style={{ background:"#f0f0f0", border:"none", width:30, height:30, borderRadius:"50%", cursor:"pointer", fontSize:16 }}>×</button>
            </div>
            <input value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder={isAr ? "كود الخصم (مثال: SAVE20)" : "Discount code (e.g. SAVE20)"} style={inp} />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
              <select value={type} onChange={e=>setType(e.target.value)} style={{ ...inp, marginBottom:0 }}>
                <option value="percent">{isAr ? "نسبة %" : "Percentage %"}</option>
                <option value="fixed">{isAr ? "مبلغ ثابت" : "Fixed amount"}</option>
              </select>
              <input type="number" value={discount} onChange={e=>setDiscount(e.target.value)} placeholder={type==="percent" ? (isAr ? "النسبة %" : "Percentage %") : (isAr ? "المبلغ ر.س" : "Amount SAR")} style={{ ...inp, marginBottom:0 }} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
              <input type="number" value={minOrder} onChange={e=>setMinOrder(e.target.value)} placeholder={isAr ? "حد أدنى للطلب" : "Minimum order"} style={{ ...inp, marginBottom:0 }} />
              <input type="number" value={maxUses} onChange={e=>setMaxUses(e.target.value)} placeholder={isAr ? "أقصى عدد استخدام" : "Max uses"} style={{ ...inp, marginBottom:0 }} />
            </div>
            <input type="date" value={expiry} onChange={e=>setExpiry(e.target.value)} style={inp} />
            <button onClick={save} disabled={saving||!code||!discount} style={{ width:"100%", padding:"13px", background:saving||!code||!discount?"#ddd":"#FF835E", color:saving||!code||!discount?"#999":"#fff", border:"none", borderRadius:12, fontWeight:"800", fontSize:14, cursor:"pointer", fontFamily:"Cairo,system-ui,sans-serif" }}>
              {saving ? t("common.saving") : t("common.add")}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}