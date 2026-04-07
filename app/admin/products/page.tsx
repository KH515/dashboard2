import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

async function getCounts(token: string) {
  try {
    const [productsRes, sellersRes, affiliateRes] = await Promise.all([
      fetch("https://api.klafstore.com/api/products?limit=100", {
        headers: { "Authorization": `Bearer ${token}` },
        cache: "no-store"
      }),
      fetch("https://api.klafstore.com/api/users/sellers-list", {
        headers: { "Authorization": `Bearer ${token}` },
        cache: "no-store"
      }),
      fetch("https://api.klafstore.com/api/users", {
        headers: { "Authorization": `Bearer ${token}` },
        cache: "no-store"
      }),
    ])
    const products = await productsRes.json()
    const sellers = await sellersRes.json()
    const users = await affiliateRes.json()
    const allProducts = products.products || []
    const allUsers = users.users || []
    const klafCount = allProducts.filter((p: any) => !p.seller_id).length
    const affiliateCount = allUsers.filter((u: any) => u.role === "affiliate").length
    return { klafCount, sellersCount: (sellers.sellers || []).length, affiliateCount }
  } catch { return { klafCount: 0, sellersCount: 0, affiliateCount: 0 } }
}

export default async function ProductsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) redirect("/login")

  const { klafCount, sellersCount, affiliateCount } = await getCounts(token)

  const sections = [
    { href: "/admin/products/users/klaf", label: "منتجات كلاف", count: klafCount },
    { href: "/admin/products/sellers", label: "منتجات البائعين", count: sellersCount },
    { href: "/admin/products/affiliate", label: "منتجات العمولة", count: affiliateCount },
  ]

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#000", zIndex: 10 }}>
        <Link href="/admin" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>← رجوع</Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>المنتجات</span>
        <span />
      </div>

      <div style={{ padding: "24px 16px", maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          {sections.map(section => (
            <Link key={section.href} href={section.href} style={{ textDecoration: "none" }}>
              <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "16px", padding: "20px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "24px", fontWeight: "800", color: "#fff" }}>{section.count}</span>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#555" }}>{section.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}