"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "حصل خطأ"); setLoading(false); return }
      router.push("/admin")
    } catch {
      setError("تعذر الاتصال بالسيرفر")
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Cairo, system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "380px", padding: "24px" }}>
        <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: "800", marginBottom: "32px", textAlign: "right" }}>تسجيل الدخول</h1>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "16px" }}>
            <input type="text" value={identifier} onChange={e => setIdentifier(e.target.value)}
              placeholder="الإيميل أو اليوزرنيم" required autoComplete="username"
              style={{ width: "100%", padding: "13px 16px", background: "#111", border: "1px solid #222", borderRadius: "12px", color: "white", fontSize: "14px", outline: "none", textAlign: "right", fontFamily: "Cairo, system-ui, sans-serif" }} />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="كلمة المرور" required autoComplete="current-password"
              style={{ width: "100%", padding: "13px 16px", background: "#111", border: "1px solid #222", borderRadius: "12px", color: "white", fontSize: "14px", outline: "none", textAlign: "right", fontFamily: "Cairo, system-ui, sans-serif" }} />
          </div>
          {error && <div style={{ color: "#f87171", fontSize: "13px", marginBottom: "16px", textAlign: "right" }}>⚠️ {error}</div>}
          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "14px", background: "#fff", color: "#000", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif" }}>
            {loading ? "جاري الدخول..." : "دخول →"}
          </button>
        </form>
      </div>
    </div>
  )
}