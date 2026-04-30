const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ erro: 'Token não enviado' });

  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET);
    req.user = dados;
    next();
  } catch {
    res.status(401).json({ erro: 'Token inválido' });
  }
}

module.exports = { verifyToken };