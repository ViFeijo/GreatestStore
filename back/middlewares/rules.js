function checkRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ erro: 'Usuário não autenticado' });
    }
    if (req.user.role === 'admin') {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ erro: 'Acesso negado: você não tem permissão para esta ação' });
    }

    next();
  };
}

module.exports = { checkRole };