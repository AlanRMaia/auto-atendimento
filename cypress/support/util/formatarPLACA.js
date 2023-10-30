let formatarPLACA = (placa) => {

  let letras = placa.substring(0, 3)
  let numeros = placa.substring(3)
  return `${letras}-${numeros}`
  
}    

  module.exports = formatarPLACA;


  