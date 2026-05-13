import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getTranslations, getLocale } from "next-intl/server"
import { ProductActions } from "./actions"

export const dynamic = "force-dynamic"

async function getProduct(token: string, id: string, locale: string) {
  try {
    const apiLocale = locale === "ar" ? "sa-ar" : "sa-en"
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}?locale=${apiLocale}`, {
      headers: { "Authorization": `Bearer ${token}` },
      cache: "no-store"
    })
    return await res.json()
  } catch { return null }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  const locale = await getLocale()
  if (!token) redirect(`/${locale}/login`)

  const t = await getTranslations()
  const isAr = locale === "ar"
  const data = await getProduct(token, id, locale)
  const product = data?.product
  if (!product) redirect(`/${locale}/admin/products`)

  return (
    <div style={{ minHeight: "100vh", background:"#EEEEEE", color: "#111", fontFamily: "Cairo, system-ui, sans-serif", direction: isAr ? "rtl" : "ltr" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e5e5", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background:"#EEEEEE", zIndex: 10 }}>
        <Link href={`/${locale}/admin/products`} style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>
          {isAr ? "← رجوع" : "← Back"}
        </Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>
          {isAr ? "تفاصيل المنتج" : "Product Details"}
        </span>
        <a href={`https://klafstore.com/sa-${locale}/product/${id}`} target="_blank" rel="noopener noreferrer"
          style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>
          {isAr ? "زيارة ←" : "Visit →"}
        </a>
      </div>

      <div style={{ maxWidth: "500px", margin: "0 auto", padding: "16px" }}>
        {product.image && (
          <div style={{ height: "200px", borderRadius: "16px", overflow: "hidden", marginBottom: "20px", background: "#fff" }}>
            <img src={product.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "#fff", borderRadius: "14px", overflow: "hidden", marginBottom: "20px" }}>
          {[
            { label: t("common.name"), value: product.name },
            { label: t("products_page.price"), value: `${product.price} ${t("common.currency")}` },
            { label: t("products_page.stock"), value: product.stock },
            { label: t("products_page.category"), value: product.category || "—" },
            { label: t("orders_page.status"), value: product.is_active ? t("common.active") : t("common.inactive") },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "14px 16px", background: "#f8f8f8", borderBottom: "1px solid #e5e5e5" }}>
              <span style={{ color: "#555", fontSize: "13px" }}>{row.label}</span>
              <span style={{ fontSize: "13px", fontWeight: "600" }}>{row.value}</span>
            </div>
          ))}
        </div>

        <ProductActions productId={product.id} isActive={product.is_active} />
      </div>
    </div>
  )
}