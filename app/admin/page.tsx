import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) redirect("/login")

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "white", fontFamily: "Cairo, system-ui, sans-serif", padding: "24px", direction: "rtl" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "800" }}>لوحة التحكم</h1>
    </div>
  )
}