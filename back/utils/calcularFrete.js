function calcularFrete(cepOrigem, cepDestino) {
  const prefixoOrigem = cepOrigem.replace(/\D/g, '').substring(0, 2);
  const prefixoDestino = cepDestino.replace(/\D/g, '').substring(0, 2);

  if (prefixoOrigem === prefixoDestino) return 15.00;

  const regioes = {
    sudeste: ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29'],
    sul: ['80','81','82','83','84','85','86','87','88','89'],
    nordeste: ['40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56'],
    norte: ['66','67','68','69'],
    centrooeste: ['70','71','72','73','74','75','76','77','78','79']
  };

  const getRegiao = (prefixo) => {
    for (const [regiao, prefixos] of Object.entries(regioes)) {
      if (prefixos.includes(prefixo)) return regiao;
    }
    return 'outro';
  };

  const regiaoO = getRegiao(prefixoOrigem);
  const regiaoD = getRegiao(prefixoDestino);

  if (regiaoO === regiaoD) return 20.00;
  return 35.00;
}

module.exports = { calcularFrete };