import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import AdsClient from "./AdsClient"

export const dynamic = "force-dynamic"

export default async function AdsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  if (!token) redirect("/login")

  console.log("TOKEN:", token?.slice(0,20))
  return <AdsClient token={token} />
}