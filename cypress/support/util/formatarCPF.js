let formatarCPFCNPJ = (cpfCnpj) => {

  if (cpfCnpj.length <= 11) {
    return cpfCnpj = mascaraCpf(cpfCnpj);
} else {
    return cpfCnpj = mascaraCnpj(cpfCnpj);
}
}
  //   //retira os caracteres indesejados...
  //   cpf = cpf.replace(/[^\d]/g, "");
    
  //   //realizar a formatação...
  //     return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  // }  

  module.exports = formatarCPFCNPJ;


  function retirarFormatacao(cpfCnpj) {
    cpfCnpj = cpfCnpj.replace(/(\.|\/|\-)/g,"");
    }
    function mascaraCpf(valor) {
    return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g,"\$1.\$2.\$3\-\$4");
    }
    function mascaraCnpj(valor) {
    return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,"\$1.\$2.\$3\/\$4\-\$5");
    }