function checkValidacao(req, res, next) {
if(!req.body.email.includes("@") || !req.body.email.includes(".com")){
    return res.status(400).json({ erro: 'email inválido' });
}
if(req.body.cnpj.length !==14){
    return res.status(400).json({ erro: 'cnpj inválido' });
}
    next();
}
module.exports = { checkValidacao };