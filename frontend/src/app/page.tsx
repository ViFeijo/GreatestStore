import Image from "next/image";
import Header from "@/components/layout/Header/Header";
import { FAQItem, FAQSection } from "@/components/FAQ"
export default function Home() {
  const minhasFAQs: FAQItem[] = [
    { id: '1', question: 'Pergunta?', answer: 'Resposta' }
  ];

  return (
    <Header/>

    <FAQSection faqs={minhasFAQs} />
  );
}
