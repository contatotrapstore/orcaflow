"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  FileText,
  Kanban,
  Bell,
  CreditCard,
  Settings,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/orcamentos", label: "Orçamentos", icon: FileText },
  { href: "/funil", label: "Funil", icon: Kanban },
  { href: "/followups", label: "Follow-ups", icon: Bell },
  { href: "/cobrancas", label: "Cobranças", icon: CreditCard },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r bg-background">
      <div className="flex h-14 items-center px-6">
        <Link href="/dashboard">
          <Image src="/logo.png" alt="OrçaFlow" width={140} height={36} className="h-8 w-auto" />
        </Link>
      </div>
      <div className="mx-3 border-b" />
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#208E76]/10 text-[#1a7562] dark:text-[#2aab8f] font-semibold border-l-2 border-[#208E76]"
                  : "text-muted-foreground hover:bg-[#f0fdf9] dark:hover:bg-[#052e23] hover:text-[#1a7562] dark:hover:text-[#2aab8f]"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
