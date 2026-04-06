"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function DeleteButton({ userId, token }: { userId: number, token: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return
    setLoading(true)
    await fetch(`https://api.klafstore.com/api/users/${userId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <button onClick={handleDelete} disabled={loading}
      style={{ color: "#f87171", fontSize: "12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", padding: "5px 12px", borderRadius: "8px", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif", marginRight: "8px" }}>
      {loading ? "..." : "حذف"}
    </button>
  )
}