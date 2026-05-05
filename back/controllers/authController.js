const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModel');
const Vendedor = require('../models/vendedorModel');
const { validarCPF, validarCNPJ, limparDocumento } = require('../utils/validadores');

async function registrarCliente(req, res) {
  try {
    const { nome, email, senha, cpf } = req.body;

    if (!nome || !email || !senha || !cpf) {
      return res.status(400).json({ error: 'Nome, email, senha e CPF são obrigatórios' });
    }

    const cpfLimpo = limparDocumento(cpf);

    if (!validarCPF(cpfLimpo)) {
      return res.status(400).json({ error: 'CPF inválido' });
    }

    const emailExistente = await Usuario.buscarPorEmail(email);
    if (emailExistente) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    const cpfExistente = await Usuario.buscarPorCpf(cpfLimpo);
    if (cpfExistente) {
      return res.status(409).json({ error: 'CPF já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await Usuario.criar(email, senhaHash, cpfLimpo, 'cliente', nome);

    return res.status(201).json(usuario);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function registrarVendedor(req, res) {
  try {
    const { email, senha, cnpj } = req.body;

    if (!email || !senha || !cnpj) {
      return res.status(400).json({ error: 'Email, senha e CNPJ são obrigatórios' });
    }

    const cnpjLimpo = limparDocumento(cnpj);

    if (!validarCNPJ(cnpjLimpo)) {
      return res.status(400).json({ error: 'CNPJ inválido' });
    }

    const emailExistente = await Usuario.buscarPorEmail(email);
    if (emailExistente) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    const cnpjExistente = await Vendedor.buscarPorCnpj(cnpjLimpo);
    if (cnpjExistente) {
      return res.status(409).json({ error: 'CNPJ já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await Usuario.criar(email, senhaHash, cnpjLimpo, 'vendedor');
    const vendedor = await Vendedor.criar(usuario.id, cnpjLimpo);

    return res.status(201).json({ usuario, vendedor });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const usuario = await Usuario.buscarPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { registrarCliente, registrarVendedor, login };