const { Lexer } = require('./lexer');

const lexer = new Lexer();

lexer.readInput();
lexer.cleanOutput();
lexer.getToken();