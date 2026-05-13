"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"

export default function NewBrandPage() {
  const t = useTranslations()
  const locale = useLocale()
  const isAr = locale === "ar"
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "",
    name_en: "",
    username: "",
    logo: "",
    description: "",
    description_en: "",
  })

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (data.url) setForm(f => ({ ...f, logo: data.url }))
    } catch { setError(t("common.error")) }
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || t("common.error")); setLoading(false); return }
      router.push(`/${locale}/admin/brands`)
    } catch {
      setError(t("common.error"))
      setLoading(false)
    }
  }

  const inp = {
    width: "100%", padding: "13px 16px", background: "#fff", border: "1px solid #e5e5e5",
    borderRadius: "12px", color: "#111", fontSize: "14px", outline: "none",
    fontFamily: "Cairo, system-ui, sans-serif", boxSizing: "border-box" as const,
  }

  return (
    <div style={{ minHeight: "100vh", background:"#EEEEEE", color: "#111", fontFamily: "Cairo, system-ui, sans-serif", direction: isAr ? "rtl" : "ltr" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e5e5", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background:"#EEEEEE", zIndex: 10 }}>
        <Link href={`/${locale}/admin/brands`} style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>
          {isAr ? "← رجوع" : "← Back"}
        </Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>{t("brands_page.new_brand")}</span>
        <span />
      </div>

      <div style={{ padding: "24px 16px", maxWidth: "500px", margin: "0 auto" }}>
        <form onSubmit={handleSubmit}>

          <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
            <div onClick={() => fileRef.current?.click()}
              style={{ width: "80px", height: "80px", borderRadius: "20px", background: "#fff", border: "1px dashed #333", overflow: "hidden", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
              {form.logo
                ? <img src={form.logo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ color: "#555", fontSize: "24px" }}>+</span>
              }
            </div>
            <p style={{ color: "#555", fontSize: "12px", margin: 0 }}>{uploading ? t("common.uploading") : (isAr ? "اضغط لرفع الشعار" : "Click to upload logo")}</p>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>
              {isAr ? "اسم البراند (عربي) *" : "Brand name (Arabic) *"}
            </label>
            <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder={isAr ? "نايكي" : "Brand in Arabic"} style={{...inp, textAlign:"right" as const}} dir="rtl" />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>
              {isAr ? "اسم البراند (إنجليزي)" : "Brand name (English)"}
            </label>
            <input type="text" value={form.name_en} onChange={e => setForm({...form, name_en: e.target.value})} placeholder="Nike" style={inp} dir="ltr" />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>{t("brands_page.username")} *</label>
            <input type="text" required value={form.username} onChange={e => setForm({...form, username: e.target.value.toLowerCase().replace(/\s/g, "")})} placeholder="nike" style={inp} />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>
              {isAr ? "وصف البراند (عربي)" : "Brand description (Arabic)"}
            </label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              placeholder={isAr ? "وصف مختصر..." : "Description in Arabic..."} rows={3}
              style={{ ...inp, resize: "vertical" as const, textAlign:"right" as const }} dir="rtl" />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "700" }}>
              {isAr ? "وصف البراند (إنجليزي)" : "Brand description (English)"}
            </label>
            <textarea value={form.description_en} onChange={e => setForm({...form, description_en: e.target.value})}
              placeholder="Brief description in English..." rows={3}
              style={{ ...inp, resize: "vertical" as const }} dir="ltr" />
          </div>

          {error && <div style={{ color: "#dc2626", fontSize: "13px", marginBottom: "16px", padding: "12px", background: "#fff0f0", borderRadius: "10px" }}>⚠️ {error}</div>}

          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "15px", background: "#FF835E", color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "800", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif", opacity: loading ? 0.6 : 1 }}>
            {loading ? t("common.saving") : t("brands_page.new_brand")}
          </button>
        </form>
      </div>
    </div>
  )
}