import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })

  const [usersRes, productsRes] = await Promise.all([
    fetch("https://api.klafstore.com/api/users/trash", {
      headers: { "Authorization": `Bearer ${token}` },
    }),
    fetch("https://api.klafstore.com/api/products/trash", {
      headers: { "Authorization": `Bearer ${token}` },
    }),
  ])

  const users = await usersRes.json()
  const products = await productsRes.json()

  return NextResponse.json({
    users: users.users || [],
    products: products.products || [],
  })
}