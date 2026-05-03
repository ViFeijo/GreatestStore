// 1. Tipagens de Apoio (Pedaços menores e reutilizáveis)

export interface PerguntaFrequente {
    id: string;
    pergunta: string;
    resposta: string;
}

export interface ItemNavegacao {
    rotulo: string; // Ex: "Monitor Gamer"
    url: string;
}

export interface InformacoesPreco {
    precoOriginal: number;      // R$ 3.333,32
    precoAtual: number;         // R$ 2.099,90
    porcentagemDesconto: number;// 37 (para o selo 37% OFF)
    descontoPix: number;        // 10 (10% de desconto no PIX)
    quantidadeParcelas: number; // 10 (10x)
    valorParcela: number;       // R$ 233,32
}

export interface InformacoesVendedor {
    nome: string;               // Ex: "Asus"
    lojaOficial: boolean;       // Adiciona o selo azul de verificado
    textoQuantidadeVendas: string; // "+50mil vendas"
    politicaDevolucao: string;  // "Você tem 30 dias a partir do recebimento"
    garantia: string;           // "Receba o produto que está esperando..."
    mesesGarantia: number;      // 12
}

export interface ResumoAvaliacoes {
    media: number;              // 4.5
    quantidadeTotal: number;    // Quantidade de pessoas que avaliaram
}

// 2. Interface para os Carrosséis (Cards menores)
export interface ProdutoResumido {
    id: string;
    nome: string;
    precoAtual: number;
    precoOriginal: number;
    porcentagemDesconto: number;
    imagem: string;
    avaliacao: number;
    emEstoque: boolean;
}

// 3. Interface Principal (A página inteira do Produto)
export interface ProdutoDetalhado {
    id: string;
    caminhoNavegacao: ItemNavegacao[];
    
    // Dados da Coluna da Esquerda (Scrollável)
    nomeMarca: string;
    logoMarca: string;
    nomeProduto: string;
    imagens: string[];                 // Array de URLs das fotos
    avisoEstoque?: string;             // "Restam Apenas 99 Un." (Opcional)
    avaliacoes: ResumoAvaliacoes;
    topicosSobreProduto: string[];     // As bolinhas do "SOBRE O PRODUTO"
    descricaoCompleta: string;         // O texto longo de descrição
    especificacoesTecnicas: Record<string, string>; // Ex: { "Resolução": "WQHD", "Painel": "VA" }
    
    // Dados da Coluna da Direita / Sidebar Fixa
    emEstoque: boolean;
    valores: InformacoesPreco;
    vendedor: InformacoesVendedor;
    textoPreviaFrete: string;          // "Chegará grátis entre segunda e quarta..."
    urlBannerPromocional?: string;     // O banner do "MEGA MAIO" (Opcional)
    
    // Seções Inferiores (Abaixo da descrição)
    perguntasFrequentes: PerguntaFrequente[];
    produtosRelacionados: ProdutoResumido[];
    vistosRecentemente: ProdutoResumido[];
}