"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function ProductActions({ productId, isActive }: { productId: number, isActive: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState("")

  const action = async (type: string) => {
    if (type === "delete" && !confirm("هل أنت متأكد من حذف هذا المنتج؟")) return
    setLoading(type)
    try {
      if (type === "toggle") {
        await fetch(`/api/admin/products/${productId}/toggle`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_active: isActive ? 0 : 1 })
        })
        router.refresh()
      } else if (type === "delete") {
        await fetch(`/api/admin/products/${productId}`, { method: "DELETE" })
        router.push("/admin/products")
      }
    } catch { }
    setLoading("")
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <button onClick={() => router.push(`/admin/products/view/${productId}/edit`)}
        style={{ width: "100%", padding: "14px", background: "#111", border: "1px solid #222", color: "#fff", borderRadius: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif" }}>
        تعديل المنتج
      </button>
      <button onClick={() => action("toggle")} disabled={loading === "toggle"}
        style={{ width: "100%", padding: "14px", background: "#111", border: "1px solid #222", color: "#fff", borderRadius: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif" }}>
        {loading === "toggle" ? "..." : isActive ? "تعطيل المنتج" : "تفعيل المنتج"}
      </button>
      <button onClick={() => action("delete")} disabled={loading === "delete"}
        style={{ width: "100%", padding: "14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#f87171", borderRadius: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif" }}>
        {loading === "delete" ? "..." : "حذف المنتج"}
      </button>
    </div>
  )
}