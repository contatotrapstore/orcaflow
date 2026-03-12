-- =============================================
-- OrçaFlow - Migration 001: Core Schema
-- All 10 tables + enums + indexes + FKs
-- =============================================

-- Enums
CREATE TYPE quote_status AS ENUM (
  'novo',
  'enviado',
  'aguardando',
  'follow_up_1',
  'follow_up_2',
  'fechado',
  'perdido',
  'cobranca_pendente',
  'pago'
);

CREATE TYPE charge_status AS ENUM (
  'pendente',
  'pago',
  'atrasado'
);

CREATE TYPE task_status AS ENUM (
  'pendente',
  'concluida',
  'cancelada'
);

CREATE TYPE follow_up_type AS ENUM (
  'follow_up_1',
  'follow_up_2',
  'follow_up_3',
  'cobranca',
  'manual'
);

CREATE TYPE user_role AS ENUM (
  'owner',
  'atendente'
);

-- =============================================
-- Table 1: workspaces
-- =============================================
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  email TEXT,
  phone TEXT,
  logo_url TEXT,
  address TEXT,
  default_terms TEXT,
  default_validity_days INTEGER DEFAULT 15,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- Table 2: users
-- =============================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'owner',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_workspace ON users(workspace_id);

-- =============================================
-- Table 3: customers
-- =============================================
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company_name TEXT,
  whatsapp TEXT,
  email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_customers_workspace ON customers(workspace_id);
CREATE INDEX idx_customers_name ON customers(workspace_id, name);

-- =============================================
-- Table 4: quotes
-- =============================================
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  quote_number INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  description TEXT,
  status quote_status NOT NULL DEFAULT 'novo',
  subtotal INTEGER NOT NULL DEFAULT 0,
  discount_amount INTEGER NOT NULL DEFAULT 0,
  total_amount INTEGER NOT NULL DEFAULT 0,
  valid_until DATE,
  sent_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  lost_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_quotes_workspace_status ON quotes(workspace_id, status);
CREATE INDEX idx_quotes_customer ON quotes(customer_id);
CREATE INDEX idx_quotes_workspace_number ON quotes(workspace_id, quote_number);

-- =============================================
-- Table 5: quote_items
-- =============================================
CREATE TABLE quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  quantity NUMERIC(10, 2) NOT NULL DEFAULT 1,
  unit TEXT,
  unit_price INTEGER NOT NULL DEFAULT 0,
  total_price INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_quote_items_quote ON quote_items(quote_id);

-- =============================================
-- Table 6: follow_up_tasks
-- =============================================
CREATE TABLE follow_up_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  type follow_up_type NOT NULL DEFAULT 'manual',
  due_date DATE NOT NULL,
  completed_at TIMESTAMPTZ,
  status task_status NOT NULL DEFAULT 'pendente',
  message_template_id UUID,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_follow_up_tasks_workspace_date ON follow_up_tasks(workspace_id, due_date, status);
CREATE INDEX idx_follow_up_tasks_quote ON follow_up_tasks(quote_id);

-- =============================================
-- Table 7: message_templates
-- =============================================
CREATE TABLE message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_message_templates_workspace ON message_templates(workspace_id);

-- Add FK for follow_up_tasks.message_template_id
ALTER TABLE follow_up_tasks
  ADD CONSTRAINT fk_follow_up_tasks_template
  FOREIGN KEY (message_template_id) REFERENCES message_templates(id) ON DELETE SET NULL;

-- =============================================
-- Table 8: charges
-- =============================================
CREATE TABLE charges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  status charge_status NOT NULL DEFAULT 'pendente',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_charges_workspace_status ON charges(workspace_id, status, due_date);
CREATE INDEX idx_charges_quote ON charges(quote_id);

-- =============================================
-- Table 9: activity_logs
-- =============================================
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  metadata_json JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_logs_workspace ON activity_logs(workspace_id, created_at DESC);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);

-- =============================================
-- Table 10: onboarding_progress
-- =============================================
CREATE TABLE onboarding_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  step_key TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(workspace_id, step_key)
);

CREATE INDEX idx_onboarding_workspace ON onboarding_progress(workspace_id);
