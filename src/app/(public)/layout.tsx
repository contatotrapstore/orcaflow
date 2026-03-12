import { PublicHeader } from "@/components/landing/public-header"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
}
