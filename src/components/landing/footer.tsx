import Link from "next/link"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="w-full bg-[var(--hero-gradient-start)] py-8 text-gray-300">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <Image src="/logo.png" alt="OrçaFlow" width={130} height={34} className="h-7 w-auto brightness-200" />

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <Link href="/termos" className="hover:text-white transition-colors">
              Termos
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="/privacidade" className="hover:text-white transition-colors">
              Privacidade
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500 sm:text-left">
          &copy; {new Date().getFullYear()} OrçaFlow. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  )
}
