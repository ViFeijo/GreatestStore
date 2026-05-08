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
    id?: string | number;
    nome: string;               // Ex: "Asus"
    lojaOficial: boolean;       // Adiciona o selo azul de verificado
    textoQuantidadeVendas: string; // "+50mil vendas"
    politicaDevolucao: string;  // "Você tem 30 dias a partir do recebimento"
    garantia: string;           // "Receba o produto que está esperando..."
    mesesGarantia: number;      // 12
    fotoPerfil?: string | null;
    banner?: string | null;
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
    
    // --- CAMPOS NOVOS ADICIONADOS AQUI ---
    evento_id?: string | number | null; // ID do evento para linkar o banner
    urlBannerPromocional?: string;     // O banner do "MEGA MAIO" (Opcional)
    
    // Seções Inferiores (Abaixo da descrição)
    perguntasFrequentes: PerguntaFrequente[];
    produtosRelacionados: ProdutoResumido[];
    vistosRecentemente: ProdutoResumido[];
}

// 4. Tipagens da API (backend)

export type RoleUsuario = "cliente" | "vendedor" | "admin" | string;

export interface ApiErrorResponse {
    error: string;
}

export interface UsuarioApi {
    id: string | number;
    nome: string | null;
    email: string;
    cpf: string | null;
    role: RoleUsuario;
    criado_em?: string;
    senha?: string;
}

export interface UsuarioPublicoApi {
    id: string | number;
    nome: string | null;
    email: string;
    cpf?: string | null;
    role: RoleUsuario;
    criado_em?: string;
}

export interface AuthLoginResponse {
    token: string;
    usuario: {
        id: string | number;
        nome: string | null;
        email: string;
        role: RoleUsuario;
    };
}

export interface AuthRegistroVendedorResponse {
    usuario: UsuarioPublicoApi;
    vendedor: VendedorApi;
}

export interface EnderecoUsuarioApi {
    id?: string | number;
    usuario_id: string | number;
    apelido: string | null;
    cep: string;
    rua: string;
    numero: string;
    complemento?: string | null;
    bairro: string;
    cidade: string;
    estado: string;
    is_principal?: boolean;
    criado_em?: string;
}

export interface EnderecoVendedorApi {
    id?: string | number;
    vendedor_id: string | number;
    cep: string;
    rua: string;
    numero: string;
    complemento?: string | null;
    bairro: string;
    cidade: string;
    estado: string;
    criado_em?: string;
}

export interface VendedorApi {
    id: string | number;
    usuario_id: string | number;
    cnpj: string;
    nome_fantasia: string | null;
    razao_social: string | null;
    foto_perfil_url?: string | null;
    banner_url?: string | null;
    criado_em?: string;
    nome?: string | null;
    email?: string | null;
    cpf?: string | null;
    endereco?: EnderecoVendedorApi | null;
}

export interface CategoriaApi {
    id: string | number;
    nome: string;
}

export interface SubcategoriaApi {
    id: string | number;
    categoria_id: string | number;
    nome: string;
    categoria_nome?: string;
}

export interface MarcaApi {
    id: string | number;
    nome: string;
    logo_url?: string | null;
}

export interface MarcaImagemApi {
    id?: string | number;
    marca_id: string | number;
    url: string;
    nome?: string | null;
    ordem?: number | null;
}

export interface EventoApi {
    id: string | number;
    nome: string;
    descricao?: string | null;
    banner_url?: string | null;
    data_inicio: string;
    data_fim: string;
    ativo?: boolean;
}

export interface ProdutoImagemApi {
    id?: string | number;
    produto_id: string | number;
    url: string;
    ordem?: number | null;
    is_principal?: boolean | null;
}

export interface ProdutoBaseApi {
    id: string | number;
    vendedor_id?: string | number;
    subcategoria_id?: string | number | null;
    marca_id?: string | number | null;
    nome: string;
    modelo?: string | null;
    descricao?: string | null;
    preco: number | string;
    quantidade?: number | string | null;
    preco_promocional?: number | string | null;
    desconto_ativo?: boolean | null;
    criado_em?: string;
}

