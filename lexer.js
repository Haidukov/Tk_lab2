const fs = require('fs');

class Lexer {
    constructor() {
        this.inputFilePath = './input.txt';
        this.outputFilePath = './output.txt';
        this.currentLineNumber = 0;
        this.headPosition = 0;
        this.allLines = [];

    }
    readInput() {
        this.allLines = fs.readFileSync(this.inputFilePath).toString().split('\r\n');
        console.log('input: ');
        console.log(this.allLines);
    }

    cleanOutput() {
        fs.writeFileSync(this.outputFilePath, '');
    }

    appendToFile(data) {
        fs.appendFileSync(this.outputFilePath, data);
    }

    writeLexem(lexemType, lexem, error = '') {
        let displayName;
        if (!error) {
            displayName = lexemType + ' \\ ' + lexem;
        }
        else {
            displayName = `Error: ${error} in sentence ${this.currentLineNumber} in  position ${this.headPosition}\n`;
            this.appendToFile('\n');
            this.headPosition = 0;
            this.currentLineNumber++;
        }
        displayName += '\r\n';
        console.log(displayName);
        this.appendToFile(displayName);
    }

    writeError() {
        displayName = `Error: ${error} in sentence ${this.currentLineNumber} in  position ${this.headPosition}\n`;
        this.currentLineNumber++;
        this.headPosition = 0;
    }

    getCurrentElement() {
        if (this.currentLineNumber >= this.allLines.length) {
            return '';
        }
        const line = this.allLines[this.currentLineNumber];
        if (this.headPosition > line.length - 1) {
            this.headPosition = 0;
            this.currentLineNumber++;
            return this.getCurrentElement();
        }
        else {
            const currentSymbol = line[this.headPosition];
            this.headPosition++;

            return currentSymbol;
        }
    }

    moveHeadToPrevPosition() {
        this.headPosition--;
    }

    getToken() {
        let currentElement = this.getCurrentElement();
        while (currentElement === ' ') {
            currentElement = this.getCurrentElement();
        }
        if (currentElement === ':') {
            this.processAssignment();
        }

        else if (currentElement === 'i') {
            this.processIf();
        }

        else if (currentElement === 't') {
            this.processThen();
        }

        else if (currentElement === '(') {
            this.processOpenedBrace();
        }

        else if (currentElement === ')') {
            this.processClosedBrace();
        }

        else if (currentElement === '*') {
            this.processStar();
        }

        else if (currentElement === '+') {
            this.processPlus();
        }

        else if (currentElement === 'x') {
            this.processIden();
        }

        else if (currentElement === ',') {
            this.processComma();
        }

        else if (currentElement === '') {
            console.log('End of program');
        }

        else {
            this.writeLexem('', '', `Unexepected identifier ${currentElement}`);
            this.getToken();
        }
    }

    processAssignment() {
        const currentElement = this.getCurrentElement();
        const assignmentToken = ':' + currentElement;
        if (assignmentToken !== LexemEnum.assignmentOperator) {
            this.writeLexem('', '', 'Unepected itentifier: "expected := operator"');
            this.getToken();
        }
        else {
            this.writeLexem('assignmentOperator', LexemEnum.assignmentOperator);
            this.getToken();
        }
    }

    processIf() {
        const currentElement = this.getCurrentElement();
        const ifToken = 'i' + currentElement;
        if (ifToken !== LexemEnum.ifOperator) {
            this.writeLexem('', '', 'Unepected itentifier: "expected if operator"');
            this.getToken();
        }
        else {
            this.writeLexem('ifOperator', LexemEnum.ifOperator);
            this.getToken();
        }
    }

    processThen() {
        let token = 't';
        for (let i = 1; i < LexemEnum.thenOperator.length; i++) {
            const element = this.getCurrentElement();
            if (token + element !== LexemEnum.thenOperator.substr(0, i + 1)) {
                this.writeLexem('', '', 'Unepected itentifier: "expected then operator"');
                this.getToken();
                return;
            }
            token += element;
        }
        this.writeLexem('thenOperator', LexemEnum.thenOperator);
        this.getToken();
    }

    processOpenedBrace() {
        this.writeLexem('openedBrace', LexemEnum.openedBrace);
        this.getToken();
    }

    processClosedBrace() {
        this.writeLexem('closedBrace', LexemEnum.closedBrace);
        this.getToken();
    }

    processStar() {
        this.writeLexem('star', LexemEnum.star);
        this.getToken();
    }

    processPlus() {
        this.writeLexem('plus', LexemEnum.plus);
        this.getToken();
    }

    processIden() {
        let lexem = 'x';
        let currentElement = this.getCurrentElement();
        lexem += currentElement;
        const idenLexenNames = ['idenX1', 'idenX2', 'idenX23'];
        const idenLexenValues = idenLexenNames.map(name => LexemEnum[name]);
        if (idenLexenValues.includes(lexem)) {
            const lexenName = idenLexenNames[idenLexenValues.indexOf(lexem)];
            if (lexenName === 'idenX2') {
                currentElement = this.getCurrentElement();
                if (lexem + currentElement === LexemEnum.idenX23) {
                    this.writeLexem('idenx23', LexemEnum.idenX23);
                    return this.getToken();
                }
                else {
                    this.moveHeadToPrevPosition();
                }
            }
            this.writeLexem(lexenName, lexem);
            this.getToken();
        }
        else {
            this.writeLexem('', '', `Unexpected identifier ${lexem}`);
            this.getToken();
        }
    }

    processComma() {
        this.writeLexem('comma', LexemEnum.comma);
        this.getToken();
    }
}

const LexemEnum = {
    assignmentOperator: ':=',
    ifOperator: 'if',
    thenOperator: 'then',
    openedBrace: '(',
    closedBrace: ')',
    star: '*',
    plus: '+',
    idenX1: 'x1',
    idenX2: 'x2',
    idenX23: 'x23',
    comma: ','
};

module.exports = {
    Lexer,
    LexemEnum
};