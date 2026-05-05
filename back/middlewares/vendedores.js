function checkVendedor(req, res, next) {

if (!req.user) {
    return res.status(401).json({ erro: 'Usuário não autenticado' });}
if(!req.user.cnpj)
    {return res.status(403).json({ erro: 'Acesso negado: você não tem permissão para criar produtos' });
    }
else{
    next();

}
}
module.exports = { checkVendedor };