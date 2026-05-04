const service = require('../services/vendedorService');
const usuarioService = require('../services/usuarioservice');

async function tornarVendedor(req, res) {
    try {
        const idDaUrl = Number(req.params.id);
        const usuarioLogado = req.user;
        if (usuarioLogado.id !== idDaUrl && usuarioLogado.role !== 'admin') {
            return res.status(403).json({ erro: 'Acesso negado: você não pode promover outro usuário' });
        }
        const { nome_fantasia, razao_social, cnpj } = req.body;
        if (!nome_fantasia || !razao_social || !cnpj) {
            return res.status(400).json({ erro: 'Dados da empresa (CNPJ, Nomes) são obrigatórios' });
        }
        const usuario = await usuarioService.buscarPorId(idDaUrl);
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }
        const vendedorCriado = await service.tornarVendedor(idDaUrl, {
            nome_fantasia,
            razao_social,
            cnpj
        });
        res.status(201).json({ 
            mensagem: 'Agora você é um vendedor oficial!',
            dados_vendedor: vendedorCriado 
        });

    } catch (error) {
        console.error("Erro no tornarVendedor:", error);
        res.status(500).json({ erro: 'Erro ao processar registro. O CNPJ já pode estar cadastrado.' });
    }
}

async function dashboard(req, res) {
    try {
        const vendedorId = req.user.id;
        const dados = await service.dashboard(vendedorId);
        res.json(dados);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao carregar dashboard' });
    }
}

async function listartodos(req, res) {
    try {
        const vendedores = await service.listartodos();
        res.json(vendedores);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao listar vendedores' });
    }
}

async function buscarPorId(req, res) {
    try {
        const vendedor = await service.buscarPorId(Number(req.params.id));
        if (!vendedor) {
            return res.status(404).json({ erro: 'Vendedor não encontrado' });
        }
        const { senha, ...dadosPublicos } = vendedor;
        res.json(dadosPublicos);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar vendedor' });
    }
}

async function atualizar(req, res) {
    try {
        const id = Number(req.params.id);
        const usuarioLogado = req.user;
        const vendedor = await service.buscarPorId(id);
        if (!vendedor) {
            return res.status(404).json({ erro: 'Vendedor não encontrado' });
        }
        if (vendedor.usuario_id !== usuarioLogado.id && usuarioLogado.role !== 'admin') {
            return res.status(403).json({ erro: 'Acesso negado' });
        }
        const atualizado = await service.atualizar(id, req.body);
        res.json(atualizado);
    } catch (error) {
        res.status(400).json({ erro: 'Erro ao atualizar dados do vendedor' });
    }
}

async function deletar(req, res) {
    try {
        const id = Number(req.params.id);
        const usuarioLogado = req.user;
        if (usuarioLogado.role !== 'admin') {
            return res.status(403).json({ erro: 'Somente administradores podem remover lojas' });
        }
        const ok = await service.deletar(id);
        if (!ok) {
            return res.status(404).json({ erro: 'Vendedor não encontrado' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao deletar vendedor' });
    }
}

module.exports = { 
    tornarVendedor, 
    dashboard, 
    listartodos, 
    buscarPorId, 
    atualizar, 
    deletar 
};