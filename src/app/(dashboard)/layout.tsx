import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get user profile
  const { data: profile } = (await supabase
    .from("users")
    .select("name")
    .eq("id", user.id)
    .single()) as { data: { name: string } | null }

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:pl-64">
        <Header userName={profile?.name} />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
