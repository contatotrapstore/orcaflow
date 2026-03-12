export type MessageVariables = {
  nome?: string
  numero_orcamento?: string | number
  valor_total?: string
  data_vencimento?: string
  empresa?: string
}

export function interpolateTemplate(
  template: string,
  variables: MessageVariables
): string {
  let result = template
  for (const [key, value] of Object.entries(variables)) {
    if (value !== undefined) {
      result = result.replace(new RegExp(`\\{${key}\\}`, "g"), String(value))
    }
  }
  return result
}
