"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function UserActions({ userId, isActive, role }: { userId: number, isActive: number, role: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState("")

  const action = async (type: string) => {
    if (type === "delete" && !confirm("هل أنت متأكد من حذف هذا الحساب نهائياً؟")) return
    if (type === "ban" && !confirm("هل أنت متأكد من حظر هذا الحساب؟")) return
    setLoading(type)
    try {
      if (type === "ban") {
        await fetch(`/api/admin/users/${userId}/ban`, { method: "PUT" })
        router.refresh()
      } else if (type === "toggle") {
        await fetch(`/api/admin/users/${userId}/toggle`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_active: !isActive })
        })
        router.refresh()
      } else if (type === "delete") {
        await fetch(`/api/admin/users/${userId}`, { method: "DELETE" })
        router.push("/admin/customers")
      }
    } catch { }
    setLoading("")
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "24px" }}>
      <button onClick={() => action("toggle")} disabled={loading === "toggle"}
        style={{ width: "100%", padding: "14px", background: "#111", border: "1px solid #222", color: "#fff", borderRadius: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif" }}>
        {loading === "toggle" ? "..." : isActive ? "تعطيل الحساب" : "تفعيل الحساب"}
      </button>

      {role !== "admin" && (
        <button onClick={() => action("ban")} disabled={loading === "ban"}
          style={{ width: "100%", padding: "14px", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", color: "#fbbf24", borderRadius: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif" }}>
          {loading === "ban" ? "..." : "حظر الحساب"}
        </button>
      )}

      {role !== "admin" && (
        <button onClick={() => action("delete")} disabled={loading === "delete"}
          style={{ width: "100%", padding: "14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#f87171", borderRadius: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif" }}>
          {loading === "delete" ? "..." : "حذف الحساب نهائياً"}
        </button>
      )}
    </div>
  )
}