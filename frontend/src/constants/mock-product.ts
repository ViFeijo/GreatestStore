import { ProdutoDescricao } from "@/types";

export const PRODUTO_MOCK: ProdutoDescricao = {
  id: "vg34wqml5a",
  name: "Monitor Gamer Curvo ASUS TUF 34\"",
  description: "Performance de Próxima Geração com 250Hz. Você terá o controle total das suas partidas com a impressionante taxa de atualização...",
  faqs: [
    {
      id: "111",
      question: "Qual a curvatura do monitor?",
      answer: "O monitor possui uma curvatura de 1500R para total preenchimento do campo de visão."
    },
    {
      id: "222",
      question: "Ele possui suporte para HDR?",
      answer: "Sim, possui certificação VESA DisplayHDR 400."
    },
    {
      id: "333",
      question: "Quais as conexões disponíveis?",
      answer: "Possui entradas DisplayPort 1.4 e HDMI 2.0."
    }
  ],
  produtosRelacionados: [
    { id: "1", name: "Monitor ASUS TUF 27\"", price: 1599.90, image: "/monitor-1.png" },
    { id: "2", name: "Monitor LG UltraWide 34\"", price: 2299.00, image: "/monitor-2.png" },
    { id: "3", name: "Monitor Samsung Odyssey G5", price: 2100.00, image: "/monitor-3.png" },
    { id: "4", name: "Monitor Alienware 25\"", price: 2800.00, image: "/monitor-4.png" },
  ],
  recemVistos: [
    { id: "a1", name: "Cabo DisplayPort 1.4 Oro", price: 89.90, image: "/cabo-dp.png" },
    { id: "a2", name: "Braço Articulado North Bayou", price: 250.00, image: "/suporte.png" },
  ]
};