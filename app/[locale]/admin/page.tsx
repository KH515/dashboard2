import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getTranslations, getLocale } from "next-intl/server"

export const dynamic = "force-dynamic"

async function getStats(token: string) {
  try {
    const [usersRes, ordersRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users", { headers: { "Authorization": `Bearer ${token}` }, cache: "no-store" }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders", { headers: { "Authorization": `Bearer ${token}` }, cache: "no-store" }),
    ])
    const users = await usersRes.json()
    const orders = await ordersRes.json()
    const allUsers = users.users || []
    const allOrders = orders.orders || []
    return {
      customers: allUsers.filter((u: any) => u.role === "customer").length,
      sellers: allUsers.filter((u: any) => u.role === "seller").length,
      orders: allOrders.length,
      revenue: allOrders.filter((o:any)=>o.status==="delivered").reduce((s:number,o:any)=>s+(o.total_price||0),0),
    }
  } catch { return { customers: 0, sellers: 0, orders: 0, revenue: 0 } }
}

const Icon = ({ d, color = "#FF835E" }: { d: string; color?: string }) => (
  <svg width="20" height="20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d={d} /></svg>
)

export default async function AdminPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  const locale = await getLocale()
  if (!token) redirect(`/${locale}/login`)

  const t = await getTranslations()
  const stats = await getStats(token)
  const now = new Date().toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" })
  const isAr = locale === "ar"
  const dir = isAr ? "rtl" : "ltr"

  // helper لإضافة locale للروابط
  const L = (path: string) => `/${locale}${path}`

  const sections = [
    { title: t("store_management.title"), color:"#FF835E", items: [
      { href: L("/admin/store_management/settings"), label: t("store_management.settings"), desc: isAr ? "عام، شعار، عملة" : "General, logo, currency", icon:"M12 15a3 3 0 100-6 3 3 0 000 6z" },
      { href: L("/admin/store_management/design"), label: t("store_management.design"), desc: isAr ? "ألوان، خطوط، قوالب" : "Colors, fonts, templates", icon:"M4 6h16M4 12h16M4 18h7" },
      { href: L("/admin/store_management/header"), label: t("store_management.header"), desc: isAr ? "البحث، البنرات، التحكم" : "Search, banners, controls", icon:"M3 12h18M3 6h18M3 18h18" },
      { href: L("/admin/store_management/footer"), label: t("store_management.footer"), desc: isAr ? "الروابط والشبكات الاجتماعية" : "Links and social media", icon:"M3 18h18M3 12h18M3 6h18" },
      { href: L("/admin/store_management/notifications"), label: t("store_management.notifications"), desc: isAr ? "قوالب Email و SMS" : "Email and SMS templates", icon:"M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" },
      { href: L("/admin/store_management/languages"), label: t("store_management.languages"), desc: isAr ? "اللغات المدعومة" : "Supported languages", icon:"M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6" },
      { href: L("/admin/store_management/seo"), label: t("store_management.seo"), desc: isAr ? "Meta tags و Analytics" : "Meta tags and Analytics", icon:"M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" },
      { href: L("/admin/store_management/branches"), label: t("store_management.branches"), desc: isAr ? "إدارة فروع المتجر" : "Manage store branches", icon:"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 13a3 3 0 100-6 3 3 0 000 6z" },
      { href: L("/admin/store_management/policies"), label: t("store_management.policies"), desc: isAr ? "الشروط، الخصوصية، الإرجاع" : "Terms, Privacy, Returns", icon:"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
      { href: L("/admin/store_management/shipping_payment"), label: t("store_management.shipping_payment"), desc: isAr ? "بوابات الدفع، الشحن" : "Payment gateways, shipping", icon:"M5 12h14M12 5l7 7-7 7" },
    ]},
    { title: t("nav.catalog"), color:"#2A7A45", items: [
      { href: L("/admin/products"), label: t("products_page.title"), desc: isAr ? "إضافة وتعديل المنتجات" : "Add and edit products", icon:"M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" },
      { href: L("/admin/catalog/categories"), label: t("categories_page.title"), desc: isAr ? "أقسام المتجر" : "Store sections", icon:"M4 6h16M4 12h8M4 18h12" },
      { href: L("/admin/catalog/brands"), label: t("brands_page.title"), desc: isAr ? "العلامات التجارية" : "Trademarks", icon:"M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" },
    ]},
    { title: t("nav.marketing"), color:"#2A3FA0", items: [
      { href: L("/admin/marketing/coupons"), label: isAr ? "الكوبونات" : "Coupons", desc: isAr ? "أكواد الخصم" : "Discount codes", icon:"M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" },
      { href: L("/admin/marketing/campaigns"), label: isAr ? "الحملات" : "Campaigns", desc: isAr ? "الحملات التسويقية" : "Marketing campaigns", icon:"M22 12h-4l-3 9L9 3l-3 9H2" },
      { href: L("/admin/marketing/ads"), label: isAr ? "الإعلانات" : "Ads", desc: isAr ? "البنرات والإعلانات" : "Banners and ads", icon:"M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" },
    ]},
    { title: t("nav.sales"), color:"#B07A00", items: [
      { href: L("/admin/sales/orders"), label: isAr ? "الطلبات" : "Orders", desc: isAr ? "متابعة وإدارة الطلبات" : "Track and manage orders", icon:"M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" },
      { href: L("/admin/sales/abandoned_carts"), label: isAr ? "السلال المتروكة" : "Abandoned Carts", desc: isAr ? "عملاء لم يكملوا الشراء" : "Customers who didn't complete purchase", icon:"M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" },
      { href: L("/admin/sales/invoices"), label: isAr ? "الفواتير" : "Invoices", desc: isAr ? "الفواتير الضريبية" : "Tax invoices", icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    ]},
    { title: t("nav.users"), color:"#C0392B", items: [
      { href: L("/admin/users/customers"), label: isAr ? "العملاء" : "Customers", desc: isAr ? "إدارة العملاء" : "Manage customers", icon:"M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" },
      { href: L("/admin/users/vendors"), label: isAr ? "البائعون" : "Vendors", desc: isAr ? "إدارة التجار" : "Manage vendors", icon:"M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z" },
    ]},
    { title: t("nav.analytics"), color:"#6B46C1", items: [
      { href: L("/admin/analytics/reports"), label: isAr ? "التقارير" : "Reports", desc: isAr ? "تقارير مالية وإحصائيات" : "Financial reports and stats", icon:"M18 20V10M12 20V4M6 20v-6" },
    ]},
  ]

  // الرابط الحالي للتبديل
  const otherLocale = isAr ? "en" : "ar"
  const switchUrl = `/${otherLocale}/admin`

  return (
    <div style={{ minHeight:"100vh", background:"#EEEEEE", color:"#111", fontFamily:"Cairo,system-ui,sans-serif", direction: dir }}>
      <div style={{ padding:"16px 20px", borderBottom:"1px solid #e5e5e5", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:"#fff", zIndex:10, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
        <img src="https://cdn.klafstore.com/logo.png.png" alt="Kaaf" style={{ height:"32px" }} />
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <Link href={switchUrl} style={{ background:"#FF835E", color:"#fff", padding:"6px 14px", borderRadius:"8px", textDecoration:"none", fontSize:"12px", fontWeight:"800", fontFamily:"Cairo,system-ui,sans-serif" }}>
            {isAr ? "🇬🇧 English" : "🇸🇦 العربية"}
          </Link>
          <form action="/api/auth/logout" method="POST">
            <button style={{ background:"transparent", border:"1px solid #e5e5e5", color:"#888", padding:"6px 14px", borderRadius:"8px", cursor:"pointer", fontSize:"13px", fontFamily:"Cairo,system-ui,sans-serif" }}>
              {isAr ? "خروج" : "Logout"}
            </button>
          </form>
        </div>
      </div>

      <div style={{ padding:"16px", maxWidth:"700px", margin:"0 auto" }}>
        <div style={{ marginBottom:"20px" }}>
          <h1 style={{ fontSize:"20px", fontWeight:"800", margin:0, marginBottom:"4px" }}>{t("nav.dashboard")}</h1>
          <p style={{ color:"#888", fontSize:"12px", margin:0 }}>{now}</p>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:"8px", marginBottom:"24px" }}>
          {[
            { label: isAr ? "العملاء" : "Customers", value:stats.customers, href: L("/admin/users/customers"), color:"#FF835E" },
            { label: isAr ? "البائعون" : "Vendors", value:stats.sellers, href: L("/admin/users/vendors"), color:"#2A7A45" },
            { label: isAr ? "الطلبات" : "Orders", value:stats.orders, href: L("/admin/sales/orders"), color:"#2A3FA0" },
            { label: isAr ? "الإيرادات" : "Revenue", value: stats.revenue.toFixed(0)+" "+t("common.currency"), href: L("/admin/analytics/reports"), color:"#B07A00" },
          ].map(stat => (
            <Link key={stat.label} href={stat.href} style={{ textDecoration:"none" }}>
              <div style={{ background:"#fff", border:"1px solid #e5e5e5", borderRadius:"12px", padding:"12px 8px", textAlign:"center", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                <p style={{ fontSize:"18px", fontWeight:"900", margin:0, color:stat.color }}>{stat.value}</p>
                <p style={{ color:"#888", fontSize:"10px", margin:"4px 0 0" }}>{stat.label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Sections */}
        {sections.map(sec => (
          <div key={sec.title} style={{ marginBottom:20 }}>
            <p style={{ fontSize:"11px", fontWeight:"700", color:"#888", marginBottom:"10px", textTransform:"uppercase" as const, letterSpacing:"1px" }}>{sec.title}</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {sec.items.map(item => (
                <Link key={item.href} href={item.href} style={{ textDecoration:"none" }}>
                  <div style={{ background:"#fff", border:"1px solid #e5e5e5", borderRadius:"14px", padding:"14px", display:"flex", gap:"10px", alignItems:"flex-start", boxShadow:"0 1px 4px rgba(0,0,0,.04)", transition:"all .2s", cursor:"pointer" }}>
                    <div style={{ width:"34px", height:"34px", borderRadius:"9px", background:sec.color+"15", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Icon d={item.icon} color={sec.color} />
                    </div>
                    <div>
                      <p style={{ fontWeight:"700", fontSize:"13px", margin:0, marginBottom:"2px", color:"#111" }}>{item.label}</p>
                      <p style={{ color:"#888", fontSize:"10px", margin:0 }}>{item.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}