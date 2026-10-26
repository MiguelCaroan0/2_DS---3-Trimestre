import chalk from 'chalk';
console.log(chalk.blue('Hello world!'));
console.log(chalk.green('Isso é um chalk!'));
console.log(chalk.red('Tenha um otimo dia!'));

export function InverterString(texto) {
    return texto.split('').reverse().join('');
}

