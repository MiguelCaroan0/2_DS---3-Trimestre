// construindo a lista de compra
let listaDeCompra =  ['Arroz', 'Feijão', 'Macarrão', 'Leite', 'Ovos'];

// Adicionando itens a lista 
// listaDeCompra.push('pão', 'Manteiga');
// listaDeCompra.
// listaDeCompra.

console.log('Total de itens na lista: ', listaDeCompra.length);

// listando os itens da lista
listaDeCompra.forEach(function(item){
    console.log('_', item)});

// Criando função para calcular média
function calculoImc (peso, altura){
    let imc = peso / (altura * altura);
    return imc.toFixed(2);
}

console.log('IMC para 70kg e 1.75m: ', calculoImc(70, 1.75));
console.log('IMC da Ana: ', calculoImc (55, 1.60));