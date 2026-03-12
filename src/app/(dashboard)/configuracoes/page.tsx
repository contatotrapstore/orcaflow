import { PageHeader } from "@/components/shared/page-header"
import { SettingsTabs } from "@/components/settings/settings-tabs"
import { getWorkspace } from "@/actions/workspace"
import { listTemplates } from "@/actions/templates"
import { listActivityLogs } from "@/actions/activity-logs"

export default async function ConfiguracoesPage() {
  const [workspace, templates, activityLogs] = await Promise.all([
    getWorkspace(),
    listTemplates(),
    listActivityLogs(50),
  ])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Gerencie as configurações da sua empresa, templates e visualize o histórico de atividades."
      />
      <SettingsTabs
        workspace={workspace}
        templates={templates}
        activityLogs={activityLogs}
      />
    </div>
  )
}
