-- =============================================
-- OrçaFlow - Migration 002: Triggers & Functions
-- =============================================

-- =============================================
-- 1. Auto-update updated_at
-- =============================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER tr_workspaces_updated_at BEFORE UPDATE ON workspaces
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER tr_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER tr_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER tr_quotes_updated_at BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER tr_quote_items_updated_at BEFORE UPDATE ON quote_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER tr_follow_up_tasks_updated_at BEFORE UPDATE ON follow_up_tasks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER tr_message_templates_updated_at BEFORE UPDATE ON message_templates
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER tr_charges_updated_at BEFORE UPDATE ON charges
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER tr_onboarding_updated_at BEFORE UPDATE ON onboarding_progress
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================
-- 2. Auto-generate quote_number per workspace
-- =============================================
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TRIGGER AS $$
BEGIN
  SELECT COALESCE(MAX(quote_number), 0) + 1
  INTO NEW.quote_number
  FROM quotes
  WHERE workspace_id = NEW.workspace_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_quotes_number BEFORE INSERT ON quotes
  FOR EACH ROW EXECUTE FUNCTION generate_quote_number();

-- =============================================
-- 3. Handle new user signup
-- Creates workspace + user row when auth.users is created
-- =============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_workspace_id UUID;
  user_name TEXT;
  company_name TEXT;
BEGIN
  -- Extract name from metadata (set during signup)
  user_name := COALESCE(NEW.raw_user_meta_data->>'name', NEW.email);
  company_name := COALESCE(NEW.raw_user_meta_data->>'company_name', 'Minha Empresa');

  -- Create workspace
  INSERT INTO workspaces (name, slug, email)
  VALUES (
    company_name,
    REPLACE(LOWER(company_name), ' ', '-') || '-' || SUBSTRING(NEW.id::TEXT, 1, 8),
    NEW.email
  )
  RETURNING id INTO new_workspace_id;

  -- Create user row
  INSERT INTO users (id, workspace_id, name, email, role)
  VALUES (NEW.id, new_workspace_id, user_name, NEW.email, 'owner');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- 4. Seed default templates on workspace creation
-- =============================================
CREATE OR REPLACE FUNCTION seed_default_templates()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO message_templates (workspace_id, name, category, content) VALUES
    (NEW.id, 'Envio de orçamento', 'envio',
     'Olá, {nome}. Tudo bem?' || chr(10) || 'Acabei de preparar seu orçamento *#{numero_orcamento}*.' || chr(10) || 'Estou enviando para sua análise. Qualquer ajuste, posso adaptar rapidinho.'),
    (NEW.id, 'Follow-up 1', 'follow_up',
     'Olá, {nome}. Passando para confirmar se conseguiu ver o orçamento que enviei. Se quiser, posso ajustar algo para ficar mais alinhado ao que precisa.'),
    (NEW.id, 'Follow-up 2', 'follow_up',
     'Oi, {nome}. Só retomando seu orçamento para não deixar passar. Caso ainda tenha interesse, consigo te ajudar a fechar isso hoje.'),
    (NEW.id, 'Reativação', 'reativacao',
     'Olá, {nome}. Estou revisitando alguns orçamentos que ficaram em aberto e lembrei do seu. Ainda faz sentido para você?'),
    (NEW.id, 'Cobrança amigável', 'cobranca',
     'Olá, {nome}. Tudo bem? Passando para lembrar sobre o pagamento pendente referente ao serviço/proposta combinada. Se precisar, posso reenviar os dados.'),
    (NEW.id, 'Cobrança vencida', 'cobranca',
     'Olá, {nome}. Tudo bem? Identifiquei que o vencimento combinado já passou. Me avisa, por favor, se houve algum imprevisto ou se prefere que eu reenvie e organize de outra forma.');

  -- Seed onboarding steps
  INSERT INTO onboarding_progress (workspace_id, step_key) VALUES
    (NEW.id, 'company_setup'),
    (NEW.id, 'first_customer'),
    (NEW.id, 'first_quote'),
    (NEW.id, 'first_pdf'),
    (NEW.id, 'first_whatsapp');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_workspace_created
  AFTER INSERT ON workspaces
  FOR EACH ROW EXECUTE FUNCTION seed_default_templates();

-- =============================================
-- 5. Auto-create follow-up tasks when quote status → enviado
-- =============================================
CREATE OR REPLACE FUNCTION create_follow_up_tasks()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'enviado' AND (OLD.status IS NULL OR OLD.status != 'enviado') THEN
    -- Set sent_at if not already set
    IF NEW.sent_at IS NULL THEN
      NEW.sent_at := now();
    END IF;

    -- Create 3 follow-up tasks
    INSERT INTO follow_up_tasks (workspace_id, quote_id, customer_id, type, due_date) VALUES
      (NEW.workspace_id, NEW.id, NEW.customer_id, 'follow_up_1', CURRENT_DATE + INTERVAL '2 days'),
      (NEW.workspace_id, NEW.id, NEW.customer_id, 'follow_up_2', CURRENT_DATE + INTERVAL '5 days'),
      (NEW.workspace_id, NEW.id, NEW.customer_id, 'follow_up_3', CURRENT_DATE + INTERVAL '15 days');
  END IF;

  -- Auto-set timestamps on status changes
  IF NEW.status = 'fechado' AND (OLD.status IS NULL OR OLD.status != 'fechado') THEN
    NEW.closed_at := COALESCE(NEW.closed_at, now());
  END IF;

  IF NEW.status = 'perdido' AND (OLD.status IS NULL OR OLD.status != 'perdido') THEN
    NEW.lost_at := COALESCE(NEW.lost_at, now());
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_quotes_follow_up BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION create_follow_up_tasks();
