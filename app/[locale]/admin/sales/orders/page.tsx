"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"

export default function OrdersPage() {
  const t = useTranslations()
  const locale = useLocale()
  const isAr = locale === "ar"
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

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
    fetch("/api/admin/orders")
      .then(r => r.json())
      .then(data => { setOrders(data.orders || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = orders.filter(o => {
    const matchSearch = search === "" || String(o.id).includes(search) || String(o.buyer_id).includes(search)
    const matchStatus = statusFilter === "all" || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalRevenue = orders
    .filter(o => o.status === "delivered")
    .reduce((sum, o) => sum + (o.total_price || 0), 0)

  return (
    <div style={{ minHeight: "100vh", background:"#EEEEEE", color: "#111", fontFamily: "Cairo, system-ui, sans-serif", direction: isAr ? "rtl" : "ltr" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e5e5", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background:"#EEEEEE", zIndex: 10 }}>
        <Link href={`/${locale}/admin`} style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>
          {isAr ? "← رجوع" : "← Back"}
        </Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>{t("orders_page.title")}</span>
        <span style={{ fontSize: "13px", color: "#555" }}>{filtered.length} {t("orders_page.order_number")}</span>
      </div>

      <div style={{ padding: "16px", maxWidth: "700px", margin: "0 auto" }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "16px" }}>
          {[
            { label: t("orders_page.all"), count: orders.length },
            { label: t("orders_page.pending"), count: orders.filter(o => o.status === "pending").length },
            { label: t("orders_page.completed"), count: orders.filter(o => o.status === "delivered").length },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "12px", padding: "12px", textAlign: "center" }}>
              <p style={{ fontWeight: "800", fontSize: "20px", margin: 0 }}>{s.count}</p>
              <p style={{ color: "#555", fontSize: "11px", margin: "4px 0 0" }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div style={{ background: "#e8f5ee", border: "1px solid #a8d9ba", borderRadius: "12px", padding: "14px 16px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#555", fontSize: "13px" }}>{t("orders_page.total")}</span>
          <span style={{ fontWeight: "800", fontSize: "18px", color: "#2A7A45" }}>{totalRevenue.toFixed(2)} {t("common.currency")}</span>
        </div>

        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t("orders_page.search_placeholder")}
          style={{ width: "100%", padding: "13px 16px", background: "#fff", border: "1px solid #e5e5e5", borderRadius: "12px", color: "#111", fontSize: "14px", outline: "none", textAlign: isAr ? "right" : "left" as const, fontFamily: "Cairo, system-ui, sans-serif", boxSizing: "border-box", marginBottom: "12px" }}
          dir={isAr ? "rtl" : "ltr"}
        />

        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", overflowX: "auto", paddingBottom: "4px" }}>
          {[
            { key: "all", label: t("orders_page.all") },
            { key: "pending", label: t("orders_page.pending") },
            { key: "processing", label: t("orders_page.processing") },
            { key: "shipped", label: t("orders_page.shipped") },
            { key: "delivered", label: t("orders_page.completed") },
            { key: "cancelled", label: t("orders_page.cancelled") },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              style={{
                padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap", border: "1px solid",
                background: statusFilter === f.key ? "#FF835E" : "#f5f5f5",
                color: statusFilter === f.key ? "#fff" : "#555",
                borderColor: statusFilter === f.key ? "#FF835E" : "#e5e5e5",
                fontFamily: "Cairo, system-ui, sans-serif",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: "#555", textAlign: "center", padding: "40px 0" }}>{t("common.loading")}</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: "#555", textAlign: "center", padding: "40px 0" }}>{t("orders_page.no_orders")}</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {filtered.map((order: any) => {
              const s = STATUS_COLORS[order.status] || STATUS_COLORS.pending
              return (
                <div
                  key={order.id}
                  onClick={() => router.push(`/${locale}/admin/orders/${order.id}`)}
                  style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "14px", padding: "14px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontWeight: "700", fontSize: "14px" }}>{t("orders_page.order_number")} #{order.id}</span>
                    <span style={{ color: "#555", fontSize: "12px" }}>
                      {new Date(order.created_at).toLocaleDateString(isAr ? "ar-SA" : "en-US")}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: isAr ? "flex-end" : "flex-start" as const, gap: "6px" }}>
                    <span style={{ fontWeight: "800", fontSize: "14px" }}>{Number(order.total_price).toFixed(2)} {t("common.currency")}</span>
                    <span style={{ background: s.bg, color: s.color, padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700" }}>
                      {statusLabel(order.status)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}