export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      workspaces: {
        Row: {
          id: string
          name: string
          slug: string
          email: string | null
          phone: string | null
          logo_url: string | null
          address: string | null
          default_terms: string | null
          default_validity_days: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          email?: string | null
          phone?: string | null
          logo_url?: string | null
          address?: string | null
          default_terms?: string | null
          default_validity_days?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          email?: string | null
          phone?: string | null
          logo_url?: string | null
          address?: string | null
          default_terms?: string | null
          default_validity_days?: number
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          workspace_id: string
          name: string
          email: string
          role: "owner" | "atendente"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          workspace_id: string
          name: string
          email: string
          role?: "owner" | "atendente"
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          email?: string
          role?: "owner" | "atendente"
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          workspace_id: string
          name: string
          company_name: string | null
          whatsapp: string | null
          email: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          company_name?: string | null
          whatsapp?: string | null
          email?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          company_name?: string | null
          whatsapp?: string | null
          email?: string | null
          notes?: string | null
          updated_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          workspace_id: string
          customer_id: string | null
          quote_number: number
          title: string
          description: string | null
          status: QuoteStatus
          subtotal: number
          discount_amount: number
          total_amount: number
          valid_until: string | null
          sent_at: string | null
          closed_at: string | null
          lost_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          customer_id?: string | null
          quote_number?: number
          title: string
          description?: string | null
          status?: QuoteStatus
          subtotal?: number
          discount_amount?: number
          total_amount?: number
          valid_until?: string | null
          sent_at?: string | null
          closed_at?: string | null
          lost_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          customer_id?: string | null
          title?: string
          description?: string | null
          status?: QuoteStatus
          subtotal?: number
          discount_amount?: number
          total_amount?: number
          valid_until?: string | null
          sent_at?: string | null
          closed_at?: string | null
          lost_at?: string | null
          notes?: string | null
          updated_at?: string
        }
      }
      quote_items: {
        Row: {
          id: string
          quote_id: string
          name: string
          description: string | null
          quantity: number
          unit: string | null
          unit_price: number
          total_price: number
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quote_id: string
          name: string
          description?: string | null
          quantity?: number
          unit?: string | null
          unit_price?: number
          total_price?: number
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          quantity?: number
          unit?: string | null
          unit_price?: number
          total_price?: number
          sort_order?: number
          updated_at?: string
        }
      }
      follow_up_tasks: {
        Row: {
          id: string
          workspace_id: string
          quote_id: string | null
          customer_id: string | null
          type: FollowUpType
          due_date: string
          completed_at: string | null
          status: TaskStatus
          message_template_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          quote_id?: string | null
          customer_id?: string | null
          type?: FollowUpType
          due_date: string
          completed_at?: string | null
          status?: TaskStatus
          message_template_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          type?: FollowUpType
          due_date?: string
          completed_at?: string | null
          status?: TaskStatus
          message_template_id?: string | null
          notes?: string | null
          updated_at?: string
        }
      }
      message_templates: {
        Row: {
          id: string
          workspace_id: string
          name: string
          category: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          category: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          category?: string
          content?: string
          updated_at?: string
        }
      }
      charges: {
        Row: {
          id: string
          workspace_id: string
          quote_id: string | null
          customer_id: string | null
          title: string
          amount: number
          due_date: string
          paid_at: string | null
          status: ChargeStatus
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          quote_id?: string | null
          customer_id?: string | null
          title: string
          amount?: number
          due_date: string
          paid_at?: string | null
          status?: ChargeStatus
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          amount?: number
          due_date?: string
          paid_at?: string | null
          status?: ChargeStatus
          notes?: string | null
          updated_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          workspace_id: string
          user_id: string | null
          entity_type: string
          entity_id: string
          action: string
          metadata_json: Json
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          user_id?: string | null
          entity_type: string
          entity_id: string
          action: string
          metadata_json?: Json
          created_at?: string
        }
        Update: never
      }
      onboarding_progress: {
        Row: {
          id: string
          workspace_id: string
          step_key: string
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          step_key: string
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          completed?: boolean
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_workspace_id: {
        Args: Record<string, never>
        Returns: string
      }
    }
    Enums: {
      quote_status: QuoteStatus
      charge_status: ChargeStatus
      task_status: TaskStatus
      follow_up_type: FollowUpType
      user_role: UserRole
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Enum types
export type QuoteStatus =
  | "novo"
  | "enviado"
  | "aguardando"
  | "follow_up_1"
  | "follow_up_2"
  | "fechado"
  | "perdido"
  | "cobranca_pendente"
  | "pago"

export type ChargeStatus = "pendente" | "pago" | "atrasado"
export type TaskStatus = "pendente" | "concluida" | "cancelada"
export type FollowUpType = "follow_up_1" | "follow_up_2" | "follow_up_3" | "cobranca" | "manual"
export type UserRole = "owner" | "atendente"

// Convenience aliases
export type Workspace = Database["public"]["Tables"]["workspaces"]["Row"]
export type User = Database["public"]["Tables"]["users"]["Row"]
export type Customer = Database["public"]["Tables"]["customers"]["Row"]
export type Quote = Database["public"]["Tables"]["quotes"]["Row"]
export type QuoteItem = Database["public"]["Tables"]["quote_items"]["Row"]
export type FollowUpTask = Database["public"]["Tables"]["follow_up_tasks"]["Row"]
export type MessageTemplate = Database["public"]["Tables"]["message_templates"]["Row"]
export type Charge = Database["public"]["Tables"]["charges"]["Row"]
export type ActivityLog = Database["public"]["Tables"]["activity_logs"]["Row"]
export type OnboardingProgress = Database["public"]["Tables"]["onboarding_progress"]["Row"]

// Composite types
export type QuoteWithItems = Quote & { quote_items: QuoteItem[] }
export type QuoteWithCustomer = Quote & { customers: Customer | null }
export type QuoteFull = Quote & { quote_items: QuoteItem[]; customers: Customer | null }
