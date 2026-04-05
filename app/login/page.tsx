"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
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
        body: JSON.stringify({ identifier, password }),
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
      router.push("/admin")
    } catch {
      setError("تعذر الاتصال بالسيرفر")
      setLoading(false)
    }
  }

  const inp = {
    width: "100%", padding: "13px 16px", background: "#111", border: "1px solid #222",
    borderRadius: "12px", color: "white", fontSize: "14px", outline: "none",
    textAlign: "right" as const, fontFamily: "Cairo, system-ui, sans-serif"
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" }}>
      <div style={{ width: "100%", maxWidth: "380px", padding: "24px" }}>
        {step === "login" ? (
          <>
            <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: "800", marginBottom: "8px" }}>تسجيل الدخول</h1>
            <p style={{ color: "#555", fontSize: "14px", marginBottom: "32px" }}>مرحباً بك في لوحة التحكم</p>
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: "16px" }}>
                <input type="text" value={identifier} onChange={e => setIdentifier(e.target.value)}
                  placeholder="الإيميل أو اليوزرنيم" required autoComplete="username" style={inp} />
              </div>
              <div style={{ marginBottom: "24px" }}>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="كلمة المرور" required autoComplete="current-password" style={inp} />
              </div>
              {error && <div style={{ color: "#f87171", fontSize: "13px", marginBottom: "16px" }}>⚠️ {error}</div>}
              <button type="submit" disabled={loading}
                style={{ width: "100%", padding: "14px", background: "#fff", color: "#000", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif", opacity: loading ? 0.6 : 1 }}>
                {loading ? "جاري التحقق..." : "التالي →"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: "800", marginBottom: "8px" }}>التحقق من الهوية</h1>
            <p style={{ color: "#555", fontSize: "14px", marginBottom: "32px" }}>أرسلنا كود التحقق إلى {email}</p>
            <form onSubmit={handleVerify}>
              <div style={{ marginBottom: "24px" }}>
                <input type="text" value={code} onChange={e => setCode(e.target.value)}
                  placeholder="123456" required maxLength={6}
                  style={{ ...inp, textAlign: "center", fontSize: "24px", letterSpacing: "8px" }} />
              </div>
              {error && <div style={{ color: "#f87171", fontSize: "13px", marginBottom: "16px" }}>⚠️ {error}</div>}
              <button type="submit" disabled={loading}
                style={{ width: "100%", padding: "14px", background: "#fff", color: "#000", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif", opacity: loading ? 0.6 : 1 }}>
                {loading ? "جاري التحقق..." : "دخول →"}
              </button>
              <button type="button" onClick={() => setStep("login")}
                style={{ width: "100%", padding: "14px", background: "transparent", color: "#555", border: "none", borderRadius: "12px", fontSize: "13px", cursor: "pointer", marginTop: "8px", fontFamily: "Cairo, system-ui, sans-serif" }}>
                ← رجوع
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}