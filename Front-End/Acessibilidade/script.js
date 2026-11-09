//1. Função para alterar o Alto Contraste 
function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
    const isHighContrast = document.body.classList.contains('high-contrast');
    localStorage.setItem('highContrast', isHighContrast);
}

//2. Função para alterar o tamanho da fonte
let currentSize= 1; // Tamanho inicial da fonte
function changeFontSize(direction) {
    currentSize += direction*0.1; // Incrementa ou decrementa o tamanho da fonte
    if (currentSize < 0.8) currentSize = 0.8;
    if (currentSize > 1.6) currentSize = 1.6;

    document.documentElement.style.fontSize = currentSize + 'rem';
}

// Carregar preferências salva de contraste ao iniciar a página
window.onload = function() {
    if(localStorage.getItem('highContrast') === 'true') {
        document.body.classList.add('high-contrast');
    }   
};
