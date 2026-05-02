export interface FaqItem {
    id: string;
    question: string;
    answer: string;
}

export interface ProdutoResumido {
    id: string;
    name: string;
    price: number;
    image: string;
    // stockQuantity: number;
    // sellQuantity: number;
    // rating: number;
}

export interface ProdutoDescricao {
    id: string;
    name: string;
    description: string;
    faqs: FaqItem[];
    produtosRelacionados: ProdutoResumido[];
    recemVistos: ProdutoResumido[];
}
