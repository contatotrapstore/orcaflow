-- =============================================
-- OrçaFlow - Migration 003: RLS Policies
-- Workspace isolation for workspaces and users (Slice 1)
-- Other tables will get RLS in their respective slices
-- =============================================

-- Enable RLS on all tables
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_up_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE charges ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Helper: get current user's workspace_id
-- =============================================
CREATE OR REPLACE FUNCTION get_my_workspace_id()
RETURNS UUID AS $$
  SELECT workspace_id FROM users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- =============================================
-- Workspaces: users can only see/update their own workspace
-- =============================================
CREATE POLICY "workspace_select" ON workspaces
  FOR SELECT USING (id = get_my_workspace_id());

CREATE POLICY "workspace_update" ON workspaces
  FOR UPDATE USING (id = get_my_workspace_id());

-- =============================================
-- Users: can see users in same workspace, update only self
-- =============================================
CREATE POLICY "users_select" ON users
  FOR SELECT USING (workspace_id = get_my_workspace_id());

CREATE POLICY "users_update" ON users
  FOR UPDATE USING (id = auth.uid());

-- =============================================
-- Customers: full CRUD within workspace
-- =============================================
CREATE POLICY "customers_all" ON customers
  FOR ALL USING (workspace_id = get_my_workspace_id())
  WITH CHECK (workspace_id = get_my_workspace_id());

-- =============================================
-- Quotes: full CRUD within workspace
-- =============================================
CREATE POLICY "quotes_all" ON quotes
  FOR ALL USING (workspace_id = get_my_workspace_id())
  WITH CHECK (workspace_id = get_my_workspace_id());

-- =============================================
-- Quote Items: access through parent quote's workspace
-- =============================================
CREATE POLICY "quote_items_all" ON quote_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = quote_items.quote_id
      AND quotes.workspace_id = get_my_workspace_id()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = quote_items.quote_id
      AND quotes.workspace_id = get_my_workspace_id()
    )
  );

-- =============================================
-- Follow-up Tasks: full CRUD within workspace
-- =============================================
CREATE POLICY "follow_up_tasks_all" ON follow_up_tasks
  FOR ALL USING (workspace_id = get_my_workspace_id())
  WITH CHECK (workspace_id = get_my_workspace_id());

-- =============================================
-- Message Templates: full CRUD within workspace
-- =============================================
CREATE POLICY "message_templates_all" ON message_templates
  FOR ALL USING (workspace_id = get_my_workspace_id())
  WITH CHECK (workspace_id = get_my_workspace_id());

-- =============================================
-- Charges: full CRUD within workspace
-- =============================================
CREATE POLICY "charges_all" ON charges
  FOR ALL USING (workspace_id = get_my_workspace_id())
  WITH CHECK (workspace_id = get_my_workspace_id());

-- =============================================
-- Activity Logs: select within workspace, insert allowed
-- =============================================
CREATE POLICY "activity_logs_select" ON activity_logs
  FOR SELECT USING (workspace_id = get_my_workspace_id());

CREATE POLICY "activity_logs_insert" ON activity_logs
  FOR INSERT WITH CHECK (workspace_id = get_my_workspace_id());

-- =============================================
-- Onboarding Progress: full CRUD within workspace
-- =============================================
CREATE POLICY "onboarding_all" ON onboarding_progress
  FOR ALL USING (workspace_id = get_my_workspace_id())
  WITH CHECK (workspace_id = get_my_workspace_id());
