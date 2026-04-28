function checkRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ erro: 'Acesso negado' });
    }
    next();
  };
}

module.exports = { checkRole };