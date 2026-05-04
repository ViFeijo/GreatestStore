CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE enderecos_usuario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    cep TEXT NOT NULL,
    rua TEXT NOT NULL,
    numero TEXT NOT NULL,
    complemento TEXT,
    bairro TEXT NOT NULL,
    cidade TEXT NOT NULL,
    estado TEXT NOT NULL,
    is_principal BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE vendedores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    nome_fantasia TEXT NOT NULL,
    razao_social TEXT NOT NULL,
    cnpj TEXT UNIQUE NOT NULL,
    foto_perfil_url TEXT,
    banner_url TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE enderecos_vendedor (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendedor_id UUID UNIQUE NOT NULL REFERENCES vendedores(id) ON DELETE CASCADE,
    cep TEXT NOT NULL,
    rua TEXT NOT NULL,
    numero TEXT NOT NULL,
    complemento TEXT,
    bairro TEXT NOT NULL,
    cidade TEXT NOT NULL,
    estado TEXT NOT NULL
);

CREATE TABLE categorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL UNIQUE
);

CREATE TABLE subcategorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    categoria_id UUID NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    UNIQUE(categoria_id, nome)
);

CREATE TABLE produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendedor_id UUID NOT NULL REFERENCES vendedores(id) ON DELETE CASCADE,
    subcategoria_id UUID REFERENCES subcategorias(id) ON DELETE SET NULL,
    nome TEXT NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    quantidade INTEGER NOT NULL DEFAULT 0 CHECK (quantidade >= 0),
    preco_promocional DECIMAL(10, 2) CHECK (preco_promocional < preco),
    desconto_ativo BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_produtos_vendedor ON produtos(vendedor_id);
CREATE INDEX idx_produtos_subcategoria ON produtos(subcategoria_id);
CREATE INDEX idx_produtos_nome ON produtos USING gin(to_tsvector('portuguese', nome));

CREATE TABLE produto_imagens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    ordem INTEGER DEFAULT 0,
    is_principal BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE produto_descricao_imagens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    ordem INTEGER DEFAULT 0
);

CREATE TABLE perguntas_produto (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    pergunta TEXT NOT NULL,
    resposta TEXT,
    respondido_em TIMESTAMP WITH TIME ZONE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE cupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo TEXT UNIQUE NOT NULL,
    tipo_desconto TEXT NOT NULL CHECK (tipo_desconto IN ('fixo', 'percentual')),
    valor_desconto DECIMAL(10, 2) NOT NULL CHECK (valor_desconto > 0),
    uso_maximo INTEGER,
    total_usado INTEGER DEFAULT 0,
    data_validade TIMESTAMP WITH TIME ZONE,
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE pedidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    cupom_id UUID REFERENCES cupons(id) ON DELETE SET NULL,
    endereco_id UUID NOT NULL REFERENCES enderecos_usuario(id),
    valor_total DECIMAL(10, 2) NOT NULL CHECK (valor_total >= 0),
    status TEXT DEFAULT 'pendente' CHECK (
        status IN ('pendente', 'pago', 'em_separacao', 'enviado', 'entregue', 'cancelado')
    ),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX idx_pedidos_status ON pedidos(status);

CREATE TABLE itens_pedido (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE RESTRICT,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    preco_unitario DECIMAL(10, 2) NOT NULL CHECK (preco_unitario >= 0)
);

CREATE INDEX idx_itens_pedido_pedido ON itens_pedido(pedido_id);

CREATE TABLE pagamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID UNIQUE NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    metodo TEXT NOT NULL CHECK (metodo IN ('pix', 'cartao_credito', 'cartao_debito', 'boleto')),
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'recusado', 'estornado')),
    valor DECIMAL(10, 2) NOT NULL,
    codigo_transacao TEXT,
    pago_em TIMESTAMP WITH TIME ZONE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE transportadoras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_empresa TEXT NOT NULL,
    cnpj TEXT UNIQUE NOT NULL,
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE fretes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID UNIQUE NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    transportadora_id UUID REFERENCES transportadoras(id) ON DELETE SET NULL,
    valor_frete DECIMAL(10, 2) NOT NULL CHECK (valor_frete >= 0),
    codigo_rastreio TEXT,
    status_entrega TEXT DEFAULT 'postado' CHECK (
        status_entrega IN ('postado', 'em_transito', 'saiu_para_entrega', 'entregue', 'devolvido')
    )
);

CREATE TABLE carrinho (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
    quantidade INTEGER NOT NULL DEFAULT 1 CHECK (quantidade > 0),
    UNIQUE(usuario_id, produto_id)
);

CREATE TABLE favoritos (
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
    PRIMARY KEY (usuario_id, produto_id)
);

CREATE TABLE avaliacoes_produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(produto_id, usuario_id)
);

CREATE TABLE avaliacoes_frete (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transportadora_id UUID NOT NULL REFERENCES transportadoras(id) ON DELETE CASCADE,
    pedido_id UUID UNIQUE NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT
);

CREATE TABLE eventos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    descricao TEXT,
    data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    data_fim TIMESTAMP WITH TIME ZONE NOT NULL,
    banner_url TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (data_fim > data_inicio)
);

CREATE TABLE evento_descontos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evento_id UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
    subcategoria_id UUID REFERENCES subcategorias(id) ON DELETE CASCADE,
    produto_id UUID REFERENCES produtos(id) ON DELETE CASCADE,
    percentual_desconto DECIMAL(5, 2) NOT NULL CHECK (percentual_desconto > 0 AND percentual_desconto <= 100),
    ativo BOOLEAN DEFAULT TRUE,
    CHECK (subcategoria_id IS NOT NULL OR produto_id IS NOT NULL)
);

CREATE TABLE evento_produtos (
    evento_id UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
    produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
    PRIMARY KEY (evento_id, produto_id)
);

CREATE TABLE metricas_acesso (
    produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
    data_acesso DATE NOT NULL DEFAULT CURRENT_DATE,
    quantidade_acessos INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (produto_id, data_acesso)
);

CREATE TABLE historico_navegacao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
    visitado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE notificacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    lida BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_historico_usuario ON historico_navegacao(usuario_id);
CREATE INDEX idx_historico_produto ON historico_navegacao(produto_id);
CREATE INDEX idx_notificacoes_usuario ON notificacoes(usuario_id);

CREATE VIEW vista_vendas_produtos AS
SELECT 
    p.id AS produto_id,
    p.nome AS produto_nome,
    v.nome_fantasia AS empresa,
    COALESCE(SUM(ip.quantidade), 0) AS total_unidades_vendidas,
    COALESCE(SUM(ip.quantidade * ip.preco_unitario), 0) AS faturamento_total_produto
FROM produtos p
JOIN vendedores v ON p.vendedor_id = v.id
LEFT JOIN itens_pedido ip ON p.id = ip.produto_id
GROUP BY p.id, p.nome, v.nome_fantasia;

CREATE VIEW vista_vendas_diarias AS
SELECT 
    v.id AS vendedor_id,
    v.nome_fantasia AS empresa,
    DATE(ped.criado_em) AS data_venda,
    COUNT(DISTINCT ped.id) AS numero_vendas_dia,
    COALESCE(SUM(ip.quantidade * ip.preco_unitario), 0) AS faturamento_dia
FROM vendedores v
JOIN produtos p ON v.id = p.vendedor_id
JOIN itens_pedido ip ON p.id = ip.produto_id
JOIN pedidos ped ON ip.pedido_id = ped.id
GROUP BY v.id, v.nome_fantasia, DATE(ped.criado_em);