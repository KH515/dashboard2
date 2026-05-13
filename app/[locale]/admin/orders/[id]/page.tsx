"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  pending:    { bg: "#1a1400", color: "#facc15", label: "معلق" },
  processing: { bg: "#001a2e", color: "#38bdf8", label: "قيد التنفيذ" },
  shipped:    { bg: "#0d1a00", color: "#86efac", label: "تم الشحن" },
  delivered:  { bg: "#001a0d", color: "#4ade80", label: "تم التسليم" },
  cancelled:  { bg: "#1a0000", color: "#f87171", label: "ملغي" },
}

const ALL_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"]

export default function OrderDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("")

  useEffect(() => {
    fetch("/api/admin/orders/" + id)
      .then(r => r.json())
      .then(d => {
        setData(d)
        setSelectedStatus(d.order?.status || "pending")
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const updateStatus = async () => {
    if (updating || selectedStatus === data?.order?.status) return
    setUpdating(true)
    try {
      const res = await fetch("/api/admin/orders/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus }),
      })
      if (res.ok) {
        setData((prev: any) => ({ ...prev, order: { ...prev.order, status: selectedStatus } }))
      }
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background:"#EEEEEE", color: "#111", fontFamily: "Cairo, system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#555" }}>جاري التحميل...</p>
    </div>
  )

  if (!data?.order) return (
    <div style={{ minHeight: "100vh", background:"#EEEEEE", color: "#111", fontFamily: "Cairo, system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#555" }}>الطلب غير موجود</p>
    </div>
  )

  const { order, items = [], buyer_name, buyer_email, seller_name } = data
  const s = STATUS_COLORS[order.status] || STATUS_COLORS.pending

  return (
    <div style={{ minHeight: "100vh", background:"#EEEEEE", color: "#111", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e5e5", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background:"#EEEEEE", zIndex: 10 }}>
        <Link href="/admin/orders" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>← رجوع</Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>طلب #{order.id}</span>
        <span style={{ background: s.bg, color: s.color, padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>{s.label}</span>
      </div>

      <div style={{ padding: "16px", maxWidth: "700px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>

        <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "14px", padding: "16px" }}>
          <p style={{ color: "#555", fontSize: "11px", margin: "0 0 12px", fontWeight: "700" }}>معلومات الطلب</p>
          {[
            { label: "العميل", value: buyer_name || "#" + order.buyer_id },
            { label: "البريد", value: buyer_email || "—" },
            { label: "البائع", value: seller_name || "#" + order.seller_id },
            { label: "طريقة الدفع", value: order.payment_method === "cash" ? "نقدي" : order.payment_method },
            { label: "التاريخ", value: new Date(order.created_at).toLocaleString("ar-SA") },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1a1a1a" }}>
              <span style={{ color: "#555", fontSize: "13px" }}>{row.label}</span>
              <span style={{ fontSize: "13px", fontWeight: "600" }}>{row.value}</span>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "14px", padding: "16px" }}>
          <p style={{ color: "#555", fontSize: "11px", margin: "0 0 12px", fontWeight: "700" }}>المنتجات ({items.length})</p>
          {items.map((item: any) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1a1a1a", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, overflow: "hidden" }}>
                {item.image && <img src={item.image} style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }} />}
                <span style={{ fontSize: "13px", fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</span>
              </div>
              <div style={{ textAlign: "left", flexShrink: 0 }}>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: "700" }}>{Number(item.price).toFixed(2)} ر.س</p>
                <p style={{ margin: 0, color: "#555", fontSize: "11px" }}>x {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "14px", padding: "16px" }}>
          <p style={{ color: "#555", fontSize: "11px", margin: "0 0 12px", fontWeight: "700" }}>المالية</p>
          {[
            { label: "الاجمالي", value: Number(order.total_price).toFixed(2) + " ر.س", bold: true },
            { label: "عمولة كلاف (10%)", value: Number(order.commission).toFixed(2) + " ر.س", color: "#f87171" },
            { label: "صافي البائع", value: Number(order.seller_amount).toFixed(2) + " ر.س", color: "#4ade80" },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1a1a1a" }}>
              <span style={{ color: "#555", fontSize: "13px" }}>{row.label}</span>
              <span style={{ fontSize: "13px", fontWeight: row.bold ? "800" : "600", color: row.color || "#fff" }}>{row.value}</span>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "14px", padding: "16px" }}>
          <p style={{ color: "#555", fontSize: "11px", margin: "0 0 12px", fontWeight: "700" }}>تغيير الحالة</p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
            {ALL_STATUSES.map(st => {
              const info = STATUS_COLORS[st]
              const active = selectedStatus === st
              return (
                <button key={st} onClick={() => setSelectedStatus(st)}
                  style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", cursor: "pointer", background: active ? info.bg : "#1a1a1a", color: active ? info.color : "#555", border: "1px solid " + (active ? info.color : "#2a2a2a"), fontFamily: "Cairo, system-ui, sans-serif" }}>
                  {info.label}
                </button>
              )
            })}
          </div>
          <button onClick={updateStatus} disabled={updating || selectedStatus === order.status}
            style={{ width: "100%", padding: "13px", borderRadius: "12px", fontWeight: "700", fontSize: "14px", cursor: updating || selectedStatus === order.status ? "not-allowed" : "pointer", background: updating || selectedStatus === order.status ? "#1a1a1a" : "#fff", color: updating || selectedStatus === order.status ? "#333" : "#000", border: "none", fontFamily: "Cairo, system-ui, sans-serif" }}>
            {updating ? "جاري الحفظ..." : "حفظ الحالة"}
          </button>
        </div>

      </div>
    </div>
  )
}