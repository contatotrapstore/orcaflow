"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CompanyForm } from "@/components/settings/company-form"
import { LogoUploader } from "@/components/settings/logo-uploader"
import { ActivityLogList } from "@/components/settings/activity-log-list"
import { TemplatesList } from "@/components/templates/templates-list"
import { Building2, FileText, Activity } from "lucide-react"
import type { Workspace, MessageTemplate, ActivityLog } from "@/types/database"

interface SettingsTabsProps {
  workspace: Workspace | null
  templates: MessageTemplate[]
  activityLogs: ActivityLog[]
}

export function SettingsTabs({
  workspace,
  templates,
  activityLogs,
}: SettingsTabsProps) {
  return (
    <Tabs defaultValue="empresa">
      <TabsList>
        <TabsTrigger value="empresa">
          <Building2 className="mr-1.5 h-4 w-4" />
          Empresa
        </TabsTrigger>
        <TabsTrigger value="templates">
          <FileText className="mr-1.5 h-4 w-4" />
          Templates
        </TabsTrigger>
        <TabsTrigger value="atividade">
          <Activity className="mr-1.5 h-4 w-4" />
          Atividade
        </TabsTrigger>
      </TabsList>

      <TabsContent value="empresa">
        <div className="space-y-6 mt-4">
          <LogoUploader
            currentLogoUrl={workspace?.logo_url ?? null}
            workspaceName={workspace?.name ?? ""}
          />
          <CompanyForm workspace={workspace} />
        </div>
      </TabsContent>

      <TabsContent value="templates">
        <div className="mt-4">
          <TemplatesList templates={templates} />
        </div>
      </TabsContent>

      <TabsContent value="atividade">
        <div className="mt-4">
          <ActivityLogList logs={activityLogs} />
        </div>
      </TabsContent>
    </Tabs>
  )
}
