"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  pending:    { bg: "#1a1400", color: "#facc15", label: "معلق" },
  processing: { bg: "#001a2e", color: "#38bdf8", label: "قيد التنفيذ" },
  shipped:    { bg: "#0d1a00", color: "#86efac", label: "تم الشحن" },
  delivered:  { bg: "#001a0d", color: "#2A7A45", label: "تم التسليم" },
  cancelled:  { bg: "#1a0000", color: "#f87171", label: "ملغي" },
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

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
    <div style={{ minHeight: "100vh", background:"#EEEEEE", color: "#111", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e5e5", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background:"#EEEEEE", zIndex: 10 }}>
        <Link href="/admin" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>← رجوع</Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>الطلبات</span>
        <span style={{ fontSize: "13px", color: "#555" }}>{filtered.length} طلب</span>
      </div>

      <div style={{ padding: "16px", maxWidth: "700px", margin: "0 auto" }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "16px" }}>
          {[
            { label: "الكل", count: orders.length },
            { label: "معلق", count: orders.filter(o => o.status === "pending").length },
            { label: "مكتمل", count: orders.filter(o => o.status === "delivered").length },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "12px", padding: "12px", textAlign: "center" }}>
              <p style={{ fontWeight: "800", fontSize: "20px", margin: 0 }}>{s.count}</p>
              <p style={{ color: "#555", fontSize: "11px", margin: "4px 0 0" }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div style={{ background: "#e8f5ee", border: "1px solid #a8d9ba", borderRadius: "12px", padding: "14px 16px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#555", fontSize: "13px" }}>إجمالي الإيرادات (مكتملة)</span>
          <span style={{ fontWeight: "800", fontSize: "18px", color: "#2A7A45" }}>{totalRevenue.toFixed(2)} ر.س</span>
        </div>

        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="ابحث برقم الطلب أو العميل..."
          style={{ width: "100%", padding: "13px 16px", background: "#fff", border: "1px solid #e5e5e5", borderRadius: "12px", color: "#111", fontSize: "14px", outline: "none", textAlign: "right", fontFamily: "Cairo, system-ui, sans-serif", boxSizing: "border-box", marginBottom: "12px" }}
        />

        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", overflowX: "auto", paddingBottom: "4px" }}>
          {[
            { key: "all", label: "الكل" },
            { key: "pending", label: "معلق" },
            { key: "processing", label: "قيد التنفيذ" },
            { key: "shipped", label: "شحن" },
            { key: "delivered", label: "مكتمل" },
            { key: "cancelled", label: "ملغي" },
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
          <p style={{ color: "#555", textAlign: "center", padding: "40px 0" }}>جاري التحميل...</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: "#555", textAlign: "center", padding: "40px 0" }}>لا يوجد طلبات</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {filtered.map((order: any) => {
              const s = STATUS_COLORS[order.status] || STATUS_COLORS.pending
              return (
                <div
                  key={order.id}
                  onClick={() => router.push(`/admin/orders/${order.id}`)}
                  style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "14px", padding: "14px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontWeight: "700", fontSize: "14px" }}>طلب #{order.id}</span>
                    <span style={{ color: "#555", fontSize: "12px" }}>
                      {new Date(order.created_at).toLocaleDateString("ar-SA")}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                    <span style={{ fontWeight: "800", fontSize: "14px" }}>{Number(order.total_price).toFixed(2)} ر.س</span>
                    <span style={{ background: s.bg, color: s.color, padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700" }}>
                      {s.label}
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
