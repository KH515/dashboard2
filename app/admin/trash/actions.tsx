"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function RestoreButton({ type, id }: { type: "user" | "product", id: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const restore = async () => {
    setLoading(true)
    await fetch(`/api/admin/trash/restore`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <button onClick={restore} disabled={loading}
      style={{ background: "#1a1a1a", border: "1px solid #222", color: "#fff", padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif", flexShrink: 0 }}>
      {loading ? "..." : "استعادة"}
    </button>
  )
}