export interface ProdutoListagemApi extends ProdutoBaseApi {
    preco_final?: number | string | null;
    marca_nome?: string | null;
    vendedor_nome?: string | null;
    subcategoria_nome?: string | null;
    categoria_nome?: string | null;
    imagem_url?: string | null;
    media_avaliacoes?: number | string | null;
    total_avaliacoes?: number | string | null;
    total_resultados?: number | string | null;
    score?: number | string | null;
    evento_banner?: string | null;
    imagem_nome?: string | null;
}

export interface ProdutoDetalheApi extends ProdutoBaseApi {
    vendedor_nome?: string | null;
    vendedor_foto?: string | null;
    vendedor_banner?: string | null;
    subcategoria_nome?: string | null;
    categoria_id?: string | number | null;
    categoria_nome?: string | null;
    marca_nome?: string | null;
    media_avaliacoes?: number | string | null;
    total_avaliacoes?: number | string | null;
    imagens?: ProdutoImagemApi[];
    evento_id?: string | number | null;
    evento_banner?: string | null;
}

export interface BuscaProdutosResponse {
    total: number;
    produtos: ProdutoListagemApi[];
}

export interface AvaliacaoApi {
    id?: string | number;
    produto_id: string | number;
    usuario_id: string | number;
    nota: number | string;
    comentario?: string | null;
    criado_em?: string;
    usuario_nome?: string | null;
}

export interface AvaliacaoMediaApi {
    total_avaliacoes: number | string;
    media: number | string;
}

export interface AvaliacaoListagemResponse {
    media: AvaliacaoMediaApi;
    avaliacoes: AvaliacaoApi[];
}

export interface FavoritoApi {
    id?: string | number;
    usuario_id: string | number;
    produto_id: string | number;
    criado_em?: string;
}

export interface FavoritoStatusResponse {
    favoritado: boolean;
}

export interface CarrinhoItemApi {
    id: string | number;
    quantidade: number | string;
    produto_id: string | number;
    nome: string;
    preco: number | string;
    preco_promocional?: number | string | null;
    desconto_ativo?: boolean | null;
    estoque?: number | string | null;
    imagem_url?: string | null;
    marca_nome?: string | null;
    vendedor_id?: string | number | null;
    cep_vendedor?: string | null;
    preco_final?: number | string | null;
    subtotal_item?: number | string | null;
}

export interface CarrinhoResumoResponse {
    itens: CarrinhoItemApi[];
    subtotal: string;
    frete: string;
    total: string;
}

export interface PedidoItemApi {
    produto_id: string | number;
    quantidade: number | string;
    preco_unitario: number | string;
}

export interface PedidoApi {
    id: string | number;
    usuario_id: string | number;
    endereco_id: string | number;
    valor_total: number | string;
    cupom_id?: string | number | null;
    status?: string | null;
    criado_em?: string;
}

export interface PedidoComItensApi extends PedidoApi {
    itens: PedidoItemApi[];
}

export interface PedidoCriadoResponse {
    pedido: PedidoApi;
    pagamento_id: string | number;
    subtotal: string;
    frete: string;
    total: string;
    metodo_pagamento: string;
}

export interface PagamentoApi {
    id: string | number;
    pedido_id: string | number;
    metodo: string;
    valor: number | string;
    status?: string | null;
    codigo_transacao?: string | null;
    criado_em?: string;
    pago_em?: string | null;
}

export interface PagamentoComPedidoApi extends PagamentoApi {
    pedido_criado_em?: string;
    valor_total?: number | string;
}

export interface NotificacaoApi {
    id: string | number;
    usuario_id: string | number;
    titulo: string;
    mensagem: string;
    lida?: boolean;
    criado_em?: string;
}

export interface NotificacaoNaoLidasResponse {
    total: number;
}

export interface UploadResponse {
    url: string;
}

// --- TIPAGEM ADICIONADA PARA O SIDEBAR DIR ---
export interface SideBarDirProps {
    produtoId: string;
    valores: InformacoesPreco;
    vendedor: InformacoesVendedor;
    emEstoque: boolean;
    textoPreviaFrete: string;
    onAddToCart: (quantidade: number) => void;
    adicionando?: boolean; // Propriedade opcional de estado de carregamento
}