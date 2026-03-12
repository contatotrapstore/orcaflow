"use client"

import { useState, useRef } from "react"
import { toast } from "sonner"
import { uploadLogo } from "@/actions/workspace"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Loader2, Trash2, Building2 } from "lucide-react"

interface LogoUploaderProps {
  currentLogoUrl: string | null
  workspaceName: string
}

export function LogoUploader({
  currentLogoUrl,
  workspaceName,
}: LogoUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentLogoUrl)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate client-side
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Formato inválido. Use JPG, PNG, WebP ou SVG.")
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo 2MB.")
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload
    handleUpload(file)
  }

  async function handleUpload(file: File) {
    setIsUploading(true)
    try {
      const fd = new FormData()
      fd.set("logo", file)
      const result = await uploadLogo(fd)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Logo atualizado com sucesso!")
        if (result.url) {
          setPreview(result.url)
        }
      }
    } catch {
      toast.error("Erro ao fazer upload do logo.")
    } finally {
      setIsUploading(false)
    }
  }

  function handleRemove() {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const initials = workspaceName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logo da Empresa</CardTitle>
        <CardDescription>
          Aparece nos orçamentos gerados em PDF. Recomendado: 200x200px.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <Avatar size="lg" className="!size-20">
            {preview ? (
              <AvatarImage src={preview} alt={workspaceName} />
            ) : null}
            <AvatarFallback className="text-lg">
              {initials || <Building2 className="h-8 w-8" />}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                {isUploading ? "Enviando..." : "Enviar logo"}
              </Button>

              {preview && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemove}
                  disabled={isUploading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remover
                </Button>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              JPG, PNG, WebP ou SVG. Máximo 2MB.
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </CardContent>
    </Card>
  )
}
