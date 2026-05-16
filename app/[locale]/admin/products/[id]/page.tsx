"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

export default function ProductPage() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const id = params.id as string
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/products/${id}`, { credentials: "include" })
      .then(r => r.json())
      .then(d => { if (d.product) setProduct(d.product); else router.push(`/${locale}/admin/products`) })
      .catch(() => router.push(`/${locale}/admin/products`))
      .finally(() => setLoading(false))
  }, [id])

  const deleteProduct = async () => {
    if (!confirm("هل أنت متأكد من حذف المنتج؟")) return
    setDeleting(true)
    await fetch(`/api/admin/products/${id}`, { method: "DELETE", credentials: "include" })
    router.push(`/${locale}/admin/products`)
  }

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#F5F5F7", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Cairo,system-ui,sans-serif" }}>
      <p style={{ color:"#aaa" }}>جاري التحميل...</p>
    </div>
  )

  return (
    <div style={{ minHeight:"100vh", background:"#F5F5F7", fontFamily:"Cairo,system-ui,sans-serif", direction:"rtl" }}>
      
      {/* Header */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e5e5e5", position:"sticky", top:0, zIndex:10, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
        <div style={{ maxWidth:"700px", margin:"0 auto", padding:"0 16px", display:"flex", alignItems:"center", justifyContent:"space-between", height:"56px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <Link href={`/${locale}/admin/products`} style={{ width:32, height:32, borderRadius:"50%", background:"#f5f5f7", border:"1px solid #e5e5e5", display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none", color:"#555" }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
            </Link>
            <span style={{ fontSize:"17px", fontWeight:"900", color:"#111" }}>تفاصيل المنتج</span>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <Link href={`/${locale}/admin/products/${id}/edit`} style={{ background:"#111", color:"#fff", padding:"7px 16px", borderRadius:"10px", textDecoration:"none", fontSize:"13px", fontWeight:"700" }}>تعديل</Link>
            <button onClick={deleteProduct} disabled={deleting} style={{ background:"#fef2f2", color:"#e53e3e", padding:"7px 16px", borderRadius:"10px", border:"1px solid #fecaca", cursor:"pointer", fontSize:"13px", fontWeight:"700", fontFamily:"Cairo,system-ui,sans-serif" }}>حذف</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:"700px", margin:"0 auto", padding:"20px 16px" }}>

        {/* Image */}
        {product?.image && (
          <div style={{ background:"#fff", borderRadius:"16px", overflow:"hidden", marginBottom:12, border:"1px solid #e5e5e5" }}>
            <img src={product.image} style={{ width:"100%", height:280, objectFit:"cover" }} alt={product.name} />
          </div>
        )}

        {/* Info */}
        <div style={{ background:"#fff", borderRadius:"16px", padding:"20px", marginBottom:12, border:"1px solid #e5e5e5" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
            <h1 style={{ fontSize:"20px", fontWeight:"900", margin:0, color:"#111" }}>{product?.name}</h1>
            <span style={{ background: product?.is_active ? "#f0fdf4" : "#fef2f2", color: product?.is_active ? "#166534" : "#991b1b", padding:"4px 10px", borderRadius:"20px", fontSize:"11px", fontWeight:"700" }}>
              {product?.is_active ? "نشط" : "غير نشط"}
            </span>
          </div>
          {product?.category && <p style={{ color:"#aaa", fontSize:"12px", margin:"0 0 12px" }}>{product.category}</p>}
          {product?.description && <p style={{ color:"#555", fontSize:"14px", lineHeight:1.7, margin:0 }}>{product.description}</p>}
        </div>

        {/* Pricing */}
        <div style={{ background:"#fff", borderRadius:"16px", padding:"20px", marginBottom:12, border:"1px solid #e5e5e5" }}>
          <p style={{ fontSize:"13px", fontWeight:"800", color:"#111", margin:"0 0 16px" }}>السعر والمخزون</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
            <div style={{ background:"#f5f5f7", borderRadius:"12px", padding:"12px", textAlign:"center" as const }}>
              <p style={{ margin:0, fontSize:"10px", color:"#aaa", fontWeight:"600" }}>السعر</p>
              <p style={{ margin:"4px 0 0", fontSize:"18px", fontWeight:"900", color:"#FF835E" }}>{product?.price} ر.س</p>
            </div>
            {product?.sale_price && (
              <div style={{ background:"#f0fdf4", borderRadius:"12px", padding:"12px", textAlign:"center" as const }}>
                <p style={{ margin:0, fontSize:"10px", color:"#aaa", fontWeight:"600" }}>سعر التخفيض</p>
                <p style={{ margin:"4px 0 0", fontSize:"18px", fontWeight:"900", color:"#166534" }}>{product.sale_price} ر.س</p>
              </div>
            )}
            <div style={{ background:"#f5f5f7", borderRadius:"12px", padding:"12px", textAlign:"center" as const }}>
              <p style={{ margin:0, fontSize:"10px", color:"#aaa", fontWeight:"600" }}>المخزون</p>
              <p style={{ margin:"4px 0 0", fontSize:"18px", fontWeight:"900", color: product?.stock > 0 ? "#2A7A45" : "#e53e3e" }}>{product?.stock}</p>
            </div>
          </div>
        </div>

        {/* Extra */}
        {(product?.sku || product?.weight) && (
          <div style={{ background:"#fff", borderRadius:"16px", padding:"20px", marginBottom:12, border:"1px solid #e5e5e5" }}>
            <p style={{ fontSize:"13px", fontWeight:"800", color:"#111", margin:"0 0 12px" }}>معلومات إضافية</p>
            <div style={{ display:"flex", flexDirection:"column" as const, gap:8 }}>
              {product.sku && <div style={{ display:"flex", justifyContent:"space-between", fontSize:"13px" }}><span style={{ color:"#888" }}>SKU</span><span style={{ fontWeight:"700" }}>{product.sku}</span></div>}
              {product.weight && <div style={{ display:"flex", justifyContent:"space-between", fontSize:"13px" }}><span style={{ color:"#888" }}>الوزن</span><span style={{ fontWeight:"700" }}>{product.weight} كجم</span></div>}
            </div>
          </div>
        )}

        {/* Date */}
        <div style={{ textAlign:"center" as const, color:"#bbb", fontSize:"12px", marginBottom:24 }}>
          أضيف في {product?.created_at ? new Date(product.created_at).toLocaleDateString("ar-SA") : "—"}
        </div>

      </div>
    </div>
  )
}