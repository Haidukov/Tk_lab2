const fs = require('fs');

class Lexer {
    constructor(options) {
        this.inputFilePath = options.inputFilePath;
        this.outputFilePath = options.outputFilePath;
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
        return displayName;
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

    isEnd() {
        let currentElement = this.getCurrentElement();
        let k = 1;
        while (currentElement === ' ') {
            currentElement = this.getCurrentElement();
            k++;
        }
        for (let i = 0; i < k; i++) {
            this.moveHeadToPrevPosition();
        }
        const result = currentElement === "";
        return result;
    }

    getToken() {
        let currentElement = this.getCurrentElement();
        while (currentElement === ' ') {
            currentElement = this.getCurrentElement();
        }
        if (currentElement === ':') {
            return this.processAssignment();
        }

        else if (currentElement === 'i') {
            return this.processIf();
        }

        else if (currentElement === 't') {
            return this.processThen();
        }

        else if (currentElement === '(') {
            return this.processOpenedBrace();
        }

        else if (currentElement === ')') {
            return this.processClosedBrace();
        }

        else if (currentElement === '*') {
            return this.processStar();
        }

        else if (currentElement === '+') {
            return this.processPlus();
        }

        else if (currentElement === 'x') {
            return this.processIden();
        }

        else if (currentElement === ',') {
            return this.processComma();
        }

        else if (currentElement === '') {
            console.log('End of program');
        }

        else {
            return this.writeLexem('', '', `Unexepected identifier ${currentElement}`);
        }
    }

    processAssignment() {
        const currentElement = this.getCurrentElement();
        const assignmentToken = ':' + currentElement;
        if (assignmentToken !== LexemEnum.assignmentOperator) {
            return this.writeLexem('', '', 'Unepected itentifier: "expected := operator"');
        }
        else {
            return this.writeLexem('assignmentOperator', LexemEnum.assignmentOperator);
        }
    }

    processIf() {
        const currentElement = this.getCurrentElement();
        const ifToken = 'i' + currentElement;
        if (ifToken !== LexemEnum.ifOperator) {
            return this.writeLexem('', '', 'Unepected itentifier: "expected if operator"');
        }
        else {
            return this.writeLexem('ifOperator', LexemEnum.ifOperator);
        }
    }

    processThen() {
        let token = 't';
        for (let i = 1; i < LexemEnum.thenOperator.length; i++) {
            const element = this.getCurrentElement();
            if (token + element !== LexemEnum.thenOperator.substr(0, i + 1)) {
                return this.writeLexem('', '', 'Unepected itentifier: "expected then operator"');
            }
            token += element;
        }
        return this.writeLexem('thenOperator', LexemEnum.thenOperator);
    }

    processOpenedBrace() {
        return this.writeLexem('openedBrace', LexemEnum.openedBrace);
    }

    processClosedBrace() {
        return this.writeLexem('closedBrace', LexemEnum.closedBrace);
    }

    processStar() {
        return this.writeLexem('star', LexemEnum.star);
    }

    processPlus() {
        return this.writeLexem('plus', LexemEnum.plus);
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
                }
                else {
                    this.moveHeadToPrevPosition();
                }
            }
            return this.writeLexem(lexenName, lexem);
        }
        else {
            return this.writeLexem('', '', `Unexpected identifier ${lexem}`);
        }
    }

    processComma() {
        return this.writeLexem('comma', LexemEnum.comma);
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