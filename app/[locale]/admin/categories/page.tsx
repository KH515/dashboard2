"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function CategoriesPage() {
  const [cats, setCats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showAdd, setShowAdd] = useState(false)
  const [editCat, setEditCat] = useState<any>(null)
  const [name, setName] = useState("")
  const [parentId, setParentId] = useState<number|null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadCats() }, [])

  const loadCats = async () => {
    const res = await fetch("/api/admin/categories")
    const data = await res.json()
    setCats(data.categories || [])
    setLoading(false)
  }

  const save = async () => {
    if (!name.trim()) return
    setSaving(true)
    if (editCat) {
      await fetch("/api/admin/categories/" + editCat.id, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, parent_id: parentId }) })
    } else {
      await fetch("/api/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, parent_id: parentId }) })
    }
    await loadCats()
    setName(""); setParentId(null); setEditCat(null); setShowAdd(false); setSaving(false)
  }

  const deleteCat = async (id: number) => {
    if (!confirm("حذف هذا القسم؟")) return
    await fetch("/api/admin/categories/" + id, { method: "DELETE" })
    setCats(prev => prev.filter(c => c.id !== id))
  }

  const openEdit = (cat: any) => { setEditCat(cat); setName(cat.name); setParentId(cat.parent_id); setShowAdd(true) }

  const parents = cats.filter(c => !c.parent_id)
  const filtered = cats.filter(c => search === "" || c.name.includes(search))
  const inp = { width:"100%",padding:"12px 14px",background:"#fff",border:"1px solid #e5e5e5",borderRadius:"10px",color:"#111",fontSize:"13px",outline:"none",fontFamily:"Cairo,system-ui,sans-serif",boxSizing:"border-box" as const,marginBottom:"10px" }

  return (
    <div style={{ minHeight:"100vh",background:"#EEEEEE",color:"#111",fontFamily:"Cairo,system-ui,sans-serif",direction:"rtl" }}>
      <div style={{ padding:"16px 20px",borderBottom:"1px solid #e5e5e5",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:"#fff",zIndex:10 }}>
        <Link href="/admin/pages" style={{ color:"#555",fontSize:"13px",textDecoration:"none" }}>← رجوع</Link>
        <span style={{ fontWeight:"700",fontSize:"16px" }}>التصنيفات</span>
        <button onClick={()=>{setShowAdd(true);setEditCat(null);setName("");setParentId(null)}} style={{ fontSize:"12px",background:"#fff",color:"#000",padding:"6px 14px",borderRadius:"8px",fontWeight:"700",border:"none",cursor:"pointer",fontFamily:"Cairo,system-ui,sans-serif" }}>+ جديد</button>
      </div>

      {/* STATS */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",borderBottom:"1px solid #e5e5e5" }}>
        <div style={{ padding:"14px",textAlign:"center",borderLeft:"1px solid #111" }}>
          <p style={{ fontWeight:"800",fontSize:"22px",margin:0,color:"#FF835E" }}>{cats.filter(c=>!c.parent_id).length}</p>
          <p style={{ color:"#555",fontSize:"11px",margin:"4px 0 0" }}>قسم رئيسي</p>
        </div>
        <div style={{ padding:"14px",textAlign:"center" }}>
          <p style={{ fontWeight:"800",fontSize:"22px",margin:0,color:"#FF835E" }}>{cats.filter(c=>c.parent_id).length}</p>
          <p style={{ color:"#555",fontSize:"11px",margin:"4px 0 0" }}>قسم فرعي</p>
        </div>
      </div>

      <div style={{ padding:"16px",maxWidth:"700px",margin:"0 auto" }}>
        <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="ابحث عن قسم..."
          style={{ width:"100%",padding:"12px 16px",background:"#fff",border:"1px solid #e5e5e5",borderRadius:"12px",color:"#111",fontSize:"13px",outline:"none",fontFamily:"Cairo,system-ui,sans-serif",boxSizing:"border-box" as const,marginBottom:"16px" }} />

        {loading ? <p style={{ color:"#555",textAlign:"center",padding:"40px 0" }}>جاري التحميل...</p> : (
          <div style={{ display:"flex",flexDirection:"column",gap:"8px" }}>
            {parents.filter(c=>search===""||c.name.includes(search)).map(parent => (
              <div key={parent.id}>
                {/* PARENT */}
                <div style={{ background:"#fff",border:"1px solid #e5e5e5",borderRadius:"12px",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"4px" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:"10px" }}>
                    <div style={{ width:"8px",height:"8px",background:"#FF835E",borderRadius:"50%" }} />
                    <span style={{ fontWeight:"700",fontSize:"14px" }}>{parent.name}</span>
                    <span style={{ color:"#555",fontSize:"11px" }}>{cats.filter(c=>c.parent_id===parent.id).length} فرعي</span>
                  </div>
                  <div style={{ display:"flex",gap:"6px" }}>
                    <button onClick={()=>openEdit(parent)} style={{ background:"#f0f0f0",border:"none",color:"#111",padding:"5px 12px",borderRadius:"7px",fontSize:"11px",fontWeight:"700",cursor:"pointer",fontFamily:"Cairo,system-ui,sans-serif" }}>تعديل</button>
                    <button onClick={()=>deleteCat(parent.id)} style={{ background:"#1a0000",border:"none",color:"#f87171",padding:"5px 12px",borderRadius:"7px",fontSize:"11px",fontWeight:"700",cursor:"pointer",fontFamily:"Cairo,system-ui,sans-serif" }}>حذف</button>
                  </div>
                </div>
                {/* CHILDREN */}
                {cats.filter(c=>c.parent_id===parent.id&&(search===""||c.name.includes(search))).map(child => (
                  <div key={child.id} style={{ background:"#f8f8f8",border:"1px solid #e5e5e5",borderRadius:"10px",padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"4px",marginRight:"16px" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:"10px" }}>
                      <div style={{ width:"1px",height:"16px",background:"#eee" }} />
                      <div style={{ width:"6px",height:"6px",background:"#ddd",borderRadius:"50%" }} />
                      <span style={{ fontSize:"13px",color:"#888" }}>{child.name}</span>
                    </div>
                    <div style={{ display:"flex",gap:"6px" }}>
                      <button onClick={()=>openEdit(child)} style={{ background:"#f0f0f0",border:"none",color:"#111",padding:"4px 10px",borderRadius:"7px",fontSize:"11px",fontWeight:"700",cursor:"pointer",fontFamily:"Cairo,system-ui,sans-serif" }}>تعديل</button>
                      <button onClick={()=>deleteCat(child.id)} style={{ background:"#1a0000",border:"none",color:"#f87171",padding:"4px 10px",borderRadius:"7px",fontSize:"11px",fontWeight:"700",cursor:"pointer",fontFamily:"Cairo,system-ui,sans-serif" }}>حذف</button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showAdd && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center" }} onClick={()=>setShowAdd(false)}>
          <div style={{ background:"#fff",borderRadius:"20px 20px 0 0",padding:"20px",width:"100%",maxWidth:"500px" }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px" }}>
              <span style={{ fontWeight:"800",fontSize:"15px" }}>{editCat?"تعديل القسم":"قسم جديد"}</span>
              <button onClick={()=>setShowAdd(false)} style={{ background:"#f0f0f0",border:"none",color:"#111",width:"30px",height:"30px",borderRadius:"50%",cursor:"pointer",fontSize:"16px" }}>×</button>
            </div>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="اسم القسم" style={inp} />
            <div style={{ marginBottom:"10px" }}>
              <label style={{ fontSize:"11px",color:"#555",fontWeight:"700",display:"block",marginBottom:"6px" }}>القسم الرئيسي (اختياري)</label>
              <select value={parentId||""} onChange={e=>setParentId(e.target.value?Number(e.target.value):null)}
                style={{ width:"100%",padding:"12px 14px",background:"#fff",border:"1px solid #e5e5e5",borderRadius:"10px",color:"#111",fontSize:"13px",outline:"none",fontFamily:"Cairo,system-ui,sans-serif" }}>
                <option value="">-- قسم رئيسي --</option>
                {parents.filter(p=>!editCat||p.id!==editCat.id).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <button onClick={save} disabled={saving||!name.trim()} style={{ width:"100%",padding:"13px",background:saving||!name.trim()?"#333":"#fff",color:saving||!name.trim()?"#666":"#000",border:"none",borderRadius:"12px",fontWeight:"800",fontSize:"14px",cursor:saving||!name.trim()?"not-allowed":"pointer",fontFamily:"Cairo,system-ui,sans-serif" }}>
              {saving?"جاري الحفظ...":editCat?"حفظ التعديلات":"إضافة القسم"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
