const { Lexer } = require('./lexer');

const options = {
    inputFilePath: './input.txt',
    outputFilePath: './output.txt'
};
const lexer = new Lexer(options);

lexer.readInput();
lexer.cleanOutput();
while (!lexer.isEnd()) {
    lexer.getToken();
};
