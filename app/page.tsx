"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const banners = [
  { title: "انضم لشبكة البائعين", desc: "افتح متجرك وابدأ البيع في كلاف ستور اليوم" },
  { title: "اكسب مع العمولة", desc: "شارك منتجاتنا واكسب عمولة على كل عملية بيع" },
  { title: "نمو مستمر", desc: "آلاف العملاء ينتظرون منتجاتك" },
]

export default function HomePage() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent(p => (p + 1) % banners.length), 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" }}>
      
      {/* Header */}
      <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #111" }}>
        <img src="https://cdn.klafstore.com/logo.png.png" alt="كلاف ستور" style={{ height: "40px" }} />
        <a href="https://klafstore.com" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>زيارة المتجر ←</a>
      </div>

      {/* Banner */}
      <div style={{ padding: "60px 24px", textAlign: "center", minHeight: "300px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transition: "all 0.5s", marginBottom: "16px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "12px" }}>{banners[current].title}</h1>
          <p style={{ color: "#555", fontSize: "16px" }}>{banners[current].desc}</p>
        </div>
        <div style={{ display: "flex", gap: "8px", marginTop: "24px" }}>
          {banners.map((_, i) => (
            <div key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? "24px" : "8px", height: "8px", borderRadius: "4px", background: i === current ? "#fff" : "#333", cursor: "pointer", transition: "all 0.3s" }} />
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div style={{ padding: "0 24px 60px", display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px", margin: "0 auto" }}>
        <Link href="/seller/login" style={{ textDecoration: "none" }}>
          <div style={{ background: "#fff", color: "#000", padding: "18px", borderRadius: "14px", textAlign: "center", fontWeight: "800", fontSize: "16px" }}>
            دخول البائعين
          </div>
        </Link>
        <Link href="/affiliate/login" style={{ textDecoration: "none" }}>
          <div style={{ background: "#111", color: "#fff", border: "1px solid #222", padding: "18px", borderRadius: "14px", textAlign: "center", fontWeight: "800", fontSize: "16px" }}>
            دخول شركاء العمولة
          </div>
        </Link>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #111", padding: "20px 24px", display: "flex", justifyContent: "center", gap: "24px" }}>
        <a href="#" style={{ color: "#555", fontSize: "12px", textDecoration: "none" }}>سياسة الخصوصية</a>
        <a href="#" style={{ color: "#555", fontSize: "12px", textDecoration: "none" }}>شروط الاستخدام</a>
        <a href="#" style={{ color: "#555", fontSize: "12px", textDecoration: "none" }}>تواصل معنا</a>
      </div>

    </div>
  )
}