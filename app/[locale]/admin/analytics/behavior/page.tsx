"use client"
import Link from "next/link"

export default function BehaviorPage() {
  return (
    <div style={{ minHeight:"100vh", background:"#EEEEEE", direction:"rtl", fontFamily:"Cairo,system-ui,sans-serif" }}>
      <div style={{ padding:"16px 20px", borderBottom:"1px solid #e5e5e5", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:"#fff", zIndex:10, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
        <Link href="/admin" style={{ color:"#888", fontSize:"13px" }}>← رجوع</Link>
        <span style={{ fontWeight:"700", fontSize:"16px" }}>سلوك الزوار</span>
        <div />
      </div>
      <div style={{ padding:16, maxWidth:"700px", margin:"0 auto", textAlign:"center", paddingTop:60 }}>
        <div style={{ fontSize:48, marginBottom:16 }}>📊</div>
        <p style={{ fontWeight:800, fontSize:16, color:"#111", marginBottom:8 }}>قريباً</p>
        <p style={{ fontSize:13, color:"#888" }}>تحليل سلوك الزوار وتتبع الصفحات</p>
      </div>
    </div>
  )
}
