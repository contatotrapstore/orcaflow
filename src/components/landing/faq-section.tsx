"use client"

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Preciso instalar algo?",
    answer: "Não! O OrçaFlow funciona 100% no navegador.",
  },
  {
    question: "Funciona no celular?",
    answer: "Sim, é totalmente responsivo.",
  },
  {
    question: "Meus dados estão seguros?",
    answer: "Sim, usamos criptografia e servidores seguros.",
  },
  {
    question: "Posso cancelar quando quiser?",
    answer: "Sim, sem multa ou fidelidade.",
  },
  {
    question: "Como funciona o envio pelo WhatsApp?",
    answer:
      "O OrçaFlow gera um link direto para o WhatsApp com a mensagem pronta.",
  },
]

export function FaqSection() {
  return (
    <section className="w-full bg-muted/40 py-20 md:py-28">
      <div className="mx-auto max-w-2xl px-4">
        <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
          Perguntas frequentes
        </h2>

        <div className="mt-12 ring-1 ring-border rounded-xl">
          <Accordion>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
