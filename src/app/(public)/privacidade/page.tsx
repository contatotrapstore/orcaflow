export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-3xl font-bold tracking-tight">
        Política de Privacidade
      </h1>
      <p className="mt-4 text-muted-foreground">
        Última atualização: março de 2026
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            1. Dados Coletados
          </h2>
          <p className="mt-2">
            Coletamos informações fornecidas por você ao criar sua conta (nome,
            e-mail) e dados de uso do serviço para melhorar a experiência.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            2. Uso dos Dados
          </h2>
          <p className="mt-2">
            Seus dados são utilizados exclusivamente para operar e melhorar o
            OrçaFlow. Não vendemos ou compartilhamos suas informações com
            terceiros para fins de marketing.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            3. Armazenamento e Segurança
          </h2>
          <p className="mt-2">
            Utilizamos a infraestrutura do Supabase para armazenamento seguro
            dos dados. Todas as comunicações são criptografadas via HTTPS.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            4. Seus Direitos
          </h2>
          <p className="mt-2">
            Você pode solicitar a exclusão dos seus dados a qualquer momento
            entrando em contato conosco. Em conformidade com a LGPD, garantimos
            o direito de acesso, correção e portabilidade dos seus dados.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            5. Contato
          </h2>
          <p className="mt-2">
            Para questões sobre privacidade, envie um e-mail para
            privacidade@orcaflow.com.br.
          </p>
        </section>
      </div>
    </div>
  )
}
