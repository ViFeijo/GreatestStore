const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ erro: 'Token não enviado' });

  try {
    const dados = jwt.verify(token, 'segredo123'); 
    req.user = dados; // salva os dados do usuário na requisição
    next();
  } catch {
    res.status(401).json({ erro: 'Token inválido' });
  }
}
module.exports = { verifyToken };