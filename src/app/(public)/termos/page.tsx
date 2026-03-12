export default function TermosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-3xl font-bold tracking-tight">Termos de Uso</h1>
      <p className="mt-4 text-muted-foreground">
        Última atualização: março de 2026
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            1. Aceitação dos Termos
          </h2>
          <p className="mt-2">
            Ao acessar e utilizar o OrçaFlow, você concorda com estes Termos de
            Uso. Se você não concorda com algum dos termos, não utilize o
            serviço.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            2. Descrição do Serviço
          </h2>
          <p className="mt-2">
            O OrçaFlow é uma plataforma de gestão de orçamentos, follow-ups e
            cobranças destinada a pequenas empresas. O serviço permite criar,
            enviar e acompanhar orçamentos via WhatsApp.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            3. Conta do Usuário
          </h2>
          <p className="mt-2">
            Você é responsável por manter a confidencialidade de sua conta e
            senha. Todas as atividades realizadas em sua conta são de sua
            responsabilidade.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            4. Uso Aceitável
          </h2>
          <p className="mt-2">
            Você concorda em utilizar o serviço apenas para fins legais e de
            acordo com estes termos. É proibido utilizar o serviço para envio de
            spam ou conteúdo malicioso.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            5. Contato
          </h2>
          <p className="mt-2">
            Em caso de dúvidas sobre estes termos, entre em contato pelo e-mail
            contato@orcaflow.com.br.
          </p>
        </section>
      </div>
    </div>
  )
}
