import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getTranslations, getLocale } from "next-intl/server"
import { UserActions } from "./actions"

export const dynamic = "force-dynamic"

async function getUser(token: string, id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, {
      headers: { "Authorization": `Bearer ${token}` },
      cache: "no-store"
    })
    return await res.json()
  } catch { return null }
}

export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  const locale = await getLocale()
  if (!token) redirect(`/${locale}/login`)

  const t = await getTranslations()
  const isAr = locale === "ar"

  const { id } = await params
  const data = await getUser(token, id)
  const user = data?.user
  if (!user) redirect(`/${locale}/admin/customers`)

  const roleLabel = (role: string) => {
    if (role === "customer") return isAr ? "عميل" : "Customer"
    if (role === "seller") return isAr ? "بائع" : "Seller"
    if (role === "affiliate") return isAr ? "عمولة" : "Affiliate"
    if (role === "staff") return isAr ? "موظف" : "Staff"
    if (role === "admin") return isAr ? "مشرف" : "Admin"
    return role
  }

  const rows = [
    { label: isAr ? "الدور" : "Role", value: roleLabel(user.role) },
    { label: t("vendors_page.username") || (isAr ? "اليوزرنيم" : "Username"), value: user.username || "—" },
    { label: t("customers_page.phone"), value: user.phone || "—" },
    { label: t("orders_page.status"), value: user.is_active ? t("common.active") : t("common.inactive") },
    { label: t("customers_page.joined"), value: user.created_at ? new Date(user.created_at).toLocaleDateString(isAr ? "ar-SA" : "en-US") : "—" },
    ...(user.role === "seller" || user.role === "affiliate" ? [{ label: t("vendors_page.iban"), value: user.iban || "—" }] : []),
  ]

  return (
    <div style={{ minHeight: "100vh", background:"#EEEEEE", color: "#111", fontFamily: "Cairo, system-ui, sans-serif", direction: isAr ? "rtl" : "ltr" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e5e5", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background:"#EEEEEE", zIndex: 10 }}>
        <Link href={`/${locale}/admin/customers`} style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>
          {isAr ? "← رجوع" : "← Back"}
        </Link>
        <span style={{ fontWeight: "700", fontSize: "16px" }}>{t("customers_page.customer_details")}</span>
        <span />
      </div>

      <div style={{ padding: "24px 16px", maxWidth: "500px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#f0f0f0", border: "1px solid #e5e5e5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "24px" }}>
            {user.name?.charAt(0) || "?"}
          </div>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: "800", margin: 0 }}>{user.name}</h1>
            <p style={{ color: "#555", fontSize: "13px", margin: "4px 0 0" }}>{user.email}</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "#fff", borderRadius: "14px", overflow: "hidden", marginBottom: "20px" }}>
          {rows.map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "14px 16px", background: "#f8f8f8", borderBottom: "1px solid #e5e5e5" }}>
              <span style={{ color: "#555", fontSize: "13px" }}>{row.label}</span>
              <span style={{ fontSize: "13px", fontWeight: "600" }}>{row.value}</span>
            </div>
          ))}
        </div>

        {(user.role === "seller" || user.role === "affiliate") && user.username && (
          <a href={`https://klafstore.com/sa-${locale}/seller/${user.username}`} target="_blank" rel="noopener noreferrer"
            style={{ display: "block", width: "100%", padding: "14px", background: "#fff", border: "1px solid #e5e5e5", color: "#111", borderRadius: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "Cairo, system-ui, sans-serif", textAlign: "center", textDecoration: "none", marginBottom: "10px", boxSizing: "border-box" }}>
            {isAr ? "عرض في المتجر ←" : "View in store →"}
          </a>
        )}

        <UserActions userId={user.id} isActive={user.is_active} role={user.role} />
      </div>
    </div>
  )
}