import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getTranslations, getLocale } from "next-intl/server"

export const dynamic = "force-dynamic"

async function getUsers(token: string) {
  try {
    const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/users", {
      headers: { "Authorization": `Bearer ${token}` },
      cache: "no-store"
    })
    const data = await res.json()
    return data.users || []
  } catch { return [] }
}

export default async function CustomersPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  const locale = await getLocale()
  if (!token) redirect(`/${locale}/login`)

  const t = await getTranslations()
  const isAr = locale === "ar"

  const allUsers = await getUsers(token)
  const customers = allUsers.filter((u: any) => u.role === "customer")

  const tabs = [
    { label: t("customers_page.title"), role: "customer", href: `/${locale}/admin/customers` },
    { label: t("vendors_page.title"), role: "seller", href: `/${locale}/admin/customers/sellers` },
    { label: isAr ? "العمولة" : "Affiliate", role: "affiliate", href: `/${locale}/admin/customers/affiliate` },
    { label: isAr ? "الموظفون" : "Staff", role: "staff", href: `/${locale}/admin/customers/staff` },
  ]

  return (
    <div style={{ minHeight: "100vh", background:"#EEEEEE", color: "#111", fontFamily: "Cairo, system-ui, sans-serif", direction: isAr ? "rtl" : "ltr" }}>

      <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e5e5", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,.06)", zIndex: 10 }}>
        <Link href={`/${locale}/admin`} style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>
          {isAr ? "← رجوع" : "← Back"}
        </Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>{t("nav.users")}</span>
        <span style={{ color: "#555", fontSize: "12px" }}>{customers.length}</span>
      </div>

      <div style={{ display: "flex", gap: "4px", padding: "12px 16px", borderBottom: "1px solid #e5e5e5", overflowX: "auto" }}>
        {tabs.map(tab => (
          <Link key={tab.href} href={tab.href} style={{ textDecoration: "none" }}>
            <div style={{ padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap", background: tab.role === "customer" ? "#FF835E" : "#f0f0f0", color: tab.role === "customer" ? "#fff" : "#555", border: "1px solid #e5e5e5" }}>
              {tab.label}
            </div>
          </Link>
        ))}
      </div>

      <div style={{ padding: "16px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
        {customers.map((user: any) => (
          <Link key={user.id} href={`/${locale}/admin/customers/${user.id}`} style={{ textDecoration: "none", color:"#111" }}>
            <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "14px", padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#f0f0f0", border: "1px solid #e5e5e5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "18px", flexShrink: 0 }}>
                {user.name?.charAt(0) || "?"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: "700", fontSize: "14px", margin: 0, marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</p>
                <p style={{ color: "#555", fontSize: "12px", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
              </div>
              <svg width="16" height="16" fill="none" stroke="#333" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points={isAr ? "15 18 9 12 15 6" : "9 18 15 12 9 6"}/>
              </svg>
            </div>
          </Link>
        ))}
        {customers.length === 0 && (
          <p style={{ color: "#555", textAlign: "center", padding: "40px", gridColumn: "1/-1" }}>{t("customers_page.no_customers")}</p>
        )}
      </div>
    </div>
  )
}