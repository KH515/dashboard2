"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function AdsActions({ adId, isActive }: { adId: number, isActive: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState("")

  const action = async (type: string) => {
    if (type === "delete" && !confirm("هل أنت متأكد من حذف هذا الإعلان؟")) return
    setLoading(type)
    try {
      if (type === "toggle") {
        await fetch(`/api/admin/ads/${adId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_active: isActive ? 0 : 1 })
        })
        router.refresh()
      } else if (type === "delete") {
        await fetch(`/api/admin/ads/${adId}`, { method: "DELETE" })
        router.refresh()
      }
    } catch { }
    setLoading("")
  }

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <button onClick={() => action("toggle")} disabled={loading === "toggle"}
        style={{ background: "#1a1a1a", border: "1px solid #222", color: "#fff", padding: "5px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif" }}>
        {loading === "toggle" ? "..." : isActive ? "تعطيل" : "تفعيل"}
      </button>
      <button onClick={() => action("delete")} disabled={loading === "delete"}
        style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#f87171", padding: "5px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif" }}>
        {loading === "delete" ? "..." : "حذف"}
      </button>
    </div>
  )
}