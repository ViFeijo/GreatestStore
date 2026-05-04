CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()b550
);

CREATE TABLE vendedores (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    nome_fantasia TEXT NOT NULL,
    razao_social TEXT NOT NULL,
    cnpj TEXT UNIQUE NOT NULL,
    gmail TEXT UNIQUE NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
 
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE
);

CREATE TABLE subcategorias (
    id SERIAL PRIMARY KEY,
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE CASCADE,
    nome TEXT NOT NULL
);

CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    vendedor_id INTEGER REFERENCES vendedores(id),
    subcategoria_id INTEGER REFERENCES subcategorias(id), -- O produto liga na subcategoria
    nome TEXT NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    quantidade INTEGER NOT NULL DEFAULT 0,
    imagem_url TEXT,
    preco_promocional DECIMAL(10, 2),
    desconto_ativo BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE cupons (
    id SERIAL PRIMARY KEY,
    codigo TEXT UNIQUE NOT NULL,
    tipo_desconto TEXT NOT NULL, -- 'fixo' ou 'percentual'
    valor_desconto DECIMAL(10, 2) NOT NULL,
    data_validade TIMESTAMP WITH TIME ZONE,
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    cupom_id INTEGER REFERENCES cupons(id),
    valor_total DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pendente',
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE itens_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
    produto_id INTEGER REFERENCES produtos(id),
    quantidade INTEGER NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL
);

CREATE TABLE transportadoras (
    id SERIAL PRIMARY KEY,
    nome_empresa TEXT NOT NULL,
    cnpj TEXT UNIQUE NOT NULL
);

CREATE TABLE fretes (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER UNIQUE REFERENCES pedidos(id) ON DELETE CASCADE,
    transportadora_id INTEGER REFERENCES transportadoras(id),
    valor_frete DECIMAL(10, 2) NOT NULL,
    codigo_rastreio TEXT,
    status_entrega TEXT DEFAULT 'postado'
);

CREATE TABLE carrinho (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    produto_id INTEGER REFERENCES produtos(id) ON DELETE CASCADE,
    quantidade INTEGER DEFAULT 1
);

CREATE TABLE favoritos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    produto_id INTEGER REFERENCES produtos(id) ON DELETE CASCADE,
    UNIQUE(usuario_id, produto_id)
);

CREATE TABLE avaliacoes_produtos (
    id SERIAL PRIMARY KEY,
    produto_id INTEGER REFERENCES produtos(id) ON DELETE CASCADE,
    usuario_id INTEGER REFERENCES usuarios(id),
    nota INTEGER CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE avaliacoes_frete (
    id SERIAL PRIMARY KEY,
    transportadora_id INTEGER REFERENCES transportadoras(id) ON DELETE CASCADE,
    pedido_id INTEGER UNIQUE REFERENCES pedidos(id),
    nota INTEGER CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT
);

CREATE TABLE eventos (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL, -- Ex: 'Black Friday', 'Lançamento de Verão'
    descricao TEXT,
    data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    data_fim TIMESTAMP WITH TIME ZONE NOT NULL,
    banner_url TEXT, -- Link da imagem da campanha
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE evento_descontos (
    id SERIAL PRIMARY KEY,
    evento_id INTEGER REFERENCES eventos(id) ON DELETE CASCADE,
    subcategoria_id INTEGER REFERENCES subcategorias(id), -- Opcional: desconto por categoria
    produto_id INTEGER REFERENCES produtos(id), -- Opcional: desconto por produto específico
    percentual_desconto DECIMAL(5, 2) NOT NULL, -- Ex: 10.00 para 10%
    ativo BOOLEAN DEFAULT TRUE
);

-- Tabela para registrar visualizações (ajuda na métrica de popularidade)
CREATE TABLE metricas_acesso (
    id SERIAL PRIMARY KEY,
    produto_id INTEGER REFERENCES produtos(id) ON DELETE CASCADE,
    data_acesso DATE DEFAULT CURRENT_DATE,
    quantidade_acessos INTEGER DEFAULT 1
);

-- Vincular um Produto a um Evento (Opcional)
-- Use isso se quiser que certos produtos apareçam na página do evento
CREATE TABLE evento_produtos (
    evento_id INTEGER REFERENCES eventos(id) ON DELETE CASCADE,
    produto_id INTEGER REFERENCES produtos(id) ON DELETE CASCADE,
    PRIMARY KEY (evento_id, produto_id)
);

-- Total de vendas de um produto específico
SELECT produto_id, SUM(quantidade) as total_vendido, SUM(quantidade * preco_unitario) as faturamento_total
FROM itens_pedido
GROUP BY produto_id;

-- Vendas diárias de um produto
SELECT 
    p.id as produto_id, 
    p.nome, 
    DATE(ped.criado_em) as dia, 
    SUM(it.quantidade) as unidades_vendidas
FROM itens_pedido it
JOIN produtos p ON it.produto_id = p.id
JOIN pedidos ped ON it.pedido_id = ped.id
GROUP BY p.id, dia
ORDER BY dia DESC;

-- Faturamento total por vendedor
SELECT 
    v.nome_fantasia, 
    SUM(it.quantidade * it.preco_unitario) as faturamento_total,
    COUNT(DISTINCT ped.id) as total_pedidos
FROM itens_pedido it
JOIN produtos p ON it.produto_id = p.id
JOIN vendedores v ON p.vendedor_id = v.id
JOIN pedidos ped ON it.pedido_id = ped.id
GROUP BY v.id;

CREATE VIEW vista_vendas_produtos AS
SELECT 
    p.id AS produto_id,
    p.nome AS produto_nome,
    v.nome_fantasia AS empresa,
    SUM(ip.quantidade) AS total_unidades_vendidas,
    SUM(ip.quantidade * ip.preco_unitario) AS faturamento_total_produto
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
    SUM(ip.quantidade * ip.preco_unitario) AS faturamento_dia
FROM vendedores v
JOIN produtos p ON v.id = p.vendedor_id
JOIN itens_pedido ip ON p.id = ip.produto_id
JOIN pedidos ped ON ip.pedido_id = ped.id
GROUP BY v.id, v.nome_fantasia, data_venda;