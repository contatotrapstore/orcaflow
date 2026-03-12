"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
  Menu,
  LayoutDashboard,
  Users,
  FileText,
  Kanban,
  Bell,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react"
import { ThemeToggle } from "@/components/shared/theme-toggle"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/orcamentos", label: "Orçamentos", icon: FileText },
  { href: "/funil", label: "Funil", icon: Kanban },
  { href: "/followups", label: "Follow-ups", icon: Bell },
  { href: "/cobrancas", label: "Cobranças", icon: CreditCard },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
]

export function Header({ userName }: { userName?: string }) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="md:hidden" />
          }
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-14 items-center border-b px-6">
            <Link href="/dashboard" className="text-xl font-bold gradient-text-emerald">
              OrçaFlow
            </Link>
          </div>
          <nav className="space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold border-l-2 border-emerald-500"
                      : "text-muted-foreground hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-700 dark:hover:text-emerald-400"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex-1" />

      <ThemeToggle />

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button className="relative flex h-8 w-8 items-center justify-center rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:ring-2 hover:ring-emerald-500/20 transition-all" />
          }
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {userName?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {userName && (
            <>
              <div className="px-2 py-1.5 text-sm font-medium">{userName}</div>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem>
            <Link href="/configuracoes" className="flex items-center w-full">
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut()}
            className="text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
