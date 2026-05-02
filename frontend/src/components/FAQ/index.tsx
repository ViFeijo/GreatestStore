import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FaqItem } from "@/types" // Importe a tipagem

// Agora ele recebe a prop "faqs" que é um array do tipo FaqItem
export function ProdutoFAQ({ faqs }: { faqs: FaqItem[] }) {
  if (!faqs || faqs.length === 0) return null; // Não renderiza se não tiver FAQ

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Perguntas Frequentes</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left font-medium">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}