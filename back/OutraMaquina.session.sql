CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    quantidade INTEGER NOT NULL DEFAULT 0,
    imagem_url TEXT,
    categoria TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);