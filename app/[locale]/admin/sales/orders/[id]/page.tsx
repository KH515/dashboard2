"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"

const ALL_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"]

export default function OrderDetailPage() {
  const t = useTranslations()
  const locale = useLocale()
  const isAr = locale === "ar"
  const params = useParams()
  const id = params.id as string

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("")

  const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    pending:    { bg: "#fef3c7", color: "#92400e" },
    processing: { bg: "#dbeafe", color: "#1e40af" },
    shipped:    { bg: "#dcfce7", color: "#166534" },
    delivered:  { bg: "#d1fae5", color: "#065f46" },
    cancelled:  { bg: "#fee2e2", color: "#991b1b" },
  }

  const statusLabel = (s: string) => {
    const labels: Record<string, string> = {
      pending: t("orders_page.pending"),
      processing: t("orders_page.processing"),
      shipped: t("orders_page.shipped"),
      delivered: t("orders_page.completed"),
      cancelled: t("orders_page.cancelled"),
    }
    return labels[s] || s
  }

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
      <p style={{ color: "#555" }}>{t("common.loading")}</p>
    </div>
  )

  if (!data?.order) return (
    <div style={{ minHeight: "100vh", background:"#EEEEEE", color: "#111", fontFamily: "Cairo, system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#555" }}>{isAr ? "الطلب غير موجود" : "Order not found"}</p>
    </div>
  )

  const { order, items = [], buyer_name, buyer_email, seller_name } = data
  const s = STATUS_COLORS[order.status] || STATUS_COLORS.pending

  return (
    <div style={{ minHeight: "100vh", background:"#EEEEEE", color: "#111", fontFamily: "Cairo, system-ui, sans-serif", direction: isAr ? "rtl" : "ltr" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e5e5", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background:"#EEEEEE", zIndex: 10 }}>
        <Link href={`/${locale}/admin/sales/orders`} style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>
          {isAr ? "← رجوع" : "← Back"}
        </Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>{t("orders_page.order_number")} #{order.id}</span>
        <span style={{ background: s.bg, color: s.color, padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>{statusLabel(order.status)}</span>
      </div>

      <div style={{ padding: "16px", maxWidth: "700px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>

        <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "14px", padding: "16px" }}>
          <p style={{ color: "#555", fontSize: "11px", margin: "0 0 12px", fontWeight: "700" }}>
            {isAr ? "معلومات الطلب" : "Order Information"}
          </p>
          {[
            { label: t("orders_page.customer"), value: buyer_name || "#" + order.buyer_id },
            { label: t("customers_page.email"), value: buyer_email || "—" },
            { label: isAr ? "البائع" : "Seller", value: seller_name || "#" + order.seller_id },
            { label: isAr ? "طريقة الدفع" : "Payment Method", value: order.payment_method === "cash" ? (isAr ? "نقدي" : "Cash") : order.payment_method },
            { label: t("orders_page.date"), value: new Date(order.created_at).toLocaleString(isAr ? "ar-SA" : "en-US") },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
              <span style={{ color: "#555", fontSize: "13px" }}>{row.label}</span>
              <span style={{ fontSize: "13px", fontWeight: "600" }}>{row.value}</span>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "14px", padding: "16px" }}>
          <p style={{ color: "#555", fontSize: "11px", margin: "0 0 12px", fontWeight: "700" }}>
            {isAr ? "المنتجات" : "Products"} ({items.length})
          </p>
          {items.map((item: any) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0f0f0", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, overflow: "hidden" }}>
                {item.image && <img src={item.image} style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }} />}
                <span style={{ fontSize: "13px", fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</span>
              </div>
              <div style={{ textAlign: isAr ? "left" : "right" as const, flexShrink: 0 }}>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: "700" }}>{Number(item.price).toFixed(2)} {t("common.currency")}</p>
                <p style={{ margin: 0, color: "#555", fontSize: "11px" }}>x {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "14px", padding: "16px" }}>
          <p style={{ color: "#555", fontSize: "11px", margin: "0 0 12px", fontWeight: "700" }}>
            {isAr ? "المالية" : "Financials"}
          </p>
          {[
            { label: isAr ? "الإجمالي" : "Total", value: Number(order.total_price).toFixed(2) + " " + t("common.currency"), bold: true, color: "#111" },
            { label: isAr ? "عمولة كاف (10%)" : "Kaaf Commission (10%)", value: Number(order.commission).toFixed(2) + " " + t("common.currency"), color: "#dc2626" },
            { label: isAr ? "صافي البائع" : "Seller Net", value: Number(order.seller_amount).toFixed(2) + " " + t("common.currency"), color: "#16a34a" },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
              <span style={{ color: "#555", fontSize: "13px" }}>{row.label}</span>
              <span style={{ fontSize: "13px", fontWeight: row.bold ? "800" : "600", color: row.color }}>{row.value}</span>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "14px", padding: "16px" }}>
          <p style={{ color: "#555", fontSize: "11px", margin: "0 0 12px", fontWeight: "700" }}>
            {isAr ? "تغيير الحالة" : "Change Status"}
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
            {ALL_STATUSES.map(st => {
              const info = STATUS_COLORS[st]
              const active = selectedStatus === st
              return (
                <button key={st} onClick={() => setSelectedStatus(st)}
                  style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", cursor: "pointer", background: active ? info.bg : "#f5f5f5", color: active ? info.color : "#555", border: "1px solid " + (active ? info.color : "#e5e5e5"), fontFamily: "Cairo, system-ui, sans-serif" }}>
                  {statusLabel(st)}
                </button>
              )
            })}
          </div>
          <button onClick={updateStatus} disabled={updating || selectedStatus === order.status}
            style={{ width: "100%", padding: "13px", borderRadius: "12px", fontWeight: "700", fontSize: "14px", cursor: updating || selectedStatus === order.status ? "not-allowed" : "pointer", background: updating || selectedStatus === order.status ? "#ccc" : "#FF835E", color: "#fff", border: "none", fontFamily: "Cairo, system-ui, sans-serif" }}>
            {updating ? t("common.saving") : t("common.save")}
          </button>
        </div>

      </div>
    </div>
  )
}