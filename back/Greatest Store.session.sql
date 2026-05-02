-- 1. Cria a tabela de teste
CREATE TABLE teste_conexao (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Insere um dado inicial
INSERT INTO teste_conexao (nome) 
VALUES ('Meu primeiro teste no Supabase!');

-- 3. Consulta para ver se funcionou
SELECT * FROM teste_conexao;