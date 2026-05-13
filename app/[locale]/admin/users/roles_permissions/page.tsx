"use client"
import Link from "next/link"

export default function RolesPage() {
  const roles = [
    { name:"أدمن", desc:"صلاحيات كاملة على المنصة", color:"#FFF0EB", stroke:"#FF835E", perms:["كل شي"] },
    { name:"موظف", desc:"إدارة الطلبات والمنتجات فقط", color:"#EEF1FF", stroke:"#2A3FA0", perms:["الطلبات","المنتجات","العملاء"] },
    { name:"بائع", desc:"إدارة منتجاته فقط", color:"#E8F5EE", stroke:"#2A7A45", perms:["منتجاته","طلباته"] },
    { name:"عميل", desc:"تصفح وشراء فقط", color:"#f5f5f5", stroke:"#888", perms:["التصفح","الشراء","ملفه الشخصي"] },
  ]

  return (
    <div style={{ minHeight:"100vh", background:"#EEEEEE", direction:"rtl", fontFamily:"Cairo,system-ui,sans-serif" }}>
      <div style={{ padding:"16px 20px", borderBottom:"1px solid #e5e5e5", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:"#fff", zIndex:10, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
        <Link href="/admin" style={{ color:"#888", fontSize:"13px" }}>← رجوع</Link>
        <span style={{ fontWeight:"700", fontSize:"16px" }}>الأدوار والصلاحيات</span>
        <div />
      </div>
      <div style={{ padding:16, maxWidth:"700px", margin:"0 auto", display:"flex", flexDirection:"column", gap:10 }}>
        {roles.map(r => (
          <div key={r.name} style={{ background:"#fff", borderRadius:14, padding:"14px 16px", border:"1px solid #e5e5e5", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <div style={{ width:36, height:36, borderRadius:9, background:r.color, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="16" height="16" fill="none" stroke={r.stroke} strokeWidth="1.75" strokeLinecap="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/></svg>
              </div>
              <div>
                <p style={{ margin:0, fontWeight:700, fontSize:14, color:"#111" }}>{r.name}</p>
                <p style={{ margin:0, fontSize:11, color:"#888" }}>{r.desc}</p>
              </div>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap" as const, gap:6 }}>
              {r.perms.map(p => <span key={p} style={{ background:r.color, color:r.stroke, fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>{p}</span>)}
            </div>
          </div>
        ))}
        <div style={{ background:"#fff", borderRadius:14, padding:16, border:"1px solid #e5e5e5", textAlign:"center" }}>
          <p style={{ fontSize:13, color:"#888", margin:0 }}>🔒 إدارة الصلاحيات المتقدمة قريباً</p>
        </div>
      </div>
    </div>
  )
}
