"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SellerLoginPage() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"login" | "code">("login")
  const [email, setEmail] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [code, setCode] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password, expectedRole: "seller" }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "حصل خطأ"); setLoading(false); return }
      setEmail(data.email)
      setAccessToken(data.accessToken)
      setLoading(false)
      setStep("code")
    } catch {
      setError("تعذر الاتصال بالسيرفر")
      setLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, accessToken }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "الكود غير صحيح"); setLoading(false); return }
      router.push("/seller")
    } catch {
      setError("تعذر الاتصال بالسيرفر")
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl", display: "flex", flexDirection: "column" }}>
      
      {/* Header */}
      <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #111" }}>
        <Link href="/" style={{ textDecoration: "none", color: "#555", fontSize: "13px" }}>← رجوع</Link>
        <img src="https://cdn.klafstore.com/logo.png.png" alt="كلاف ستور" style={{ height: "36px" }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ width: "100%", maxWidth: "380px" }}>
          
          {step === "login" ? (
            <>
              <div style={{ marginBottom: "32px" }}>
                <p style={{ color: "#555", fontSize: "13px", marginBottom: "4px" }}>مرحباً بك في</p>
                <h1 style={{ fontSize: "26px", fontWeight: "800", marginBottom: "8px" }}>لوحة تحكم البائعين</h1>
                <p style={{ color: "#444", fontSize: "14px" }}>أدر متجرك ومنتجاتك وطلباتك من مكان واحد</p>
              </div>

              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: "12px" }}>
                  <input type="text" value={identifier} onChange={e => setIdentifier(e.target.value)}
                    placeholder="الإيميل أو اليوزرنيم" required autoComplete="username"
                    style={{ width: "100%", padding: "14px 16px", background: "#111", border: "1px solid #222", borderRadius: "12px", color: "white", fontSize: "15px", outline: "none", textAlign: "right", fontFamily: "Cairo, system-ui, sans-serif", boxSizing: "border-box" }} />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="كلمة المرور" required autoComplete="current-password"
                    style={{ width: "100%", padding: "14px 16px", background: "#111", border: "1px solid #222", borderRadius: "12px", color: "white", fontSize: "15px", outline: "none", textAlign: "right", fontFamily: "Cairo, system-ui, sans-serif", boxSizing: "border-box" }} />
                </div>
                {error && <div style={{ color: "#f87171", fontSize: "13px", marginBottom: "16px", padding: "12px", background: "rgba(239,68,68,0.08)", borderRadius: "10px" }}>⚠️ {error}</div>}
                <button type="submit" disabled={loading}
                  style={{ width: "100%", padding: "15px", background: "#fff", color: "#000", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "800", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif", opacity: loading ? 0.6 : 1 }}>
                  {loading ? "جاري التحقق..." : "التالي →"}
                </button>
              </form>
            </>
          ) : (
            <>
              <div style={{ marginBottom: "32px" }}>
                <h1 style={{ fontSize: "26px", fontWeight: "800", marginBottom: "8px" }}>التحقق من الهوية</h1>
                <p style={{ color: "#555", fontSize: "14px" }}>أرسلنا كود التحقق إلى {email}</p>
              </div>
              <form onSubmit={handleVerify}>
                <div style={{ marginBottom: "20px" }}>
                  <input type="text" value={code} onChange={e => setCode(e.target.value)}
                    placeholder="123456" required maxLength={6}
                    style={{ width: "100%", padding: "14px 16px", background: "#111", border: "1px solid #222", borderRadius: "12px", color: "white", fontSize: "28px", outline: "none", textAlign: "center", fontFamily: "Cairo, system-ui, sans-serif", letterSpacing: "10px", boxSizing: "border-box" }} />
                </div>
                {error && <div style={{ color: "#f87171", fontSize: "13px", marginBottom: "16px", padding: "12px", background: "rgba(239,68,68,0.08)", borderRadius: "10px" }}>⚠️ {error}</div>}
                <button type="submit" disabled={loading}
                  style={{ width: "100%", padding: "15px", background: "#fff", color: "#000", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "800", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif", opacity: loading ? 0.6 : 1 }}>
                  {loading ? "جاري التحقق..." : "دخول →"}
                </button>
                <button type="button" onClick={() => setStep("login")}
                  style={{ width: "100%", padding: "14px", background: "transparent", color: "#555", border: "none", fontSize: "13px", cursor: "pointer", marginTop: "8px", fontFamily: "Cairo, system-ui, sans-serif" }}>
                  ← رجوع
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "16px 24px", borderTop: "1px solid #111", display: "flex", justifyContent: "center", gap: "20px" }}>
        <a href="#" style={{ color: "#444", fontSize: "11px", textDecoration: "none" }}>سياسة الخصوصية</a>
        <a href="#" style={{ color: "#444", fontSize: "11px", textDecoration: "none" }}>شروط الاستخدام</a>
      </div>
    </div>
  )
}