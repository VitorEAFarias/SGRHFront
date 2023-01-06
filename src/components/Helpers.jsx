
function cpfMask(value) {
    return value
      .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
      .replace(/(\d{3})(\d)/, '$1.$2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1') // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada
}

function somenteNumeros(value) {
    return value.replace(/[^0-9]/g, '');
}

function formataData(data) {
    var data_bruta = new Date(data);
    let dataFormatada = (
        (data_bruta.getDate() > 9 ? data_bruta.getDate() : "0"+data_bruta.getDate()) + "/" + 
        ((data_bruta.getMonth() + 1 <= 9 ? "0"+(data_bruta.getMonth() + 1): data_bruta.getMonth() + 1)) + "/" + 
        data_bruta.getFullYear() + " " +
        (data_bruta.getHours() <= 9 ? "0"+data_bruta.getHours() : data_bruta.getHours()) + ":" +
        (data_bruta.getMinutes() <= 9 ? "0"+data_bruta.getMinutes() : data_bruta.getMinutes()) + ":" +
        (data_bruta.getSeconds() <= 9 ? "0"+data_bruta.getSeconds() : data_bruta.getSeconds())
    );
    return dataFormatada
}

function formataDataUs(data) {
    var data_bruta = new Date(data);
    let dataFormatada = (
        data_bruta.getFullYear() + "-" +
        ((data_bruta.getMonth() + 1 <= 9 ? "0"+(data_bruta.getMonth() + 1): data_bruta.getMonth() + 1)) + "-" + 
        (data_bruta.getDate() > 9 ? data_bruta.getDate() : "0"+data_bruta.getDate())
    )
    return dataFormatada;
}

function zero_esquerda(mes)
{
	if(mes >=1 && mes <= 9)
		return "0"+mes;
	
	return mes;
}

const Helpers = {
    cpfMask,
    somenteNumeros,
    formataData,
    formataDataUs,
    zero_esquerda
}

export default Helpers;